const TOTAL_DAYS = 363;

const SVG_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const SVG_PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

export function getLocalDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDateRange() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - TOTAL_DAYS);
  return { startDate: getLocalDate(start), endDate: getLocalDate(today) };
}

function buildLogsMap(logs) {
  const map = {};
  for (const log of logs) {
    if (!map[log.habit_id]) map[log.habit_id] = {};
    map[log.habit_id][log.log_date] = log.count;
  }
  return map;
}

export function groupLogsByHabit(logs) {
  return buildLogsMap(logs);
}

function getDaysList() {
  const days = [];
  const today = new Date();
  for (let i = TOTAL_DAYS; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(getLocalDate(d));
  }
  return days;
}

export function countApplicableDays(fromDate, toDate, activeWeekdays = [1, 2, 3, 4, 5, 6, 0]) {
  let count = 0;
  const d = new Date(fromDate + 'T00:00:00');
  const end = new Date(toDate + 'T00:00:00');
  while (d <= end) {
    if (activeWeekdays.includes(d.getDay())) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function renderDotGrid(habit, habitLogs, { interactive = false } = {}) {
  const container = document.createElement('div');
  container.className = 'dot-grid';

  const days = getDaysList();
  const { r, g, b } = hexToRgb(habit.color);
  const startDate = habit.start_date || null;
  const activeWeekdays = habit.active_weekdays || [1, 2, 3, 4, 5, 6, 0];

  for (const dateStr of days) {
    if (startDate && dateStr < startDate) {
      const blank = document.createElement('div');
      blank.className = 'dot dot--blank';
      container.appendChild(blank);
      continue;
    }

    const count = habitLogs[dateStr] || 0;
    const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay();
    const isApplicable = activeWeekdays.includes(dayOfWeek);

    const tag = interactive ? 'button' : 'div';
    const dot = document.createElement(tag);
    dot.className = interactive ? 'dot' : 'dot dot--readonly';
    if (interactive) dot.type = 'button';
    dot.dataset.date = dateStr;
    dot.dataset.count = count;
    dot.setAttribute('aria-label', `${dateStr}: ${count}/${habit.daily_target}`);

    if (count >= habit.daily_target) {
      dot.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    } else if (count > 0) {
      const opacity = Math.max(0.15, count / habit.daily_target);
      dot.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (!isApplicable) {
      dot.classList.add('dot--non-applicable');
    }

    container.appendChild(dot);
  }

  requestAnimationFrame(() => {
    container.scrollLeft = container.scrollWidth;
  });

  return container;
}

export function renderActionButton(habit, todayCount) {
  const btn = document.createElement('button');
  btn.className = 'action-btn';
  btn.type = 'button';
  btn.dataset.habitId = habit.id;
  btn.setAttribute('aria-label', `Toggle ${habit.name} today`);

  const { r, g, b } = hexToRgb(habit.color);

  if (todayCount >= habit.daily_target) {
    btn.classList.add('action-btn--complete');
    btn.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    btn.innerHTML = SVG_CHECK;
  } else if (todayCount > 0) {
    btn.classList.add('action-btn--partial');
    const opacity = Math.max(0.15, todayCount / habit.daily_target);
    btn.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    btn.innerHTML = habit.daily_target === 1 ? SVG_CHECK : SVG_PLUS;
  } else {
    btn.classList.add('action-btn--empty');
    btn.innerHTML = habit.daily_target === 1 ? SVG_CHECK : SVG_PLUS;
  }

  return btn;
}

export function renderHabitCard(habit, habitLogs) {
  const today = getLocalDate();
  const todayCount = habitLogs[today] || 0;
  const { r, g, b } = hexToRgb(habit.color);

  const card = document.createElement('article');
  card.className = 'habit-card';
  card.dataset.habitId = habit.id;

  // Top row: icon + name + action button
  const top = document.createElement('div');
  top.className = 'habit-card__top';

  const icon = document.createElement('a');
  icon.className = 'habit-card__icon';
  icon.href = `habit-detail.html?id=${habit.id}`;
  icon.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
  icon.setAttribute('aria-label', `View ${habit.name} details`);
  icon.textContent = habit.icon;

  const name = document.createElement('a');
  name.className = 'habit-card__name';
  name.href = `habit-detail.html?id=${habit.id}`;
  name.textContent = habit.daily_target > 1
    ? `${habit.name} (${habit.daily_target}x)`
    : habit.name;

  const actionBtn = renderActionButton(habit, todayCount);

  top.appendChild(icon);
  top.appendChild(name);
  top.appendChild(actionBtn);

  // Dot grid
  const dotGrid = renderDotGrid(habit, habitLogs);

  card.appendChild(top);
  card.appendChild(dotGrid);

  return card;
}

export function renderEmptyState() {
  const el = document.createElement('div');
  el.className = 'empty-state';
  el.innerHTML = `
    <div class="empty-state__icon">✨</div>
    <p class="empty-state__text">No habits yet. Start tracking your first one!</p>
    <a href="habit-form.html" class="empty-state__btn">+ Add habit</a>
  `;
  return el;
}

export function renderHabitList(container, habits, logsMap) {
  container.innerHTML = '';

  if (!habits.length) {
    container.appendChild(renderEmptyState());
    return;
  }

  for (const habit of habits) {
    const habitLogs = logsMap[habit.id] || {};
    container.appendChild(renderHabitCard(habit, habitLogs));
  }
}
