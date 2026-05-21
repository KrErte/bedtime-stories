ALTER TABLE children ALTER COLUMN interests TYPE TEXT USING array_to_string(interests, ',');
