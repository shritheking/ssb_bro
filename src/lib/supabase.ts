import { createClient } from '@supabase/supabase-js';

// Supabase credentials (environment variables or fallback demo keys)
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://mock-ssb-project.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-ssb-bro';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface LiveSessionRecord {
  id: string;
  room_code: string;
  topic: string;
  mentor_name: string;
  candidate_name: string;
  duration_seconds: number;
  recorded_at: string;
  recording_url?: string;
  notes?: string;
}

// Helper to save recorded session to Supabase or local storage fallback
export async function saveSessionRecording(record: LiveSessionRecord): Promise<boolean> {
  try {
    // 1. Save locally for instant persistence
    const existing = JSON.parse(localStorage.getItem('ssb_live_recordings') || '[]');
    const formattedItem = {
      id: record.id,
      topic: record.topic,
      mentor: record.mentor_name,
      duration: `${Math.floor(record.duration_seconds / 60).toString().padStart(2, '0')}:${(record.duration_seconds % 60).toString().padStart(2, '0')}`,
      timestamp: new Date(record.recorded_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      downloadUrl: record.recording_url || '#',
      videoUrl: record.recording_url,
    };
    localStorage.setItem('ssb_live_recordings', JSON.stringify([formattedItem, ...existing]));

    // 2. Try Supabase cloud table if configured
    if (metaEnv.VITE_SUPABASE_URL && metaEnv.VITE_SUPABASE_ANON_KEY) {
      const { error } = await supabase.from('ssb_recordings').insert([record]);
      if (error) console.warn('Supabase recording insert warning:', error);
    }
    return true;
  } catch (err) {
    console.warn('Could not save session recording:', err);
    return false;
  }
}
