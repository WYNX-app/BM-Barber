import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Service, Professional, Appointment, Transaction, Product } from '../types';
import { differenceInDays } from 'date-fns';
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
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  quickRegister: (data: { clientName: string, services: Service[], paymentStatus: 'pago' | 'pendente' }) => Promise<void>;
  getClientStatus: (client: Client) => string;
  loadingData: boolean;
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

  // Busca os dados toda vez que o usuário logar
  useEffect(() => {
    if (!user) {
      setClients([]); setServices([]); setAppointments([]); setTransactions([]); setProducts([]);
      setLoadingData(false);
      return;
    }

    const fetchData = async () => {
      setLoadingData(true);
      // Busca todos os dados filtrando pelo ID do usuário logado
      const [clientsRes, servicesRes, apptsRes, txRes, prodRes] = await Promise.all([
        supabase.from('clients').select('*').eq('user_id', user.id),
        supabase.from('services').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('products').select('*').eq('user_id', user.id)
      ]);

      if (clientsRes.data) setClients(clientsRes.data as Client[]);
      
      if (servicesRes.data && servicesRes.data.length > 0) {
        setServices(servicesRes.data as Service[]);
      } else if (user) {
        // Se for uma conta nova, cria os serviços padrão para ela
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

    fetchData();
  }, [user]);

  const addClient = async (data: any) => {
    if (!user) return;
    const newClient = {
      user_id: user.id,
      name: data.name,
      phone: data.phone || '',
      notes: data.notes || '',
      totalVisits: 0,
      totalSpent: 0
    };
    
    const { data: savedClient, error } = await supabase.from('clients').insert(newClient).select().single();
    if (savedClient && !error) {
      setClients(prev => [...prev, savedClient as Client]);
    }
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    const { error } = await supabase.from('clients').update(data).eq('id', id);
    if (!error) {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    }
  };

  const addService = async (data: Omit<Service, 'id'>) => {
    if (!user) return;
    const newService = { user_id: user.id, ...data };
    const { data: savedService, error } = await supabase.from('services').insert(newService).select().single();
    if (savedService && !error) {
      setServices(prev => [...prev, savedService as Service]);
    }
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const quickRegister = async (data: { clientName: string, services: Service[], paymentStatus: 'pago' | 'pendente' }) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);

    // 1. Verifica ou Cria o Cliente no Supabase
    let clientId = clients.find(c => c.name.toLowerCase() === data.clientName.toLowerCase())?.id;
    
    if (!clientId) {
      const newClient = { user_id: user.id, name: data.clientName, phone: '', notes: '' };
      const { data: savedClient } = await supabase.from('clients').insert(newClient).select().single();
      if (savedClient) {
        clientId = savedClient.id;
        setClients(prev => [...prev, savedClient as Client]);
      }
    }

    if (!clientId) return;

    const totalPrice = data.services.reduce((acc, curr) => acc + curr.price, 0);
    const serviceIdsString = data.services.map(s => s.id).join(',');

    // 2. Cria o Agendamento no Supabase
    const newAppt = {
      user_id: user.id,
      client_id: clientId,
      service_id: serviceIdsString,
      date: today,
      time: time,
      status: 'concluido',
      price: totalPrice,
      payment_status: data.paymentStatus
    };

    const { data: savedAppt } = await supabase.from('appointments').insert(newAppt).select().single();
    if (savedAppt) {
      setAppointments(prev => [...prev, { ...savedAppt, clientId: savedAppt.client_id, serviceId: savedAppt.service_id, paymentStatus: savedAppt.payment_status } as Appointment]);
    }

    // 3. Se pagou, gera a Transação e atualiza o Cliente
    if (data.paymentStatus === 'pago') {
      const newTx = {
        user_id: user.id,
        appointment_id: savedAppt?.id,
        type: 'receita',
        amount: totalPrice,
        date: today,
        description: `Atendimento - ${data.clientName} (${data.services.map(s => s.name).join(' + ')})`,
        status: 'pago',
      };
      const { data: savedTx } = await supabase.from('transactions').insert(newTx).select().single();
      if (savedTx) setTransactions(prev => [...prev, savedTx as Transaction]);

      // Atualiza contadores do cliente
      const clientToUpdate = clients.find(c => c.id === clientId);
      if (clientToUpdate) {
        await updateClient(clientId, {
          lastVisit: today,
          totalVisits: clientToUpdate.totalVisits + 1,
          totalSpent: clientToUpdate.totalSpent + totalPrice
        });
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
    <DataContext.Provider value={{ clients, services, professionals, appointments, transactions, products, addClient, updateClient, addService, removeService, quickRegister, getClientStatus, loadingData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};