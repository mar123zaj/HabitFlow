-- Migration 001: Expand daily_target range from 1-3 to 1-99
-- Run in: Supabase Dashboard → SQL Editor → New query

ALTER TABLE habits DROP CONSTRAINT chk_habits_daily_target;
ALTER TABLE habits ADD CONSTRAINT chk_habits_daily_target CHECK (daily_target BETWEEN 1 AND 99);
