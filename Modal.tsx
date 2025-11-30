import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  theme?: 'day' | 'night';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, theme = 'day' }) => {
  if (!isOpen) return null;

  const isNight = theme === 'night';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* The Guide Blade Shape */}
      <div className={`
        relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border-2 
        ${isNight ? 'border-green-500 bg-gray-900' : 'border-white bg-gray-100'}
        animate-scale-up origin-center
      `}>
        {/* Header */}
        <div className={`
          p-4 flex justify-between items-center bg-gradient-to-b 
          ${isNight ? 'from-gray-800 to-gray-900 border-b border-green-700' : 'from-gray-200 to-gray-300 border-b border-gray-300'}
        `}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isNight ? 'bg-green-500 shadow-[0_0_10px_#0f0]' : 'bg-xbox-green'}`}></div>
            <h2 className={`text-xl font-bold uppercase tracking-widest ${isNight ? 'text-green-400' : 'text-gray-700'}`}>{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shadow-inner hover:bg-red-500 active:scale-95 transition-transform border border-white/20"
          >
            B
          </button>
        </div>

        {/* Body */}
        <div className={`
          p-6 min-h-[200px] 
          ${isNight ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}
        `}>
          {children}
        </div>

        {/* Footer */}
        <div className={`
          p-3 flex justify-end gap-3 border-t 
          ${isNight ? 'bg-gray-900 border-green-800' : 'bg-gray-200 border-gray-300'}
        `}>
          <button onClick={onClose} className="px-6 py-1.5 rounded-full bg-gray-500 text-white font-bold shadow-sm hover:bg-gray-400 border border-white/10 uppercase text-xs tracking-wider">Back</button>
          <button onClick={onClose} className="px-6 py-1.5 rounded-full bg-xbox-green text-white font-bold shadow-sm hover:bg-xbox-darkGreen border border-white/10 uppercase text-xs tracking-wider">Select</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;