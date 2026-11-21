import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, DollarSign, Package, FileText, Settings, Scissors, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/servicos', icon: Scissors, label: 'Catálogo' },
  { path: '/agenda', icon: Calendar, label: 'Agenda' },
  { path: '/clientes', icon: Users, label: 'Clientes' },
  { path: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { path: '/estoque', icon: Package, label: 'Estoque' },
  { path: '/relatorios', icon: FileText, label: 'Relatórios' },
  { path: '/config', icon: Settings, label: 'Configurações' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();

  return (
    // h-screen e overflow-hidden garantem que a barra não cresça além da tela
    <aside className="w-64 bg-dm-black text-dm-white h-screen flex flex-col fixed left-0 top-0 border-r border-dm-graphite z-50 overflow-hidden">
      
      {/* CABEÇALHO DA SIDEBAR */}
      <div className="p-6 flex flex-col items-center border-b border-dm-graphite relative shrink-0">
        
        {/* ÍCONE DE ADMIN (TOPO DIREITO, PERTO DO NOME) */}
        {isAdmin && (
          <Link 
            to="/admin" 
            title="Painel do Fundador"
            className="absolute top-4 right-4 p-2 bg-dm-gold/10 text-dm-gold rounded-lg hover:bg-dm-gold hover:text-dm-black transition-all shadow-sm"
          >
            <Shield size={20} />
          </Link>
        )}

        <div className="w-16 h-16 rounded-full border-2 border-dm-gold flex items-center justify-center mb-2 bg-dm-black">
          <span className="font-serif text-2xl text-dm-gold">D&M</span>
        </div>
        <h1 className="font-serif text-xl tracking-widest text-dm-ivory">BARBEARIA</h1>
      </div>

      {/* MENU DE NAVEGAÇÃO (COM SCROLL) */}
      {/* flex-1 faz ocupar o espaço restante, overflow-y-auto libera a rolagem */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto sidebar-scroll">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative ${
                isActive ? 'text-dm-gold font-medium bg-dm-graphite/30' : 'text-dm-white/60 hover:text-dm-white hover:bg-dm-graphite/50'
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

      {/* RODAPÉ DA SIDEBAR */}
      <div className="p-4 border-t border-dm-graphite bg-dm-black shrink-0">
        <div className="text-center mb-4">
          <p className="text-xs text-dm-white/40">Desenvolvido para Danilson</p>
          <p className="text-xs text-dm-gold font-medium">v1.4 Premium</p>
        </div>
        
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-dm-graphite text-dm-white/70 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};