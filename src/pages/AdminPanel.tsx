import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Shield, User, CreditCard, Settings, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [subData, setSubData] = useState<any>(null);
  
  // Form states
  const [price, setPrice] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [graceDays, setGraceDays] = useState('7');

  useEffect(() => {
    async function loadData() {
      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles) {
        setProfessionals(profiles);
        if (profiles.length > 0) handleSelectUser(profiles[0]);
      }
    }
    if (isAdmin) loadData();
  }, [isAdmin]);

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
    if (data) {
      setSubData(data);
      setPrice(data.plan_price.toString());
      setDueDay(data.due_day.toString());
      setGraceDays(data.grace_period_days.toString());
    }
  };

  const handleUpdateBilling = async () => {
    if (!selectedUser) return;
    const updates = {
      plan_price: parseFloat(price),
      due_day: parseInt(dueDay),
      grace_period_days: parseInt(graceDays),
    };

    const { error } = await supabase.from('subscriptions').update(updates).eq('user_id', selectedUser.id);
    
    if (!error) {
      showToast('Dados de cobrança atualizados!', 'success');
      handleSelectUser(selectedUser); // Recarrega
    } else {
      showToast('Erro ao atualizar.', 'error');
    }
  };

  const handleRegisterPayment = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { error } = await supabase.from('subscriptions')
      .update({ last_payment_date: today, status: 'active' })
      .eq('user_id', selectedUser.id);
      
    if (!error) {
      showToast('Pagamento registrado! Acesso liberado.', 'success');
      handleSelectUser(selectedUser);
    }
  };

  const handleToggleSuspension = async (suspend: boolean) => {
    const newStatus = suspend ? 'suspended' : 'active';
    const { error } = await supabase.from('subscriptions')
      .update({ status: newStatus })
      .eq('user_id', selectedUser.id);
      
    if (!error) {
      showToast(suspend ? 'Acesso Suspenso manualmente.' : 'Acesso Reativado.', 'info');
      handleSelectUser(selectedUser);
    }
  };

  if (!isAdmin) return <div className="text-center p-10 font-bold text-red-500">Acesso Restrito</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 border-b border-dm-gold/30 pb-4">
        <div className="p-3 bg-dm-black rounded-2xl text-dm-gold">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-dm-black">Painel SaaS - Fundador</h1>
          <p className="text-dm-graphite/70">Gestão de clientes, faturamento e bloqueios do sistema.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LISTA DE CLIENTES (BARBEARIAS) */}
        <div className="bg-dm-white p-4 rounded-2xl border border-dm-gold/20 shadow-sm h-fit">
          <h2 className="text-sm font-bold uppercase tracking-wider text-dm-graphite mb-4">Minhas Barbearias</h2>
          <div className="space-y-2">
            {professionals.map(prof => (
              <button 
                key={prof.id} 
                onClick={() => handleSelectUser(prof)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${selectedUser?.id === prof.id ? 'bg-dm-gold/20 border border-dm-gold/50' : 'hover:bg-dm-ivory'}`}
              >
                <div className="w-10 h-10 rounded-full bg-dm-black text-dm-gold flex items-center justify-center font-bold">
                  {prof.full_name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-dm-black truncate">{prof.full_name || 'Sem nome'}</p>
                  <p className="text-xs text-dm-graphite/60 truncate">{prof.id.split('-')[0]}...</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* DETALHES DA ASSINATURA E CONTROLE */}
        {selectedUser && subData && (
          <div className="lg:col-span-3 space-y-6">
            
            {/* STATUS DO CLIENTE */}
            <div className={`p-6 rounded-2xl border-2 shadow-sm ${
              subData.status === 'suspended' ? 'bg-red-50 border-red-200' : 
              subData.status === 'late' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-dm-black mb-1">{selectedUser.full_name}</h2>
                  <p className="text-sm font-medium text-dm-graphite flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      subData.status === 'suspended' ? 'bg-red-500' : 
                      subData.status === 'late' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></span>
                    Status: {subData.status === 'suspended' ? 'BLOQUEADO POR FALTA DE PAGAMENTO' : subData.status === 'late' ? 'EM ATRASO' : 'EM DIA'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-dm-graphite/60 uppercase">Último Pagamento</p>
                  <p className="font-bold text-lg">{subData.last_payment_date ? format(new Date(subData.last_payment_date), 'dd/MM/yyyy') : 'Nenhum'}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleRegisterPayment} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex justify-center items-center gap-2">
                  <CheckCircle size={20}/> Registrar Pagamento (Liberar Acesso)
                </button>
                {subData.status !== 'suspended' ? (
                  <button onClick={() => handleToggleSuspension(true)} className="px-6 py-3 bg-red-100 text-red-700 border border-red-300 rounded-xl font-bold hover:bg-red-200 transition-colors flex justify-center items-center gap-2">
                    <XCircle size={20}/> Suspender Manualmente
                  </button>
                ) : (
                  <button onClick={() => handleToggleSuspension(false)} className="px-6 py-3 bg-dm-white text-dm-black border border-dm-graphite/20 rounded-xl font-bold hover:bg-dm-ivory transition-colors">
                    Reativar Acesso
                  </button>
                )}
              </div>
            </div>

            {/* CONFIGURAÇÃO DO PLANO */}
            <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/20 shadow-sm">
              <h3 className="text-lg font-serif mb-4 flex items-center gap-2"><CreditCard className="text-dm-gold"/> Configuração de Cobrança</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-dm-graphite mb-1">Valor Mensal (R$)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl focus:border-dm-gold outline-none font-bold text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dm-graphite mb-1">Dia do Vencimento</label>
                  <input type="number" min="1" max="31" value={dueDay} onChange={e => setDueDay(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl focus:border-dm-gold outline-none font-bold text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dm-graphite mb-1">Tolerância de Atraso</label>
                  <select value={graceDays} onChange={e => setGraceDays(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl focus:border-dm-gold outline-none font-bold text-lg bg-white">
                    <option value="3">3 dias</option>
                    <option value="5">5 dias</option>
                    <option value="7">7 dias</option>
                    <option value="10">10 dias</option>
                  </select>
                </div>
              </div>
              <button onClick={handleUpdateBilling} className="px-6 py-3 bg-dm-black text-white rounded-xl font-bold hover:bg-dm-graphite transition-colors">
                Salvar Configurações do Cliente
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}