import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, DollarSign, Package, FileText, Settings, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { path: '/', icon: Home, label: 'Agenda Rápida' },
  { path: '/servicos', icon: Scissors, label: 'Catálogo' },
  { path: '/agenda', icon: Calendar, label: 'Agendamentos' },
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

      <div className="p-4 border-t border-dm-graphite text-center">
        <p className="text-xs text-dm-white/40">Desenvolvido para Danilson</p>
        <p className="text-xs text-dm-gold">v1.1 Premium</p>
      </div>
    </aside>
  );
};