-- Initialize Gbawo Finance Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create additional databases if needed
-- CREATE DATABASE gbawo_finance_test;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a schema for the application (optional, but good practice)
-- CREATE SCHEMA IF NOT EXISTS finance;

-- Set timezone
SET timezone = 'UTC';

-- Log the initialization
DO $$
BEGIN
    RAISE NOTICE 'Gbawo Finance database initialized successfully at %', NOW();
END $$; 