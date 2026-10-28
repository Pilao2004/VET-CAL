import React from 'react';
import { X, User, Crown, HelpCircle, LogOut, Users, Bot, Gift, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { setCurrentView, setIsSubscriptionModalOpen, isPremium } = useApp();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-[var(--header-bg)] border-l border-[var(--border)] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-[var(--border)]">
          <span className="font-bold">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-[var(--input-bg)] rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <button 
            onClick={() => { setCurrentView('patients'); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl"
          >
            <Users className="w-5 h-5 text-[var(--secondary)]" />
            <span>Pacientes</span>
          </button>
          <button 
            onClick={() => { setCurrentView('assistant'); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl"
          >
            <Bot className="w-5 h-5 text-[var(--secondary)]" />
            <span>Assistente IA</span>
          </button>
          <button 
            onClick={() => { setCurrentView('bonus'); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl"
          >
            <Gift className="w-5 h-5 text-[var(--secondary)]" />
            <span>Bônus Exclusivos</span>
          </button>
          <button
            onClick={() => { setIsSubscriptionModalOpen(true); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl cursor-pointer"
          >
            <Crown className="w-5 h-5 text-amber-400" />
            <span>Minha compra</span>
          </button>
          <div className="border-t border-[var(--border)] my-2" />
          <button 
            onClick={() => { setCurrentView('profile'); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl cursor-pointer"
          >
            <User className="w-5 h-5 text-[var(--secondary)]" />
            <span>Perfil</span>
          </button>
          <button 
            onClick={() => { setCurrentView('support'); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-[var(--secondary)]" />
            <span>Suporte</span>
          </button>
          <button
            onClick={() => { setCurrentView('legal'); onClose(); }}
            className="flex items-center space-x-3 w-full p-3 hover:bg-[var(--input-bg)] rounded-xl cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-[var(--secondary)]" />
            <span>Termos e Privacidade</span>
          </button>
        </div>
      </div>
    </>
  );
};
