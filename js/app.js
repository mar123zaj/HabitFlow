import { requireAuth, signOut } from './auth.js';
import { fetchHabits } from './habits.js';
import { fetchAllLogs, toggleLog } from './logs.js';
import { fetchAllRequirements, fetchRequirementLogs, saveRequirementLogs, clearRequirementLogs } from './requirements.js';
import {
  renderHabitList,
  renderActionButton,
  getLocalDate,
  getDateRange,
  groupLogsByHabit,
  hexToRgb,
} from './ui.js';

let habits = [];
let logsMap = {};
let requirementsMap = {};
let selectedDate = getLocalDate();

const habitListEl = document.getElementById('habit-list');
const headerDateEl = document.getElementById('header-date');
const datePrevBtn = document.getElementById('date-prev');
const dateNextBtn = document.getElementById('date-next');
const logoutBtn = document.getElementById('logout-btn');

const popupOverlay = document.getElementById('req-popup-overlay');
const popupHeader = document.getElementById('req-popup-header');
const popupBody = document.getElementById('req-popup-body');
const popupActions = document.getElementById('req-popup-actions');
const popupSubmit = document.getElementById('req-popup-submit');
const popupCancel = document.getElementById('req-popup-cancel');
const popupConfirm = document.getElementById('req-popup-confirm');
const popupSkip = document.getElementById('req-popup-skip');
const popupPartial = document.getElementById('req-popup-partial');
const popupComplete = document.getElementById('req-popup-complete');

function updateHeaderDate(date) {
  const today = getLocalDate();
  const isToday = date === today;

  if (isToday) {
    headerDateEl.textContent = 'Today';
    headerDateEl.classList.add('header__date--today');
  } else {
    const d = new Date(date + 'T00:00:00');
    headerDateEl.textContent = d.toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    headerDateEl.classList.remove('header__date--today');
  }

  const { startDate } = getDateRange();
  datePrevBtn.disabled = date <= startDate;
  datePrevBtn.classList.toggle('date-nav__arrow--disabled', date <= startDate);
  dateNextBtn.disabled = isToday;
  dateNextBtn.classList.toggle('date-nav__arrow--disabled', isToday);
}

function updateAllActionButtons(date) {
  for (const card of habitListEl.querySelectorAll('.habit-card')) {
    const habit = findHabitForCard(card);
    if (!habit) continue;
    const count = logsMap[habit.id]?.[date] || 0;
    replaceActionButton(card, habit, count);
  }
}

function updateDotHighlight(date) {
  const today = getLocalDate();
  for (const card of habitListEl.querySelectorAll('.habit-card')) {
    for (const dot of card.querySelectorAll('.dot--selected')) {
      dot.classList.remove('dot--selected');
    }
    if (date !== today) {
      const dot = card.querySelector(`.dot[data-date="${date}"]`);
      if (dot) dot.classList.add('dot--selected');
    }
  }
}

