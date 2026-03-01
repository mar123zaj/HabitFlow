import { supabase } from './supabase.js';

export async function fetchLogs(habitId, startDate, endDate) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('log_date, count')
    .eq('habit_id', habitId)
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchAllLogs(habitIds, startDate, endDate) {
  if (!habitIds.length) return [];

  const { data, error } = await supabase
    .from('habit_logs')
    .select('habit_id, log_date, count')
    .in('habit_id', habitIds)
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function toggleLog(habitId, date, currentCount, dailyTarget) {
  const newCount = (currentCount + 1) % (dailyTarget + 1);

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        log_date: date,
        count: newCount,
      },
      { onConflict: 'habit_id,log_date' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
