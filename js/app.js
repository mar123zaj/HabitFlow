import { requireAuth, signOut } from './auth.js';
import { fetchHabits } from './habits.js';
import { fetchAllLogs, toggleLog } from './logs.js';
import {
  renderHabitList,
  renderActionButton,
  getLocalDate,
  getDateRange,
  groupLogsByHabit,
} from './ui.js';

let habits = [];
let logsMap = {};

const habitListEl = document.getElementById('habit-list');
const headerDateEl = document.getElementById('header-date');
const logoutBtn = document.getElementById('logout-btn');

function formatHeaderDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

async function loadData() {
  habits = await fetchHabits();
  const { startDate, endDate } = getDateRange();
  const habitIds = habits.map((h) => h.id);
  const logs = await fetchAllLogs(habitIds, startDate, endDate);
  logsMap = groupLogsByHabit(logs);
  renderHabitList(habitListEl, habits, logsMap);
}

function updateDotVisual(dot, count, dailyTarget, color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  dot.dataset.count = count;
  if (count >= dailyTarget) {
    dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  } else if (count > 0) {
    dot.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
  } else {
    dot.style.backgroundColor = '';
  }
}

function replaceActionButton(card, habit, newCount) {
  const oldBtn = card.querySelector('.action-btn');
  const newBtn = renderActionButton(habit, newCount);
  newBtn.classList.add('bounce');
  oldBtn.replaceWith(newBtn);
}

function findHabitForCard(card) {
  const id = card.dataset.habitId;
  return habits.find((h) => h.id === id);
}

habitListEl.addEventListener('click', async (e) => {
  // Action button click
  const actionBtn = e.target.closest('.action-btn');
  if (actionBtn) {
    const card = actionBtn.closest('.habit-card');
    const habit = findHabitForCard(card);
    if (!habit) return;

    const today = getLocalDate();
    const currentCount = logsMap[habit.id]?.[today] || 0;
    const newCount = (currentCount + 1) % (habit.daily_target + 1);

    // Optimistic update
    if (!logsMap[habit.id]) logsMap[habit.id] = {};
    logsMap[habit.id][today] = newCount;
    replaceActionButton(card, habit, newCount);

    const todayDot = card.querySelector(`.dot[data-date="${today}"]`);
    if (todayDot) updateDotVisual(todayDot, newCount, habit.daily_target, habit.color);

    try {
      await toggleLog(habit.id, today, currentCount, habit.daily_target);
    } catch {
      // Revert on failure
      logsMap[habit.id][today] = currentCount;
      replaceActionButton(card, habit, currentCount);
      if (todayDot) updateDotVisual(todayDot, currentCount, habit.daily_target, habit.color);
    }
    return;
  }

  // Dot click
  const dot = e.target.closest('.dot');
  if (dot) {
    const card = dot.closest('.habit-card');
    const habit = findHabitForCard(card);
    if (!habit) return;

    const date = dot.dataset.date;
    const currentCount = parseInt(dot.dataset.count, 10) || 0;
    const newCount = (currentCount + 1) % (habit.daily_target + 1);

    // Optimistic update
    if (!logsMap[habit.id]) logsMap[habit.id] = {};
    logsMap[habit.id][date] = newCount;
    updateDotVisual(dot, newCount, habit.daily_target, habit.color);

    const today = getLocalDate();
    if (date === today) {
      replaceActionButton(card, habit, newCount);
    }

    try {
      await toggleLog(habit.id, date, currentCount, habit.daily_target);
    } catch {
      // Revert on failure
      logsMap[habit.id][date] = currentCount;
      updateDotVisual(dot, currentCount, habit.daily_target, habit.color);
      if (date === today) {
        replaceActionButton(card, habit, currentCount);
      }
    }
  }
});

logoutBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to log out?')) {
    await signOut();
    window.location.replace('login.html');
  }
});

// Init
headerDateEl.textContent = formatHeaderDate();

requireAuth().then((session) => {
  if (session) loadData();
});
