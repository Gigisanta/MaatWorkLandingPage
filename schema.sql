-- ===========================================
-- Maatwork Database Schema for Neon
-- ===========================================
-- Run this script in Neon Console or via psql
-- to create the required table for the landing page
-- ===========================================

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  industria VARCHAR(255) NOT NULL,
  problema TEXT NOT NULL,
  procesos TEXT[] NOT NULL,
  presupuesto VARCHAR(100),
  timeline VARCHAR(100),
  source VARCHAR(100) DEFAULT 'landing_page',
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Create index for source tracking
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Grant permissions (adjust as needed for your Neon setup)
-- Neon uses role-based access, so you may need to adjust ownership

COMMENT ON TABLE leads IS 'Stores lead submissions from the Maatwork landing page';
COMMENT ON COLUMN leads.nombre IS 'Contact full name';
COMMENT ON COLUMN leads.whatsapp IS 'WhatsApp phone number';
COMMENT ON COLUMN leads.email IS 'Optional email address';
COMMENT ON COLUMN leads.industria IS 'Industry sector';
COMMENT ON COLUMN leads.problema IS 'Main problem described by the lead';
COMMENT ON COLUMN leads.procesos IS 'Array of selected process types';
COMMENT ON COLUMN leads.presupuesto IS 'Budget range selected';
COMMENT ON COLUMN leads.timeline IS 'Timeline/urgency selection';
COMMENT ON COLUMN leads.source IS 'Lead source tracking (default: landing_page)';
COMMENT ON COLUMN leads.ip_address IS 'IP address of the submitter';
COMMENT ON COLUMN leads.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN leads.created_at IS 'Timestamp of submission';