# StoryFor.me — AI Personalized Bedtime Stories

## Product Overview

AI-powered personalized bedtime stories where the child IS the main character. Parents input child's name, age, interests → AI generates a unique story every night with audio narration and themed illustrations.

**Target Market:** English-speaking parents with children aged 2-10, globally.
**Pricing:** Freemium. Free: 1 story/day (text only, max 200 words). Pro $7.99/mo: unlimited stories with audio, illustrations, story library, printable PDFs.
**Revenue target:** 1000 paying users = ~$8K MRR.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| Frontend | Angular 18, TailwindCSS, Angular PWA |
| Database | PostgreSQL 16 |
| AI Story | Anthropic Claude Haiku 4.5 API |
| AI Voice | OpenAI TTS-1 API (english), ElevenLabs Flash v2.5 API (future: multilingual) |
| Illustrations | Pre-generated themed illustration sets (Phase 1), DALL-E/Flux (Phase 2) |
| Payments | Stripe Checkout + Stripe Billing (subscriptions) |
| Email | Resend API |
| Auth | Spring Security + JWT + Google OAuth2 |
| Deployment | Docker Compose on Contabo VPS |
| Reverse Proxy | Caddy (auto HTTPS) |
| Domain | storyfor.me (or similar, TBD) |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Caddy (HTTPS)                 │
│         storyfor.me → frontend:4200             │
│         api.storyfor.me → backend:8080          │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼───┐               ┌──────▼──────┐
│Angular│               │ Spring Boot │
│  PWA  │◄─── REST ────►│    API      │
└───────┘               └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
       ┌──────▼──────┐ ┌──────▼──────┐ ┌───────▼───────┐
       │ PostgreSQL  │ │ Claude API  │ │ OpenAI TTS    │
       │             │ │ (stories)   │ │ (audio)       │
       └─────────────┘ └─────────────┘ └───────────────┘
              │
       ┌──────▼──────┐
       │   Stripe    │
       │  (payments) │
       └─────────────┘
```

---

## Database Schema

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- null for OAuth users
    name VARCHAR(255),
    auth_provider VARCHAR(50) DEFAULT 'local', -- local, google
    auth_provider_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'free', -- free, pro, cancelled
    subscription_expires_at TIMESTAMP,
    stories_generated_today INT DEFAULT 0,
    stories_generated_total INT DEFAULT 0,
    last_story_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### children
```sql
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age BETWEEN 1 AND 12),
    gender VARCHAR(20), -- boy, girl, neutral
    interests TEXT[], -- e.g. {'dinosaurs', 'space', 'princesses', 'football'}
    favorite_animal VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_children_user_id ON children(user_id);
```

### stories
```sql
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    content_word_count INT NOT NULL,
    audio_url VARCHAR(500), -- S3/local path to mp3
    audio_duration_seconds INT,
    illustration_theme VARCHAR(100), -- forest, space, ocean, castle, etc.
    illustration_urls TEXT[], -- array of illustration image paths
    language VARCHAR(10) DEFAULT 'en',
    story_theme VARCHAR(100), -- adventure, friendship, courage, kindness
    is_favorite BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(100) DEFAULT 'claude-haiku-4-5',
    tts_model VARCHAR(100) DEFAULT 'openai-tts-1',
    generation_cost_cents INT, -- track cost per story for analytics
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_child_id ON stories(child_id);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
```

### subscription_events
```sql
CREATE TABLE subscription_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_event_id VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL, -- checkout.session.completed, invoice.paid, customer.subscription.deleted
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Auth
```
POST   /api/auth/register          - Email/password registration
POST   /api/auth/login             - Email/password login → JWT
POST   /api/auth/google            - Google OAuth2 callback
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/forgot-password   - Send reset email via Resend
POST   /api/auth/reset-password    - Reset password with token
```

### Children (profiles)
```
GET    /api/children               - List user's children
POST   /api/children               - Add child profile
PUT    /api/children/{id}          - Update child profile
DELETE /api/children/{id}          - Delete child profile
```

