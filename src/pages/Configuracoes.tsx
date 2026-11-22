import { useState, useEffect } from 'react';
import { Settings, User, LogOut, Shield, Bell, Smartphone, Trash2, Database, LifeBuoy, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext'; // <-- IMPORTANTE
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns'; // <-- IMPORTANTE
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useToast } from '../contexts/ToastContext';

export const Configuracoes = () => {
  const { signOut, user, isAdmin } = useAuth();
  const { lastBackupDate } = useData(); // <-- Puxando a data do backup
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      showToast('O app já está instalado ou o navegador não suporta.', 'info');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      showToast('App instalado com sucesso!', 'success');
    }
    setDeferredPrompt(null);
  };

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      showToast('Seu navegador não suporta notificações.', 'error');
      return;
    }

    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      showToast('Notificações desativadas nas configurações do app.', 'info');
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showToast('Notificações ativadas com sucesso!', 'success');
      } else {
        showToast('Permissão de notificação negada pelo navegador.', 'error');
      }
    }
  };

  const handleClearLocalData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('dm_')) {
        localStorage.removeItem(key);
      }
    });
    setIsClearDataModalOpen(false);
    showToast('Cache local limpo. O app será recarregado.', 'success');
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleSupport = () => {
    const mensagem = encodeURIComponent(`Olá, Heitor! Encontrei um problema/erro no sistema da Barbearia D&M. Pode me ajudar?`);
    window.open(`https://wa.me/5589994386200?text=${mensagem}`, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl pb-20">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Configurações</h1>
        <p className="text-dm-graphite/70 mt-1">Ajustes gerais do seu sistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PERFIL DO DONO */}
        <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
            <User className="text-dm-gold"/> Perfil do Dono
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-dm-graphite mb-1">Conta Logada</label>
              <input 
                type="text" 
                value={user?.email || 'Carregando...'} 
                className="w-full p-3 border border-dm-gold/20 rounded-xl bg-dm-ivory/50 outline-none text-dm-graphite font-medium" 
                disabled 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-dm-graphite mb-1">Nome da Barbearia</label>
              <input 
                type="text" 
                defaultValue="Barbearia D&M" 
                className="w-full p-3 border border-dm-gold/20 rounded-xl bg-dm-ivory/50 outline-none focus:border-dm-gold font-medium" 
              />
            </div>
          </div>
        </div>

        {/* PREFERÊNCIAS DO SISTEMA */}
        <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/30 shadow-sm flex flex-col">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
            <Settings className="text-dm-gold"/> Preferências do App
          </h2>
          
          <div className="space-y-3 flex-1">
            
            {/* Status do Backup Automático */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-2">
              <p className="text-green-800 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                Backup Automático Protegido
              </p>
              <p className="text-xs text-green-700 mt-1">
                Último backup na nuvem: {lastBackupDate ? format(new Date(lastBackupDate), 'dd/MM/yyyy') : 'Hoje'}
              </p>
            </div>

            {/* Botão de Instalação PWA */}
            {isInstallable && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                onClick={handleInstallApp}
                className="w-full flex items-center justify-between p-4 bg-dm-gold/10 border border-dm-gold/30 rounded-xl hover:bg-dm-gold/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-dm-gold text-white rounded-lg"><Smartphone size={20}/></div>
                  <div className="text-left">
                    <p className="font-bold text-dm-black text-sm">Instalar Aplicativo</p>
                    <p className="text-xs text-dm-graphite/70">Adicione o D&M à sua tela inicial</p>
                  </div>
                </div>
              </motion.button>
            )}

            {/* Toggle de Notificações */}
            <div className="flex items-center justify-between p-4 bg-dm-ivory/30 border border-dm-gold/10 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${notificationsEnabled ? 'bg-dm-gold text-white' : 'bg-dm-graphite/10 text-dm-graphite'}`}>
                  <Bell size={20}/>
                </div>
                <div>
                  <p className="font-bold text-dm-black text-sm">Notificações</p>
                  <p className="text-xs text-dm-graphite/70">Avisos de novos agendamentos</p>
                </div>
              </div>
              <button 
                onClick={handleToggleNotifications}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <motion.div 
                  layout
                  className="w-5 h-5 bg-white rounded-full shadow-md"
                  style={{ marginLeft: notificationsEnabled ? '26px' : '2px' }}
                />
              </button>
            </div>

            {/* Limpar Dados Locais */}
            <button 
              onClick={() => setIsClearDataModalOpen(true)}
              className="w-full flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
            >
              <div className="p-2 bg-red-200 text-red-700 rounded-lg"><Trash2 size={20}/></div>
              <div className="text-left">
                <p className="font-bold text-red-800 text-sm">Limpar Cache do Aparelho</p>
                <p className="text-xs text-red-600/70">Força a atualização dos dados na nuvem</p>
              </div>
            </button>
          </div>

          {/* Rodapé do Card */}
          <div className="mt-4 pt-4 border-t border-dm-gold/20 text-xs text-dm-graphite/60 space-y-1">
            <p className="flex items-center gap-1"><Database size={12}/> Versão: 1.5.0 (Cloud Seguro)</p>
            <p>Status: Sincronizado com Supabase</p>
            {isAdmin && (
              <p className="flex items-center gap-1 text-dm-gold font-bold mt-2">
                <Shield size={14} /> Acesso de Fundador Ativo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD DE SUPORTE TÉCNICO */}
      <div className="bg-gradient-to-r from-dm-black to-dm-graphite p-6 rounded-2xl shadow-lg mt-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-dm-gold/20 rounded-full text-dm-gold">
              <LifeBuoy size={28} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Suporte Técnico</h2>
              <p className="text-sm text-dm-white/70">Encontrou algum erro ou precisa de ajuda com o sistema? Fale com o desenvolvedor.</p>
            </div>
          </div>
          <button 
            onClick={handleSupport}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-colors shadow-md whitespace-nowrap"
          >
            <MessageCircle size={20} />
            Falar com Heitor
          </button>
        </div>
      </div>

      {/* ÁREA DE LOGOUT */}
      <div className="bg-dm-white border-2 border-dashed border-red-200 p-6 rounded-2xl shadow-sm mt-8">
        <h2 className="text-lg font-serif mb-2 text-red-800 flex items-center gap-2">
          <LogOut /> Encerrar Sessão
        </h2>
        <p className="text-sm text-dm-graphite/70 mb-4">
          Ao sair, você precisará digitar o e-mail e a senha novamente para acessar o sistema.
        </p>
        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-white border-2 border-red-600 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>

      {/* MODAIS */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Sair do Sistema"
        message="Tem certeza que deseja encerrar a sessão? Você precisará fazer login novamente."
        confirmText="Sim, Sair"
        isDestructive={true}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isClearDataModalOpen}
        title="Limpar Cache"
        message="Isso apagará os dados salvos neste aparelho e os baixará novamente da nuvem. Deseja continuar?"
        confirmText="Sim, Limpar"
        isDestructive={true}
        onConfirm={handleClearLocalData}
        onCancel={() => setIsClearDataModalOpen(false)}
      />
    </motion.div>
  );
};