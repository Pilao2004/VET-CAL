import React from 'react';
import { HelpCircle, Mail, BookOpen, MessageCircle, FileText, ExternalLink } from 'lucide-react';

export const SupportView: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-16">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Central de Ajuda & Suporte</h1>
            <p className="text-xs text-slate-500">Tire suas dúvidas sobre o uso do VET CALC PRO ou entre em contato conosco.</p>
          </div>
        </div>

        {/* Contact Email Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Fale Conosco por E-mail</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">Atendimento especializado para suporte técnico e dúvidas.</p>
            </div>
          </div>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=suporte.vetcalcpro@gmail.com&su=Suporte%20VET%20CALC%20PRO"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>suporte.vetcalcpro@gmail.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* FAQ / Guia de Uso */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>Guia Rápido de Utilização</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">1. Como realizar cálculos de medicamentos?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Acesse a aba <strong>Calculadoras</strong> no menu principal. Escolha o tipo de cálculo desejado (Dose mg/kg, Fluidoterapia, CRI, etc.), preencha o peso do animal e a dose recomendada pela bula para obter o volume exato ou o fracionamento em comprimidos.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">2. Como utilizar o Raciocínio Clínico por Sintomas?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Na aba <strong>Sintomas</strong>, selecione a espécie e marque um ou mais sintomas observados no paciente. O sistema exibirá perguntas de anamnese essenciais, diagnósticos diferenciais prováveis e sinais de alerta (Red Flags).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">3. Como gerenciar Prontuários e Consultas?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Vá até a aba <strong>Pacientes</strong> para cadastrar animais. Cada paciente recebe um código único (ex: VET-000001) que pode ser consultado rapidamente pela Assistente IA ou utilizado para registrar novas evoluções clínicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
