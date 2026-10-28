import React, { useRef, useState } from 'react';
import { saveFile } from '../utils/fileSave';
import {
  Users,
  Plus,
  Search,
  FileDown,
  Calendar,
  Phone,
  Trash2,
  Edit3,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Check,
  X,
  FileText,
  Database,
  Cloud,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PatientRecord, ClinicalConsultation } from '../types';
import { exportPatientRecordToPdf } from '../utils/pdfExport';

export const PatientsView: React.FC = () => {
  const {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    selectedPatientId,
    setSelectedPatientId,
    setCurrentView,
    addConsultationToPatient,
    showToast,
    user,
    isSupabaseReady,
    supabaseConnected,
    isLoadingPatients,
    patientError,
    refreshPatients,
    importPatientsBackup,
  } = useApp();

  // Backup em arquivo: protege os prontuários do modo local (troca de aparelho, limpeza do navegador)
  const backupInputRef = useRef<HTMLInputElement>(null);
  const exportBackup = async () => {
    const payload = { app: 'VET CALC PRO', version: 1, exportedAt: new Date().toISOString(), patients };
    const date = new Date().toISOString().slice(0, 10);
    const outcome = await saveFile(
      `VetCalcPro_backup_prontuarios_${date}.json`,
      new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    );
    if (outcome === 'saved') showToast(`Backup de ${patients.length} paciente(s) salvo. Guarde o arquivo em local seguro.`);
    else if (outcome === 'declined') showToast('Backup cancelado.');
    else showToast('Não foi possível salvar o backup aqui.');
  };
  const importBackup = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      const list: PatientRecord[] = (Array.isArray(data) ? data : data?.patients || [])
        .filter((p: any) => p && typeof p.name === 'string' && p.name.trim())
        .map((p: any) => ({ ...p, id: String(p.id || `pat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`), consultations: Array.isArray(p.consultations) ? p.consultations : [] }));
      if (list.length === 0) {
        showToast('O arquivo não contém pacientes do VET CALC PRO.');
        return;
      }
      const count = await importPatientsBackup(list);
      showToast(`${count} paciente(s) restaurado(s) do backup.`);
    } catch {
      showToast('Arquivo de backup inválido. Use um arquivo .json gerado pelo app.');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewConsultationModalOpen, setIsNewConsultationModalOpen] = useState(false);
  const [isSavingPatient, setIsSavingPatient] = useState(false);
  const [isSavingConsultation, setIsSavingConsultation] = useState(false);

  // New patient form state
  const [patientName, setPatientName] = useState('');
  const [patientSpecies, setPatientSpecies] = useState<'Canino' | 'Felino' | 'Equino' | 'Outro'>('Canino');
  const [patientBreed, setPatientBreed] = useState('');
  const [patientSex, setPatientSex] = useState<'Macho' | 'Fêmea'>('Macho');
  const [isNeutered, setIsNeutered] = useState(true);
  const [patientAge, setPatientAge] = useState('');
  const [patientWeight, setPatientWeight] = useState('10');
  const [tutorName, setTutorName] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');
  const [allergies, setAllergies] = useState('');

  // New consultation form state
  const [consChiefComplaint, setConsChiefComplaint] = useState('');
  const [consSymptoms, setConsSymptoms] = useState('');
  const [consTemp, setConsTemp] = useState('38.5');
  const [consFC, setConsFC] = useState('100');
  const [consFR, setConsFR] = useState('24');
  const [consTPC, setConsTPC] = useState('< 2');
  const [consMucosas, setConsMucosas] = useState('Normocoradas');
  const [consHidratacao, setConsHidratacao] = useState('0');
  const [consECC, setConsECC] = useState('5');
  const [consLinfonodos, setConsLinfonodos] = useState('Normais');
  const [consTentativeDiag, setConsTentativeDiag] = useState('');
  const [consRequestedExams, setConsRequestedExams] = useState('');
  const [consPrescriptions, setConsPrescriptions] = useState('');
  const [consEvolution, setConsEvolution] = useState('');
  const [consWeight, setConsWeight] = useState('');
  const [consCode, setConsCode] = useState('');

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tutorName.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q)
    );
  });

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !tutorName.trim()) {
      showToast('Por favor, informe ao menos o nome do animal e do tutor.');
      return;
    }

    setIsSavingPatient(true);
    try {
      await addPatient({
        name: patientName.trim(),
        species: patientSpecies,
        breed: patientBreed.trim() || 'SRD',
        sex: patientSex,
        isNeutered,
        age: patientAge.trim() || 'Não informada',
        weight: parseFloat(patientWeight) || 0,
        tutorName: tutorName.trim(),
        tutorPhone: tutorPhone.trim(),
        allergies: allergies.trim(),
      });

      // Reset form
      setPatientName('');
      setPatientBreed('');
      setPatientAge('');
      setTutorName('');
      setTutorPhone('');
      setAllergies('');
      setIsNewPatientModalOpen(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSavingPatient(false);
    }
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const prescriptionsArray = consPrescriptions
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const requestedExamsArray = consRequestedExams
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const symptomsArray = consSymptoms
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setIsSavingConsultation(true);
    try {
      await addConsultationToPatient(activePatient.id, {
        weight: parseFloat(consWeight) || activePatient.weight,
        chiefComplaint: consChiefComplaint.trim(),
        reportedSymptoms: symptomsArray,
        physicalExam: {
          temperature: parseFloat(consTemp) || undefined,
          heartRate: parseFloat(consFC) || undefined,
          respiratoryRate: parseFloat(consFR) || undefined,
          crt: consTPC,
          mucousMembranes: consMucosas,
          hydrationPercent: parseFloat(consHidratacao) || 0,
          bodyConditionScore: parseFloat(consECC) || undefined,
          lymphNodes: consLinfonodos,
        },
        tentativeDiagnosis: consTentativeDiag.trim(),
        requestedExams: requestedExamsArray,
        prescriptions: prescriptionsArray,
        clinicalEvolution: consEvolution.trim(),
        consultationCode: consCode.trim() || undefined,
      });

      setIsNewConsultationModalOpen(false);
      // Reset consultation form
      setConsChiefComplaint('');
      setConsSymptoms('');
      setConsTentativeDiag('');
      setConsRequestedExams('');
      setConsPrescriptions('');
      setConsEvolution('');
      setConsCode('');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSavingConsultation(false);
    }
  };

  const handleExportPDF = (consultation?: ClinicalConsultation) => {
    if (!activePatient) return;
    try {
      exportPatientRecordToPdf(activePatient, consultation);
      showToast('Prontuário exportado em PDF com sucesso!');
    } catch (err) {
      showToast('Erro ao gerar PDF. Verifique os dados do paciente.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-teal-500" />
            <span>Prontuário Clínico Veterinário</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão de pacientes, histórico de consultas, exame físico detalhado, prescrições e exportação em PDF.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => refreshPatients()}
            disabled={isLoadingPatients}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Atualizar prontuários"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPatients ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsNewPatientModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Paciente</span>
          </button>
        </div>
      </div>

      {/* Cloud & PostgreSQL Security Status Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              user && supabaseConnected
                ? 'bg-emerald-500'
                : isSupabaseReady
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
          />
          <span className="text-slate-700 dark:text-slate-300">
            {user && supabaseConnected ? (
              <>
                <strong className="text-emerald-600 dark:text-emerald-400">Banco de Dados Ativo:</strong> Prontuários sincronizados com Supabase PostgreSQL (RLS por usuário).
              </>
            ) : user ? (
              <>
                <strong className="text-amber-600 dark:text-amber-400">Aguardando Conexão:</strong> Autenticado como {user.email}, mas a conexão com o PostgreSQL precisa ser verificada no Perfil.
              </>
            ) : (
              <>
                <strong className="text-blue-600 dark:text-blue-400">Modo Local:</strong> Prontuários salvos neste navegador. Acesse a aba <strong>Perfil</strong> para fazer login no Supabase e ativar o salvamento na nuvem.
              </>
            )}
          </span>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => setCurrentView('profile')}
            className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline shrink-0 cursor-pointer"
          >
            Gerenciar Conexão &gt;
          </button>
        )}
      </div>

      {/* Backup dos prontuários */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={exportBackup}
          disabled={patients.length === 0}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-4 h-4" />
          Fazer backup
        </button>
        <button
          type="button"
          onClick={() => backupInputRef.current?.click()}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer hover:border-teal-500"
        >
          <Plus className="w-4 h-4" />
          Restaurar backup
        </button>
        <input
          ref={backupInputRef}
          id="backup-file"
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importBackup(file);
            e.target.value = '';
          }}
        />
        {!user && (
          <span className="text-slate-500 dark:text-slate-400">
            No modo local, faça backup com frequência: os dados ficam só neste aparelho.
          </span>
        )}
      </div>

      {/* Error Banner */}
      {patientError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{patientError}</span>
          </div>
          <button
            onClick={() => refreshPatients()}
            className="px-3 py-1 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 cursor-pointer shrink-0"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Main Grid: Patient List & Active Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por animal ou tutor..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Nenhum paciente cadastrado.
                </div>
              ) : (
                filteredPatients.map((p) => {
                  const isSelected = activePatient && activePatient.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {p.species}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {p.breed} • {p.weight} kg • {p.age}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Tutor: {p.tutorName}</span>
                        <span>{p.consultations?.length || 0} consulta(s)</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Patient Profile & Consultations */}
        <div className="lg:col-span-8 space-y-6">
          {activePatient ? (
            <>
              {/* Patient Banner */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {activePatient.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {activePatient.species} ({activePatient.sex})
                      </span>
                      {activePatient.publicCode && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {activePatient.publicCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Raça: <strong>{activePatient.breed}</strong> | Peso: <strong>{activePatient.weight} kg</strong> | Idade: <strong>{activePatient.age}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatientId(activePatient.id);
                          setCurrentView('assistant');
                        }}
                        className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[40px]"
                      >
                        <span>Conversar com IA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatientId(activePatient.id);
                          setCurrentView('assistant');
                          // TODO: Trigger clinical evolution flow
                        }}
                        className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[40px]"
                      >
                        <span>Criar Evolução</span>
                      </button>
                    {/* EXPORT PDF BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleExportPDF()}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[40px]"
                      title="Exportar Prontuário Completo em PDF"
                    >
                      <FileDown className="w-4 h-4 text-emerald-400" />
                      <span>Exportar PDF</span>
                    </button>

                    {/* NEW CONSULTATION BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setConsWeight(String(activePatient.weight));
                        setIsNewConsultationModalOpen(true);
                      }}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer min-h-[40px]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Consulta</span>
                    </button>

                    {/* DELETE PATIENT */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Deseja remover o prontuário de ${activePatient.name}?`)) {
                          deletePatient(activePatient.id);
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                      title="Excluir paciente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tutor & Health Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tutor Responsável</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activePatient.tutorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Telefone de Contato</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activePatient.tutorPhone || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Alergias Conhecidas</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">{activePatient.allergies || 'Nenhuma relatada'}</span>
                  </div>
                </div>
              </div>

              {/* Consultation History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5 text-teal-500" />
                    <span>Histórico de Consultas Clínicas ({activePatient.consultations?.length || 0})</span>
                  </h3>
                </div>

                {(!activePatient.consultations || activePatient.consultations.length === 0) ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                    Nenhuma consulta registrada para este paciente ainda. Clique em <strong>Nova Consulta</strong> para iniciar o atendimento.
                  </div>
                ) : (
                  activePatient.consultations.map((cons) => (
                    <div
                      key={cons.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center space-x-2 text-xs">
                          <Calendar className="w-4 h-4 text-teal-500" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {new Date(cons.date).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(cons.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {cons.consultationCode && (
                            <span className="text-slate-500 font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                              Cod: {cons.consultationCode}
                            </span>
                          )}
                          <span className="text-slate-400">• Peso: {cons.weight} kg</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleExportPDF(cons)}
                          className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF Desta Consulta</span>
                        </button>
                      </div>

                      {/* Queixa Principal */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Queixa Principal & Anamnese
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                          {cons.chiefComplaint}
                        </p>
                      </div>

                      {/* Exame Físico */}
                      {cons.physicalExam && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Temperatura:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {cons.physicalExam.temperature ? `${cons.physicalExam.temperature} °C` : '--'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Freq. Cardíaca:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {cons.physicalExam.heartRate ? `${cons.physicalExam.heartRate} bpm` : '--'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Freq. Resp:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {cons.physicalExam.respiratoryRate ? `${cons.physicalExam.respiratoryRate} mpm` : '--'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">TPC:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {cons.physicalExam.crt || '--'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Hipótese Diagnóstica */}
                      {cons.tentativeDiagnosis && (
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                            Hipótese Diagnóstica
                          </span>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {cons.tentativeDiagnosis}
                          </p>
                        </div>
                      )}

                      {/* Prescrições */}
                      {cons.prescriptions && cons.prescriptions.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5 text-xs">
                          <span className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px] uppercase tracking-wider block">
                            Prescrição e Conduta Terapêutica:
                          </span>
                          <ul className="space-y-1 text-slate-800 dark:text-slate-200">
                            {cons.prescriptions.map((p, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{i + 1}.</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Evolução Clínica Registrada */}
                      {cons.clinicalEvolution && (
                        <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1 text-xs">
                          <span className="font-bold text-blue-900 dark:text-blue-300 text-[11px] uppercase tracking-wider block">
                            Evolução Clínica & Resposta:
                          </span>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                            {cons.clinicalEvolution}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Seção: Evoluções Clínicas Independentes (Assistente IA e Notas de Plantão) */}
              {activePatient.evolutions && activePatient.evolutions.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Evoluções Clínicas Registradas ({activePatient.evolutions.length})</span>
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {activePatient.evolutions.map((evo) => (
                      <div
                        key={evo.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              evo.source === 'ai_assistant'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {evo.source === 'ai_assistant' ? 'Assistente IA • Aprovado pelo Vet' : 'Registro Manual'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(evo.createdAt).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(evo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {evo.evolutionText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              Selecione um paciente para ver o prontuário.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Novo Paciente */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Cadastrar Novo Paciente
              </h3>
              <button onClick={() => setIsNewPatientModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Animal *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ex: Rex"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Espécie
                  </label>
                  <select
                    value={patientSpecies}
                    onChange={(e: any) => setPatientSpecies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Canino">Canino (Cão)</option>
                    <option value="Felino">Felino (Gato)</option>
                    <option value="Equino">Equino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Raça
                  </label>
                  <input
                    type="text"
                    value={patientBreed}
                    onChange={(e) => setPatientBreed(e.target.value)}
                    placeholder="Ex: Labrador, SRD"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peso Atual (kg) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={patientWeight}
                    onChange={(e) => setPatientWeight(e.target.value)}
                    placeholder="Ex: 15.5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sexo
                  </label>
                  <select
                    value={patientSex}
                    onChange={(e: any) => setPatientSex(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Idade / Nascimento
                  </label>
                  <input
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="Ex: 3 anos"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Tutor *
                  </label>
                  <input
                    type="text"
                    required
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                    placeholder="Ex: Maria Pereira"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={tutorPhone}
                    onChange={(e) => setTutorPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alergias ou Observações Prévias
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Ex: Alergia a Penicilina"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingPatient}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  {isSavingPatient && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingPatient ? 'Salvando...' : 'Salvar Paciente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nova Consulta */}
      {isNewConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Registrar Consulta Clínica — {activePatient?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Preencha os dados da anamnese, exame físico e prescrição médica
                </p>
              </div>
              <button onClick={() => setIsNewConsultationModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConsultation} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peso Nesta Consulta (kg) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={consWeight}
                    onChange={(e) => setConsWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código da Consulta
                  </label>
                  <input
                    type="text"
                    value={consCode}
                    onChange={(e) => setConsCode(e.target.value)}
                    placeholder="Ex: C-001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sintomas Relatados
                  </label>
                  <input
                    type="text"
                    value={consSymptoms}
                    onChange={(e) => setConsSymptoms(e.target.value)}
                    placeholder="Ex: Vômito, diarreia, apatia"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Queixa Principal & Anamnese Detalhada *
                </label>
                <textarea
                  required
                  rows={2}
                  value={consChiefComplaint}
                  onChange={(e) => setConsChiefComplaint(e.target.value)}
                  placeholder="Relato do tutor sobre início, intensidade e frequência dos sintomas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Exame Físico Inputs */}
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase text-[10px] tracking-wider">
                  Exame Físico Detalhado
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[10px] text-slate-500">Temp (°C)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={consTemp}
                      onChange={(e) => setConsTemp(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">FC (bpm)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={consFC}
                      onChange={(e) => setConsFC(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">FR (mpm)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={consFR}
                      onChange={(e) => setConsFR(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">TPC</label>
                    <input
                      type="text"
                      value={consTPC}
                      onChange={(e) => setConsTPC(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hipóteses Diagnósticas
                </label>
                <input
                  type="text"
                  value={consTentativeDiag}
                  onChange={(e) => setConsTentativeDiag(e.target.value)}
                  placeholder="Ex: Gastroenterite alimentar aguda, suspeita de corpo estranho"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prescrição e Conduta Terapêutica (Um item por linha)
                </label>
                <textarea
                  rows={3}
                  value={consPrescriptions}
                  onChange={(e) => setConsPrescriptions(e.target.value)}
                  placeholder="Ex:&#10;Meloxicam 0,2% injetável: aplicar 0,5 mL SC dose única&#10;Amoxicilina + Clavulanato 250 mg: 1 comp VO a cada 12h por 10 dias"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exames Complementares Solicitados (Separados por vírgula)
                </label>
                <input
                  type="text"
                  value={consRequestedExams}
                  onChange={(e) => setConsRequestedExams(e.target.value)}
                  placeholder="Ex: Hemograma completo, ALT, Creatinina, Ultrassom abdominal"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewConsultationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingConsultation}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  {isSavingConsultation && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingConsultation ? 'Salvando...' : 'Salvar Consulta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
