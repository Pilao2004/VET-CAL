import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  ActiveView,
  CalculatorType,
  CalculationHistoryItem,
  DrugItem,
  PatientRecord,
  SubscriptionInfo,
} from '../types';
import { CommercialProduct } from '../data/commercialProducts';
import {
  getSupabase,
  isSupabaseConfigured,
  testSupabaseConnection,
  saveSupabaseConfig,
  clearSupabaseConfig,
  getSupabaseConfig,
} from '../lib/supabase';
import { patientService, MigrationSummary } from '../services/patientService';
import { isOwnerPreview } from '../config/plans';

interface PrefillData {
  drugName?: string;
  weight?: number;
  doseMgKg?: number;
  concentrationMgMl?: number;
  formType?: 'liquid' | 'tablet' | 'drops' | 'topical' | 'spray' | 'paste' | string;
  tabletMg?: number;
  percentage?: number;
  bottleVolumeMl?: number;
  frequency?: string;
  durationDays?: number;
  route?: string;
  species?: 'dog' | 'cat' | 'equine' | 'bovine' | string;
  selectedProductId?: string;
}

interface AppContextType {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedCalculator: CalculatorType;
  setSelectedCalculator: (calc: CalculatorType) => void;
  prefilledCalculatorData: PrefillData | null;
  setPrefilledCalculatorData: (data: PrefillData | null) => void;
  openCalculatorWithDrug: (drug: DrugItem, doseMgKg?: number, concentrationMgMl?: number) => void;
  openCalculatorWithCommercialProduct: (prod: CommercialProduct, speciesPref?: string) => void;

  // Dark/Light Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;

  // History & Favorites
  calculationHistory: CalculationHistoryItem[];
  addCalculationToHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  favoriteCalculators: string[];
  toggleFavoriteCalculator: (id: string) => void;
  favoriteDrugs: string[];
  toggleFavoriteDrug: (id: string) => void;

  // Supabase Auth & Real Database
  user: User | null;
  session: Session | null;
  isSupabaseReady: boolean;
  supabaseConnected: boolean | null;
  supabaseLatency: number | null;
  isLoadingAuth: boolean;
  testConnection: () => Promise<{ success: boolean; message: string; latencyMs?: number }>;
  saveConfig: (url: string, key: string) => void;
  clearConfig: () => void;
  signUpWithSupabase: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOutWithSupabase: () => Promise<void>;
  resetPasswordWithSupabase: (email: string) => Promise<{ success: boolean; message: string }>;

  // Patients (Supabase PostgreSQL with safe local fallback)
  patients: PatientRecord[];
  isLoadingPatients: boolean;
  patientError: string | null;
  refreshPatients: () => Promise<void>;
  addPatient: (patient: Omit<PatientRecord, 'id' | 'createdAt' | 'consultations'>) => Promise<void>;
  updatePatient: (patient: PatientRecord) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  addConsultationToPatient: (patientId: string, consultation: any) => Promise<void>;
  addClinicalEvolutionToPatient: (patientId: string, evolutionText: string, source?: 'ai_assistant' | 'manual') => Promise<void>;
  importPatientsBackup: (list: PatientRecord[]) => Promise<number>;

  // Migration & Backups
  localPatientsCount: number;
  migrateLocalPatients: () => Promise<MigrationSummary>;
  exportLocalBackup: () => void;
  clearLocalMigratedData: () => void;

