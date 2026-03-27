import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DiagnosticResult = {
  id: string;
  user_id?: string;
  overall_score: number;
  dimension_scores: Record<string, number>;
  answers: Record<number, number>;
  top_gaps: Array<{dimension: string; score: number; insight: string}>;
  action_plan: string[];
  created_at: string;
  completed_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  business_name?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
};
