import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Service, Professional, Appointment, Transaction, Product } from '../types';
import { differenceInDays } from 'date-fns';

interface DataContextType {
  clients: Client[];
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  transactions: Transaction[];
  products: Product[];
  addClient: (client: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'createdAt'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  removeService: (id: string) => void;
  // Atualizado para receber lista de serviços
  quickRegister: (data: { clientName: string, services: Service[], paymentStatus: 'pago' | 'pendente' }) => void;
  getClientStatus: (client: Client) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const load = (key: string, fallback: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [clients, setClients] = useState<Client[]>(load('dm_clients', []));
  const [services, setServices] = useState<Service[]>(load('dm_services', [
    { id: '1', name: 'Corte Social', price: 25, duration: 30 },
    { id: '2', name: 'Corte Degradê', price: 30, duration: 30 },
    { id: '3', name: 'Corte na Tesoura', price: 30, duration: 40 },
    { id: '4', name: 'Barba Terapia', price: 20, duration: 30 },
  ]));
  const [professionals] = useState<Professional[]>(load('dm_professionals', [{ id: '1', name: 'Danilson' }]));
  const [appointments, setAppointments] = useState<Appointment[]>(load('dm_appointments', []));
  const [transactions, setTransactions] = useState<Transaction[]>(load('dm_transactions', []));
  const [products] = useState<Product[]>(load('dm_products', []));

  useEffect(() => {
    localStorage.setItem('dm_clients', JSON.stringify(clients));
    localStorage.setItem('dm_appointments', JSON.stringify(appointments));
    localStorage.setItem('dm_transactions', JSON.stringify(transactions));
    localStorage.setItem('dm_services', JSON.stringify(services));
  }, [clients, appointments, transactions, services]);

  const addClient = (data: any) => {
    const newClient: Client = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      totalVisits: 0,
      totalSpent: 0,
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const addService = (data: Omit<Service, 'id'>) => {
    const newService = { ...data, id: crypto.randomUUID() };
    setServices(prev => [...prev, newService]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const quickRegister = (data: { clientName: string, services: Service[], paymentStatus: 'pago' | 'pendente' }) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);

    let clientId = clients.find(c => c.name.toLowerCase() === data.clientName.toLowerCase())?.id;
    
    if (!clientId) {
      clientId = crypto.randomUUID();
      const newClient: Client = {
        id: clientId,
        name: data.clientName,
        phone: '',
        createdAt: new Date().toISOString(),
        totalVisits: 0,
        totalSpent: 0
      };
      setClients(prev => [...prev, newClient]);
    }

    const totalPrice = data.services.reduce((acc, curr) => acc + curr.price, 0);
    const serviceIdsString = data.services.map(s => s.id).join(','); // Salva os IDs separados por vírgula

    const newAppt: Appointment = {
      id: crypto.randomUUID(),
      clientId: clientId,
      serviceId: serviceIdsString, // Armazena todos os IDs
      professionalId: '1',
      date: today,
      time: time,
      status: 'concluido',
      price: totalPrice,
      paymentStatus: data.paymentStatus,
    };
    setAppointments(prev => [...prev, newAppt]);

    if (data.paymentStatus === 'pago') {
      const newTx: Transaction = {
        id: crypto.randomUUID(),
        appointmentId: newAppt.id,
        type: 'receita',
        amount: totalPrice,
        date: today,
        description: `Atendimento - ${data.clientName} (${data.services.map(s => s.name).join(' + ')})`,
        status: 'pago',
      };
      setTransactions(prev => [...prev, newTx]);

      setClients(prev => prev.map(c => c.id === clientId ? {
        ...c,
        lastVisit: today,
        totalVisits: c.totalVisits + 1,
        totalSpent: c.totalSpent + totalPrice
      } : c));
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
    <DataContext.Provider value={{ clients, services, professionals, appointments, transactions, products, addClient, updateClient, addService, removeService, quickRegister, getClientStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};