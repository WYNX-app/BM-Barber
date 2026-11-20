import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Scissors } from 'lucide-react';

export const Servicos = () => {
  const { services, addService, removeService } = useData();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    addService({ name, price: Number(price), duration: Number(duration) });
    setName(''); setPrice(''); setDuration('30');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Catálogo de Serviços</h1>
        <p className="text-dm-graphite/70 mt-1">Cadastre os cortes e valores fixos para agilizar o atendimento.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="bg-dm-white p-6 rounded-xl border border-dm-gold/30 shadow-sm h-fit">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><Plus size={20} className="text-dm-gold"/> Novo Serviço</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nome do Corte</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Corte Degradê" className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Valor (R$)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="30" className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" />
              </div>
              <div>
                <label className="block text-sm mb-1">Tempo (min)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-3 border border-dm-gold/30 rounded-lg bg-dm-ivory/50 outline-none focus:border-dm-gold" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-dm-black text-dm-white rounded-lg hover:bg-dm-graphite transition-colors font-medium">
              Adicionar ao Catálogo
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-2 bg-dm-white p-6 rounded-xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><Scissors size={20} className="text-dm-gold"/> Meus Serviços</h2>
          <div className="space-y-3">
            {services.map(s => (
              <div key={s.id} className="flex justify-between items-center p-4 bg-dm-ivory/30 rounded-lg border border-dm-gold/10">
                <div>
                  <p className="font-semibold text-dm-black">{s.name}</p>
                  <p className="text-sm text-dm-graphite/70">Duração: {s.duration} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-dm-gold">R$ {s.price.toFixed(2)}</span>
                  <button onClick={() => removeService(s.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};