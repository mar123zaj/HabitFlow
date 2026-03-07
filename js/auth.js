import { supabase } from './supabase.js';

function getAuthRedirectUrl() {
  return window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'login.html';
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: getAuthRedirectUrl() } });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: getAuthRedirectUrl() });
  if (error) throw error;
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return data;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.replace('login.html');
    return null;
  }
  return session;
}
