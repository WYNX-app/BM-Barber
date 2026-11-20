import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Package, Plus, AlertTriangle } from 'lucide-react';

export const Estoque = () => {
  const { products } = useData();
  // Como o foco principal é a agenda, deixaremos o cadastro de produtos simples por enquanto
  // Você pode expandir isso no futuro

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-dm-black">Estoque</h1>
          <p className="text-dm-graphite/70 mt-1">Controle seus produtos e avise quando estiverem acabando.</p>
        </div>
        <button className="bg-dm-black text-dm-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-dm-graphite transition-all shadow-premium">
          <Plus size={20} className="text-dm-gold" /> Novo Produto
        </button>
      </header>

      <div className="bg-dm-white p-6 rounded-xl border border-dm-gold/30 shadow-sm">
        <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><Package className="text-dm-gold"/> Produtos Cadastrados</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12 text-dm-graphite/50 flex flex-col items-center gap-2">
            <AlertTriangle size={48} className="text-orange-400 opacity-50" />
            <p>Seu estoque está vazio.</p>
            <p className="text-sm">Clique em "Novo Produto" para começar a cadastrar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-dm-ivory/30 rounded-lg border border-dm-gold/10">
                <div>
                  <p className="font-bold text-dm-black">{p.name}</p>
                  <p className="text-sm text-dm-graphite/70">Categoria: {p.category}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${p.quantity <= p.minQuantity ? 'text-red-500' : 'text-green-600'}`}>
                    {p.quantity} un.
                  </p>
                  <p className="text-xs text-dm-graphite/60">Mínimo: {p.minQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};