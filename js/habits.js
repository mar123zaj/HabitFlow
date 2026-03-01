import { supabase } from './supabase.js';

export async function fetchHabits() {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getHabitById(id) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createHabit({ name, icon, color, dailyTarget, startDate, activeWeekdays, description }) {
  const { data: { user } } = await supabase.auth.getUser();

  const payload = {
    user_id: user.id,
    name,
    icon,
    color,
    daily_target: dailyTarget,
  };

  if (startDate) payload.start_date = startDate;
  if (activeWeekdays) payload.active_weekdays = activeWeekdays;
  if (description) payload.description = description;

  const { data, error } = await supabase
    .from('habits')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(id, { name, icon, color, dailyTarget, startDate, activeWeekdays, description }) {
  const payload = {
    name,
    icon,
    color,
    daily_target: dailyTarget,
    start_date: startDate || null,
    active_weekdays: activeWeekdays || [1, 2, 3, 4, 5, 6, 0],
    description: description || null,
  };

  const { data, error } = await supabase
    .from('habits')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(id) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
