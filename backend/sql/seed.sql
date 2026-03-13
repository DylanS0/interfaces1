-- Seed admin user.
-- Password hash is for: Admin1234
INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@theme.local',
  '$2b$12$p/VnHOfu0oRutPtV1KGAmumIG2auvFNimKBwuMJ1z5QVug2qXP7bW',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
