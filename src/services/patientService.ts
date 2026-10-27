import { getSupabase } from '../lib/supabase';
import { PatientRecord, ClinicalConsultation } from '../types';

export interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
}

export interface MigrationSummary {
  totalFound: number;
  migratedCount: number;
  skippedCount: number;
  errors: string[];
}

export const patientService = {
  // Fetch all patients for authenticated user
  async getPatients(userId: string): Promise<PatientRecord[]> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const { data: patientsData, error: patientsError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (patientsError) {
      console.error('Error fetching patients:', patientsError);
      throw new Error(`Erro ao buscar pacientes: ${patientsError.message}`);
    }

    if (!patientsData || patientsData.length === 0) {
      return [];
    }

    const patientIds = patientsData.map((p) => p.id);

    // Fetch consultations for these patients
    const { data: consultationsData, error: consError } = await supabase
      .from('consultations')
      .select('*')
      .in('patient_id', patientIds)
      .order('date', { ascending: false });

    if (consError) {
      console.warn('Error fetching consultations:', consError);
    }

    // Fetch clinical evolutions
    const { data: evolutionsData, error: evolError } = await supabase
      .from('clinical_evolutions')
      .select('*')
      .in('patient_id', patientIds)
      .order('created_at', { ascending: false });

    if (evolError) {
      console.warn('Error fetching evolutions:', evolError);
    }

    // Group consultations by patient
    const consByPatient = new Map<string, ClinicalConsultation[]>();
    (consultationsData || []).forEach((c) => {
      const list = consByPatient.get(c.patient_id) || [];
      list.push({
        id: c.id,
        date: c.date,
        weight: Number(c.weight) || 0,
        consultationCode: c.consultation_code,
        chiefComplaint: c.chief_complaint || '',
        reportedSymptoms: Array.isArray(c.reported_symptoms) ? c.reported_symptoms : [],
        physicalExam: c.physical_exam || {},
        tentativeDiagnosis: c.tentative_diagnosis || '',
        requestedExams: Array.isArray(c.requested_exams) ? c.requested_exams : [],
        prescriptions: Array.isArray(c.prescriptions) ? c.prescriptions : [],
        clinicalEvolution: c.clinical_evolution || '',
      });
      consByPatient.set(c.patient_id, list);
    });

    // Group evolutions by patient
    const evolsByPatient = new Map<string, any[]>();
    (evolutionsData || []).forEach((e) => {
      const list = evolsByPatient.get(e.patient_id) || [];
      list.push({
        id: e.id,
        patientId: e.patient_id,
        evolutionText: e.evolution_text,
        source: e.source,
        createdAt: e.created_at,
      });
      evolsByPatient.set(e.patient_id, list);
    });

    return patientsData.map((p) => ({
      id: p.id,
      publicCode: p.public_code,
      name: p.name,
      species: p.species,
      subSpecies: p.sub_species,
      breed: p.breed || 'SRD',
      sex: p.sex,
      isNeutered: p.is_neutered,
      age: p.age,
      birthDate: p.birth_date,
      weight: Number(p.weight) || 0,
      microchip: p.microchip,
      tutorName: p.tutor_name,
      tutorPhone: p.tutor_phone,
      tutorEmail: p.tutor_email,
      allergies: p.allergies,
      createdAt: p.created_at,
      consultations: consByPatient.get(p.id) || [],
      evolutions: evolsByPatient.get(p.id) || [],
    }));
  },

  // Create a patient record in Supabase
  async createPatient(
    patient: Omit<PatientRecord, 'id' | 'createdAt' | 'consultations'>,
    userId: string
  ): Promise<PatientRecord> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const insertPayload: any = {
      user_id: userId,
      name: patient.name,
      species: patient.species,
      sub_species: patient.subSpecies || null,
      breed: patient.breed || 'SRD',
      sex: patient.sex,
      is_neutered: patient.isNeutered,
      age: patient.age || 'Não informada',
      birth_date: patient.birthDate || null,
      weight: patient.weight || 0,
      microchip: patient.microchip || null,
      tutor_name: patient.tutorName,
      tutor_phone: patient.tutorPhone || null,
      tutor_email: patient.tutorEmail || null,
      allergies: patient.allergies || null,
    };

    if (patient.publicCode) {
      insertPayload.public_code = patient.publicCode;
    }

    const { data, error } = await supabase
      .from('patients')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Error inserting patient into Supabase:', error);
      throw new Error(`Falha ao salvar paciente no banco de dados: ${error.message}`);
    }

    // Register audit log
    await this.logAudit({
      action: 'create_patient',
      entityType: 'patient',
      entityId: data.id,
      details: { name: data.name, publicCode: data.public_code },
    }, userId);

    return {
      id: data.id,
      publicCode: data.public_code,
      name: data.name,
      species: data.species,
      subSpecies: data.sub_species,
      breed: data.breed,
      sex: data.sex,
      isNeutered: data.is_neutered,
      age: data.age,
      birthDate: data.birth_date,
      weight: Number(data.weight) || 0,
      microchip: data.microchip,
      tutorName: data.tutor_name,
      tutorPhone: data.tutor_phone,
      tutorEmail: data.tutor_email,
      allergies: data.allergies,
      createdAt: data.created_at,
      consultations: [],
    };
  },

  // Update existing patient
  async updatePatient(patient: PatientRecord, userId: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const { error } = await supabase
      .from('patients')
      .update({
        name: patient.name,
        species: patient.species,
        sub_species: patient.subSpecies || null,
        breed: patient.breed || 'SRD',
        sex: patient.sex,
        is_neutered: patient.isNeutered,
        age: patient.age,
        birth_date: patient.birthDate || null,
        weight: patient.weight,
        microchip: patient.microchip || null,
        tutor_name: patient.tutorName,
        tutor_phone: patient.tutorPhone || null,
        tutor_email: patient.tutorEmail || null,
        allergies: patient.allergies || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', patient.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating patient:', error);
      throw new Error(`Falha ao atualizar paciente: ${error.message}`);
    }

    await this.logAudit({
      action: 'update_patient',
      entityType: 'patient',
      entityId: patient.id,
      details: { name: patient.name },
    }, userId);
  },

  // Delete patient (archive or delete)
  async deletePatient(patientId: string, userId: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting patient:', error);
      throw new Error(`Falha ao remover paciente: ${error.message}`);
    }

    await this.logAudit({
      action: 'delete_patient',
      entityType: 'patient',
      entityId: patientId,
    }, userId);
  },

  // Add consultation to patient
  async addConsultation(
    patientId: string,
    consultation: any,
    userId: string
  ): Promise<ClinicalConsultation> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase
      .from('consultations')
      .insert({
        patient_id: patientId,
        user_id: userId,
        weight: consultation.weight || null,
        consultation_code: consultation.consultationCode || null,
        chief_complaint: consultation.chiefComplaint || '',
        reported_symptoms: consultation.reportedSymptoms || [],
        physical_exam: consultation.physicalExam || {},
        tentative_diagnosis: consultation.tentativeDiagnosis || '',
        requested_exams: consultation.requestedExams || [],
        prescriptions: consultation.prescriptions || [],
        clinical_evolution: consultation.clinicalEvolution || '',
        date: consultation.date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding consultation:', error);
      throw new Error(`Falha ao registrar consulta: ${error.message}`);
    }

    // Also update patient weight if specified
    if (consultation.weight) {
      await supabase
        .from('patients')
        .update({ weight: consultation.weight, updated_at: new Date().toISOString() })
        .eq('id', patientId)
        .eq('user_id', userId);
    }

    await this.logAudit({
      action: 'create_consultation',
      entityType: 'consultation',
      entityId: data.id,
      details: { patientId, chiefComplaint: data.chief_complaint },
    }, userId);

    return {
      id: data.id,
      date: data.date,
      weight: Number(data.weight) || 0,
      consultationCode: data.consultation_code,
      chiefComplaint: data.chief_complaint,
      reportedSymptoms: data.reported_symptoms || [],
      physicalExam: data.physical_exam || {},
      tentativeDiagnosis: data.tentative_diagnosis,
      requestedExams: data.requested_exams || [],
      prescriptions: data.prescriptions || [],
      clinicalEvolution: data.clinical_evolution,
    };
  },

  // Add independent clinical evolution
  async addClinicalEvolution(
    patientId: string,
    evolutionText: string,
    source: 'manual' | 'ai_assistant',
    userId: string
  ): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const { error } = await supabase
      .from('clinical_evolutions')
      .insert({
        patient_id: patientId,
        user_id: userId,
        evolution_text: evolutionText,
        source,
      });

    if (error) {
      console.error('Error adding clinical evolution:', error);
      throw new Error(`Falha ao salvar evolução: ${error.message}`);
    }

    await this.logAudit({
      action: 'create_clinical_evolution',
      entityType: 'clinical_evolution',
      details: { patientId, source },
    }, userId);
  },

  // Lookup authorized patient by public code (for AI Assistant and Quick Search)
  async getPatientByPublicCode(publicCode: string, userId: string): Promise<PatientRecord | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado');

    const cleanCode = publicCode.trim().toUpperCase();

    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('public_code', cleanCode)
      .eq('user_id', userId)
      .single();

    if (error || !patient) {
      return null;
    }

    // Fetch consultations
    const { data: consultations } = await supabase
      .from('consultations')
      .select('*')
      .eq('patient_id', patient.id)
      .order('date', { ascending: false });

    // Fetch clinical evolutions
    const { data: evolutions } = await supabase
      .from('clinical_evolutions')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false });

    return {
      id: patient.id,
      publicCode: patient.public_code,
      name: patient.name,
      species: patient.species,
      subSpecies: patient.sub_species,
      breed: patient.breed,
      sex: patient.sex,
      isNeutered: patient.is_neutered,
      age: patient.age,
      birthDate: patient.birth_date,
      weight: Number(patient.weight) || 0,
      microchip: patient.microchip,
      tutorName: patient.tutor_name,
      tutorPhone: patient.tutor_phone,
      tutorEmail: patient.tutor_email,
      allergies: patient.allergies,
      createdAt: patient.created_at,
      consultations: (consultations || []).map((c) => ({
        id: c.id,
        date: c.date,
        weight: Number(c.weight) || 0,
        consultationCode: c.consultation_code,
        chiefComplaint: c.chief_complaint || '',
        reportedSymptoms: c.reported_symptoms || [],
        physicalExam: c.physical_exam || {},
        tentativeDiagnosis: c.tentative_diagnosis || '',
        requestedExams: c.requested_exams || [],
        prescriptions: c.prescriptions || [],
        clinicalEvolution: c.clinical_evolution || '',
      })),
      evolutions: (evolutions || []).map((e) => ({
        id: e.id,
        patientId: e.patient_id,
        evolutionText: e.evolution_text,
        source: e.source,
        createdAt: e.created_at,
      })),
    };
  },

  // Audit logger
  async logAudit(entry: AuditLogEntry, userId: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId || null,
        details: entry.details || {},
      });
    } catch (e) {
      console.warn('Audit log write failed silently:', e);
    }
  },

  // Safe migration routine from local data
  async migrateFromLocalStorage(localPatients: PatientRecord[], userId: string): Promise<MigrationSummary> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não conectado.');

    const summary: MigrationSummary = {
      totalFound: localPatients.length,
      migratedCount: 0,
      skippedCount: 0,
      errors: [],
    };

    // Fetch existing publicCodes in Supabase to avoid duplicates
    const { data: existingPatients, error: existingError } = await supabase
      .from('patients')
      .select('public_code, name, tutor_name')
      .eq('user_id', userId);

    if (existingError) {
      throw new Error(`Falha ao verificar registros existentes: ${existingError.message}`);
    }

    const existingCodes = new Set((existingPatients || []).map((p) => p.public_code));
    const existingNamesAndTutors = new Set(
      (existingPatients || []).map((p) => `${p.name.toLowerCase().trim()}::${p.tutor_name.toLowerCase().trim()}`)
    );

    for (const patient of localPatients) {
      try {
        const nameTutorKey = `${patient.name.toLowerCase().trim()}::${patient.tutorName.toLowerCase().trim()}`;
        if (
          (patient.publicCode && existingCodes.has(patient.publicCode)) ||
          existingNamesAndTutors.has(nameTutorKey)
        ) {
          summary.skippedCount++;
          continue;
        }

        // Insert patient
        const newPatient = await this.createPatient(
          {
            name: patient.name,
            species: patient.species,
            subSpecies: patient.subSpecies,
            breed: patient.breed,
            sex: patient.sex,
            isNeutered: patient.isNeutered,
            age: patient.age,
            birthDate: patient.birthDate,
            weight: patient.weight,
            microchip: patient.microchip,
            tutorName: patient.tutorName,
            tutorPhone: patient.tutorPhone,
            tutorEmail: patient.tutorEmail,
            allergies: patient.allergies,
          },
          userId
        );

        // Migrate its consultations
        if (patient.consultations && patient.consultations.length > 0) {
          for (const cons of patient.consultations) {
            await this.addConsultation(newPatient.id, cons, userId);
          }
        }

        existingCodes.add(newPatient.publicCode || '');
        existingNamesAndTutors.add(nameTutorKey);
        summary.migratedCount++;
      } catch (err: any) {
        summary.errors.push(`Erro em "${patient.name}": ${err.message || String(err)}`);
      }
    }

    await this.logAudit({
      action: 'migration_completed',
      entityType: 'migration',
      details: {
        totalFound: summary.totalFound,
        migrated: summary.migratedCount,
        skipped: summary.skippedCount,
      },
    }, userId);

    return summary;
  },
};
