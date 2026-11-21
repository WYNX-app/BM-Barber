import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { differenceInDays, setDate, isAfter } from 'date-fns';

export interface Subscription {
  id: string;
  user_id: string;
  plan_price: number;
  due_day: number;
  grace_period_days: number;
  status: 'active' | 'late' | 'suspended';
  last_payment_date: string | null;
}

interface SubContextType {
  subscription: Subscription | null;
  loading: boolean;
  isSuspended: boolean;
  daysUntilDue: number;
  warningMessage: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubContext = createContext<SubContextType>({} as SubContextType);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isSuspended, setIsSuspended] = useState(false);
  const [daysUntilDue, setDaysUntilDue] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!user) {
      // CORREÇÃO CRUCIAL: Se não tem usuário, para o loading e sai.
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
    
    if (data && !error) {
      setSubscription(data);
      calculateStatus(data);
    } else if (error && error.code === 'PGRST116') {
      // Se não encontrou assinatura (código PGRST116), cria uma padrão
      const { data: newSub } = await supabase.from('subscriptions').insert({
        user_id: user.id, plan_price: 0, due_day: 10, status: 'active'
      }).select().single();
      
      if (newSub) {
        setSubscription(newSub);
        calculateStatus(newSub);
      }
    }
    setLoading(false);
  };

  const calculateStatus = (sub: Subscription) => {
    if (sub.status === 'suspended') {
      setIsSuspended(true);
      setWarningMessage(null);
      return;
    }
    setIsSuspended(false);

    const today = new Date();
    let dueDate = setDate(today, sub.due_day);
    
    if (isAfter(today, dueDate)) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, sub.due_day);
      dueDate = nextMonth;
    }

    const diff = differenceInDays(dueDate, today);
    setDaysUntilDue(diff);

    if (diff === 2) {
      setWarningMessage(`Atenção: Sua mensalidade vence em 2 dias (dia ${sub.due_day}).`);
    } else if (diff === 0) {
      setWarningMessage(`Hoje é o dia do vencimento da sua mensalidade!`);
    } else if (diff < 0 && Math.abs(diff) <= sub.grace_period_days) {
      setWarningMessage(`Sua mensalidade está atrasada há ${Math.abs(diff)} dias. Você tem mais ${sub.grace_period_days - Math.abs(diff)} dias antes do bloqueio.`);
    } else if (diff < -sub.grace_period_days) {
      setIsSuspended(true);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return (
    <SubContext.Provider value={{ subscription, loading, isSuspended, daysUntilDue, warningMessage, refreshSubscription: fetchSubscription }}>
      {children}
    </SubContext.Provider>
  );
};

export const useSubscription = () => useContext(SubContext);