import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export const Agenda = () => {
  const { appointments, clients, services } = useData();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif text-dm-black">Histórico Geral</h1>
        <p className="text-dm-graphite/70 mt-1">Todos os agendamentos e atendimentos do sistema.</p>
      </header>

      <div className="bg-dm-white rounded-2xl border border-dm-gold/20 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-dm-gold" size={24} />
          <h2 className="text-xl font-serif font-bold text-dm-black">Linha do Tempo</h2>
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-dm-graphite/50">Nenhum agendamento registrado.</div>
        ) : (
          <div className="space-y-3">
            {[...appointments].reverse().map(appt => {
              const client = clients.find(c => c.id === appt.clientId);
              const apptServices = appt.serviceId.split(',').map(id => services.find(s => s.id === id)?.name).join(' + ');
              return (
                <motion.div key={appt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-4 rounded-xl border border-dm-gold/10 bg-dm-ivory/30">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px] bg-dm-white p-2 rounded-lg border border-dm-gold/20">
                      <p className="text-sm font-bold text-dm-black">{appt.time}</p>
                      <p className="text-[10px] text-dm-graphite/60 uppercase">{appt.date.split('-').reverse().slice(0,2).join('/')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-dm-black">{client?.name || 'Cliente'}</p>
                      <p className="text-sm font-medium text-dm-gold">{apptServices}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dm-black">R$ {appt.price.toFixed(2)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${appt.paymentStatus === 'pago' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {appt.paymentStatus === 'pago' ? 'Pago' : 'Fiado'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};