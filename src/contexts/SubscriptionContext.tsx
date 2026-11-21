import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { differenceInDays, parseISO, setDate, isAfter } from 'date-fns';

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
  
  // Estados calculados
  const [isSuspended, setIsSuspended] = useState(false);
  const [daysUntilDue, setDaysUntilDue] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
    
    if (data) {
      setSubscription(data);
      calculateStatus(data);
    } else {
      // Se não tem assinatura, cria uma padrão (Active) para não travar o app do Danilson de primeira
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

    // Cálculo de vencimento
    const today = new Date();
    // Cria a data de vencimento para o mês atual
    let dueDate = setDate(today, sub.due_day);
    
    // Se já passou do dia de vencimento este mês, joga pro próximo mês
    if (isAfter(today, dueDate)) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, sub.due_day);
      dueDate = nextMonth;
    }

    const diff = differenceInDays(dueDate, today);
    setDaysUntilDue(diff);

    // Lógica de Avisos (2 dias antes, no dia, e tolerância)
    if (diff === 2) {
      setWarningMessage(`Atenção: Sua mensalidade vence em 2 dias (dia ${sub.due_day}).`);
    } else if (diff === 0) {
      setWarningMessage(`Hoje é o dia do vencimento da sua mensalidade!`);
    } else if (diff < 0 && Math.abs(diff) <= sub.grace_period_days) {
      setWarningMessage(`Sua mensalidade está atrasada há ${Math.abs(diff)} dias. Você tem mais ${sub.grace_period_days - Math.abs(diff)} dias antes do bloqueio.`);
    } else if (diff < -sub.grace_period_days) {
      // Passou da tolerância: Suspenso Automaticamente (O front bloqueia, o admin pode reverter)
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