function goToPrevDay() {
  const { startDate } = getDateRange();
  if (selectedDate <= startDate) return;
  const d = new Date(selectedDate + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  selectedDate = getLocalDate(d);
  updateHeaderDate(selectedDate);
  updateAllActionButtons(selectedDate);
  updateDotHighlight(selectedDate);
}

function goToNextDay() {
  const today = getLocalDate();
  if (selectedDate >= today) return;
  const d = new Date(selectedDate + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  selectedDate = getLocalDate(d);
  updateHeaderDate(selectedDate);
  updateAllActionButtons(selectedDate);
  updateDotHighlight(selectedDate);
}

async function loadData() {
  habits = await fetchHabits();
  const { startDate, endDate } = getDateRange();
  const habitIds = habits.map((h) => h.id);
  const [logs, allReqs] = await Promise.all([
    fetchAllLogs(habitIds, startDate, endDate),
    fetchAllRequirements(habitIds),
  ]);
  logsMap = groupLogsByHabit(logs);

  requirementsMap = {};
  for (const req of allReqs) {
    if (!requirementsMap[req.habit_id]) requirementsMap[req.habit_id] = [];
    requirementsMap[req.habit_id].push(req);
  }

  renderHabitList(habitListEl, habits, logsMap, selectedDate);
}

function updateDotVisual(dot, count, dailyTarget, color, habit) {
  const { r, g, b } = hexToRgb(color);

  dot.dataset.count = count;
  dot.classList.remove('dot--non-applicable');

  if (count >= dailyTarget) {
    dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  } else if (count > 0) {
    const opacity = Math.max(0.15, count / dailyTarget);
    dot.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else {
    dot.style.backgroundColor = '';
    if (habit) {
      const dateStr = dot.dataset.date;
      const activeWeekdays = habit.active_weekdays || [1, 2, 3, 4, 5, 6, 0];
      const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay();
      if (!activeWeekdays.includes(dayOfWeek)) {
        dot.classList.add('dot--non-applicable');
      }
    }
  }
}

function replaceActionButton(card, habit, newCount, animate = false) {
  const oldBtn = card.querySelector('.action-btn');
  const newBtn = renderActionButton(habit, newCount);
  if (animate) newBtn.classList.add('bounce');
  oldBtn.replaceWith(newBtn);
}

function findHabitForCard(card) {
  const id = card.dataset.habitId;
  return habits.find((h) => h.id === id);
}

// ── Requirements popup ──
let popupResolve = null;

function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

async function openPopup(habit, date, iteration, reqs) {
  popupHeader.textContent = `${habit.icon} ${habit.name} — Iteration ${iteration}`;
  popupBody.innerHTML = '';
  popupActions.classList.remove('hidden');
  popupConfirm.classList.add('hidden');

  const existingLogs = await fetchRequirementLogs(habit.id, date).catch(() => []);
  const logsByReq = {};
  for (const log of existingLogs) {
    if (log.iteration === iteration) logsByReq[log.requirement_id] = log;
  }

  const fields = [];
  for (const req of reqs) {
    const field = document.createElement('div');
    field.className = 'requirement-input';
    const prev = logsByReq[req.id];

    if (req.type === 'boolean') {
      const checked = prev ? prev.fulfilled : false;
      field.innerHTML = `<label class="requirement-input__label"><input type="checkbox" data-req-id="${esc(req.id)}" ${checked ? 'checked' : ''}> ${esc(req.name)}</label>`;
    } else {
      const unitLabel = req.unit ? ` (${esc(req.unit)})` : '';
      const targetHint = req.target_value != null ? ` ≥ ${esc(String(req.target_value))}` : '';
      const prevVal = prev && prev.value != null ? prev.value : '';
      field.innerHTML = `<label class="requirement-input__label">${esc(req.name)}${unitLabel}${targetHint}</label><input type="number" class="form-input" data-req-id="${esc(req.id)}" step="any" min="0" placeholder="Value" value="${esc(String(prevVal))}">`;
    }
    popupBody.appendChild(field);
    fields.push({ req, field });
  }

  popupOverlay.classList.remove('hidden');
  popupBody.querySelector('input')?.focus();

  return new Promise((resolve) => {
    popupResolve = { resolve, fields, habit, date, iteration };
  });
}

function closePopup() {
  popupOverlay.classList.add('hidden');
  popupResolve = null;
}

function collectLogs() {
  if (!popupResolve) return null;
  const { fields, habit, date, iteration } = popupResolve;

  const logs = [];
  let allFulfilled = true;
  let anyFilled = false;

  for (const { req, field } of fields) {
    if (req.type === 'boolean') {
      const checked = field.querySelector('input[type="checkbox"]').checked;
      logs.push({ requirement_id: req.id, habit_id: habit.id, log_date: date, iteration, value: checked ? 1 : 0, fulfilled: checked });
      if (checked) anyFilled = true;
      if (!checked) allFulfilled = false;
    } else {
      const val = parseFloat(field.querySelector('input[type="number"]').value);
      const fulfilled = !isNaN(val) && req.target_value != null && val >= req.target_value;
      logs.push({ requirement_id: req.id, habit_id: habit.id, log_date: date, iteration, value: isNaN(val) ? null : val, fulfilled });
      if (!isNaN(val) && val > 0) anyFilled = true;
      if (!fulfilled) allFulfilled = false;
    }
  }

  return { logs, allFulfilled, anyFilled };
}

popupCancel.addEventListener('click', () => {
  if (popupResolve) popupResolve.resolve(null);
  closePopup();
});

popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) {
    if (popupResolve) popupResolve.resolve(null);
    closePopup();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popupResolve) {
    popupResolve.resolve(null);
    closePopup();
  }
});

