import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Fundo escuro com blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          
          {/* Caixa do Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="bg-dm-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 border border-dm-gold/30"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-dm-gold/20 text-dm-gold'}`}>
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-dm-black mb-2">{title}</h2>
              <p className="text-dm-graphite/70 text-sm mb-8">{message}</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={onCancel}
                  className="flex-1 py-3 border-2 border-dm-ivory text-dm-graphite font-bold rounded-xl hover:bg-dm-ivory transition-colors"
                >
                  {cancelText}
                </button>
                <button 
                  onClick={onConfirm}
                  className={`flex-1 py-3 font-bold rounded-xl transition-colors text-white shadow-md ${
                    isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-dm-black hover:bg-dm-graphite'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};