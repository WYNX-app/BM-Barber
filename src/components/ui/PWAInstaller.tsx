import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';

export const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se é iOS (iPhone/iPad)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Se for iOS, e não estiver instalado (standalone), mostra o modal depois de 3 segundos
    if (isIOSDevice && !(window.navigator as any).standalone) {
      setTimeout(() => setIsVisible(true), 3000);
    }

    // Escuta o evento do Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Mostra o modal após 3 segundos para o usuário ver o sistema primeiro
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  // Se já estiver instalado ou não for aplicável, não mostra nada
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ y: '100%', opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-dm-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative border border-dm-gold/30"
        >
          {/* Botão de Fechar */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 bg-dm-ivory rounded-full text-dm-graphite hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center mt-2">
            {/* Ícone do App */}
            <div className="w-20 h-20 rounded-2xl bg-dm-black border-2 border-dm-gold flex items-center justify-center mb-4 shadow-lg shadow-dm-gold/20">
              <span className="font-serif text-3xl text-dm-gold font-bold">D&M</span>
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-dm-black mb-2">App da Barbearia</h2>
            <p className="text-sm text-dm-graphite/70 mb-6">
              Instale o aplicativo oficial da D&M no seu celular para acesso rápido, tela cheia e funcionamento offline.
            </p>

            {/* Lógica para Android/Chrome */}
            {!isIOS && (
              <button 
                onClick={handleInstallClick}
                className="w-full py-4 bg-dm-black text-dm-white rounded-xl font-bold text-lg hover:bg-dm-graphite transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={22} className="text-dm-gold" /> Baixar Aplicativo
              </button>
            )}

            {/* Lógica para iPhone (iOS) - Tutorial Visual */}
            {isIOS && (
              <div className="w-full bg-dm-ivory/50 p-4 rounded-xl border border-dm-gold/20 text-left space-y-3">
                <p className="text-sm font-bold text-dm-black uppercase tracking-wider mb-2">Como instalar no iPhone:</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 text-white rounded-lg"><Share size={18} /></div>
                  <p className="text-sm text-dm-graphite">1. Toque no ícone de <strong>Compartilhar</strong> do Safari.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 text-black rounded-lg"><PlusSquare size={18} /></div>
                  <p className="text-sm text-dm-graphite">2. Role e toque em <strong>Adicionar à Tela de Início</strong>.</p>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setIsVisible(false)}
              className="mt-4 text-xs font-bold text-dm-graphite/50 hover:text-dm-graphite transition-colors uppercase tracking-wider"
            >
              Continuar no navegador
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};