import { Link, useLocation } from 'react-router-dom';
import { Home, Scissors, Users, DollarSign, FileText, Settings, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { vibrate } from '../../utils/haptics';
import { useAuth } from '../../contexts/AuthContext'; // <-- Importando o Auth

export const BottomNav = () => {
  const location = useLocation();
  const { isAdmin } = useAuth(); // <-- Verificando se é admin

  let menuItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/servicos', icon: Scissors, label: 'Cortes' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/financeiro', icon: DollarSign, label: 'Caixa' },
    { path: '/relatorios', icon: FileText, label: 'Relatórios' },
    { path: '/config', icon: Settings, label: 'Ajustes' },
  ];

  // Se for Admin, adiciona a aba do Painel do Fundador
  if (isAdmin) {
    menuItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-2 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-xl border border-dm-gold/20 shadow-[0_10px_40px_rgb(0,0,0,0.15)] rounded-[2.5rem] flex justify-between items-center px-1 py-2 w-full max-w-md pointer-events-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => vibrate()}
              // Usamos flex-1 para que os itens se dividam igualmente no espaço (6 ou 7 itens)
              className={`relative flex flex-col items-center justify-center flex-1 h-12 md:h-14 rounded-full transition-colors ${
                isActive ? 'text-dm-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-bubble"
                  className="absolute inset-0 bg-dm-gold/25 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.8 }} className="flex flex-col items-center relative z-10">
                {/* Ajusta o tamanho do ícone se for admin (para caber 7) */}
                <item.icon size={isAdmin ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`mt-1 font-bold whitespace-nowrap ${isAdmin ? 'text-[8px]' : 'text-[9px] md:text-[10px]'} ${isActive ? 'text-dm-black' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};