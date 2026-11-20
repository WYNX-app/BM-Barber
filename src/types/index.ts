export type ClientStatus = 'novo' | 'frequente' | 'regular' | 'risco' | 'inativo';
export type PaymentStatus = 'pago' | 'pendente' | 'cancelado';
export type PaymentMethod = 'dinheiro' | 'pix' | 'debito' | 'credito' | 'outro';

export interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  lastVisit?: string;
  totalVisits: number;
  totalSpent: number;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
}

export interface Professional {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'agendado' | 'concluido' | 'cancelado' | 'faltou';
  price: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface Transaction {
  id: string;
  appointmentId?: string;
  type: 'receita' | 'despesa';
  amount: number;
  date: string;
  description: string;
  status: PaymentStatus;
  method?: PaymentMethod;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  sellPrice: number;
  category: string;
}