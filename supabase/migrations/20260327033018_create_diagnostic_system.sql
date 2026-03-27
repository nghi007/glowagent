/*
  # GlowAgent Diagnostic System Schema

  1. New Tables
    - `diagnostic_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, nullable for anonymous)
      - `overall_score` (integer, 0-100)
      - `dimension_scores` (jsonb, stores scores for each dimension)
      - `answers` (jsonb, stores all quiz answers)
      - `top_gaps` (jsonb, stores identified gaps)
      - `action_plan` (jsonb, stores personalized actions)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `user_profiles`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `email` (text)
      - `business_name` (text, nullable)
      - `industry` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can read their own diagnostic results
    - Anonymous users can create results (for lead generation)
    - Authenticated users can view and update their profile
*/

-- Create diagnostic_results table
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  dimension_scores jsonb NOT NULL DEFAULT '{}',
  answers jsonb NOT NULL DEFAULT '{}',
  top_gaps jsonb DEFAULT '[]',
  action_plan jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert diagnostic results (for anonymous lead generation)
CREATE POLICY "Anyone can create diagnostic results"
  ON diagnostic_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can view their own results
CREATE POLICY "Users can view own diagnostic results"
  ON diagnostic_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own results
CREATE POLICY "Users can update own diagnostic results"
  ON diagnostic_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  business_name text,
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_user_id ON diagnostic_results(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_created_at ON diagnostic_results(created_at DESC);