-- Members table
CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(255) PRIMARY KEY,
  naam VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefoon VARCHAR(50),
  adres TEXT,
  burgerlijke_staat VARCHAR(50),
  contributietarief DECIMAL(10,2) DEFAULT 10.00,
  betaal_methode VARCHAR(50) DEFAULT 'Bank Transfer',
  registratie_datum DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY,
  member_id VARCHAR(255) REFERENCES members(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  payment_date DATE,
  payment_method VARCHAR(100),
  reference_note TEXT,
  status VARCHAR(50) DEFAULT 'Unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_id, month, year)
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT 'default',
  organization_name VARCHAR(255) DEFAULT 'PPME Al Ikhlash Amsterdam',
  contribution_married DECIMAL(10,2) DEFAULT 20.00,
  contribution_single DECIMAL(10,2) DEFAULT 10.00,
  currency VARCHAR(10) DEFAULT 'EUR',
  default_payment_method VARCHAR(100) DEFAULT 'Bank Transfer',
  language VARCHAR(10) DEFAULT 'nl',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
