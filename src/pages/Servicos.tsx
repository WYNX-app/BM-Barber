import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Plus, Trash2, Scissors, Loader2 } from 'lucide-react';

export const Servicos = () => {
  const { services, addService, removeService } = useData();
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      return showToast('Preencha o nome e o valor do serviço.', 'error');
    }
    
    setIsSubmitting(true);
    try {
      await addService({ name, price: Number(price), duration: Number(duration) });
      setName(''); 
      setPrice(''); 
      setDuration('30');
      showToast('Serviço adicionado ao catálogo!', 'success');
    } catch (error) {
      showToast('Erro ao cadastrar. Verifique a conexão.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este serviço?')) return;
    
    try {
      await removeService(id);
      showToast('Serviço removido.', 'info');
    } catch (error) {
      showToast('Erro ao remover o serviço.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Catálogo de Serviços</h1>
        <p className="text-dm-graphite/70 mt-1">Cadastre os cortes e valores fixos para agilizar o atendimento.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/30 shadow-sm h-fit">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><Plus size={20} className="text-dm-gold"/> Novo Serviço</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-dm-graphite mb-1">Nome do Corte</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Corte Degradê" className="w-full p-3 border-2 border-dm-ivory rounded-xl bg-dm-ivory/30 outline-none focus:border-dm-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-dm-graphite mb-1">Valor (R$)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="30" className="w-full p-3 border-2 border-dm-ivory rounded-xl bg-dm-ivory/30 outline-none focus:border-dm-gold font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-dm-graphite mb-1">Tempo (min)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-3 border-2 border-dm-ivory rounded-xl bg-dm-ivory/30 outline-none focus:border-dm-gold" />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-dm-black text-dm-white rounded-xl hover:bg-dm-graphite transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin text-dm-gold"/> Salvando...</> : 'Adicionar ao Catálogo'}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-2 bg-dm-white p-6 rounded-2xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><Scissors size={20} className="text-dm-gold"/> Meus Serviços</h2>
          <div className="space-y-3">
            {services.length === 0 && <p className="text-dm-graphite/50 text-center py-4">Nenhum serviço cadastrado.</p>}
            {services.map(s => (
              <div key={s.id} className="flex justify-between items-center p-4 bg-dm-ivory/30 rounded-xl border border-dm-gold/10">
                <div>
                  <p className="font-bold text-dm-black">{s.name}</p>
                  <p className="text-xs text-dm-graphite/60 font-medium">Duração: {s.duration} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-dm-gold">R$ {s.price.toFixed(2)}</span>
                  <button onClick={() => handleRemove(s.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};