### Stories
```
POST   /api/stories/generate       - Generate new story (main endpoint)
GET    /api/stories                 - List user's stories (paginated)
GET    /api/stories/{id}           - Get single story with audio URL
PUT    /api/stories/{id}/favorite  - Toggle favorite
DELETE /api/stories/{id}           - Delete story
GET    /api/stories/{id}/audio     - Stream audio file
GET    /api/stories/{id}/pdf       - Generate printable PDF
```

### Subscription
```
POST   /api/subscription/checkout  - Create Stripe Checkout Session
GET    /api/subscription/status    - Get current subscription status
POST   /api/subscription/cancel    - Cancel subscription
POST   /api/webhooks/stripe        - Stripe webhook handler
```

### Public
```
GET    /api/health                 - Health check
GET    /api/demo/story             - Generate demo story (no auth, limited)
```

---

## Core Business Logic

### Story Generation Flow

```
1. User selects child profile + optional theme
2. Backend validates:
   - Free user: max 1 story/day, max 200 words, no audio
   - Pro user: unlimited, up to 600 words, with audio
3. Call Claude Haiku API with prompt
4. Store story text in DB
5. If Pro user: call OpenAI TTS-1 API → store MP3
6. Match illustration theme → attach pre-generated images
7. Return complete story object
```

### Claude Haiku Prompt Template

```
SYSTEM:
You are a children's bedtime story writer. You write warm, calming,
age-appropriate stories that help children fall asleep. The stories
always have a positive message and a peaceful ending.

Rules:
- The child named {child_name} is ALWAYS the main character
- Age-appropriate language for a {age}-year-old
- Include the child's interests: {interests}
- Story theme: {theme}
- Word count: exactly {word_count} words (200 for free, 500-600 for pro)
- Structure: beginning → small adventure → gentle resolution → sleepy ending
- End with the child falling asleep in the story
- Tone: warm, magical, soothing
- No scary elements, no villains, no conflict that isn't resolved
- Include sensory details (soft blankets, warm light, gentle breeze)

USER:
Write a bedtime story for {child_name}, a {age}-year-old {gender} who
loves {interests}. Tonight's theme is {theme}.
{optional: Include their favorite animal: {favorite_animal}}
```

### Story Themes (selectable by parent)
- Adventure & Exploration
- Friendship & Kindness
- Courage & Bravery
- Nature & Animals
- Space & Stars
- Under the Sea
- Magic & Fantasy
- Helping Others
- Random / Surprise Me

### Illustration System (Phase 1 - Pre-generated)

Pre-generate 10-15 illustration sets, each containing 3-4 images:

| Theme | Images |
|---|---|
| forest | forest_day.webp, forest_path.webp, forest_night.webp, forest_cozy.webp |
| space | space_stars.webp, space_planet.webp, space_ship.webp, space_sleep.webp |
| ocean | ocean_surface.webp, ocean_deep.webp, ocean_beach.webp, ocean_sunset.webp |
| castle | castle_gate.webp, castle_room.webp, castle_garden.webp, castle_bed.webp |
| meadow | meadow_flowers.webp, meadow_animals.webp, meadow_tree.webp, meadow_stars.webp |

Images are placed between story paragraphs in the reading view.
Style: soft watercolor, dreamy pastels, Ghibli-inspired warmth.

### Audio Generation

```java
// OpenAI TTS-1 integration
public byte[] generateAudio(String storyText, String voice) {
    // voice options: "nova" (warm female), "echo" (calm male),
    //               "shimmer" (gentle), "fable" (storyteller)
    // Default: "nova" - warm, maternal tone
    
    // Split story into chunks of max 4096 chars if needed
    // Generate MP3 for each chunk
    // Concatenate and return final MP3
    // Store in /data/audio/{storyId}.mp3
}
```

**Voice options presented to user:**
- "Luna" (nova) — warm, gentle female voice (default)
- "Atlas" (echo) — calm, soothing male voice
- "Willow" (shimmer) — soft, whispery voice
- "Sage" (fable) — classic storyteller voice

