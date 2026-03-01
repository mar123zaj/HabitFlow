-- Add created_at timestamps to requirement tables

ALTER TABLE habit_requirements
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE habit_requirement_logs
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
