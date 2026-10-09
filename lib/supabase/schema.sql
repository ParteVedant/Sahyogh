-- =================================================================
-- SAHYOG (सहयोग) — SUPABASE POSTGRESQL DATABASE SCHEMA
-- =================================================================

-- 1. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT,
    sub_services TEXT[] DEFAULT '{}',
    base_price NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKERS TABLE
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    worker_code VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    skills TEXT[] DEFAULT '{}',
    rating NUMERIC(3,2) DEFAULT 5.00,
    jobs_completed INT DEFAULT 0,
    society_name VARCHAR(150) NOT NULL,
    service_areas TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    available_now BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS service_requests (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    problem_description TEXT NOT NULL,
    consumer_name VARCHAR(100) NOT NULL,
    consumer_phone VARCHAR(20) NOT NULL,
    address JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'REQUESTED',
    assigned_worker_id VARCHAR(50) REFERENCES workers(id) ON DELETE SET NULL,
    preferred_date VARCHAR(50),
    preferred_time_slot VARCHAR(50),
    amount JSONB,
    completion_notes TEXT,
    evidence_photos TEXT[] DEFAULT '{}',
    rating JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- SEED DATA INSERTIONS
-- =================================================================

INSERT INTO categories (id, name, hindi_name, icon_name, description, sub_services, base_price) VALUES
('plumbing', 'Plumbing Repairs', 'नल-प्लंबिंग सेवा', 'Wrench', 'Fix leaks, pipe installations, bathroom fitting repairs, and drainage unclogging by certified plumbers.', ARRAY['Pipe Leak Repair', 'Tap Installation', 'P-Trap Replacement', 'Drain Unclogging'], 350.00),
('electrical', 'Electrical Wiring & Appliances', 'बिजली और उपकरण', 'Zap', 'Circuit breaker fixes, ceiling fan installation, short circuit diagnosis, and safety inspections.', ARRAY['Fan Installation', 'MCB Tripping Fix', 'Switchboard Repair', 'Wiring Inspection'], 400.00),
('cleaning', 'Deep House Cleaning', 'घर की गहरी सफाई', 'Sparkles', 'Full house deep cleaning, bathroom sanitation, kitchen degreasing, and sofa shampooing.', ARRAY['2BHK Deep Clean', 'Kitchen Sanitation', 'Bathroom Scrubbing', 'Sofa Shampooing'], 800.00),
('painting', 'Wall Painting & Touch-up', 'दीवार पुताई व पेंट', 'Paintbrush', 'Interior wall touch-ups, waterproof coating, dampness treatment, and full room painting.', ARRAY['Wall Touch-up', 'Dampness Treatment', 'Waterproof Paint', 'Color Coating'], 600.00),
('carpentry', 'Furniture Repair & Carpentry', 'बढ़ईगीरी व फर्नीचर', 'Hammer', 'Door hinge alignment, cabinet repairs, custom wood fitting, and lock installations.', ARRAY['Hinge Alignment', 'Cabinet Repair', 'Lock Installation', 'Wood Polishing'], 450.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO workers (id, name, worker_code, phone, skills, rating, jobs_completed, society_name, service_areas, status, available_now) VALUES
('worker-1', 'Suresh Kumar', 'W-042', '+91 98201 12345', ARRAY['Plumbing', 'Pipe Repair'], 4.6, 142, 'Shivaji Labour Cooperative Society', ARRAY['Thane', 'Kalwa', 'Majiwada'], 'AVAILABLE', TRUE),
('worker-2', 'Amit Sharma', 'W-041', '+91 98200 11223', ARRAY['Plumbing', 'Sanitation'], 4.8, 18, 'Shivaji Labour Cooperative Society', ARRAY['Borivali East', 'Kandivali West'], 'AVAILABLE', TRUE),
('worker-3', 'Ramesh Patil', 'W-043', '+91 98202 33445', ARRAY['Electrical', 'Wiring'], 4.7, 12, 'Dharavi Skilled Workers Federation', ARRAY['Kalwa', 'Thane West'], 'BUSY', FALSE),
('worker-4', 'Vijay Kumar', 'W-044', '+91 98203 44556', ARRAY['Painting', 'Coatings'], 4.5, 6, 'Shivaji Labour Cooperative Society', ARRAY['Panch Pakhadi', 'Thane'], 'AVAILABLE', TRUE),
('worker-5', 'Karan Singh', 'W-045', '+91 98204 55667', ARRAY['Cleaning', 'Sanitation'], 4.4, 4, 'Dharavi Skilled Workers Federation', ARRAY['Majiwada', 'Thane'], 'OFFLINE', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_requests (id, category_id, category_name, title, problem_description, consumer_name, consumer_phone, address, status, assigned_worker_id, preferred_date, preferred_time_slot, amount) VALUES
('1042', 'plumbing', 'Plumbing Repairs', 'Pipe leakage repair', 'Bathroom pipe is leaking near the sink. Water is pooling on the floor — would like it looked at today if possible.', 'Rahul Sharma', '+91 98199 88776', '{"houseNo": "Flat 402, Building A", "locality": "Thane, Maharashtra", "pinCode": "400601"}'::jsonb, 'IN_PROGRESS', 'worker-1', '2026-08-28', '10:00 AM', '{"base": 350, "fee": 50, "tax": 72, "total": 472}'::jsonb),
('1043', 'electrical', 'Electrical Wiring & Appliances', 'Ceiling fan installation', 'New ceiling fan needs to be mounted and wired in the living room.', 'Priya Verma', '+91 98200 99887', '{"houseNo": "Flat 101, B Wing", "locality": "Kalwa, Thane", "pinCode": "400605"}'::jsonb, 'WORKER_ASSIGNED', 'worker-3', '2026-08-28', '11:00 AM', '{"base": 400, "fee": 50, "tax": 81, "total": 531}'::jsonb)
ON CONFLICT (id) DO NOTHING;
