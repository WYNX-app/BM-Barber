import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Lock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export const SuspendedScreen = () => {
  const { signOut } = useAuth();
  const { subscription } = useSubscription();

  const handleSupport = () => {
    const mensagem = encodeURIComponent(`Olá, Heitor! Meu acesso ao sistema D&M foi suspenso (Atraso). Gostaria de regularizar meu pagamento.`);
    window.open(`https://wa.me/5589994386200?text=${mensagem}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-dm-ivory flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-dm-white p-8 rounded-3xl border-2 border-red-500/20 shadow-2xl w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-red-600" size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-dm-black mb-2">Acesso Suspenso</h1>
        <p className="text-dm-graphite mb-6">
          Identificamos que sua mensalidade de <strong>R$ {subscription?.plan_price?.toFixed(2)}</strong> está com mais de {subscription?.grace_period_days} dias de atraso.
        </p>
        <div className="bg-red-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-red-800 font-medium">Para liberar o sistema e voltar a usar a Agenda, realize o pagamento via Pix e envie o comprovante para o suporte.</p>
        </div>
        
        <button 
          onClick={handleSupport}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-500 transition-colors mb-4"
        >
          <MessageCircle size={20} /> Falar com o Suporte (Heitor)
        </button>
        <button 
          onClick={() => signOut()}
          className="text-sm text-dm-graphite/60 hover:text-dm-black transition-colors"
        >
          Sair da Conta
        </button>
      </motion.div>
    </div>
  );
};