/* ═══════════════════════════════════════════════════════════
   BANKFINITY 32 — app.js

   To add/edit NOTICES: update the NOTICES array below.
   To add/edit PHOTOS:  update the PHOTOS array below.
   Commit & push to GitHub — no in-site editor needed.
   ═══════════════════════════════════════════════════════════ */

/* ─── NOTICES DATA ─────────────────────────────────────────────
   Add objects with: title, body, category, date (YYYY-MM-DD), driveLink
   driveLink is optional — leave as '' if none.
   categories: Academic | Exam | Result | Cultural | General
   ─────────────────────────────────────────────────────────── */
const NOTICES = [
  {
    title: 'Section A and B student lists will be published today',
    body: '',
    category: 'General',
    date: '2026-04-09',
    driveLink: ''
  },
  {
    title: 'Class Routine Effective from April 12, 2026',
    body: 'The weekly class routine for both Section A and Section B is now available. Please check the Routine section for the detailed schedule.',
    category: 'Academic',
    date: '2026-04-08',
    driveLink: 'https://drive.google.com/file/d/1ZA5XqfVo-0C40YV7KArCWx6tVJMy9nwO/view?usp=sharing'
  },
  {
    title: 'Course Details',
    body: 'Course details for 2026',
    category: 'Academic',
    date: '2026-04-08',
    driveLink: 'https://drive.google.com/file/d/1ZA5XqfVo-0C40YV7KArCWx6tVJMy9nwO/view?usp=sharing'
  }
];

/* ─── PHOTOS DATA ───────────────────────────────────────────────
   Add objects with: url, caption, tag
   tags: Campus | Events | Class | Outing
   ─────────────────────────────────────────────────────────── */
const PHOTOS = [
  // Example — replace with real batch photo URLs:
  // { url: 'https://example.com/photo.jpg', caption: 'Freshers Day 2026', tag: 'Events' },
];

/* ─── ROUTINE DATA ─────────────────────────────────────────── */
/*
  Each slot entry can be:
    null                — no class
    { ...class }        — single section class
    [{ ...}, { ...}]    — BOTH sections at the SAME time (stacked in one cell)
*/
const ROUTINE_DATA = [
  {
    day: 'Sunday',
    slots: [
      null,
      null,
      { code: 'B-101', section: 'A', room: 'Room 5056', teacher: 'JUP' },
      { code: 'B-102', section: 'A', room: 'Room 7057', teacher: 'MAI' },
      { code: 'B-102', section: 'B', room: 'Room 7057', teacher: 'MAI' },
    ]
  },
  {
    day: 'Monday',
    slots: [
      { code: 'B-101', section: 'B', room: 'Room 4004', teacher: 'JR' },
      { code: 'B-104', section: 'A', room: 'Room 7057', teacher: 'AAM' },
      { code: 'B-104', section: 'B', room: 'Room 7057', teacher: 'AAM' },
      null,
      { code: 'B-103', section: 'A', room: 'Room 5056', teacher: 'AN' },
    ]
  },
  {
    day: 'Tuesday',
    slots: [null, null, null, { code: 'B-101', section: 'B', room: 'Room 4001', teacher: 'JR' }, null]
  },
  {
    day: 'Wednesday',
    slots: [
      null,
      { code: 'B-104', section: 'A', room: 'Room 7057', teacher: 'AAM' },          // 10:30–11:50 (Sec A)
      { code: 'B-104', section: 'B', room: 'Room 7057', teacher: 'AAM' },          // 12:00–01:20 (Sec B)
      [                                                                              // 02:00–03:20 — BOTH sections
        { code: 'B-102', section: 'A', room: 'Room 7003', teacher: 'MAI' },
        { code: 'B-102', section: 'B', room: 'Room 7003', teacher: 'MAI' },
      ],
      [                                                                              // 03:30–04:50 — BOTH sections
        { code: 'B-103', section: 'A', room: 'Room 7003', teacher: 'AN' },
        { code: 'B-103', section: 'B', room: 'Room 7003', teacher: 'AN' },
      ],
    ]
  },
  {
    day: 'Thursday',
    slots: [
      null,
      { code: 'B-103', section: 'B', room: 'Room 7003', teacher: 'AN' },
      { code: 'B-101', section: 'A', room: 'Room 5056', teacher: 'JUP' },

    ]
  }
];



