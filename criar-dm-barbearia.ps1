# ==========================================
# SCRIPT DE CRIAÇÃO AUTOMÁTICA - D&M BARBEARIA
# ==========================================

$projectName = "dm-barbearia"

Write-Host "Criando estrutura do projeto $projectName..." -ForegroundColor Green

# Criar pastas
$folders = @(
    "$projectName",
    "$projectName/src",
    "$projectName/src/components",
    "$projectName/src/components/layout",
    "$projectName/src/contexts",
    "$projectName/src/layouts",
    "$projectName/src/pages",
    "$projectName/src/types",
    "$projectName/public"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Set-Location $projectName

# ==========================================
# CRIANDO ARQUIVOS DE CONFIGURAÇÃO
# ==========================================

Write-Host "Criando arquivos de configuração..." -ForegroundColor Cyan

# package.json
@'
{
  "name": "dm-barbearia",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "date-fns": "^3.3.1",
    "framer-motion": "^11.0.3",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.323.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.1",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0"
  }
}
'@ | Out-File -FilePath "package.json" -Encoding utf8

# tailwind.config.js
@'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dm: {
          black: '#171717',
          graphite: '#262626',
          ivory: '#F1EBDD',
          white: '#FAF9F6',
          gold: '#B49A68',
          bronze: '#806747',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(23, 23, 23, 0.05)',
      }
    },
  },
  plugins: [],
}
'@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8

# postcss.config.js
@'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@ | Out-File -FilePath "postcss.config.js" -Encoding utf8

# index.html
@'
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>D&M Barbearia - Gestão Inteligente</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@ | Out-File -FilePath "index.html" -Encoding utf8

# vite.config.ts
@'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
'@ | Out-File -FilePath "vite.config.ts" -Encoding utf8

# tsconfig.json
@'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
'@ | Out-File -FilePath "tsconfig.json" -Encoding utf8

# tsconfig.node.json
@'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
'@ | Out-File -FilePath "tsconfig.node.json" -Encoding utf8

# ==========================================
# CRIANDO ARQUIVOS FONTE (SRC)
# ==========================================

Write-Host "Criando código-fonte..." -ForegroundColor Cyan

# src/index.css
@'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-dm-ivory text-dm-black font-sans antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-serif;
  }
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { @apply bg-dm-gold/40 rounded-full; }
::-webkit-scrollbar-thumb:hover { @apply bg-dm-gold/80; }
'@ | Out-File -FilePath "src/index.css" -Encoding utf8

# src/main.tsx
@'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'@ | Out-File -FilePath "src/main.tsx" -Encoding utf8

# src/types/index.ts
@'
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
  duration: number;
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
  date: string;
  time: string;
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
'@ | Out-File -FilePath "src/types/index.ts" -Encoding utf8

