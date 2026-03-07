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

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({ email, type: 'signup', options: { emailRedirectTo: getAuthRedirectUrl() } });
  if (error) throw error;
}

const ERROR_MAP = {
  'Invalid login credentials': 'Incorrect email or password. Please try again.',
  'Email not confirmed': 'Please confirm your email first. Check your inbox.',
  'User already registered': 'An account with this email already exists. Try logging in.',
  'Password should be at least 6 characters': 'Password must be at least 6 characters.',
  'Email rate limit exceeded': 'Too many attempts. Please wait a moment and try again.',
  'For security purposes, you can only request this after': 'Please wait before requesting another email.',
};

export function mapAuthError(message) {
  if (!message) return 'Something went wrong. Please try again.';
  for (const [key, friendly] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return friendly;
  }
  return message;
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
