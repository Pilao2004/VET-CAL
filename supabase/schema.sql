-- ==============================================================================
-- VET CALC PRO — SCHEMA OFICIAL POSTGRESQL & ROW LEVEL SECURITY (SUPABASE)
-- Execute este script no SQL Editor do seu projeto Supabase (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Perfis de Usuário (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  crmv TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar profiles automaticamente quando um novo usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Sequência e Função para geração de Código Único do Paciente (VET-XXXXXX)
CREATE SEQUENCE IF NOT EXISTS public.patient_public_code_seq START 100001;

CREATE OR REPLACE FUNCTION public.generate_patient_public_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_code IS NULL OR NEW.public_code = '' THEN
    NEW.public_code := 'VET-' || LPAD(nextval('public.patient_public_code_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Tabela de Pacientes
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  sub_species TEXT,
  breed TEXT DEFAULT 'SRD',
  sex TEXT NOT NULL DEFAULT 'Macho',
  is_neutered BOOLEAN DEFAULT TRUE,
  age TEXT DEFAULT 'Não informada',
  birth_date TEXT,
  weight NUMERIC(6,2) DEFAULT 0,
  microchip TEXT,
  tutor_name TEXT NOT NULL,
  tutor_phone TEXT,
  tutor_email TEXT,
  allergies TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_set_patient_code ON public.patients;
CREATE TRIGGER trigger_set_patient_code
  BEFORE INSERT ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.generate_patient_public_code();

CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_public_code ON public.patients(public_code);

-- 5. Tabela de Consultas Clínicas
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_code TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  weight NUMERIC(6,2),
  chief_complaint TEXT,
  reported_symptoms JSONB DEFAULT '[]'::JSONB,
  physical_exam JSONB DEFAULT '{}'::JSONB,
  tentative_diagnosis TEXT,
  requested_exams JSONB DEFAULT '[]'::JSONB,
  prescriptions JSONB DEFAULT '[]'::JSONB,
  clinical_evolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);

-- 6. Tabela de Evoluções Clínicas Independentes / Assistente IA
CREATE TABLE IF NOT EXISTS public.clinical_evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evolution_text TEXT NOT NULL,
  source TEXT DEFAULT 'manual', -- 'manual', 'ai_assistant'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinical_evolutions_patient_id ON public.clinical_evolutions(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_evolutions_user_id ON public.clinical_evolutions(user_id);

-- 7. Tabela de Auditoria e Conformidade LGPD
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) — SEGURANÇA TOTAL POR USUÁRIO AUTENTICADO
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para Pacientes
DROP POLICY IF EXISTS "patients_select_own" ON public.patients;
CREATE POLICY "patients_select_own" ON public.patients FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "patients_insert_own" ON public.patients;
CREATE POLICY "patients_insert_own" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "patients_update_own" ON public.patients;
CREATE POLICY "patients_update_own" ON public.patients FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "patients_delete_own" ON public.patients;
CREATE POLICY "patients_delete_own" ON public.patients FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Consultas
DROP POLICY IF EXISTS "consultations_select_own" ON public.consultations;
CREATE POLICY "consultations_select_own" ON public.consultations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "consultations_insert_own" ON public.consultations;
CREATE POLICY "consultations_insert_own" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "consultations_update_own" ON public.consultations;
CREATE POLICY "consultations_update_own" ON public.consultations FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "consultations_delete_own" ON public.consultations;
CREATE POLICY "consultations_delete_own" ON public.consultations FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Evoluções Clínicas
DROP POLICY IF EXISTS "evolutions_select_own" ON public.clinical_evolutions;
CREATE POLICY "evolutions_select_own" ON public.clinical_evolutions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "evolutions_insert_own" ON public.clinical_evolutions;
CREATE POLICY "evolutions_insert_own" ON public.clinical_evolutions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para Auditoria
DROP POLICY IF EXISTS "audit_select_own" ON public.audit_logs;
CREATE POLICY "audit_select_own" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "audit_insert_own" ON public.audit_logs;
CREATE POLICY "audit_insert_own" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
