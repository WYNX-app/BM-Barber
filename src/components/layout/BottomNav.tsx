import { Link, useLocation } from 'react-router-dom';
import { Home, Scissors, Users, DollarSign, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { vibrate } from '../../utils/haptics'; // <-- Importe

const menuItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/servicos', icon: Scissors, label: 'Cortes' },
  { path: '/clientes', icon: Users, label: 'Clientes' },
  { path: '/financeiro', icon: DollarSign, label: 'Caixa' },
  { path: '/relatorios', icon: FileText, label: 'Relatórios' },
  { path: '/config', icon: Settings, label: 'Ajustes' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-2 pointer-events-none">
      <nav className="bg-white/95 backdrop-blur-xl border border-dm-gold/20 shadow-[0_10px_40px_rgb(0,0,0,0.15)] rounded-[2.5rem] flex justify-between items-center px-2 py-2 w-full max-w-md pointer-events-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => vibrate()} // <-- Vibra ao clicar no menu
              className={`relative flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-colors ${
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
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] md:text-[10px] mt-1 font-bold ${isActive ? 'text-dm-black' : 'text-gray-500'}`}>
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