popupSubmit.addEventListener('click', async () => {
  const result = collectLogs();
  if (!result) return;
  const { logs, allFulfilled, anyFilled } = result;

  if (allFulfilled) {
    await saveRequirementLogs(logs);
    const r = popupResolve;
    closePopup();
    r.resolve('completed');
    return;
  }

  if (anyFilled) {
    popupActions.classList.add('hidden');
    popupConfirm.classList.remove('hidden');
    return;
  }

  if (popupResolve) popupResolve.resolve(null);
  closePopup();
});

popupComplete.addEventListener('click', async () => {
  const result = collectLogs();
  if (!result) return;
  await saveRequirementLogs(result.logs);
  const r = popupResolve;
  closePopup();
  r.resolve('completed');
});

popupPartial.addEventListener('click', async () => {
  const result = collectLogs();
  if (!result) return;
  await saveRequirementLogs(result.logs);
  const r = popupResolve;
  closePopup();
  r.resolve('partial');
});

popupSkip.addEventListener('click', () => {
  if (popupResolve) popupResolve.resolve(null);
  closePopup();
});

// ── Toggle helpers ──
async function handleToggle(habit, date, currentCount, dotOrCell, card) {
  const newCount = (currentCount + 1) % (habit.daily_target + 1);
  const reqs = requirementsMap[habit.id];

  if (reqs?.length && newCount > 0) {
    const result = await openPopup(habit, date, newCount, reqs);
    if (!result) return;
  }

  if (reqs?.length && newCount === 0) {
    clearRequirementLogs(habit.id, date).catch(() => {});
  }

  if (!logsMap[habit.id]) logsMap[habit.id] = {};
  logsMap[habit.id][date] = newCount;
  updateDotVisual(dotOrCell, newCount, habit.daily_target, habit.color, habit);

  if (card) replaceActionButton(card, habit, newCount, true);

  try {
    await toggleLog(habit.id, date, currentCount, habit.daily_target);
  } catch {
    logsMap[habit.id][date] = currentCount;
    updateDotVisual(dotOrCell, currentCount, habit.daily_target, habit.color, habit);
    if (card) replaceActionButton(card, habit, currentCount, true);
  }
}

habitListEl.addEventListener('click', async (e) => {
  const actionBtn = e.target.closest('.action-btn');
  if (actionBtn) {
    const card = actionBtn.closest('.habit-card');
    const habit = findHabitForCard(card);
    if (!habit) return;

    const currentCount = logsMap[habit.id]?.[selectedDate] || 0;
    const selectedDot = card.querySelector(`.dot[data-date="${selectedDate}"]`);
    await handleToggle(habit, selectedDate, currentCount, selectedDot || actionBtn, card);
    return;
  }
});

headerDateEl.addEventListener('click', () => {
  const today = getLocalDate();
  if (selectedDate !== today) {
    selectedDate = today;
    updateHeaderDate(selectedDate);
    updateAllActionButtons(selectedDate);
    updateDotHighlight(selectedDate);
  }
});

datePrevBtn.addEventListener('click', goToPrevDay);
dateNextBtn.addEventListener('click', goToNextDay);

logoutBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to log out?')) {
    await signOut();
    window.location.replace('login.html');
  }
});

// Init
updateHeaderDate(selectedDate);

requireAuth().then((session) => {
  if (session) loadData();
});
