import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Shield, User, CreditCard, CheckCircle, XCircle, 
  TrendingUp, Users, AlertTriangle, ChevronRight, 
  Settings, Activity, DollarSign
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  full_name: string;
  username: string;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_price: number;
  due_day: number;
  grace_period_days: number;
  status: 'active' | 'late' | 'suspended';
  last_payment_date: string | null;
}

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [price, setPrice] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [graceDays, setGraceDays] = useState('7');

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    // Busca todos os perfis
    const { data: profilesData } = await supabase.from('profiles').select('*');
    // Busca todas as assinaturas
    const { data: subsData } = await supabase.from('subscriptions').select('*');

    if (profilesData) {
      setProfiles(profilesData);
      
      // Se ainda não tem usuário selecionado, seleciona o primeiro
      if (!selectedUser && profilesData.length > 0) {
        handleSelectUser(profilesData[0], subsData || []);
      }
    }
    if (subsData) setSubscriptions(subsData);
    setIsLoading(false);
  };

  const handleSelectUser = async (user: Profile, currentSubs = subscriptions) => {
    setSelectedUser(user);
    
    // Procura a assinatura do usuário
    let sub = currentSubs.find(s => s.user_id === user.id);

    // Se não existir, cria uma assinatura padrão na hora
    if (!sub) {
      const { data: newSub } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        plan_price: 0,
        due_day: 10,
        grace_period_days: 7,
        status: 'active'
      }).select().single();
      
      if (newSub) {
        sub = newSub;
        setSubscriptions(prev => [...prev, newSub]);
      }
    }

    if (sub) {
      setSelectedSub(sub);
      setPrice(sub.plan_price.toString());
      setDueDay(sub.due_day.toString());
      setGraceDays(sub.grace_period_days.toString());
    }
  };

  const handleUpdateBilling = async () => {
    if (!selectedSub) return;
    const updates = {
      plan_price: parseFloat(price) || 0,
      due_day: parseInt(dueDay) || 1,
      grace_period_days: parseInt(graceDays) || 7,
    };

    const { error } = await supabase.from('subscriptions').update(updates).eq('id', selectedSub.id);
    
    if (!error) {
      showToast('Plano atualizado com sucesso!', 'success');
      setSelectedSub({ ...selectedSub, ...updates });
      fetchData();
    } else {
      showToast('Erro ao atualizar o plano.', 'error');
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedSub) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { error } = await supabase.from('subscriptions')
      .update({ last_payment_date: today, status: 'active' })
      .eq('id', selectedSub.id);
      
    if (!error) {
      showToast('Pagamento registrado! Acesso liberado.', 'success');
      setSelectedSub({ ...selectedSub, last_payment_date: today, status: 'active' });
      fetchData();
    }
  };

  const handleToggleSuspension = async (suspend: boolean) => {
    if (!selectedSub) return;
    const newStatus = suspend ? 'suspended' : 'active';
    
    const { error } = await supabase.from('subscriptions')
      .update({ status: newStatus })
      .eq('id', selectedSub.id);
      
    if (!error) {
      showToast(suspend ? 'Acesso Suspenso.' : 'Acesso Reativado.', 'info');
      setSelectedSub({ ...selectedSub, status: newStatus });
      fetchData();
    }
  };

  // Cálculos de Métricas (MRR, Ativos, Atrasados)
  const totalBarbers = profiles.length;
  const activeBarbers = subscriptions.filter(s => s.status === 'active').length;
  const mrr = subscriptions.filter(s => s.status === 'active').reduce((acc, curr) => acc + curr.plan_price, 0);

  if (!isAdmin) return <div className="text-center p-10 font-bold text-red-500">Acesso Restrito</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER PREMIUM */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-dm-graphite pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-dm-gold/20 text-dm-gold text-xs font-bold uppercase tracking-wider rounded-md border border-dm-gold/30">SaaS Enterprise</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white flex items-center gap-3">
            <Shield className="text-dm-gold" size={36} /> Command Center
          </h1>
          <p className="text-dm-white/60 mt-1">Gestão estratégica de faturamento e clientes.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-dm-white/40 uppercase">Status da Nuvem</p>
            <p className="text-green-400 font-medium flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </header>

      {/* MÉTRICAS GLOBAIS (DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dm-graphite p-6 rounded-2xl border border-dm-gold/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} className="text-dm-gold"/></div>
          <p className="text-sm font-bold text-dm-white/50 uppercase tracking-wider mb-2">Faturamento Recorrente (MRR)</p>
          <h3 className="text-4xl font-serif font-bold text-white">R$ {mrr.toFixed(2)}</h3>
        </div>
        <div className="bg-dm-graphite p-6 rounded-2xl border border-dm-gold/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={64} className="text-dm-gold"/></div>
          <p className="text-sm font-bold text-dm-white/50 uppercase tracking-wider mb-2">Barbearias Ativas</p>
          <h3 className="text-4xl font-serif font-bold text-white">{activeBarbers} <span className="text-lg text-dm-white/40 font-sans">/ {totalBarbers}</span></h3>
        </div>
        <div className="bg-dm-graphite p-6 rounded-2xl border border-red-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-500"/></div>
          <p className="text-sm font-bold text-dm-white/50 uppercase tracking-wider mb-2">Em Atraso / Bloqueados</p>
          <h3 className="text-4xl font-serif font-bold text-red-400">{totalBarbers - activeBarbers}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LISTA DE CLIENTES (ESQUERDA - 4 COLUNAS) */}
        <div className="lg:col-span-4 bg-dm-graphite rounded-2xl border border-dm-white/10 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-dm-white/10 bg-dm-black/50">
            <h2 className="text-sm font-bold uppercase tracking-wider text-dm-white">Diretório de Barbearias</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {profiles.map(prof => {
              const sub = subscriptions.find(s => s.user_id === prof.id);
              const isSelected = selectedUser?.id === prof.id;
              const isSuspended = sub?.status === 'suspended';

              return (
                <button 
                  key={prof.id} 
                  onClick={() => handleSelectUser(prof)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                    isSelected ? 'bg-dm-gold/10 border border-dm-gold/30' : 'hover:bg-dm-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      isSuspended ? 'bg-red-500/20 text-red-400' : 'bg-dm-black text-dm-gold'
                    }`}>
                      {prof.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className={`font-bold ${isSelected ? 'text-dm-gold' : 'text-white'}`}>{prof.full_name || 'Sem nome'}</p>
                      <p className={`text-xs ${isSuspended ? 'text-red-400' : 'text-dm-white/40'}`}>
                        {isSuspended ? 'Acesso Bloqueado' : 'Acesso Ativo'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`text-dm-white/20 group-hover:text-dm-white transition-colors ${isSelected ? 'text-dm-gold' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* DETALHES DO CLIENTE (DIREITA - 8 COLUNAS) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedUser && selectedSub ? (
              <motion.div 
                key={selectedUser.id}
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* HEADER DO CLIENTE */}
                <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/30 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-dm-black text-dm-gold flex items-center justify-center text-2xl font-bold">
                      {selectedUser.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-dm-black">{selectedUser.full_name}</h2>
                      <p className="text-sm text-dm-graphite/60 font-medium">ID: {selectedUser.id.split('-')[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-dm-graphite/50 uppercase">Status do Cliente</p>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mt-1 ${
                      selectedSub.status === 'suspended' ? 'bg-red-100 text-red-700' : 
                      selectedSub.status === 'late' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {selectedSub.status === 'suspended' ? 'BLOQUEADO' : selectedSub.status === 'late' ? 'EM ATRASO' : 'ATIVO'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CONFIGURAÇÃO DO PLANO */}
                  <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/20 shadow-sm">
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-2 border-b border-dm-ivory pb-2">
                      <Settings className="text-dm-gold" size={20}/> Configurar Plano
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-dm-graphite uppercase mb-1">Valor Mensal (R$)</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl focus:border-dm-gold outline-none font-bold text-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dm-graphite uppercase mb-1">Vencimento</label>
                          <input type="number" min="1" max="31" value={dueDay} onChange={e => setDueDay(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl focus:border-dm-gold outline-none font-bold text-lg" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-dm-graphite uppercase mb-1">Tolerância</label>
                          <select value={graceDays} onChange={e => setGraceDays(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl focus:border-dm-gold outline-none font-bold text-lg bg-white">
                            <option value="3">3 dias</option>
                            <option value="5">5 dias</option>
                            <option value="7">7 dias</option>
                            <option value="10">10 dias</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={handleUpdateBilling} className="w-full py-3 bg-dm-black text-white rounded-xl font-bold hover:bg-dm-graphite transition-colors mt-2">
                        Salvar Configurações
                      </button>
                    </div>
                  </div>

                  {/* AÇÕES DE COBRANÇA E BLOQUEIO */}
                  <div className="bg-dm-black p-6 rounded-2xl border border-dm-graphite shadow-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-5"><Activity size={150} className="text-dm-gold"/></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-lg font-serif mb-4 flex items-center gap-2 text-white border-b border-dm-graphite pb-2">
                        <CreditCard className="text-dm-gold" size={20}/> Ações Financeiras
                      </h3>
                      
                      <div className="mb-6">
                        <p className="text-xs font-bold text-dm-white/50 uppercase">Último Pagamento Registrado</p>
                        <p className="text-xl font-bold text-white mt-1">
                          {selectedSub.last_payment_date 
                            ? format(new Date(selectedSub.last_payment_date), 'dd/MM/yyyy')
                            : 'Nenhum registro'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button onClick={handleRegisterPayment} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                          <CheckCircle size={20}/> Registrar Pagamento (Liberar)
                        </button>
                        
                        {selectedSub.status !== 'suspended' ? (
                          <button onClick={() => handleToggleSuspension(true)} className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors flex justify-center items-center gap-2">
                            <XCircle size={20}/> Suspender Acesso Manualmente
                          </button>
                        ) : (
                          <button onClick={() => handleToggleSuspension(false)} className="w-full py-3 bg-dm-white/10 text-white border border-dm-white/20 rounded-xl font-bold hover:bg-dm-white hover:text-dm-black transition-colors">
                            Forçar Reativação
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-dm-graphite/50 bg-dm-white rounded-2xl border border-dm-gold/20 p-10 min-h-[400px]">
                <User size={64} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Selecione uma barbearia ao lado para gerenciar o plano.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}