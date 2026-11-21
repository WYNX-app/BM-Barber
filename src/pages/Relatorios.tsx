import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Relatorios = () => {
  const { transactions, clients, getClientStatus } = useData();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthString = format(currentDate, 'yyyy-MM');
  const displayMonth = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  const displayMonthCapitalized = displayMonth.charAt(0).toUpperCase() + displayMonth.slice(1);

  const monthTransactions = transactions.filter(t => t.date.startsWith(monthString));
  const totalRevenue = monthTransactions.filter(t => t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const pending = monthTransactions.filter(t => t.status === 'pendente').reduce((acc, curr) => acc + curr.amount, 0);
  const ticketMedio = monthTransactions.length > 0 ? totalRevenue / monthTransactions.length : 0;

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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* CABEÇALHO DA TELA (Oculto na impressão) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-serif">Relatórios</h1>
          <p className="text-dm-graphite/70 mt-1">Gere e exporte relatórios mensais.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-dm-black rounded-lg hover:bg-dm-black hover:text-white transition-colors">
            <Printer size={18} /> Imprimir
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-dm-gold text-dm-black font-medium rounded-lg hover:bg-dm-bronze hover:text-white transition-colors shadow-premium">
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
    </div>
  );
};