import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Download, Printer, ChevronLeft, ChevronRight, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Relatorios = () => {
  const { transactions, clients, appointments, services, getClientStatus } = useData();
  const { showToast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthString = format(currentDate, 'yyyy-MM');
  const displayMonth = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  const displayMonthCapitalized = displayMonth.charAt(0).toUpperCase() + displayMonth.slice(1);

  // Filtra agendamentos do mês selecionado
  const monthAppointments = appointments.filter(a => a.date.startsWith(monthString));

  const monthTransactions = transactions.filter(t => t.date.startsWith(monthString));
  const totalRevenue = monthTransactions.filter(t => t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const pending = monthTransactions.filter(t => t.status === 'pendente').reduce((acc, curr) => acc + curr.amount, 0);
  const ticketMedio = monthTransactions.length > 0 ? totalRevenue / monthTransactions.length : 0;

  // Função para enviar o recibo individual
  // Função para enviar o recibo individual
  const handleSendReceipt = (appt: any) => {
    const client = clients.find(c => c.id === appt.clientId);
    if (!client) return;

    if (!client.phone) {
      showToast(`O cliente ${client.name} não tem telefone cadastrado. Vá em Clientes para adicionar.`, 'error');
      return;
    }

    const apptServices = appt.serviceId.split(',').map((id: string) => services.find(s => s.id === id)?.name).join(' + ');
    
    // MENSAGEM REFORMULADA E PREMIUM
    const message = encodeURIComponent(
      `*💈 BARBEARIA D&M 💈*\n` +
      `_Tradição e Estilo_\n\n` +
      `Olá, *${client.name}*! Tudo bem?\n\n` +
      `Segue o recibo do seu atendimento de hoje:\n\n` +
      `📅 *Data:* ${format(new Date(appt.date), 'dd/MM/yyyy')}\n` +
      `✂️ *Serviços:* ${apptServices}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Valor Total:* *R$ ${appt.price.toFixed(2)}*\n` +
      `💳 *Status:* ${appt.paymentStatus === 'pago' ? '*PAGO* ✅' : '*PENDENTE* ⏳'}\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `Agradecemos imensamente pela sua preferência! 🙏🏼\n` +
      `Esperamos te ver novamente em breve para manter o visual em dia. 😉✂️`
    );

    const cleanPhone = client.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const handleExportPDF = () => {
    // O código do jsPDF continua o mesmo da resposta anterior
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;
    const black = [23, 23, 23] as [number, number, number];
    const gold = [180, 154, 104] as [number, number, number];
    const gray = [100, 100, 100] as [number, number, number];

    doc.setDrawColor(...black);
    doc.setLineWidth(0.5);
    doc.circle(pageWidth / 2, y + 10, 8);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...black);
    doc.text('D&M', pageWidth / 2, y + 11, { align: 'center' });
    y += 28;
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.text('BARBEARIA D&M', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...gray);
    doc.text('Relatório de Desempenho Mensal', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...black);
    doc.text(`Período: ${displayMonthCapitalized}`, pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...black);
    doc.text('Resumo Financeiro', margin, y);
    y += 8;
    const boxWidth = (pageWidth - (margin * 2) - 10) / 3;
    const boxHeight = 25;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, boxWidth, boxHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text('Faturamento Bruto', margin + 5, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...black);
    doc.text(`R$ ${totalRevenue.toFixed(2)}`, margin + 5, y + 18);
    doc.setDrawColor(...gold);
    doc.rect(margin + boxWidth + 5, y, boxWidth, boxHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text('Ticket Médio', margin + boxWidth + 10, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...black);
    doc.text(`R$ ${ticketMedio.toFixed(2)}`, margin + boxWidth + 10, y + 18);
    doc.setDrawColor(...gold);
    doc.rect(margin + (boxWidth * 2) + 10, y, boxWidth, boxHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text('Pagamentos Pendentes', margin + (boxWidth * 2) + 15, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(200, 50, 50);
    doc.text(`R$ ${pending.toFixed(2)}`, margin + (boxWidth * 2) + 15, y + 18);
    y += 35;
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...black);
    doc.text('Análise de Clientes', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Total de clientes cadastrados: ${clients.length}`, margin, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Clientes em Risco / Inativos:', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const riskClients = clients.filter(c => ['Risco', 'Inativo'].includes(getClientStatus(c))).slice(0, 8);
    if (riskClients.length === 0) {
      doc.text('Nenhum cliente em risco no momento.', margin, y);
    } else {
      riskClients.forEach(client => {
        const status = getClientStatus(client);
        doc.setTextColor(...gray);
        doc.text(`${client.name} - Último atendimento: ${client.lastVisit ? format(new Date(client.lastVisit), 'dd/MM/yyyy') : 'Nunca'}`, margin, y);
        doc.setTextColor(200, 50, 50);
        doc.text(status, pageWidth - margin, y, { align: 'right' });
        y += 6;
      });
    }
    y = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(...gold);
    doc.line(margin, y - 5, pageWidth - margin, y - 5);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(`Relatório gerado pelo Sistema de Gestão D&M em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, y, { align: 'center' });
    doc.save(`Relatorio_DM_${monthString}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* CABEÇALHO DA TELA (Oculto na impressão) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-serif">Relatórios</h1>
          <p className="text-dm-graphite/70 mt-1">Gere e exporte relatórios mensais.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-dm-black rounded-lg hover:bg-dm-black hover:text-white transition-colors text-sm">
            <Printer size={18} /> Imprimir
          </button>
          <button onClick={handleExportPDF} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-dm-gold text-dm-black font-medium rounded-lg hover:bg-dm-bronze hover:text-white transition-colors shadow-premium text-sm">
            <Download size={18} /> Baixar PDF
          </button>
        </div>
      </div>

      {/* SELETOR DE MÊS (Oculto na impressão) */}
      <div className="mb-4 no-print bg-dm-white p-2 rounded-2xl border border-dm-gold/30 shadow-sm flex items-center justify-between">
        <button onClick={handlePrevMonth} className="p-3 bg-dm-ivory/50 hover:bg-dm-gold/20 rounded-xl transition-colors text-dm-black">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center flex-1">
          <span className="block text-xs text-dm-graphite/60 uppercase tracking-wider font-semibold">Mês Selecionado</span>
          <span className="block text-lg font-serif font-bold text-dm-black">{displayMonthCapitalized}</span>
        </div>
        <button onClick={handleNextMonth} className="p-3 bg-dm-ivory/50 hover:bg-dm-gold/20 rounded-xl transition-colors text-dm-black">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ÁREA DO RELATÓRIO (Esta parte vai para a impressão) */}
      <div className="bg-dm-white p-6 md:p-8 rounded-xl shadow-sm border border-dm-gold/20 text-dm-black print-area">
        <div className="text-center border-b-2 border-dm-gold pb-6 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-dm-black flex items-center justify-center mx-auto mb-2">
            <span className="font-serif text-xl font-bold">D&M</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-widest">BARBEARIA D&M</h1>
          <p className="text-sm text-dm-graphite/70 mt-1">Relatório de Desempenho Mensal</p>
          <p className="text-sm font-medium mt-2">Período: {displayMonthCapitalized}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-dm-gold/30 p-4 rounded-lg text-center bg-dm-ivory/20">
            <p className="text-sm text-dm-graphite/70">Faturamento Bruto</p>
            <p className="text-xl font-bold text-dm-black">R$ {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="border border-dm-gold/30 p-4 rounded-lg text-center bg-dm-ivory/20">
            <p className="text-sm text-dm-graphite/70">Ticket Médio</p>
            <p className="text-xl font-bold text-dm-black">R$ {ticketMedio.toFixed(2)}</p>
          </div>
          <div className="border border-dm-gold/30 p-4 rounded-lg text-center bg-dm-ivory/20">
            <p className="text-sm text-dm-graphite/70">Pendentes</p>
            <p className="text-xl font-bold text-orange-600">R$ {pending.toFixed(2)}</p>
          </div>
        </div>

        <h2 className="text-xl font-serif border-b border-dm-gold/30 pb-2 mb-4">Análise de Clientes</h2>
        <div className="space-y-4">
          <p className="text-sm"><strong>Total de Clientes Cadastrados:</strong> {clients.length}</p>
          <div>
            <h3 className="font-semibold text-sm mb-2">Clientes em Risco/Inativos</h3>
            <ul className="text-sm space-y-1">
              {clients.filter(c => ['Risco', 'Inativo'].includes(getClientStatus(c))).slice(0, 5).map(c => (
                <li key={c.id} className="flex justify-between border-b border-dm-ivory pb-1">
                  <span>{c.name}</span>
                  <span className="text-red-500">{getClientStatus(c)}</span>
                </li>
              ))}
              {clients.filter(c => ['Risco', 'Inativo'].includes(getClientStatus(c))).length === 0 && (
                <li className="text-dm-graphite/60">Nenhum cliente em risco.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dm-gold/30 text-center text-xs text-dm-graphite/50">
          <p>Relatório gerado automaticamente pelo Sistema de Gestão D&M em {format(new Date(), 'dd/MM/yyyy HH:mm')}.</p>
        </div>
      </div>

      {/* NOVA SEÇÃO: RECIBOS INDIVIDUAIS (Visível apenas na tela) */}
      <div className="mt-8 no-print">
        <h2 className="text-2xl font-serif font-bold text-dm-black mb-4 flex items-center gap-2">
          <FileText className="text-dm-gold" /> Recibos de Atendimentos
        </h2>
        
        {monthAppointments.length === 0 ? (
          <div className="bg-dm-white p-8 rounded-2xl border border-dm-gold/20 text-center text-dm-graphite/60">
            Nenhum atendimento registrado em {displayMonthCapitalized}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...monthAppointments].reverse().map(appt => {
              const client = clients.find(c => c.id === appt.clientId);
              const apptServices = appt.serviceId.split(',').map(id => services.find(s => s.id === id)?.name).join(' + ');
              const hasPhone = !!client?.phone;

              return (
                <div key={appt.id} className="bg-dm-white p-4 rounded-2xl border border-dm-gold/20 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-lg text-dm-black">{client?.name || 'Cliente'}</p>
                        <p className="text-sm font-medium text-dm-gold">{apptServices}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-dm-black">R$ {appt.price.toFixed(2)}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${appt.paymentStatus === 'pago' ? 'text-green-600' : 'text-orange-500'}`}>
                          {appt.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-dm-graphite/60 mb-4">
                      Data: {format(parseISO(appt.date), 'dd/MM/yyyy')} • Horário: {appt.time}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSendReceipt(appt)}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                      hasPhone 
                        ? 'bg-green-600 text-white hover:bg-green-500' 
                        : 'bg-dm-ivory text-dm-graphite/50 border border-dm-gold/20 hover:bg-dm-ivory/80'
                    }`}
                  >
                    {hasPhone ? (
                      <><MessageCircle size={18} /> Enviar Recibo (WhatsApp)</>
                    ) : (
                      <><CheckCircle2 size={18} /> Sem telefone cadastrado</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};