/* ─── STATE ─────────────────────────────────────────────────── */
let activeSection = 'both';
let activeFilter = 'All';
let lightboxIndex = 0;

/* ─── UTILS ─────────────────────────────────────────────────── */
function formatDate(iso) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase()
  };
}

/* ─── THEME TOGGLE ─────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Initialize theme
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
htmlEl.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* ─── NAV TOGGLE ────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navToggle.classList.remove('open');
  mainNav.classList.remove('open');
}));

/* ─── NOTICES ───────────────────────────────────────────────── */
function renderNotices() {
  const list = document.getElementById('noticeList');
  if (!NOTICES.length) {
    list.innerHTML = '<p style="color:var(--muted);padding:1.5rem 0;">No notices yet.</p>';
    return;
  }
  list.innerHTML = NOTICES
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(n => {
      const { day, month } = formatDate(n.date);
      return `
        <div class="notice-card">
          <div class="notice-date-col">
            <span class="notice-day">${day}</span>
            <span class="notice-month">${month}</span>
          </div>
          <div class="notice-body">
            <div class="notice-meta">
              <span class="notice-badge">${n.category}</span>
            </div>
            <p class="notice-title-text">${escHtml(n.title)}</p>
            ${n.body ? `<p class="notice-text">${escHtml(n.body)}</p>` : ''}
            ${n.driveLink ? `<a class="notice-link" href="${escHtml(n.driveLink)}" target="_blank" rel="noopener">
              📄 Open Document / PDF ↗
            </a>` : ''}
          </div>
        </div>
      `;
    })
    .join('');
}

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

/* ─── GALLERY ───────────────────────────────────────────────── */
function filteredPhotos() {
  if (activeFilter === 'All') return PHOTOS;
  return PHOTOS.filter(p => p.tag === activeFilter);
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');
  const fp = filteredPhotos();
  if (!fp.length) {
    grid.innerHTML = ''; empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = fp.map((p, idx) => `
    <div class="gallery-item" data-idx="${idx}" onclick="openLightbox(${idx})">
      <img src="${escHtml(p.url)}" alt="${escHtml(p.caption)}" loading="lazy" />
      <div class="gallery-caption">${escHtml(p.caption)}</div>
    </div>
  `).join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderGallery();
  });
});

/* ─── LIGHTBOX ──────────────────────────────────────────────── */
function openLightbox(idx) {
  const fp = filteredPhotos();
  lightboxIndex = idx;
  updateLightbox(fp);
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function updateLightbox(fp) {
  const p = fp[lightboxIndex];
  document.getElementById('lightboxImg').src = p.url;
  document.getElementById('lightboxImg').alt = p.caption;
  document.getElementById('lightboxCaption').textContent = p.caption;
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.getElementById('lightboxPrev').addEventListener('click', e => {
  e.stopPropagation();
  const fp = filteredPhotos();
  lightboxIndex = (lightboxIndex - 1 + fp.length) % fp.length;
  updateLightbox(fp);
});
document.getElementById('lightboxNext').addEventListener('click', e => {
  e.stopPropagation();
  const fp = filteredPhotos();
  lightboxIndex = (lightboxIndex + 1) % fp.length;
  updateLightbox(fp);
});
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (lb.classList.contains('hidden')) return;
  const fp = filteredPhotos();
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + fp.length) % fp.length; updateLightbox(fp); }
  if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % fp.length; updateLightbox(fp); }
});
function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ─── ESCAPE HTML ───────────────────────────────────────────── */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── INIT ──────────────────────────────────────────────────── */
renderNotices();
renderRoutine('both');
renderGallery();
