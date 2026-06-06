-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- to check if your table has been created:
-- SELECT * FROM organization; 

-- ========================================
-- Service Projects Table Setup
-- ========================================
CREATE TABLE IF NOT EXISTS service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

-- 2. Clean slate: Clear any old data and reset the ID counter to 1
TRUNCATE TABLE service_project RESTART IDENTITY CASCADE;

-- 3. Insert your 15 required sample projects (5 per organization)
INSERT INTO service_project (organization_id, title, description, location, date)
VALUES
(1, 'Community Center Repair', 'Repairing the roof and painting the main hall.', 'Downtown Community Center', '2026-06-15'),
(1, 'Park Bench Installation', 'Building and installing 10 new sustainable wood benches.', 'Greenwood Park', '2026-06-22'),
(1, 'Wheelchair Ramp Build', 'Constructing access ramps for local community members.', 'Westside Suburb District', '2026-07-05'),
(1, 'Library Bookshelf Renovation', 'Sanding and mounting new shelves in the kids learning zone.', 'Public Library Branch B', '2026-07-19'),
(1, 'Shelter Fence Restore', 'Replacing broken chain links with a secure perimeter fence.', 'Hope Emergency Shelter', '2026-08-02'),

(2, 'Spring Seed Planting', 'Sowing organic tomato, pepper, and herb seeds.', 'Northside Urban Farm', '2026-05-20'),
(2, 'Compost Bin Construction', 'Assembling multi-tiered wooden compost stations.', 'East End Community Garden', '2026-06-01'),
(2, 'Rain Barrel Installation', 'Setting up eco-friendly water collection systems.', 'Northside Urban Farm', '2026-06-14'),
(2, 'Youth Gardening Workshop', 'Teaching local school kids soil management.', 'Central Education Plot', '2026-06-28'),
(2, 'Harvest and Donation Day', 'Gathering ripe produce for delivery to food banks.', 'East End Community Garden', '2026-07-12'),

(3, 'Senior Center Games Day', 'Hosting a board game and social afternoon for residents.', 'Silver Linings Care Home', '2026-05-30'),
(3, 'Food Pantry Sorting', 'Organizing incoming canned goods into categories.', 'Unity Food Bank Warehouse', '2026-06-10'),
(3, 'School Supply Packing', 'Stuffing 500 backpacks with notebooks and pencils.', 'City Youth Center', '2026-07-01'),
(3, 'Riverside Clean-up', 'Collecting plastic trash along the nature trail.', 'Scenic River Walkway', '2026-07-15'),
(3, 'Soup Kitchen Dinner Shift', 'Preparing and serving hot meals during evening hours.', 'Downtown Kitchen Facility', '2026-07-25');

-- 4. Verify that all 15 rows exist in your Render database right now
SELECT project_id, title, location FROM service_project;

-- ========================================
-- Categories Table
-- ========================================
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Junction Table: Many-to-Many Link
-- ========================================
CREATE TABLE IF NOT EXISTS project_category (
    project_id INT NOT NULL REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id) -- Prevents assigning the same category twice
);

-- Wipe old junction and category data to reset the state cleanly
TRUNCATE TABLE project_category, category RESTART IDENTITY CASCADE;

-- ========================================
-- Insert Sample Data: Categories
-- ========================================
INSERT INTO category (name)
VALUES 
('Construction & Repair'),
('Environmental & Agriculture'),
('Community Outreach & Care');

-- ========================================
-- Insert Sample Data: Project Linkages
-- ========================================
-- This links all 15 of your existing projects to at least one category.
INSERT INTO project_category (project_id, category_id)
VALUES
-- 🏢 Projects 1 to 5 belong to Category 1 (Construction & Repair)
(1, 1), 
(2, 1), 
(3, 1), 
(4, 1), 
(5, 1),

-- 🚜 Projects 6 to 10 belong to Category 2 (Environmental & Agriculture)
(6, 2), 
(7, 2), 
(8, 2), 
(9, 2), 
(10, 2),

-- 🤝 Projects 11 to 15 belong to Category 3 (Community Outreach & Care)
(11, 3), 
(12, 3), 
(13, 3), 
(14, 3), 
(15, 3),

-- Cross-linking extra tags to satisfy "one or more" requirement:
(2, 2),  -- Park Bench installation also relates to Environment
(14, 2); -- Riverside Cleanup also relates to Environment

-- Verification query to check your work in pgAdmin
SELECT p.title, c.name AS category_name
FROM project_category pc
JOIN service_project p USING (project_id)
JOIN category c USING (category_id)
ORDER BY c.name, p.title;

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);