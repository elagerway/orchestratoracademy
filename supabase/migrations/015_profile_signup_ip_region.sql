-- Track signup IP and region for admin visibility
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_ip text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_region text;