---

## Frontend Structure (Angular)

### Pages

```
/                       - Landing page (marketing)
/demo                   - Try demo story without signup
/login                  - Login page
/register               - Registration page
/app                    - Main app shell (authenticated)
/app/children           - Manage child profiles
/app/new-story          - Story creation wizard
/app/story/{id}         - Story reader (book view with audio player)
/app/library            - Story library (all past stories)
/app/favorites          - Favorite stories
/app/settings           - Account & subscription management
/app/subscribe          - Pricing / upgrade page
```

### Story Reader Component (key UX)

The story reader is the CORE experience. It must feel like a digital storybook:

```
┌──────────────────────────────────────────┐
│  ☽ Luna's Adventure in the Starry Woods  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │     [illustration_1.webp]        │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Once upon a time, little Luna walked    │
│  through a forest where the trees        │
│  sparkled with tiny golden lights...     │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │     [illustration_2.webp]        │    │
│  └──────────────────────────────────┘    │
│                                          │
│  She met a friendly owl who said...      │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  ▶   advancement   advancement    │    │
│  │   advancement_bar ━━━━━━━━━━━░░░ │    │
│  │  ◁ 2:15 / 4:30 ▷               │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ♡ Favorite    📄 PDF    ← Back         │
└──────────────────────────────────────────┘
```

