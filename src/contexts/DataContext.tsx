import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Service, Professional, Appointment, Transaction, Product } from '../types';
import { differenceInDays, format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
  clients: Client[];
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  transactions: Transaction[];
  products: Product[];
  addClient: (client: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  quickRegister: (data: { clientName: string, services: Service[], paymentStatus: 'pago' | 'pendente' }) => Promise<void>;
  getClientStatus: (client: Client) => string;
  loadingData: boolean;
  lastBackupDate: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals] = useState<Professional[]>([{ id: '1', name: 'Danilson' }]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  // BUSCA DE DADOS (Apenas o que não está na lixeira)
  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);
    
    const [clientsRes, servicesRes, apptsRes, txRes, prodRes] = await Promise.all([
      supabase.from('clients').select('*').eq('user_id', user.id).is('deleted_at', null),
      supabase.from('services').select('*').eq('user_id', user.id).is('deleted_at', null),
      supabase.from('appointments').select('*').eq('user_id', user.id).is('deleted_at', null),
      supabase.from('transactions').select('*').eq('user_id', user.id).is('deleted_at', null),
      supabase.from('products').select('*').eq('user_id', user.id).is('deleted_at', null)
    ]);

    if (clientsRes.data) setClients(clientsRes.data as Client[]);
    
    if (servicesRes.data && servicesRes.data.length > 0) {
      setServices(servicesRes.data as Service[]);
    } else if (user) {
      const defaultServices = [
        { user_id: user.id, name: 'Corte Social', price: 25, duration: 30 },
        { user_id: user.id, name: 'Corte Degradê', price: 30, duration: 30 },
        { user_id: user.id, name: 'Barba Terapia', price: 20, duration: 30 },
      ];
      const { data: newServices } = await supabase.from('services').insert(defaultServices).select();
      if (newServices) setServices(newServices as Service[]);
    }

    if (apptsRes.data) setAppointments(apptsRes.data as Appointment[]);
    if (txRes.data) setTransactions(txRes.data as Transaction[]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    
    setLoadingData(false);
  };

  // BACKUP AUTOMÁTICO DIÁRIO
  const performAutoBackup = async (currentData: any) => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastBackup = localStorage.getItem(`@dm_backup_${user.id}`);

    if (lastBackup !== today) {
      console.log('Iniciando backup automático diário...');
      const { error } = await supabase.from('backups').insert({
        user_id: user.id,
        backup_data: currentData
      });
      
      if (!error) {
        localStorage.setItem(`@dm_backup_${user.id}`, today);
        setLastBackupDate(today);
        console.log('Backup automático realizado com sucesso!');
      }
    }
  };

  useEffect(() => {
    if (!user) {
      setClients([]); setServices([]); setAppointments([]); setTransactions([]); setProducts([]);
      setLoadingData(false);
      return;
    }
    fetchData();
  }, [user]);

  // Dispara o backup sempre que os dados terminam de carregar
  useEffect(() => {
    if (!loadingData && user && clients.length > 0) {
      performAutoBackup({ clients, services, appointments, transactions, products });
    }
  }, [loadingData]);

  // --- FUNÇÕES DE ESCRITA COM SOFT DELETE ---

  const addClient = async (data: any) => {
    if (!user) return;
    const newClient = { user_id: user.id, name: data.name, phone: data.phone || '', notes: data.notes || '', totalVisits: 0, totalSpent: 0 };
    const { data: saved, error } = await supabase.from('clients').insert(newClient).select().single();
    if (saved && !error) setClients(prev => [...prev, saved as Client]);
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    const { error } = await supabase.from('clients').update(data).eq('id', id);
    if (!error) setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  // SOFT DELETE CLIENTE
  const removeClient = async (id: string) => {
    const { error } = await supabase.from('clients').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (!error) setClients(prev => prev.filter(c => c.id !== id));
  };

  const addService = async (data: Omit<Service, 'id'>) => {
    if (!user) throw new Error("Usuário não autenticado");
    const newService = { user_id: user.id, ...data };
    const { data: saved, error } = await supabase.from('services').insert(newService).select().single();
    if (error) throw error;
    if (saved) setServices(prev => [...prev, saved as Service]);
  };

  // SOFT DELETE SERVIÇO
  const removeService = async (id: string) => {
    const { error } = await supabase.from('services').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const quickRegister = async (data: { clientName: string, services: Service[], paymentStatus: 'pago' | 'pendente' }) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);

    let clientId = clients.find(c => c.name.toLowerCase() === data.clientName.toLowerCase())?.id;
    if (!clientId) {
      const { data: saved } = await supabase.from('clients').insert({ user_id: user.id, name: data.clientName, phone: '', notes: '' }).select().single();
      if (saved) { clientId = saved.id; setClients(prev => [...prev, saved as Client]); }
    }
    if (!clientId) return;

    const totalPrice = data.services.reduce((acc, curr) => acc + curr.price, 0);
    const serviceIdsString = data.services.map(s => s.id).join(',');

    const { data: savedAppt } = await supabase.from('appointments').insert({
      user_id: user.id, client_id: clientId, service_id: serviceIdsString, date: today, time, status: 'concluido', price: totalPrice, payment_status: data.paymentStatus
    }).select().single();

    if (savedAppt) setAppointments(prev => [...prev, savedAppt as unknown as Appointment]);

    if (data.paymentStatus === 'pago') {
      const { data: savedTx } = await supabase.from('transactions').insert({
        user_id: user.id, appointment_id: savedAppt?.id, type: 'receita', amount: totalPrice, date: today, description: `Atendimento - ${data.clientName}`, status: 'pago'
      }).select().single();
      if (savedTx) setTransactions(prev => [...prev, savedTx as Transaction]);

      const clientToUpdate = clients.find(c => c.id === clientId);
      if (clientToUpdate) {
        await updateClient(clientId, { lastVisit: today, totalVisits: clientToUpdate.totalVisits + 1, totalSpent: clientToUpdate.totalSpent + totalPrice });
      }
    }
  };

  const getClientStatus = (client: Client) => {
    if (client.totalVisits === 0) return 'Novo';
    if (!client.lastVisit) return 'Regular';
    const daysSince = differenceInDays(new Date(), new Date(client.lastVisit));
    if (daysSince > 60) return 'Inativo';
    if (daysSince > 30) return 'Risco';
    if (client.totalVisits > 5) return 'Frequente';
    return 'Regular';
  };

  return (
    <DataContext.Provider value={{ clients, services, professionals, appointments, transactions, products, addClient, updateClient, removeClient, addService, removeService, quickRegister, getClientStatus, loadingData, lastBackupDate }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};