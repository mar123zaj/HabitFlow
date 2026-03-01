-- Habit Enhancements: start_date, active_weekdays, description, requirements system

-- ── Extend habits table ──

ALTER TABLE habits ADD COLUMN start_date DATE;
ALTER TABLE habits ADD COLUMN active_weekdays INT[] DEFAULT '{1,2,3,4,5,6,0}';
ALTER TABLE habits ADD COLUMN description TEXT;
ALTER TABLE habits ADD CONSTRAINT habits_description_length CHECK (char_length(description) <= 256);

-- ── Habit Requirements ──

CREATE TABLE habit_requirements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id    UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('boolean', 'duration', 'distance', 'weight', 'count', 'custom')),
    unit        TEXT,
    target_value NUMERIC,
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_habit_requirements_habit ON habit_requirements(habit_id);

ALTER TABLE habit_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY habit_requirements_user_policy ON habit_requirements
    FOR ALL
    USING (habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid()))
    WITH CHECK (habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid()));

-- ── Habit Requirement Logs ──

CREATE TABLE habit_requirement_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id  UUID NOT NULL REFERENCES habit_requirements(id) ON DELETE CASCADE,
    habit_id        UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date        DATE NOT NULL,
    iteration       INT NOT NULL,
    value           NUMERIC,
    fulfilled       BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (requirement_id, log_date, iteration)
);

CREATE INDEX idx_habit_requirement_logs_habit_date ON habit_requirement_logs(habit_id, log_date);

ALTER TABLE habit_requirement_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY habit_requirement_logs_user_policy ON habit_requirement_logs
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