- Dark mode by default (it's bedtime!)
- Large, readable serif font (Georgia/Merriweather)
- Audio auto-plays, text highlights as narration progresses (Phase 2)
- Swipe between pages on mobile
- Background: deep navy/dark purple gradient

### Landing Page Sections

1. Hero: "Every child deserves to be the hero of their own story" + demo CTA
2. How it works: 3 steps (add child → pick theme → listen)
3. Example story player (demo, no signup needed)
4. Social proof / testimonials
5. Pricing (Free vs Pro comparison)
6. FAQ
7. Footer

---

## Stripe Integration

### Products & Prices

```
Product: "StoryFor.me Pro"
Price: $7.99/month (USD), recurring
Trial: 7-day free trial (no card required for free tier, card for trial)
```

### Webhook Events to Handle

```
checkout.session.completed  → Activate Pro subscription
invoice.paid                → Renew subscription
invoice.payment_failed      → Mark subscription at risk, send email
customer.subscription.deleted → Downgrade to free
customer.subscription.updated → Handle plan changes
```

---

## Rate Limiting & Quotas

| User Type | Stories/Day | Word Count | Audio | Illustrations |
|---|---|---|---|---|
| Free | 1 | 200 max | No | 1 image |
| Pro | Unlimited* | 500-600 | Yes | 3-4 images |

*Pro soft limit: 20 stories/day to prevent abuse.

### API Rate Limits
- Auth endpoints: 5 requests/minute per IP
- Story generation: 3 requests/minute per user
- General API: 60 requests/minute per user

---

## Cost Per Story Breakdown

| Component | Free Story | Pro Story |
|---|---|---|
| Claude Haiku (text) | $0.001 | $0.003 |
| OpenAI TTS-1 (audio) | — | $0.045 |
| Illustrations | $0.00 | $0.00 |
| **Total** | **$0.001** | **$0.048** |

At 30 stories/month per Pro user: **~$1.44/month cost → $7.99 revenue = 82% margin**

---

## SEO & Growth Strategy

### Landing Pages (SSR or pre-rendered)
- /bedtime-stories-for-kids — main SEO page
- /personalized-bedtime-stories — alternate keyword
- /ai-bedtime-story-generator — tech-savvy parents
- /bedtime-stories-for-{age}-year-olds — age-specific (2-10)
- /bedtime-stories-about-{theme} — theme-specific pages

### Viral Mechanics
1. **Share story as image** — Auto-generate OG image with child's name + story title → parent shares on Instagram/Facebook
2. **Gift a story** — Send a free personalized story to a friend's child via email
3. **"My child is the hero"** — Shareable snippet card for social media

### Distribution Channels
- Product Hunt launch
- Parenting subreddits (r/parenting, r/daddit, r/mommit)
- Parenting Facebook groups
- TikTok: record screen of story being generated + child's reaction
- Instagram: story illustration cards
- Hacker News: Show HN (technical angle: how I built AI bedtime stories)

---

## Deployment (Docker Compose)

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/storyforme
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
    volumes:
      - audio-data:/data/audio
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "4200:80"

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=storyforme
      - POSTGRES_USER=storyforme
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pg-data:/var/lib/postgresql/data

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
      - caddy-config:/config

volumes:
  pg-data:
  audio-data:
  caddy-data:
  caddy-config:
```

### Caddyfile
```
storyfor.me {
    reverse_proxy frontend:4200
}

api.storyfor.me {
    reverse_proxy backend:8080
}
```

---

## MVP Scope (2 weeks)

### Week 1: Core
- [ ] Spring Boot project setup with security + JWT
- [ ] PostgreSQL schema + Flyway migrations
- [ ] User registration + login (email + Google OAuth)
- [ ] Child profile CRUD
- [ ] Story generation endpoint (Claude Haiku integration)
- [ ] Audio generation endpoint (OpenAI TTS-1)
- [ ] Story storage + retrieval API
- [ ] Angular app shell + routing + auth guards

### Week 2: Product
- [ ] Story reader component (book view + audio player)
- [ ] Story library page
- [ ] Landing page
- [ ] Demo story (no auth)
- [ ] Stripe Checkout integration + webhooks
- [ ] Free tier rate limiting
- [ ] Pre-generated illustration sets (commission or AI-generate 10 sets)
- [ ] Docker Compose + Caddy deployment to Contabo
- [ ] Domain purchase + DNS setup

### Post-MVP (Phase 2)
- [ ] Per-story AI illustration generation (DALL-E / Flux)
- [ ] Voice cloning (parent records 30 sec → ElevenLabs PVC)
- [ ] Text highlighting synced with audio playback
- [ ] Multiple languages (ElevenLabs multilingual)
- [ ] Story continuation ("Part 2 of last night's story")
- [ ] Printable PDF storybook (collect 10 stories → PDF book)
- [ ] Bedtime routine timer ("Story starts in 10 minutes!")
- [ ] Push notifications ("Time for tonight's story!")
- [ ] Referral program (invite friend → both get 1 week free)
- [ ] Annual plan ($59.99/year = 2 months free)
- [ ] Family plan ($12.99/mo, up to 4 children)

---

## Environment Variables

```env
# Database
DB_PASSWORD=<strong_password>

# APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
RESEND_API_KEY=re_...

# App
JWT_SECRET=<random_256bit>
APP_URL=https://storyfor.me
API_URL=https://api.storyfor.me
ALLOWED_ORIGINS=https://storyfor.me

# Email
FROM_EMAIL=hello@storyfor.me
```

---

## Key Technical Decisions

1. **No S3 for audio** — Store MP3 files on VPS disk (`/data/audio/`). At ~500KB per story and 1000 users × 30 stories = 15GB/month. Contabo VPS has 400GB+ disk. Migrate to S3 only if scaling beyond 10K users.

2. **No Redis for MVP** — Rate limiting via in-memory counters (Bucket4j or similar). Add Redis when needed for session management or caching at scale.

3. **No message queue** — Story + audio generation is synchronous in MVP. User waits ~5-8 seconds. Add async (RabbitMQ/Redis) if generation time becomes an issue.

4. **PWA first, no native apps** — Angular PWA with "Add to Home Screen" covers mobile. Native apps only if validated product-market fit.

5. **Flyway for migrations** — Version-controlled schema changes from day one.

6. **Pre-generated illustrations** — Commission 10-15 sets from Fiverr/AI-generated in consistent style. Much cheaper and faster than per-story generation. Users care about the STORY and VOICE, not unique illustrations per story.
