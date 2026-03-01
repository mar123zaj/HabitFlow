-- HabitFlow — Database Schema
-- Apply via Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ── Tables ──

CREATE TABLE habits (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    icon        TEXT NOT NULL,
    color       TEXT NOT NULL,
    daily_target INT NOT NULL DEFAULT 1
        CONSTRAINT chk_habits_daily_target CHECK (daily_target BETWEEN 1 AND 99),
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ
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

-- ── Indexes ──

CREATE INDEX idx_habits_user ON habits(user_id, sort_order);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, log_date DESC);

-- ── Row Level Security ──

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY habits_user_policy ON habits
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY habit_logs_user_policy ON habit_logs
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
