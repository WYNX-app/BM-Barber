import { Settings, User, Scissors } from 'lucide-react';

export const Configuracoes = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Configurações</h1>
        <p className="text-dm-graphite/70 mt-1">Ajustes gerais do seu sistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dm-white p-6 rounded-xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><User className="text-dm-gold"/> Perfil do Dono</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nome</label>
              <input type="text" defaultValue="Danilson" className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" disabled />
            </div>
            <div>
              <label className="block text-sm mb-1">Nome da Barbearia</label>
              <input type="text" defaultValue="Barbearia D&M" className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" disabled />
            </div>
          </div>
        </div>

        <div className="bg-dm-white p-6 rounded-xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><Settings className="text-dm-gold"/> Preferências</h2>
          <p className="text-sm text-dm-graphite/70 mb-4">Mais opções de personalização estarão disponíveis nas próximas atualizações.</p>
          <div className="p-4 bg-dm-ivory/50 rounded-lg border border-dm-gold/20 text-sm">
            <p><strong>Versão do Sistema:</strong> 1.2.0</p>
            <p><strong>Status dos Dados:</strong> Salvos localmente no navegador</p>
          </div>
        </div>
      </div>
    </div>
  );
};