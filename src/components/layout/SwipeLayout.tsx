import { motion, useAnimation } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ROUTES = ['/', '/servicos', '/clientes', '/financeiro', '/relatorios', '/config'];

export const SwipeLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation();

  const currentIndex = ROUTES.indexOf(location.pathname);

  useEffect(() => {
    controls.start({ x: 0, opacity: 1 });
  }, [location.pathname, controls]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    
    if (info.offset.x < -swipeThreshold && currentIndex < ROUTES.length - 1) {
      navigate(ROUTES[currentIndex + 1]);
    } 
    else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      navigate(ROUTES[currentIndex - 1]);
    } 
    else {
      controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="w-full min-h-screen touch-pan-y"
    >
      {children}
    </motion.div>
  );
};