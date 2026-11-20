import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, CheckCircle, Clock, X, Sparkles, User, Calculator, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { vibrate } from '../utils/haptics';
import { Service } from '../types'; // <-- Importando o tipo correto

export const Dashboard = () => {
  const { services, quickRegister, appointments, clients } = useData();
  
  const [clientName, setClientName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  // CORRIGIDO AQUI: O carrinho agora é do tipo Service[]
  const [cart, setCart] = useState<Service[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'pago' | 'pendente'>('pago');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [lastClientPhone, setLastClientPhone] = useState('');
  const [lastTotal, setLastTotal] = useState(0);
  const [lastName, setLastName] = useState('');
  const [valorPago, setValorPago] = useState<string>('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(a => a.date === today);

  const formattedDate = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const dateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();

  const suggestions = clientName.length > 0 
    ? clients.filter(c => c.name.toLowerCase().includes(clientName.toLowerCase()) && c.name.toLowerCase() !== clientName.toLowerCase()).slice(0, 4) 
    : [];

  const handleSelectClient = (name: string) => {
    vibrate();
    setClientName(name);
    setShowSuggestions(false);
  };

  const addToCart = (service: Service) => {
    vibrate();
    if (!cart.find(s => s.id === service.id)) {
      setCart(prev => [...prev, service]);
    }
  };

  const removeFromCart = (id: string) => {
    vibrate();
    setCart(prev => prev.filter(s => s.id !== id));
  };

  const totalPrice = cart.reduce((acc, curr) => acc + curr.price, 0);
  const troco = Number(valorPago) > totalPrice ? Number(valorPago) - totalPrice : 0;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || cart.length === 0) return;

    vibrate([50, 50, 50]);
    
    const existingClient = clients.find(c => c.name.toLowerCase() === clientName.toLowerCase());
    setLastClientPhone(existingClient?.phone || '');
    setLastTotal(totalPrice);
    setLastName(clientName);

    quickRegister({ clientName, services: cart, paymentStatus });
    
    setClientName('');
    setCart([]);
    setValorPago('');
    setSuccessMsg('Atendimento registrado!');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value.split(' ');
    const capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setClientName(capitalized);
    setShowSuggestions(true);
  };

  const enviarReciboWhatsApp = () => {
    if (!lastClientPhone) {
      alert("Esse cliente não tem telefone cadastrado na ficha.");
      return;
    }
    const cleanPhone = lastClientPhone.replace(/\D/g, '');
    const mensagem = encodeURIComponent(`Olá ${lastName}, tudo bem? Passando para agradecer pela preferência na Barbearia D&M! O valor do seu atendimento hoje foi de R$ ${lastTotal.toFixed(2)}. Esperamos você em breve! ✂️💈`);
    window.open(`https://wa.me/55${cleanPhone}?text=${mensagem}`, '_blank');
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <span className="text-dm-gold font-bold tracking-widest text-sm uppercase">Barbearia D&M</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dm-black leading-tight">
          Novo<br/>Atendimento
        </h1>
        <p className="text-dm-graphite/70 font-medium text-lg mt-1">{dateCapitalized}</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dm-white p-6 md:p-8 rounded-[2rem] border border-dm-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="relative">
              <label className="block text-sm font-bold text-dm-graphite uppercase tracking-wider mb-2">Quem é o cliente?</label>
              <input 
                type="text" 
                placeholder="Digite o nome..." 
                value={clientName}
                onChange={handleNameChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full p-4 text-xl font-medium border-2 border-dm-ivory bg-dm-ivory/50 rounded-2xl outline-none focus:border-dm-gold focus:bg-white transition-all placeholder:text-dm-graphite/40"
              />
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-dm-gold/30 overflow-hidden">
                    {suggestions.map((sugestao) => (
                      <button key={sugestao.id} type="button" onClick={() => handleSelectClient(sugestao.name)} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-dm-ivory transition-colors border-b border-dm-ivory last:border-0">
                        <User size={18} className="text-dm-gold" />
                        <span className="font-semibold text-dm-black text-lg">{sugestao.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-bold text-dm-graphite uppercase tracking-wider mb-2">O que ele vai fazer?</label>
              <div className="grid grid-cols-2 gap-2">
                {services.map(service => {
                  const isSelected = cart.some(item => item.id === service.id);
                  return (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      key={service.id}
                      onClick={() => addToCart(service)}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between h-full min-h-[80px] ${isSelected ? 'border-dm-gold bg-dm-gold/10 shadow-sm' : 'border-dm-ivory bg-white hover:border-dm-gold/50'}`}
                    >
                      <span className="font-bold text-dm-black text-sm leading-tight">{service.name}</span>
                      <div className="flex justify-between items-end w-full mt-2">
                        <span className="text-dm-gold font-bold text-lg">R$ {service.price}</span>
                        {isSelected && <CheckCircle size={18} className="text-dm-gold" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-dm-ivory/30 rounded-2xl p-4 border border-dm-gold/20">
                  <p className="text-xs font-bold text-dm-graphite/60 uppercase tracking-wider mb-3">Serviços Adicionados</p>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {cart.map(item => (
                        <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-dm-gold/10">
                          <span className="font-bold text-dm-black flex items-center gap-2"><Scissors size={16} className="text-dm-gold"/> {item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-dm-graphite">R$ {item.price.toFixed(2)}</span>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-dm-graphite/40 hover:text-red-500 transition-colors bg-dm-ivory p-1 rounded-full"><X size={16} /></button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-dm-black rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} className="text-dm-gold"/></div>
              
              <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-dm-white/60 font-medium uppercase tracking-wider text-sm">Total</span>
                <motion.span key={totalPrice} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-serif font-bold text-dm-gold">
                  R$ {totalPrice.toFixed(2)}
                </motion.span>
              </div>

              <div className="flex gap-2 relative z-10">
                <button type="button" onClick={() => { vibrate(); setPaymentStatus('pago'); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${paymentStatus === 'pago' ? 'bg-dm-gold text-dm-black' : 'bg-dm-graphite text-dm-white/50'}`}>Recebido</button>
                <button type="button" onClick={() => { vibrate(); setPaymentStatus('pendente'); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${paymentStatus === 'pendente' ? 'bg-orange-500 text-white' : 'bg-dm-graphite text-dm-white/50'}`}>Fiado</button>
              </div>

              <AnimatePresence>
                {paymentStatus === 'pago' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-dm-graphite relative z-10">
                    <div className="flex items-center gap-2">
                      <Calculator size={18} className="text-dm-white/50" />
                      <input 
                        type="number"
                        placeholder="Valor entregue pelo cliente..."
                        value={valorPago}
                        onChange={(e) => setValorPago(e.target.value)}
                        className="flex-1 bg-dm-graphite text-white placeholder:text-dm-white/30 p-3 rounded-xl outline-none focus:ring-2 focus:ring-dm-gold"
                      />
                    </div>
                    {troco > 0 && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-bold mt-2 text-right">
                        Troco: R$ {troco.toFixed(2)}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button 
              whileHover={cart.length > 0 && clientName ? { scale: 1.02 } : {}}
              whileTap={cart.length > 0 && clientName ? { scale: 0.98 } : {}}
              type="submit" 
              disabled={cart.length === 0 || !clientName}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${cart.length > 0 && clientName ? 'bg-gradient-to-r from-dm-gold to-dm-bronze text-white shadow-[0_8px_20px_rgba(180,154,104,0.4)]' : 'bg-dm-ivory text-dm-graphite/40 cursor-not-allowed'}`}
            >
              <CheckCircle size={24} /> FINALIZAR ATENDIMENTO
            </motion.button>

          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-transparent">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Clock className="text-dm-gold" size={24} />
            <h2 className="text-2xl font-serif font-bold text-dm-black">Histórico de Hoje</h2>
          </div>
          
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="bg-dm-white/50 border border-dm-gold/20 border-dashed rounded-3xl p-8 text-center text-dm-graphite/50">
                <p>Nenhum atendimento registrado hoje.</p>
              </div>
            ) : (
              <AnimatePresence>
                {[...todayAppointments].reverse().map(appt => {
                  const client = clients.find(c => c.id === appt.clientId);
                  const apptServices = appt.serviceId.split(',').map(id => services.find(s => s.id === id)?.name).join(' + ');
                  return (
                    <motion.div key={appt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-dm-white p-5 rounded-2xl border border-dm-gold/20 shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg text-dm-black">{client?.name || 'Cliente'}</p>
                        <p className="text-sm font-medium text-dm-gold mt-0.5">{apptServices}</p>
                        <p className="text-xs text-dm-graphite/50 mt-1 font-medium">{appt.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-dm-black">R$ {appt.price.toFixed(2)}</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.paymentStatus === 'pago' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {appt.paymentStatus === 'pago' ? 'Pago' : 'Fiado'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 bg-dm-black text-dm-white px-5 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 z-50 border border-dm-gold/30 w-11/12 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="text-dm-gold" size={24} />
              <span className="font-bold text-lg">{successMsg}</span>
            </div>
            
            {lastClientPhone && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={enviarReciboWhatsApp}
                className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={20} />
                Enviar Recibo no WhatsApp
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};