# src/contexts/DataContext.tsx
@'
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
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  getClientStatus: (client: Client) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const load = (key: string, fallback: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [clients, setClients] = useState<Client[]>(load('dm_clients', []));
  const [services] = useState<Service[]>(load('dm_services', [
    { id: '1', name: 'Corte Degradê', price: 45, duration: 30 },
    { id: '2', name: 'Barba Terapia', price: 35, duration: 30 },
  ]));
  const [professionals] = useState<Professional[]>(load('dm_professionals', [{ id: '1', name: 'Danilson' }]));
  const [appointments, setAppointments] = useState<Appointment[]>(load('dm_appointments', []));
  const [transactions, setTransactions] = useState<Transaction[]>(load('dm_transactions', []));
  const [products] = useState<Product[]>(load('dm_products', []));

  useEffect(() => {
    localStorage.setItem('dm_clients', JSON.stringify(clients));
    localStorage.setItem('dm_appointments', JSON.stringify(appointments));
    localStorage.setItem('dm_transactions', JSON.stringify(transactions));
  }, [clients, appointments, transactions]);

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

  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const newAppt = { ...data, id: crypto.randomUUID() };
    setAppointments(prev => [...prev, newAppt]);

    if (data.paymentStatus === 'pago') {
      const newTx: Transaction = {
        id: crypto.randomUUID(),
        appointmentId: newAppt.id,
        type: 'receita',
        amount: data.price,
        date: data.date,
        description: `Atendimento - ${clients.find(c => c.id === data.clientId)?.name}`,
        status: 'pago',
        method: data.paymentMethod
      };
      setTransactions(prev => [...prev, newTx]);
      
      setClients(prev => prev.map(c => c.id === data.clientId ? {
        ...c,
        lastVisit: data.date,
        totalVisits: c.totalVisits + 1,
        totalSpent: c.totalSpent + data.price
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
    <DataContext.Provider value={{ clients, services, professionals, appointments, transactions, products, addClient, addAppointment, getClientStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
'@ | Out-File -FilePath "src/contexts/DataContext.tsx" -Encoding utf8

# src/components/layout/Sidebar.tsx
@'
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, DollarSign, Package, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/agenda', icon: Calendar, label: 'Agenda' },
  { path: '/clientes', icon: Users, label: 'Clientes' },
  { path: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { path: '/estoque', icon: Package, label: 'Estoque' },
  { path: '/relatorios', icon: FileText, label: 'Relatórios' },
  { path: '/config', icon: Settings, label: 'Configurações' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-dm-black text-dm-white min-h-screen flex flex-col fixed left-0 top-0 border-r border-dm-graphite">
      <div className="p-6 flex flex-col items-center border-b border-dm-graphite">
        <div className="w-16 h-16 rounded-full border-2 border-dm-gold flex items-center justify-center mb-2">
          <span className="font-serif text-2xl text-dm-gold">D&M</span>
        </div>
        <h1 className="font-serif text-xl tracking-widest text-dm-ivory">BARBEARIA</h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative ${
                isActive ? 'text-dm-gold font-medium' : 'text-dm-white/60 hover:text-dm-white hover:bg-dm-graphite/50'
              }`}
            >
              {isActive && (
                <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-8 bg-dm-gold rounded-r-full" />
              )}
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
'@ | Out-File -FilePath "src/components/layout/Sidebar.tsx" -Encoding utf8

# src/layouts/MainLayout.tsx
@'
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-dm-ivory">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
'@ | Out-File -FilePath "src/layouts/MainLayout.tsx" -Encoding utf8

# src/pages/Dashboard.tsx
@'
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar as CalendarIcon, AlertCircle, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { appointments, transactions, clients, products } = useData();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayRevenue = transactions
    .filter(t => t.date === today && t.status === 'pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingPayments = appointments.filter(a => a.paymentStatus === 'pendente');
  const lowStock = products.filter(p => p.quantity <= p.minQuantity);
  const todayAppointments = appointments.filter(a => a.date === today && a.status === 'agendado');

  const chartData = [
    { name: 'Seg', receita: 150 }, { name: 'Ter', receita: 230 },
    { name: 'Qua', receita: 180 }, { name: 'Qui', receita: 320 },
    { name: 'Sex', receita: 450 }, { name: 'Sáb', receita: 500 },
    { name: 'Dom', receita: 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-dm-black">Bom dia, Danilson!</h1>
          <p className="text-dm-graphite/70 mt-1">Veja como está sua barbearia hoje.</p>
        </div>
        <Link to="/agenda" className="bg-dm-black text-dm-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-dm-graphite transition-colors shadow-premium">
          <Plus size={20} className="text-dm-gold" /> NOVO AGENDAMENTO
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Faturamento Hoje', value: `R$ ${todayRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-600' },
          { title: 'Atendimentos Hoje', value: todayAppointments.length, icon: CalendarIcon, color: 'text-dm-gold' },
          { title: 'Clientes Ativos', value: clients.length, icon: Users, color: 'text-blue-600' },
          { title: 'Pendentes', value: pendingPayments.length, icon: AlertCircle, color: 'text-orange-500' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-dm-white p-6 rounded-xl border border-dm-gold/20 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-dm-graphite/60">{kpi.title}</p>
                <h3 className="text-2xl font-semibold mt-2">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded-full bg-dm-ivory ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dm-white p-6 rounded-xl border border-dm-gold/20 shadow-sm">
          <h3 className="font-serif text-lg mb-4">Evolução do Faturamento</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B49A68" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B49A68" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#B49A68', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="receita" stroke="#B49A68" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dm-black text-dm-white p-6 rounded-xl shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-dm-gold opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <h3 className="font-serif text-lg mb-4 text-dm-gold">O QUE PRECISA DA SUA ATENÇÃO?</h3>
          <ul className="space-y-4">
            {pendingPayments.length > 0 && <li className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-orange-500"></div>{pendingPayments.length} pagamento(s) pendente(s).</li>}
            {lowStock.length > 0 && <li className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-red-500"></div>{lowStock.length} produto(s) com estoque baixo.</li>}
            {todayAppointments.length > 0 && <li className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-dm-gold"></div>{todayAppointments.length} agendamento(s) para hoje.</li>}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
'@ | Out-File -FilePath "src/pages/Dashboard.tsx" -Encoding utf8

# src/pages/Agenda.tsx
@'
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const appointmentSchema = z.object({
  clientId: z.string().min(1, 'Selecione um cliente'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  date: z.string().min(1, 'Selecione a data'),
  time: z.string().min(1, 'Selecione o horário'),
  paymentStatus: z.enum(['pago', 'pendente']),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

export const Agenda = () => {
  const { appointments, clients, services, professionals, addAppointment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { date: selectedDate, paymentStatus: 'pendente' }
  });

  const dayAppointments = appointments.filter(a => a.date === selectedDate);

  const onSubmit = (data: AppointmentForm) => {
    const service = services.find(s => s.id === data.serviceId);
    if (!service) return;

    const hasConflict = dayAppointments.some(a => a.time === data.time && a.status === 'agendado');
    if (hasConflict) {
      alert('Já existe um agendamento neste horário!');
      return;
    }

    addAppointment({
      ...data,
      price: service.price,
      professionalId: professionals[0]?.id || '1',
      status: 'agendado'
    });

    setIsModalOpen(false);
    reset();
    alert('Agendamento registrado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Agenda</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-dm-black text-dm-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-dm-graphite transition-all">
          <Plus size={20} className="text-dm-gold" /> Novo Agendamento
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dateStr = format(date, 'yyyy-MM-dd');
          return (
            <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
              className={`p-4 rounded-xl min-w-[100px] flex flex-col items-center transition-all ${
                selectedDate === dateStr ? 'bg-dm-black text-dm-white shadow-premium' : 'bg-dm-white text-dm-graphite border border-dm-gold/20'
              }`}>
              <span className="text-xs uppercase opacity-70">{format(date, 'EEE')}</span>
              <span className="text-2xl font-serif mt-1">{format(date, 'dd')}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-dm-white rounded-xl border border-dm-gold/20 p-6 shadow-sm">
        <h3 className="font-serif text-lg mb-4">Agendamentos de {format(new Date(selectedDate), 'dd/MM/yyyy')}</h3>
        {dayAppointments.length === 0 ? (
          <div className="text-center py-12 text-dm-graphite/50"><p>Nenhum agendamento para este dia.</p></div>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map(appt => {
              const client = clients.find(c => c.id === appt.clientId);
              const service = services.find(s => s.id === appt.serviceId);
              return (
                <motion.div key={appt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-4 rounded-lg border border-dm-gold/10 bg-dm-ivory/30">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]"><p className="text-lg font-semibold">{appt.time}</p></div>
                    <div className="w-px h-8 bg-dm-gold/30"></div>
                    <div>
                      <p className="font-medium">{client?.name}</p>
                      <p className="text-sm text-dm-graphite/70">{service?.name} • R$ {appt.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appt.paymentStatus === 'pago' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {appt.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-dm-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-serif mb-6">Novo Agendamento</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Cliente</label>
                  <select {...register('clientId')} className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold">
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.clientId && <span className="text-red-500 text-xs">{errors.clientId.message}</span>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Serviço</label>
                  <select {...register('serviceId')} className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold">
                    <option value="">Selecione...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm mb-1">Data</label><input type="date" {...register('date')} className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" /></div>
                  <div><label className="block text-sm mb-1">Horário</label><input type="time" {...register('time')} className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" /></div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Status do Pagamento</label>
                  <select {...register('paymentStatus')} className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold">
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-dm-black text-dm-black rounded-lg hover:bg-dm-ivory transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-dm-black text-dm-white rounded-lg hover:bg-dm-graphite transition-colors">Salvar</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
'@ | Out-File -FilePath "src/pages/Agenda.tsx" -Encoding utf8

# src/pages/Relatorios.tsx
@'
import { useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export const Relatorios = () => {
  const { transactions, clients, getClientStatus } = useData();
  const reportRef = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  const monthTransactions = transactions.filter(t => t.date.startsWith(month));
  const totalRevenue = monthTransactions.filter(t => t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const pending = monthTransactions.filter(t => t.status === 'pendente').reduce((acc, curr) => acc + curr.amount, 0);
  const ticketMedio = monthTransactions.length > 0 ? totalRevenue / monthTransactions.length : 0;

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Relatorio_DM_${month}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h1 className="text-3xl font-serif">Relatórios Inteligentes</h1>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-dm-black rounded-lg hover:bg-dm-black hover:text-white transition-colors"><Printer size={18} /> Imprimir</button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-dm-gold text-dm-black rounded-lg hover:bg-dm-bronze hover:text-white transition-colors"><Download size={18} /> Enviar como PDF</button>
        </div>
      </div>

      <div className="mb-4 no-print">
        <label className="text-sm font-medium mr-2">Selecione o Mês:</label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-dm-gold/30 rounded-lg bg-dm-white" />
      </div>

      <div ref={reportRef} className="bg-dm-white p-8 rounded-xl shadow-sm border border-dm-gold/20 text-dm-black">
        <div className="text-center border-b-2 border-dm-gold pb-6 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-dm-black flex items-center justify-center mx-auto mb-2"><span className="font-serif text-xl font-bold">D&M</span></div>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-widest">BARBEARIA D&M</h1>
          <p className="text-sm text-dm-graphite/70 mt-1">Relatório de Desempenho Mensal</p>
          <p className="text-sm font-medium mt-2">Período: {month.split('-').reverse().join('/')}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-dm-gold/30 p-4 rounded-lg text-center bg-dm-ivory/20">
            <p className="text-sm text-dm-graphite/70">Faturamento Bruto</p>
            <p className="text-xl font-bold text-dm-black">R$ {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="border border-dm-gold/30 p-4 rounded-lg text-center bg-dm-ivory/20">
            <p className="text-sm text-dm-graphite/70">Ticket Médio</p>
            <p className="text-xl font-bold text-dm-black">R$ {ticketMedio.toFixed(2)}</p>
          </div>
          <div className="border border-dm-gold/30 p-4 rounded-lg text-center bg-dm-ivory/20">
            <p className="text-sm text-dm-graphite/70">Pendentes</p>
            <p className="text-xl font-bold text-orange-600">R$ {pending.toFixed(2)}</p>
          </div>
        </div>

        <h2 className="text-xl font-serif border-b border-dm-gold/30 pb-2 mb-4">Análise de Clientes</h2>
        <div className="space-y-4">
          <p className="text-sm"><strong>Total de Clientes Cadastrados:</strong> {clients.length}</p>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <h3 className="font-semibold text-sm mb-2">Clientes em Risco/Inativos</h3>
               <ul className="text-sm space-y-1">
                 {clients.filter(c => ['Risco', 'Inativo'].includes(getClientStatus(c))).slice(0, 5).map(c => (
                   <li key={c.id} className="flex justify-between border-b border-dm-ivory pb-1"><span>{c.name}</span><span className="text-red-500">{getClientStatus(c)}</span></li>
                 ))}
               </ul>
             </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dm-gold/30 text-center text-xs text-dm-graphite/50">
          <p>Relatório gerado automaticamente pelo Sistema de Gestão D&M em {format(new Date(), 'dd/MM/yyyy HH:mm')}.</p>
        </div>
      </div>
    </div>
  );
};
'@ | Out-File -FilePath "src/pages/Relatorios.tsx" -Encoding utf8

# src/App.tsx
@'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Agenda } from './pages/Agenda';
import { Relatorios } from './pages/Relatorios';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="*" element={<div className="text-center mt-20 text-xl font-serif">Página em construção...</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
'@ | Out-File -FilePath "src/App.tsx" -Encoding utf8

# ==========================================
# INSTALANDO DEPENDÊNCIAS
# ==========================================

Write-Host "Instalando dependências (isso pode levar alguns minutos)..." -ForegroundColor Yellow
npm install

Write-Host "==============================================" -ForegroundColor Green
Write-Host "PROJETO CRIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "Para iniciar, execute:" -ForegroundColor Yellow
Write-Host "cd $projectName"
Write-Host "npm run dev"
Write-Host "==============================================" -ForegroundColor Green