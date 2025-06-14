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






-- Create a new sequence starting from max(id) + 1 or 1 if table empty
CREATE SEQUENCE users_id_seq START 1;

-- Set the default value of id column to use that sequence
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

-- Set the sequence current value to max(id) in users table, so it doesn't conflict
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM public.users));




-- inserting 100 records of data into the 'user' table
INSERT INTO public.users (name, email, age, country, role, is_active, created_at, updated_at) VALUES
('Alice Smith', 'alice.smith@example.com', 28, 'USA', 'user', true, now(), NULL),
('Bob Johnson', 'bob.johnson@example.com', 35, 'Canada', 'user', true, now(), NULL),
('Carol Lee', 'carol.lee@example.com', 42, 'UK', 'admin', true, now(), NULL),
('David Kim', 'david.kim@example.com', 30, 'South Korea', 'user', true, now(), NULL),
('Eva Martinez', 'eva.martinez@example.com', 25, 'Mexico', 'user', true, now(), NULL),
('Frank Wilson', 'frank.wilson@example.com', 38, 'Australia', 'user', true, now(), NULL),
('Grace Chen', 'grace.chen@example.com', 27, 'China', 'user', true, now(), NULL),
('Hannah Patel', 'hannah.patel@example.com', 31, 'India', 'user', true, now(), NULL),
('Ian Brown', 'ian.brown@example.com', 29, 'USA', 'user', true, now(), NULL),
('Jane Doe', 'jane.doe@example.com', 33, 'UK', 'user', true, now(), NULL),
('Kyle Nguyen', 'kyle.nguyen@example.com', 26, 'Vietnam', 'user', true, now(), NULL),
('Laura Garcia', 'laura.garcia@example.com', 45, 'Spain', 'admin', true, now(), NULL),
('Michael Scott', 'michael.scott@example.com', 40, 'USA', 'user', true, now(), NULL),
('Nina Rossi', 'nina.rossi@example.com', 36, 'Italy', 'user', true, now(), NULL),
('Oscar Silva', 'oscar.silva@example.com', 34, 'Brazil', 'user', true, now(), NULL),
('Paula Kim', 'paula.kim@example.com', 28, 'South Korea', 'user', true, now(), NULL),
('Quinn Jackson', 'quinn.jackson@example.com', 30, 'Canada', 'user', true, now(), NULL),
('Rachel Adams', 'rachel.adams@example.com', 32, 'USA', 'user', true, now(), NULL),
('Samir Hassan', 'samir.hassan@example.com', 29, 'Egypt', 'user', true, now(), NULL),
('Tina Brooks', 'tina.brooks@example.com', 27, 'UK', 'user', true, now(), NULL),
('Umar Khan', 'umar.khan@example.com', 31, 'Pakistan', 'user', true, now(), NULL),
('Vera Petrov', 'vera.petrov@example.com', 38, 'Russia', 'user', true, now(), NULL),
('Will Turner', 'will.turner@example.com', 33, 'USA', 'user', true, now(), NULL),
('Xiang Li', 'xiang.li@example.com', 26, 'China', 'user', true, now(), NULL),
('Yara Silva', 'yara.silva@example.com', 29, 'Brazil', 'user', true, now(), NULL),
('Zane Cooper', 'zane.cooper@example.com', 35, 'Australia', 'admin', true, now(), NULL),
('Amy White', 'amy.white@example.com', 30, 'UK', 'user', true, now(), NULL),
('Ben Wright', 'ben.wright@example.com', 28, 'USA', 'user', true, now(), NULL),
('Cathy Young', 'cathy.young@example.com', 34, 'Canada', 'user', true, now(), NULL),
('Danielle Green', 'danielle.green@example.com', 32, 'USA', 'user', true, now(), NULL),
('Aaron Blake', 'aaron.blake@example.com', 29, 'USA', 'user', true, now(), NULL),
('Bianca Cruz', 'bianca.cruz@example.com', 33, 'Mexico', 'user', true, now(), NULL),
('Charles Davis', 'charles.davis@example.com', 41, 'UK', 'admin', true, now(), NULL),
('Diana Evans', 'diana.evans@example.com', 27, 'Canada', 'user', true, now(), NULL),
('Ethan Ford', 'ethan.ford@example.com', 35, 'Australia', 'user', true, now(), NULL),
('Fiona Gray', 'fiona.gray@example.com', 30, 'Ireland', 'user', true, now(), NULL),
('George Hill', 'george.hill@example.com', 36, 'USA', 'user', true, now(), NULL),
('Holly Ivers', 'holly.ivers@example.com', 28, 'UK', 'user', true, now(), NULL),
('Isaac Jones', 'isaac.jones@example.com', 31, 'South Africa', 'user', true, now(), NULL),
('Jasmine King', 'jasmine.king@example.com', 25, 'New Zealand', 'user', true, now(), NULL),
('Kevin Lee', 'kevin.lee@example.com', 34, 'South Korea', 'user', true, now(), NULL),
('Lily Moore', 'lily.moore@example.com', 29, 'USA', 'user', true, now(), NULL),
('Mark Nelson', 'mark.nelson@example.com', 40, 'Canada', 'admin', true, now(), NULL),
('Nora Owens', 'nora.owens@example.com', 32, 'UK', 'user', true, now(), NULL),
('Owen Parker', 'owen.parker@example.com', 27, 'USA', 'user', true, now(), NULL),
('Pamela Quinn', 'pamela.quinn@example.com', 31, 'Ireland', 'user', true, now(), NULL),
('Quincy Reed', 'quincy.reed@example.com', 38, 'Australia', 'user', true, now(), NULL),
('Rebecca Smith', 'rebecca.smith@example.com', 33, 'USA', 'user', true, now(), NULL),
('Steven Taylor', 'steven.taylor@example.com', 35, 'UK', 'user', true, now(), NULL),
('Tracy Underwood', 'tracy.underwood@example.com', 29, 'Canada', 'user', true, now(), NULL),
('Uma Vasquez', 'uma.vasquez@example.com', 28, 'Mexico', 'user', true, now(), NULL),
('Victor White', 'victor.white@example.com', 34, 'USA', 'user', true, now(), NULL),
('Wendy Xu', 'wendy.xu@example.com', 26, 'China', 'user', true, now(), NULL),
('Xavier Young', 'xavier.young@example.com', 30, 'UK', 'user', true, now(), NULL),
('Yvonne Zimmerman', 'yvonne.zimmerman@example.com', 31, 'Germany', 'user', true, now(), NULL),
('Zachary Allen', 'zachary.allen@example.com', 37, 'USA', 'admin', true, now(), NULL),
('Amy Brooks', 'amy.brooks@example.com', 28, 'Canada', 'user', true, now(), NULL),
('Brian Carter', 'brian.carter@example.com', 33, 'USA', 'user', true, now(), NULL),
('Cynthia Diaz', 'cynthia.diaz@example.com', 30, 'Spain', 'user', true, now(), NULL),
('Derek Edwards', 'derek.edwards@example.com', 35, 'UK', 'user', true, now(), NULL),
('Alex Foster', 'alex.foster@example.com', 27, 'USA', 'user', true, now(), NULL),
('Bella Gomez', 'bella.gomez@example.com', 31, 'Mexico', 'user', true, now(), NULL),
('Carl Howard', 'carl.howard@example.com', 36, 'UK', 'user', true, now(), NULL),
('Diana Irwin', 'diana.irwin@example.com', 29, 'Canada', 'user', true, now(), NULL),
('Eli Johnson', 'eli.johnson@example.com', 34, 'Australia', 'user', true, now(), NULL),
('Faye Kim', 'faye.kim@example.com', 28, 'South Korea', 'user', true, now(), NULL),
('Gavin Lee', 'gavin.lee@example.com', 32, 'USA', 'admin', true, now(), NULL),
('Holly Martinez', 'holly.martinez@example.com', 26, 'Spain', 'user', true, now(), NULL),
('Ian Nelson', 'ian.nelson@example.com', 33, 'UK', 'user', true, now(), NULL),
('Jill Owens', 'jill.owens@example.com', 30, 'USA', 'user', true, now(), NULL),
('Kyle Patterson', 'kyle.patterson@example.com', 35, 'Canada', 'user', true, now(), NULL),
('Lara Quinn', 'lara.quinn@example.com', 29, 'Ireland', 'user', true, now(), NULL),
('Mike Roberts', 'mike.roberts@example.com', 31, 'USA', 'user', true, now(), NULL),
('Nina Sanchez', 'nina.sanchez@example.com', 27, 'Mexico', 'user', true, now(), NULL),
('Oliver Thomas', 'oliver.thomas@example.com', 38, 'UK', 'user', true, now(), NULL),
('Paula Upton', 'paula.upton@example.com', 32, 'USA', 'user', true, now(), NULL),
('Quentin Vega', 'quentin.vega@example.com', 34, 'Canada', 'admin', true, now(), NULL),
('Rita Walker', 'rita.walker@example.com', 30, 'Australia', 'user', true, now(), NULL),
('Sam Young', 'sam.young@example.com', 28, 'USA', 'user', true, now(), NULL),
('Tina Zimmerman', 'tina.zimmerman@example.com', 33, 'UK', 'user', true, now(), NULL),
('Ulysses Brooks', 'ulysses.brooks@example.com', 35, 'Canada', 'user', true, now(), NULL),
('Violet Clark', 'violet.clark@example.com', 29, 'USA', 'user', true, now(), NULL),
('Walter Diaz', 'walter.diaz@example.com', 31, 'Mexico', 'user', true, now(), NULL),
('Xena Edwards', 'xena.edwards@example.com', 27, 'UK', 'user', true, now(), NULL),
('Yusuf Farah', 'yusuf.farah@example.com', 34, 'Somalia', 'user', true, now(), NULL),
('Zara Green', 'zara.green@example.com', 30, 'USA', 'user', true, now(), NULL),
('Aaron Hill', 'aaron.hill@example.com', 33, 'Canada', 'user', true, now(), NULL),
('Bethany Irvine', 'bethany.irvine@example.com', 28, 'UK', 'user', true, now(), NULL),
('Charlie Jenkins', 'charlie.jenkins@example.com', 31, 'USA', 'user', true, now(), NULL),
('Denise Kelly', 'denise.kelly@example.com', 29, 'Australia', 'user', true, now(), NULL),
('Evan Lewis', 'evan.lewis@example.com', 35, 'Canada', 'admin', true, now(), NULL),
('Faith Miller', 'faith.miller@example.com', 27, 'USA', 'user', true, now(), NULL),
('Gordon Norris', 'gordon.norris@example.com', 32, 'UK', 'user', true, now(), NULL),
('Hailey Owens', 'hailey.owens@example.com', 30, 'USA', 'user', true, now(), NULL),
('Ian Parker', 'ian.parker@example.com', 34, 'Canada', 'user', true, now(), NULL),
('Jenna Quinn', 'jenna.quinn@example.com', 28, 'Australia', 'user', true, now(), NULL),
('Keith Reynolds', 'keith.reynolds@example.com', 31, 'USA', 'user', true, now(), NULL),
('Leah Simmons', 'leah.simmons@example.com', 29, 'UK', 'user', true, now(), NULL);
