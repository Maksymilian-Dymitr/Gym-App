INSERT INTO users (email, password, role, height_cm, weight_kg, google_id) VALUES 
  ('maksymiliandymitr@chasacademy.se', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 171, 100, NULL) 
ON CONFLICT (email) DO NOTHING;
