CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    content_word_count INT NOT NULL,
    audio_url VARCHAR(500),
    audio_duration_seconds INT,
    illustration_theme VARCHAR(100),
    illustration_urls TEXT[],
    language VARCHAR(10) DEFAULT 'en',
    story_theme VARCHAR(100),
    is_favorite BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(100) DEFAULT 'claude-haiku-4-5',
    tts_model VARCHAR(100) DEFAULT 'openai-tts-1',
    generation_cost_cents INT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_child_id ON stories(child_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
