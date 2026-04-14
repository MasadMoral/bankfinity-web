/* ═══════════════════════════════════════════════════════════
   BANKFINITY 32 — app.js

   To add/edit NOTICES: update the NOTICES array below.
   To add/edit PHOTOS:  update the PHOTOS array below.
   Commit & push to GitHub — no in-site editor needed.
   ═══════════════════════════════════════════════════════════ */

// STATE (Simplified)
let activeSection = 'both';

/* ─── ROUTINE DATA ─────────────────────────────────────────── */
const ROUTINE_DATA = [
  {
    day: 'Sunday',
    slots: [
      null,
      null,
      { code: 'B-101', section: 'A', room: 'Room 5056', teacher: 'JUP' },
      [
        { code: 'B-102', section: 'A', room: 'Room 7057', teacher: 'MAI' },
        { code: 'B-105', section: 'B', room: 'Room 503', teacher: 'MRAB' }
      ],
      [
        { code: 'B-102', section: 'B', room: 'Room 7057', teacher: 'MAI' },
        { code: 'B-105', section: 'A', room: 'Room 503', teacher: 'MRAB' }
      ]
    ]
  },
  {
    day: 'Monday',
    slots: [
      { code: 'B-101', section: 'B', room: 'Room 4004', teacher: 'JR' },
      { code: 'B-104', section: 'A', room: 'Room 7057', teacher: 'AAM' },
      { code: 'B-104', section: 'B', room: 'Room 7057', teacher: 'AAM' },
      null,
      { code: 'B-103', section: 'A', room: 'Room 5056', teacher: 'AN' }
    ]
  },
  {
    day: 'Tuesday',
    slots: [
      null,
      { code: 'B-105', section: 'A', room: 'Room 7057', teacher: 'MRAB' },
      { code: 'B-105', section: 'B', room: 'Room 7057', teacher: 'MRAB' },
      { code: 'B-101', section: 'B', room: 'Room 4001', teacher: 'JR' },
      null
    ]
  },
  {
    day: 'Wednesday',
    slots: [
      null,
      { code: 'B-104', section: 'A', room: 'Room 7057', teacher: 'AAM' },
      { code: 'B-104', section: 'B', room: 'Room 7057', teacher: 'AAM' },
      [
        { code: 'B-102', section: 'A', room: 'Room 7057', teacher: 'MAI' },
        { code: 'B-103', section: 'B', room: 'Room 5056', teacher: 'AN' }
      ],
      [
        { code: 'B-102', section: 'B', room: 'Room 7057', teacher: 'MAI' },
        { code: 'B-103', section: 'A', room: 'Room 5056', teacher: 'AN' }
      ]
    ]
  },
  {
    day: 'Thursday',
    slots: [
      null,
      { code: 'B-103', section: 'B', room: 'Room 7003', teacher: 'AN' },
      { code: 'B-101', section: 'A', room: 'Room 5056', teacher: 'JUP' },
      null,
      null
    ]
  }
];

/* ─── ROUTINE ───────────────────────────────────────────────── */
const SLOT_TIMES = [
  '09:00 – 10:20',
  '10:30 – 11:50',
  '12:00 – 01:20',
  '02:00 – 03:20',
  '03:30 – 04:50'
];

function classCell(slot) {
  return `
    <span class="class-code">${slot.code} <span class="sec-badge sec-${slot.section}">${slot.section}</span></span>
    <span class="class-room">${slot.room}</span>
    <span class="class-teacher">${slot.teacher}</span>
  `;
}

function renderRoutine(section) {
  const body = document.getElementById('routineBody');
  const mobileContainer = document.getElementById('routineMobile');
  
  if (!body || !mobileContainer) return;

  // Desktop Table
  body.innerHTML = ROUTINE_DATA.map(row => {
    const dayCells = row.slots.map(slot => {
      if (!slot) return '<td></td>';

      // Array slot — both sections at the same time
      if (Array.isArray(slot)) {
        const visible = section === 'both'
          ? slot
          : slot.filter(s => s.section === section);
        if (!visible.length) return '<td></td>';
        const inner = visible.map((s, i) =>
          (i > 0 ? '<hr class="slot-divider">' : '') + classCell(s)
        ).join('');
        return `<td class="class-cell">${inner}</td>`;
      }

      // Single slot
      if (section !== 'both' && slot.section !== section) return '<td></td>';
      return `<td class="class-cell">${classCell(slot)}</td>`;
    }).join('');
    return `<tr><td>${row.day}</td>${dayCells}</tr>`;
  }).join('');

  // Mobile Cards
  mobileContainer.innerHTML = ROUTINE_DATA.map(row => {
    const slotsHtml = row.slots.map((slot, idx) => {
      let content = '';
      if (!slot) {
        content = '<div class="slot-content empty">No class</div>';
      } else if (Array.isArray(slot)) {
        const visible = section === 'both' ? slot : slot.filter(s => s.section === section);
        if (!visible.length) {
          content = '<div class="slot-content empty">No class</div>';
        } else {
          content = `<div class="slot-content">${visible.map((s, i) => (i > 0 ? '<hr class="slot-divider">' : '') + classCell(s)).join('')}</div>`;
        }
      } else {
        if (section !== 'both' && slot.section !== section) {
          content = '<div class="slot-content empty">No class</div>';
        } else {
          content = `<div class="slot-content">${classCell(slot)}</div>`;
        }
      }
      return `
        <div class="mobile-slot">
          <div class="slot-time">${SLOT_TIMES[idx]}</div>
          ${content}
        </div>
      `;
    }).join('');

    return `
      <div class="day-group">
        <div class="day-header">${row.day}</div>
        <div class="day-slots">${slotsHtml}</div>
      </div>
    `;
  }).join('');
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSection = btn.dataset.section;
    renderRoutine(activeSection);
  });
});

/* ─── THEME TOGGLE ─────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

if (themeToggle) {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  htmlEl.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ─── NAV TOGGLE ────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mainNav.classList.remove('open');
  }));
}

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderRoutine('both');
});
