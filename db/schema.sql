-- create DB and tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pi_wallet TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  module TEXT,
  title TEXT,
  synopsis TEXT,
  diff TEXT,
  length_min INT,
  is_premium BOOLEAN DEFAULT false,
  reward JSONB,
  steps JSONB,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  story_id TEXT REFERENCES stories(id) ON DELETE SET NULL,
  choices JSONB,
  points INT,
  items JSONB,
  emotions JSONB,
  snapshot_urls JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT,
  synopsis TEXT,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  amount_pi NUMERIC,
  type TEXT,
  status TEXT,
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT now()
);
