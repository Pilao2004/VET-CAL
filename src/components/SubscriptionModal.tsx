import React, { useState } from 'react';
import {
  Crown,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Key,
  CreditCard,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SubscriptionModal: React.FC = () => {
  const { isSubscriptionModalOpen, setIsSubscriptionModalOpen, subscription, activateSubscriptionServer } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isSubscriptionModalOpen) return null;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoading(true);
    setFeedback(null);

    const res = await activateSubscriptionServer(couponCode.trim(), emailInput.trim());
    setLoading(false);
    setFeedback(res);

    if (res.success) {
      setTimeout(() => {
        setIsSubscriptionModalOpen(false);
      }, 1500);
    }
  };

  const handleApplyPreset = (code: string) => {
    setCouponCode(code);
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#0B1D3A] via-[#102A54] to-[#0B1D3A] p-6 text-white text-center">
          <button
            onClick={() => setIsSubscriptionModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/40 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Crown className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">VET CALC PRO — Planos & Assinaturas</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Precisão matemática e apoio clínico inteligente para a sua rotina veterinária diária.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          <p className="text-center text-slate-500">Conteúdo removido conforme solicitado.</p>
        </div>
      </div>
    </div>
  );
};
