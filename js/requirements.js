import { supabase } from './supabase.js';

export async function fetchRequirements(habitId) {
  const { data, error } = await supabase
    .from('habit_requirements')
    .select('*')
    .eq('habit_id', habitId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchAllRequirements(habitIds) {
  if (!habitIds.length) return [];

  const { data, error } = await supabase
    .from('habit_requirements')
    .select('*')
    .in('habit_id', habitIds)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function saveRequirements(habitId, requirements) {
  const existing = await fetchRequirements(habitId);
  const existingIds = existing.map((r) => r.id);
  const incomingIds = requirements.filter((r) => r.id).map((r) => r.id);

  const toDelete = existingIds.filter((id) => !incomingIds.includes(id));
  if (toDelete.length) {
    const { error } = await supabase
      .from('habit_requirements')
      .delete()
      .in('id', toDelete);
    if (error) throw error;
  }

  const toUpdate = requirements.filter((r) => r.id && existingIds.includes(r.id));
  const toInsert = requirements.filter((r) => !r.id || !existingIds.includes(r.id));

  const ops = [];

  if (toUpdate.length) {
    ops.push(
      ...toUpdate.map((req) =>
        supabase
          .from('habit_requirements')
          .update({ name: req.name, type: req.type, unit: req.unit, target_value: req.target_value, sort_order: req.sort_order })
          .eq('id', req.id)
      )
    );
  }

  if (toInsert.length) {
    ops.push(
      supabase
        .from('habit_requirements')
        .insert(toInsert.map((req) => ({
          habit_id: habitId, name: req.name, type: req.type, unit: req.unit, target_value: req.target_value, sort_order: req.sort_order,
        })))
    );
  }

  const results = await Promise.all(ops);
  for (const { error } of results) {
    if (error) throw error;
  }
}

export async function fetchRequirementLogs(habitId, date) {
  const { data, error } = await supabase
    .from('habit_requirement_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('log_date', date);

  if (error) throw error;
  return data;
}

export async function saveRequirementLogs(logs) {
  if (!logs.length) return;

  const { data: { user } } = await supabase.auth.getUser();

  const payload = logs.map((l) => ({
    requirement_id: l.requirement_id,
    habit_id: l.habit_id,
    user_id: user.id,
    log_date: l.log_date,
    iteration: l.iteration,
    value: l.value,
    fulfilled: l.fulfilled,
  }));

  const { error } = await supabase
    .from('habit_requirement_logs')
    .upsert(payload, { onConflict: 'requirement_id,log_date,iteration' });

  if (error) throw error;
}

export async function clearRequirementLogs(habitId, date) {
  const { error } = await supabase
    .from('habit_requirement_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('log_date', date);

  if (error) throw error;
}
