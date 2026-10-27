import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const STORAGE_KEY = 'vetcalc_custom_supabase_config';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch {}

  return {
    url: (import.meta.env.VITE_SUPABASE_URL || '').trim(),
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim(),
  };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Trigger reconfiguration
    initSupabaseClient();
    window.dispatchEvent(new Event('vetcalc_supabase_config_changed'));
  } catch (e) {
    console.error('Failed to save Supabase config', e);
  }
}

export function clearSupabaseConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    initSupabaseClient();
    window.dispatchEvent(new Event('vetcalc_supabase_config_changed'));
  } catch (e) {
    console.error('Failed to clear Supabase config', e);
  }
}

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('https://') && !cfg.url.includes('your-project-id'));
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return supabaseInstance;
}

function initSupabaseClient() {
  const cfg = getSupabaseConfig();
  if (isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.error('Error creating Supabase client:', err);
      supabaseInstance = null;
    }
  } else {
    supabaseInstance = null;
  }
}

// Initial setup
initSupabaseClient();

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase não está configurado. Preencha o URL do Projeto e a Chave Pública (Anon Key).',
    };
  }

  const start = performance.now();
  try {
    // Attempt reading from profiles or ping auth
    const { error } = await client.from('profiles').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's connected but needs schema
      if (error.code === '42P01') {
        return {
          success: true,
          latencyMs,
          message: 'Conectado ao Supabase! AVISO: As tabelas ainda não foram criadas. Execute o script schema.sql no SQL Editor.',
        };
      }
      return {
        success: false,
        latencyMs,
        message: `Erro do Supabase (${error.code}): ${error.message}`,
      };
    }

    return {
      success: true,
      latencyMs,
      message: 'Conexão segura com Supabase PostgreSQL estabelecida com sucesso!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha de rede ao conectar ao Supabase: ${err.message || String(err)}`,
    };
  }
}