  // Subscription
  subscription: SubscriptionInfo;
  activateSubscriptionServer: (key: string, email?: string) => Promise<{ success: boolean; message: string }>;
  claimPurchase: (email: string, order: string) => Promise<{ success: boolean; message: string }>;
  deactivateSubscription: () => void;
  isPremium: boolean;
  checkIsFeatureUnlocked: (badge: 'Básica' | 'Avançada') => boolean;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_PATIENTS: PatientRecord[] = [
  {
    id: 'demo-patient-1',
    publicCode: 'VET-100001',
    name: 'Thor (Demonstração)',
    species: 'Canino',
    breed: 'Golden Retriever',
    sex: 'Macho',
    isNeutered: true,
    age: '4 anos',
    birthDate: '2022-04-10',
    weight: 32.5,
    microchip: '981098102394821',
    tutorName: 'Mariana Silva',
    tutorPhone: '(11) 98765-4321',
    tutorEmail: 'mariana.silva@email.com',
    allergies: 'Sem alergias conhecidas',
    createdAt: '2026-03-01T10:00:00Z',
    consultations: [
      {
        id: 'cons-1',
        date: '2026-03-10T14:30:00Z',
        weight: 32.5,
        chiefComplaint: 'Episódio agudo de êmese matinal e apatia após passeio no parque.',
        reportedSymptoms: ['Vômito bilioso', 'Apatia leve', 'Hiporexia'],
        physicalExam: {
          temperature: 38.6,
          heartRate: 98,
          respiratoryRate: 24,
          crt: '< 2',
          mucousMembranes: 'Rosadas e úmidas',
          hydrationPercent: 5,
          bodyConditionScore: 5,
          lymphNodes: 'Normais e reativos simétricos',
          abdominalPalpation: 'Leve desconforto epigástrico à palpação profunda, sem massas.',
        },
        tentativeDiagnosis: 'Gastrite aguda alimentar / Indigestão dietética.',
        requestedExams: ['Hemograma completo', 'Ultrassonografia abdominal'],
        prescriptions: [
          'Citrato de Maropitant 10 mg/mL injetável: aplicar 3,25 mL (1 mg/kg) via SC a cada 24 horas por 3 dias.',
          'Omeprazol 20 mg: administrar 1 cápsula e meia (30 mg) VO pela manhã em jejum por 7 dias.',
          'Dieta branda (frango cozido desfiado sem tempero com arroz) em pequenas porções fracionadas.',
        ],
        clinicalEvolution: 'Paciente estável, normohidratado, responsivo ao antiemético.',
      },
    ],
  },
  {
    id: 'demo-patient-2',
    publicCode: 'VET-100002',
    name: 'Luna (Demonstração)',
    species: 'Felino',
    breed: 'Siamês',
    sex: 'Fêmea',
    isNeutered: true,
    age: '2 anos e meio',
    birthDate: '2023-09-15',
    weight: 3.8,
    microchip: '981098104473829',
    tutorName: 'Carlos Eduardo Mendes',
    tutorPhone: '(21) 99887-1122',
    tutorEmail: 'carlos.mendes@email.com',
    allergies: 'Sensibilidade prévia a ampicilina',
    createdAt: '2026-02-20T11:00:00Z',
    consultations: [
      {
        id: 'cons-2',
        date: '2026-03-12T09:15:00Z',
        weight: 3.8,
        chiefComplaint: 'Visitas frequentes à caixa de areia com vocalização e pequenos pingos de urina avermelhada.',
        reportedSymptoms: ['Disúria', 'Polaciúria', 'Hematúria', 'Vocalização'],
        physicalExam: {
          temperature: 38.4,
          heartRate: 170,
          respiratoryRate: 32,
          crt: '< 2',
          mucousMembranes: 'Normocoradas',
          hydrationPercent: 0,
          bodyConditionScore: 4,
          lymphNodes: 'Normais',
          abdominalPalpation: 'Bexiga pequena, túrgida e dolorosa à palpação caudal. Não há obstrução uretral no momento.',
        },
        tentativeDiagnosis: 'Cistite Idiopática Felina (CIF) / Suspeita de Urolitíase.',
        requestedExams: ['Urinálise com sedimento por cistocentese', 'Ultrassonografia vesical e renal'],
        prescriptions: [
          'Meloxicam 0,2% (2 mg/mL) injetável: aplicar 0,1 mL (0,05 mg/kg) via SC dose única no consultório.',
          'Gabapentina 50 mg: administrar 1/2 comprimido (25 mg) VO a cada 12 horas por 5 dias para modulação de dor visceral e estresse.',
          'Estímulo hídrico intensivo com fontes de água corrente e alimentação úmida em sachê.',
        ],
        clinicalEvolution: 'Micção com alívio após primeira dose de analgesia multimodal.',
      },
    ],
  },
];

// Helper to scan all local patients in localStorage
function scanAllLocalPatients(): PatientRecord[] {
  const result: PatientRecord[] = [];
  const seenIds = new Set<string>();

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('patients') || key === 'vet_calc_pro_patients')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) {
            parsed.forEach((p: any) => {
              if (p && p.name && !p.id?.startsWith('demo-') && !seenIds.has(p.id)) {
                seenIds.add(p.id);
                result.push(p);
              }
            });
          }
        }
      }
    }
  } catch {}
  return result;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>('dosage');
  const [prefilledCalculatorData, setPrefilledCalculatorData] = useState<PrefillData | null>(null);

  // Tema: escuro por padrão; a escolha fica salva no aparelho
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vet_calc_pro_theme') !== 'light';
    } catch {
      return true;
    }
  });
  const toggleTheme = () => setIsDarkMode((d) => !d);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    root.classList.toggle('light', !isDarkMode);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDarkMode ? '#0B1D3A' : '#FFFFFF');
    try {
      localStorage.setItem('vet_calc_pro_theme', isDarkMode ? 'dark' : 'light');
    } catch {}
  }, [isDarkMode]);

  // Modals & Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Supabase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(isSupabaseConfigured());
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [supabaseLatency, setSupabaseLatency] = useState<number | null>(null);

  // Patient states
  const [patients, setPatients] = useState<PatientRecord[]>(DEMO_PATIENTS);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [patientError, setPatientError] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [localPatientsCount, setLocalPatientsCount] = useState<number>(0);

  // Active email for history / favorites
  const getActiveUserEmail = (): string => {
    if (user?.email) return user.email.toLowerCase().trim();
    try {
      const saved = localStorage.getItem('vetcalc_user_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.email) return p.email.toLowerCase().trim();
      }
    } catch {}
    return 'guest';
  };

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(getActiveUserEmail);

  // Test connection to Supabase
  const checkConnection = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSupabaseConnected(false);
      setSupabaseLatency(null);
      return { success: false, message: 'Supabase não configurado' };
    }
    const res = await testSupabaseConnection();
    setSupabaseConnected(res.success);
    if (res.latencyMs !== undefined) setSupabaseLatency(res.latencyMs);
    return res;
  }, []);

  // Initialize Supabase Auth listener
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsLoadingAuth(false);
      setIsSupabaseReady(false);
      return;
    }

    setIsSupabaseReady(true);
    checkConnection();

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user?.email) {
        setCurrentUserEmail(currentSession.user.email.toLowerCase().trim());
      }
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user?.email) {
        setCurrentUserEmail(newSession.user.email.toLowerCase().trim());
      }
      setIsLoadingAuth(false);
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [checkConnection]);

  // Listen to custom config updates
  useEffect(() => {
    const handleConfigChange = () => {
      setIsSupabaseReady(isSupabaseConfigured());
      checkConnection();
    };
    window.addEventListener('vetcalc_supabase_config_changed', handleConfigChange);
    return () => {
      window.removeEventListener('vetcalc_supabase_config_changed', handleConfigChange);
    };
  }, [checkConnection]);

  // Update local unmigrated records count
  useEffect(() => {
    const local = scanAllLocalPatients();
    setLocalPatientsCount(local.length);
  }, [patients]);

  // Fetch patients from Supabase or fallback
  const refreshPatients = useCallback(async () => {
    if (user && isSupabaseReady) {
      setIsLoadingPatients(true);
      setPatientError(null);
      try {
        const cloudPatients = await patientService.getPatients(user.id);
        setPatients(cloudPatients);
        if (cloudPatients.length > 0 && !selectedPatientId) {
          setSelectedPatientId(cloudPatients[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load cloud patients:', err);
        setPatientError(err.message || 'Falha ao sincronizar prontuários com o banco de dados.');
        showToast('Erro ao carregar prontuários do Supabase.');
      } finally {
        setIsLoadingPatients(false);
      }
    } else {
      // Local fallback
      try {
        const storageKey = `vetcalc_user_${currentUserEmail}_patients`;
        const saved = localStorage.getItem(storageKey);
        const parsed: PatientRecord[] = saved ? JSON.parse(saved) : (currentUserEmail === 'guest' ? DEMO_PATIENTS : []);
        setPatients(parsed);
      } catch {
        setPatients(DEMO_PATIENTS);
      }
    }
  }, [user, isSupabaseReady, currentUserEmail, selectedPatientId]);

  useEffect(() => {
    refreshPatients();
  }, [user, isSupabaseReady, currentUserEmail]);

  // History & Favorites storage keys
  const getStorageKey = (suffix: string) => `vetcalc_user_${currentUserEmail}_${suffix}`;

  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('history'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteCalculators, setFavoriteCalculators] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('fav_calcs'));
      return saved ? JSON.parse(saved) : ['dosage', 'fluidotherapy', 'dilution'];
    } catch {
      return ['dosage', 'fluidotherapy', 'dilution'];
    }
  });

  const [favoriteDrugs, setFavoriteDrugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('fav_drugs'));
      return saved ? JSON.parse(saved) : ['meloxicam', 'maropitant', 'amoxicilina-clavulanato'];
    } catch {
      return ['meloxicam', 'maropitant', 'amoxicilina-clavulanato'];
    }
  });

  // Reload history and favorites on email change
  useEffect(() => {
    try {
      const savedHist = localStorage.getItem(getStorageKey('history'));
      setCalculationHistory(savedHist ? JSON.parse(savedHist) : []);

      const savedCalcs = localStorage.getItem(getStorageKey('fav_calcs'));
      setFavoriteCalculators(savedCalcs ? JSON.parse(savedCalcs) : ['dosage', 'fluidotherapy', 'dilution']);

      const savedDrugs = localStorage.getItem(getStorageKey('fav_drugs'));
      setFavoriteDrugs(savedDrugs ? JSON.parse(savedDrugs) : ['meloxicam', 'maropitant', 'amoxicilina-clavulanato']);
    } catch {
      setCalculationHistory([]);
      setFavoriteCalculators(['dosage', 'fluidotherapy', 'dilution']);
      setFavoriteDrugs(['meloxicam', 'maropitant', 'amoxicilina-clavulanato']);
    }
  }, [currentUserEmail]);

  const addCalculationToHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: 'calc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    setCalculationHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      try {
        localStorage.setItem(getStorageKey('history'), JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    try {
      localStorage.removeItem(getStorageKey('history'));
    } catch {}
    showToast('Histórico de cálculos limpo com sucesso.');
  };

  const toggleFavoriteCalculator = (id: string) => {
    setFavoriteCalculators((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(getStorageKey('fav_calcs'), JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleFavoriteDrug = (id: string) => {
    setFavoriteDrugs((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(getStorageKey('fav_drugs'), JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Patients CRUD methods
  const addPatient = async (patientData: Omit<PatientRecord, 'id' | 'createdAt' | 'consultations'>) => {
    if (user && isSupabaseReady) {
      try {
        const created = await patientService.createPatient(patientData, user.id);
        setPatients((prev) => [created, ...prev]);
        setSelectedPatientId(created.id);
        showToast(`Paciente ${created.name} (${created.publicCode}) gravado no banco de dados!`);
      } catch (err: any) {
        showToast(`Erro ao gravar no banco: ${err.message}`);
        throw err;
      }
    } else {
      // Local fallback
      const newPatient: PatientRecord = {
        ...patientData,
        id: 'patient-' + Date.now(),
        publicCode: 'VET-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
        consultations: [],
      };
      setPatients((prev) => {
        const updated = [newPatient, ...prev];
        try {
          localStorage.setItem(getStorageKey('patients'), JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setSelectedPatientId(newPatient.id);
      showToast(`Paciente salvo localmente (faça login no Supabase para salvar na nuvem).`);
    }
  };

  const updatePatient = async (updatedPatient: PatientRecord) => {
    if (user && isSupabaseReady) {
      try {
        await patientService.updatePatient(updatedPatient, user.id);
        setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
        showToast(`Dados de ${updatedPatient.name} atualizados com sucesso.`);
      } catch (err: any) {
        showToast(`Erro ao atualizar no banco: ${err.message}`);
        throw err;
      }
    } else {
      setPatients((prev) => {
        const updated = prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p));
        try {
          localStorage.setItem(getStorageKey('patients'), JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast(`Dados de ${updatedPatient.name} atualizados.`);
    }
  };

  const deletePatient = async (id: string) => {
    if (user && isSupabaseReady) {
      try {
        await patientService.deletePatient(id, user.id);
        setPatients((prev) => prev.filter((p) => p.id !== id));
        if (selectedPatientId === id) setSelectedPatientId(null);
        showToast('Paciente removido com sucesso do banco de dados.');
      } catch (err: any) {
        showToast(`Erro ao excluir: ${err.message}`);
        throw err;
      }
    } else {
      setPatients((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        try {
          localStorage.setItem(getStorageKey('patients'), JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (selectedPatientId === id) setSelectedPatientId(null);
      showToast('Paciente removido do dispositivo.');
    }
  };

  const addConsultationToPatient = async (patientId: string, consultationData: any) => {
    if (user && isSupabaseReady) {
      try {
        const newCons = await patientService.addConsultation(patientId, consultationData, user.id);
        setPatients((prev) =>
          prev.map((p) => {
            if (p.id === patientId) {
              return {
                ...p,
                weight: consultationData.weight || p.weight,
                consultations: [newCons, ...(p.consultations || [])],
              };
            }
            return p;
          })
        );
        showToast('Consulta gravada no prontuário no banco de dados!');
      } catch (err: any) {
        showToast(`Erro ao gravar consulta: ${err.message}`);
        throw err;
      }
    } else {
      setPatients((prev) => {
        const updated = prev.map((p) => {
          if (p.id === patientId) {
            const newCons = {
              ...consultationData,
              id: 'cons-' + Date.now(),
              date: new Date().toISOString(),
            };
            return {
              ...p,
              weight: consultationData.weight || p.weight,
              consultations: [newCons, ...(p.consultations || [])],
            };
          }
          return p;
        });
        try {
          localStorage.setItem(getStorageKey('patients'), JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast('Consulta salva no prontuário local!');
    }
  };

  const addClinicalEvolutionToPatient = async (
    patientId: string,
    evolutionText: string,
    source: 'ai_assistant' | 'manual' = 'manual'
  ) => {
    if (user && isSupabaseReady) {
      try {
        await patientService.addClinicalEvolution(patientId, evolutionText, source, user.id);
      } catch (err: any) {
        console.error('Error saving clinical evolution to Supabase:', err);
      }
    }

    const newEvol = {
      id: 'evo-' + Date.now(),
      patientId,
      evolutionText,
      source,
      createdAt: new Date().toISOString(),
    };

    setPatients((prev) => {
      const updated = prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            evolutions: [newEvol, ...(p.evolutions || [])],
          };
        }
        return p;
      });
      try {
        localStorage.setItem(getStorageKey('patients'), JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Restaura um backup em arquivo: na nuvem cria os pacientes; no modo local mescla por id
  const importPatientsBackup = async (list: PatientRecord[]): Promise<number> => {
    if (user && isSupabaseReady) {
      const summary = await patientService.migrateFromLocalStorage(list, user.id);
      await refreshPatients();
      return summary.migratedCount;
    }
    setPatients((prev) => {
      const byId = new Map(prev.map((p) => [p.id, p]));
      for (const p of list) byId.set(p.id, p);
      const updated = Array.from(byId.values());
      try {
        localStorage.setItem(getStorageKey('patients'), JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return list.length;
  };

  // Migration from localStorage
  const migrateLocalPatients = async (): Promise<MigrationSummary> => {
    if (!user) throw new Error('É necessário estar autenticado para migrar os prontuários.');
    const local = scanAllLocalPatients();
    if (local.length === 0) {
      return { totalFound: 0, migratedCount: 0, skippedCount: 0, errors: [] };
    }

    const summary = await patientService.migrateFromLocalStorage(local, user.id);
    await refreshPatients();
    setLocalPatientsCount(scanAllLocalPatients().length);
    return summary;
  };

  // Export local backup as JSON
  const exportLocalBackup = () => {
    const local = scanAllLocalPatients();
    const backupData = {
      exportDate: new Date().toISOString(),
      appName: 'VET CALC PRO',
      patientCount: local.length,
      patients: local,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-vetcalc-prontuarios-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup JSON exportado com sucesso!');
  };

  const clearLocalMigratedData = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('patients') || key === 'vet_calc_pro_patients')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      setLocalPatientsCount(0);
      showToast('Dados locais antigos limpos com segurança.');
    } catch (e) {
      showToast('Erro ao limpar dados locais.');
    }
  };

  // Supabase Auth Methods
  const signUpWithSupabase = async (email: string, password: string, name: string) => {
    const supabase = getSupabase();
    if (!supabase) return { success: false, message: 'Supabase não configurado.' };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        return {
          success: true,
          message: data.session
            ? 'Conta criada com sucesso!'
            : 'Conta criada! Verifique seu e-mail para confirmar o cadastro.',
        };
      }

      return { success: false, message: 'Não foi possível completar o cadastro.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro inesperado ao cadastrar.' };
    }
  };

  const signInWithSupabase = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { success: false, message: 'Supabase não configurado.' };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      setUser(data.user);
      setSession(data.session);
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro inesperado ao fazer login.' };
    }
  };

  const signOutWithSupabase = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setCurrentUserEmail('guest');
    showToast('Sessão encerrada com sucesso.');
  };

  const resetPasswordWithSupabase = async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) return { success: false, message: 'Supabase não configurado.' };

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: 'Link de recuperação enviado para seu e-mail com sucesso!',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao enviar e-mail de recuperação.' };
    }
  };

  // Subscription state: grátis por padrão; Premium só com código ativado no servidor
  const FREE_PLAN: SubscriptionInfo = { tier: 'free', isActive: false };
  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => {
    try {
      const saved: SubscriptionInfo | null = JSON.parse(localStorage.getItem('vet_calc_pro_sub') || 'null');
      // Licenças antigas sem token (códigos públicos) não valem mais
      if (!saved || saved.tier !== 'premium' || !saved.token) return FREE_PLAN;
      return saved;
    } catch {
      return FREE_PLAN;
    }
  });

  const isPremium =
    isOwnerPreview() ||
    (subscription.tier === 'premium' &&
      subscription.isActive &&
      (!subscription.expiresAt || subscription.expiresAt >= new Date().toISOString().slice(0, 10)));

  const saveSubscription = (subData: SubscriptionInfo) => {
    setSubscription(subData);
    try {
      localStorage.setItem('vet_calc_pro_sub', JSON.stringify(subData));
    } catch {}
  };

  const postJson = async (url: string, body: unknown) => {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return { response, data: await response.json().catch(() => null) };
  };

  const activateSubscriptionServer = async (key: string, email?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { response, data } = await postJson('./api/subscription/activate', { licenseKey: key, email });
      if (response.ok && data?.success) {
        saveSubscription({
          tier: 'premium',
          isActive: true,
          licenseKey: key.trim().toUpperCase(),
          expiresAt: data.expiresAt,
          email: (email || '').trim().toLowerCase(),
          token: data.token,
        });
        showToast('Acesso liberado!');
        return { success: true, message: data.message };
      }
      return { success: false, message: data?.message || 'Não foi possível ativar. Confira o código e o e-mail.' };
    } catch {
      return { success: false, message: 'Sem conexão com o servidor de ativação. Verifique a internet e tente de novo.' };
    }
  };

  // Compra única na Kiwify/Hotmart: libera com e-mail + nº do pedido
  const claimPurchase = async (email: string, order: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { response, data } = await postJson('./api/subscription/claim', { email, order });
      if (response.ok && data?.success) {
        saveSubscription({ tier: 'premium', isActive: true, licenseKey: order.trim().toUpperCase(), email: email.trim().toLowerCase(), token: data.token });
        showToast('Acesso liberado!');
        return { success: true, message: data.message };
      }
      return { success: false, message: data?.message || 'Não foi possível confirmar a compra. Confira o e-mail e o nº do pedido.' };
    } catch {
      return { success: false, message: 'Sem conexão com o servidor. Verifique a internet e tente de novo.' };
    }
  };

  // Ao abrir com internet, renova o token; reembolso ou chargeback bloqueia o acesso
  useEffect(() => {
    if (isOwnerPreview() || !subscription.token) return;
    let cancelled = false;
    postJson('./api/subscription/refresh', { token: subscription.token })
      .then(({ response, data }) => {
        if (cancelled) return;
        if (response.ok && data?.token) saveSubscription({ ...subscription, token: data.token });
        else if (response.status === 401 || response.status === 403) {
          setSubscription(FREE_PLAN);
          try {
            localStorage.removeItem('vet_calc_pro_sub');
          } catch {}
          showToast(data?.reason === 'revoked' ? 'Acesso encerrado: a compra foi reembolsada ou cancelada.' : 'Seu acesso precisa ser ativado novamente.');
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deactivateSubscription = () => {
    setSubscription(FREE_PLAN);
    try {
      localStorage.removeItem('vet_calc_pro_sub');
    } catch {}
    showToast('Acesso removido deste aparelho.');
  };

  const checkIsFeatureUnlocked = (badge: 'Básica' | 'Avançada'): boolean => badge !== 'Avançada' || isPremium;

  // Open calculator prefilled with drug
  const openCalculatorWithDrug = (
    drug: DrugItem,
    doseMgKg?: number,
    concentrationMgMl?: number,
    extra?: { formType?: 'liquid' | 'tablet' | 'drops'; tabletMg?: number; frequency?: string; route?: string }
  ) => {
    const refDose = drug.referenceDosages[0];
    const suggestedDose = doseMgKg || (refDose?.suggestedMgKg || 1);
    const suggestedConc = concentrationMgMl || (drug.standardConcentrations[0]?.valueMgMl || 10);
    const formType =
      extra?.formType ||
      (drug.presentations.some((p) => p.toLowerCase().includes('comprimido')) &&
      !drug.presentations.some((p) => p.toLowerCase().includes('injetável'))
        ? 'tablet'
        : 'liquid');

    setPrefilledCalculatorData({
      drugName: `${drug.activePrinciple} (${drug.brandNames[0] || ''})`,
      doseMgKg: suggestedDose,
      concentrationMgMl: suggestedConc,
      formType,
      tabletMg: extra?.tabletMg || (drug.presentations.find((p) => p.includes('mg')) ? 50 : undefined),
      frequency: extra?.frequency || refDose?.frequency || 'BID',
      route: extra?.route || refDose?.route || 'VO',
      species: refDose?.species?.toLowerCase().includes('gato') ? 'cat' : 'dog',
    });
    setSelectedCalculator('dosage');
    setCurrentView('calculators');
    showToast(`Calculadora preenchida com ${drug.activePrinciple}!`);
  };

  // Open calculator prefilled with specific commercial product
  const openCalculatorWithCommercialProduct = (prod: CommercialProduct, speciesPref: string = 'Canino') => {
    const isCat = speciesPref.toLowerCase().includes('gato') || speciesPref.toLowerCase().includes('felin');
    const dose = isCat
      ? (prod.defaultDoseMgKg.felino || prod.defaultDoseMgKg.canino || 1)
      : (prod.defaultDoseMgKg.canino || prod.defaultDoseMgKg.felino || 1);

    setPrefilledCalculatorData({
      drugName: prod.brandName,
      selectedProductId: prod.id,
      doseMgKg: dose,
      concentrationMgMl: prod.concentrationMgMl,
      percentage: prod.percentage,
      formType: prod.formType as any,
      tabletMg: prod.tabletMg,
      bottleVolumeMl: prod.bottleVolumeMl,
      frequency: prod.defaultFrequency,
      route: prod.defaultRoute,
      species: isCat ? 'cat' : 'dog',
    });
    setSelectedCalculator('dosage');
    setCurrentView('calculators');
    showToast(`Calculadora carregada com ${prod.brandName}!`);
  };

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCalculator,
        setSelectedCalculator,
        prefilledCalculatorData,
        setPrefilledCalculatorData,
        openCalculatorWithDrug,
        openCalculatorWithCommercialProduct,
        isDarkMode,
        toggleTheme,
        isSearchOpen,
        setIsSearchOpen,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        calculationHistory,
        addCalculationToHistory,
        clearHistory,
        favoriteCalculators,
        toggleFavoriteCalculator,
        favoriteDrugs,
        toggleFavoriteDrug,

        // Supabase Auth & Config
        user,
        session,
        isSupabaseReady,
        supabaseConnected,
        supabaseLatency,
        isLoadingAuth,
        testConnection: checkConnection,
        saveConfig: (url, key) => saveSupabaseConfig({ url, anonKey: key }),
        clearConfig: clearSupabaseConfig,
        signUpWithSupabase,
        signInWithSupabase,
        signOutWithSupabase,
        resetPasswordWithSupabase,

        // Patients
        patients,
        isLoadingPatients,
        patientError,
        refreshPatients,
        addPatient,
        updatePatient,
        deletePatient,
        selectedPatientId,
        setSelectedPatientId,
        addConsultationToPatient,
        addClinicalEvolutionToPatient,
        importPatientsBackup,

        // Migration & Backups
        localPatientsCount,
        migrateLocalPatients,
        exportLocalBackup,
        clearLocalMigratedData,

        subscription,
        activateSubscriptionServer,
        claimPurchase,
        deactivateSubscription,
        isPremium,
        checkIsFeatureUnlocked,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
