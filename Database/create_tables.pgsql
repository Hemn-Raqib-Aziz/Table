-- 2. Connect to the 'data' database before running this script

-- Create users table inside 'data' database
CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    age INTEGER,
    country VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP
);
