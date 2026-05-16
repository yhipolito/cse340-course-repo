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