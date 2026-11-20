import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const Financeiro = () => {
  const { transactions } = useData();

  const totalRecebido = transactions.filter(t => t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendente = transactions.filter(t => t.status === 'pendente').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Financeiro</h1>
        <p className="text-dm-graphite/70 mt-1">Acompanhe o dinheiro que entrou e o que está pendente.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dm-white p-6 rounded-xl border border-green-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ArrowUpRight size={80} className="text-green-600"/></div>
          <p className="text-sm font-medium text-dm-graphite/70">Total Recebido (Caixa)</p>
          <h3 className="text-4xl font-bold text-green-600 mt-2">R$ {totalRecebido.toFixed(2)}</h3>
          <p className="text-xs text-dm-graphite/50 mt-2">Dinheiro já na mão.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dm-white p-6 rounded-xl border border-orange-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ArrowDownRight size={80} className="text-orange-500"/></div>
          <p className="text-sm font-medium text-dm-graphite/70">A Receber (Fiado/Pendente)</p>
          <h3 className="text-4xl font-bold text-orange-500 mt-2">R$ {totalPendente.toFixed(2)}</h3>
          <p className="text-xs text-dm-graphite/50 mt-2">Valores que ainda não entraram no caixa.</p>
        </motion.div>
      </div>

      <div className="bg-dm-white p-6 rounded-xl border border-dm-gold/30 shadow-sm">
        <h2 className="text-lg font-serif mb-4">Histórico de Movimentações</h2>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-dm-graphite/50">Nenhuma movimentação registrada.</div>
          ) : (
            [...transactions].reverse().map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 border-b border-dm-ivory last:border-0 hover:bg-dm-ivory/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${t.status === 'pago' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {t.status === 'pago' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-dm-black">{t.description}</p>
                    <p className="text-xs text-dm-graphite/60">{format(new Date(t.date), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                <p className={`font-bold ${t.status === 'pago' ? 'text-green-600' : 'text-orange-500'}`}>
                  R$ {t.amount.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};