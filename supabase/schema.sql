-- HabitFlow — Database Schema
-- Apply via Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ── Tables ──

CREATE TABLE habits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    icon            TEXT NOT NULL,
    color           TEXT NOT NULL,
    daily_target    INT NOT NULL DEFAULT 1
        CONSTRAINT chk_habits_daily_target CHECK (daily_target BETWEEN 1 AND 99),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at     TIMESTAMPTZ,
    start_date      DATE,
    active_weekdays INT[] DEFAULT '{1,2,3,4,5,6,0}',
    description     TEXT
        CONSTRAINT habits_description_length CHECK (char_length(description) <= 256)
);

CREATE TABLE habit_logs (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id  UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date  DATE NOT NULL,
    count     INT NOT NULL DEFAULT 0
        CONSTRAINT chk_habit_logs_count CHECK (count >= 0),
    UNIQUE (habit_id, log_date)
);

CREATE TABLE habit_requirements (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id     UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    type         TEXT NOT NULL CHECK (type IN ('boolean', 'duration', 'distance', 'weight', 'count', 'custom')),
    unit         TEXT,
    target_value NUMERIC,
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE habit_requirement_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id  UUID NOT NULL REFERENCES habit_requirements(id) ON DELETE CASCADE,
    habit_id        UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date        DATE NOT NULL,
    iteration       INT NOT NULL,
    value           NUMERIC,
    fulfilled       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (requirement_id, log_date, iteration)
);

-- ── Indexes ──

CREATE INDEX idx_habits_user ON habits(user_id, sort_order);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, log_date DESC);
CREATE INDEX idx_habit_requirements_habit ON habit_requirements(habit_id);
CREATE INDEX idx_habit_requirement_logs_habit_date ON habit_requirement_logs(habit_id, log_date);

-- ── Row Level Security ──

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_requirement_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY habits_user_policy ON habits
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY habit_logs_user_policy ON habit_logs
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY habit_requirements_user_policy ON habit_requirements
    FOR ALL
    USING (habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid()))
    WITH CHECK (habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid()));

CREATE POLICY habit_requirement_logs_user_policy ON habit_requirement_logs
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
