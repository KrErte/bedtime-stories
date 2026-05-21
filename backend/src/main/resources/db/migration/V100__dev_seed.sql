-- Dev seed: test kasutaja test@test.com / test123 (pro)
INSERT INTO users (id, email, password_hash, name, auth_provider, subscription_status, stories_generated_today, stories_generated_total, created_at)
VALUES (
    gen_random_uuid(),
    'test@test.com',
    '$2a$10$tzq7S9JfsyvEMdjeT9YTN.rqxMzkhI78bI2iCgAkx9wHpGkxTc1Sm',
    'Test',
    'local',
    'pro',
    0,
    0,
    NOW()
)
ON CONFLICT (email) DO UPDATE SET subscription_status = 'pro';
