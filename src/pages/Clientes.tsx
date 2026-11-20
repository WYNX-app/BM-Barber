import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Phone, Calendar, DollarSign, X, Save, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Client } from '../types';

// Função que cria a máscara de telefone automaticamente
const formatPhone = (value: string) => {
  if (!value) return '';
  value = value.replace(/\D/g, ''); // Remove tudo que não for número
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses no DDD
  value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca o traço antes dos últimos 4 dígitos
  return value.substring(0, 15); // Limita o tamanho máximo
};

export const Clientes = () => {
  const { clients, addClient, updateClient, getClientStatus } = useData();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addClient({ name, phone });
    setName(''); setPhone('');
  };

  const handleOpenClient = (client: Client) => {
    setSelectedClient(client);
    setEditName(client.name);
    setEditPhone(client.phone || '');
    setEditNotes(client.notes || '');
  };

  const handleSaveEdits = () => {
    if (!selectedClient) return;
    updateClient(selectedClient.id, { name: editName, phone: editPhone, notes: editNotes });
    setSelectedClient(null);
  };

  // Função para abrir o WhatsApp
  const handleWhatsApp = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation(); // Impede que o modal abra ao clicar no WhatsApp
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    }
  };

  return (
    <div className="space-y-6 relative">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-dm-black">Meus Clientes</h1>
          <p className="text-dm-graphite/70 mt-1">Toque em um cliente para ver detalhes e adicionar anotações.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Cadastro */}
        <div className="bg-dm-white p-5 md:p-6 rounded-2xl border border-dm-gold/30 shadow-premium h-fit">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2"><UserPlus className="text-dm-gold" size={20}/> Novo Cliente</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nome Completo</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João Silva" className="w-full p-3 border border-dm-gold/30 rounded-xl bg-dm-ivory/50 outline-none focus:border-dm-gold" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Telefone (WhatsApp)</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(formatPhone(e.target.value))} 
                placeholder="(00) 00000-0000" 
                className="w-full p-3 border border-dm-gold/30 rounded-xl bg-dm-ivory/50 outline-none focus:border-dm-gold" 
              />
            </div>
            <button type="submit" className="w-full py-3 bg-dm-black text-dm-white rounded-xl hover:bg-dm-graphite transition-colors font-medium">
              Cadastrar Cliente
            </button>
          </form>
        </div>

        {/* Lista de Clientes */}
        <div className="lg:col-span-2 bg-dm-white p-5 md:p-6 rounded-2xl border border-dm-gold/30 shadow-sm">
          <h2 className="text-lg font-serif mb-4">Lista de Clientes</h2>
          <div className="space-y-3">
            {clients.length === 0 ? (
              <div className="text-center py-8 text-dm-graphite/50">Nenhum cliente cadastrado ainda.</div>
            ) : (
              clients.map(client => {
                const status = getClientStatus(client);
                return (
                  <motion.div 
                    key={client.id} 
                    onClick={() => handleOpenClient(client)}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-dm-ivory/30 rounded-xl border border-dm-gold/10 cursor-pointer hover:border-dm-gold/50 hover:bg-dm-ivory/60 transition-all"
                  >
                    <div>
                      <p className="font-bold text-dm-black text-lg">{client.name}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-dm-graphite/70 mt-1">
                        {/* BOTÃO DE WHATSAPP NO CARTÃO */}
                        {client.phone ? (
                          <button 
                            onClick={(e) => handleWhatsApp(e, client.phone)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 bg-green-100/50 px-2 py-1 rounded-md transition-colors"
                          >
                            <MessageCircle size={14} /> {client.phone}
                          </button>
                        ) : (
                          <span className="flex items-center gap-1"><Phone size={14}/> Sem telefone</span>
                        )}
                        <span className="flex items-center gap-1"><Calendar size={14}/> Último: {client.lastVisit ? format(new Date(client.lastVisit), 'dd/MM/yyyy') : 'Nunca'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-sm font-bold text-dm-black flex items-center gap-1"><DollarSign size={14} className="text-green-600"/> {client.totalSpent.toFixed(2)}</p>
                        <p className="text-xs text-dm-graphite/60">{client.totalVisits} visitas</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        status === 'Frequente' ? 'bg-green-100 text-green-700' :
                        status === 'Risco' ? 'bg-orange-100 text-orange-700' :
                        status === 'Inativo' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE DETALHES DO CLIENTE */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[100] p-4 pb-0 md:pb-4"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()} // Impede que clique dentro do modal feche ele
              className="bg-dm-white w-full max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-dm-black">Ficha do Cliente</h2>
                <button onClick={() => setSelectedClient(null)} className="p-2 bg-dm-ivory rounded-full text-dm-graphite hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 border border-dm-gold/30 rounded-xl bg-dm-ivory/50 outline-none focus:border-dm-gold" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input 
                    type="text" 
                    value={editPhone} 
                    onChange={e => setEditPhone(formatPhone(e.target.value))} 
                    className="w-full p-3 border border-dm-gold/30 rounded-xl bg-dm-ivory/50 outline-none focus:border-dm-gold" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Anotações / Preferências</label>
                  <textarea 
                    value={editNotes} 
                    onChange={e => setEditNotes(e.target.value)} 
                    placeholder="Ex: Gosta de degradê baixo, prefere navalha..."
                    rows={3}
                    className="w-full p-3 border border-dm-gold/30 rounded-xl bg-dm-ivory/50 outline-none focus:border-dm-gold resize-none"
                  />
                </div>

                <div className="bg-dm-ivory/50 p-4 rounded-xl border border-dm-gold/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-dm-graphite/60 uppercase tracking-wider font-bold">Resumo</p>
                    <p className="text-sm font-medium mt-1">{selectedClient.totalVisits} visitas • R$ {selectedClient.totalSpent.toFixed(2)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        getClientStatus(selectedClient) === 'Frequente' ? 'bg-green-100 text-green-700' :
                        getClientStatus(selectedClient) === 'Risco' ? 'bg-orange-100 text-orange-700' :
                        getClientStatus(selectedClient) === 'Inativo' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {getClientStatus(selectedClient)}
                  </span>
                </div>

                <button onClick={handleSaveEdits} className="w-full py-4 bg-dm-black text-dm-white rounded-xl font-bold text-lg hover:bg-dm-graphite transition-colors mt-2 flex items-center justify-center gap-2">
                  <Save size={20} className="text-dm-gold" /> SALVAR ALTERAÇÕES
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};