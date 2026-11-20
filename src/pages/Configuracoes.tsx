import { Settings, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Configuracoes = () => {
  const { signOut, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair do sistema?')) {
      await signOut();
      navigate('/login');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl pb-20">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Configurações</h1>
        <p className="text-dm-graphite/70 mt-1">Ajustes gerais do seu sistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil do Dono */}
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

        {/* Preferências do Sistema */}
        <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
            <Settings className="text-dm-gold"/> Preferências
          </h2>
          <p className="text-sm text-dm-graphite/70 mb-4">
            Mais opções de personalização estarão disponíveis nas próximas atualizações.
          </p>
          <div className="p-4 bg-dm-ivory/50 rounded-xl border border-dm-gold/20 text-sm space-y-2">
            <p><strong>Versão do Sistema:</strong> 1.3.0 (Cloud)</p>
            <p><strong>Status dos Dados:</strong> Sincronizado com Supabase</p>
            {isAdmin && (
              <p className="flex items-center gap-1 text-dm-gold font-bold">
                <Shield size={14} /> Acesso de Fundador Ativo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ÁREA DE LOGOUT */}
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm mt-8">
        <h2 className="text-lg font-serif mb-2 text-red-800 flex items-center gap-2">
          <LogOut /> Encerrar Sessão
        </h2>
        <p className="text-sm text-red-700/70 mb-4">
          Ao sair, você precisará digitar o e-mail e a senha novamente para acessar o sistema.
        </p>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md"
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>
    </motion.div>
  );
};