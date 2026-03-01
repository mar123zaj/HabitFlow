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

export async function createHabit({ name, icon, color, dailyTarget }) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: user.id,
      name,
      icon,
      color,
      daily_target: dailyTarget,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(id, { name, icon, color, dailyTarget }) {
  const { data, error } = await supabase
    .from('habits')
    .update({
      name,
      icon,
      color,
      daily_target: dailyTarget,
    })
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
