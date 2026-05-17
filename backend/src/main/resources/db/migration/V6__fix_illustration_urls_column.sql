-- illustration_urls was TEXT[] but StringListConverter stores comma-separated TEXT
ALTER TABLE stories
    ALTER COLUMN illustration_urls TYPE TEXT
    USING array_to_string(illustration_urls, ',');
