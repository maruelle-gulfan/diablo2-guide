/* ─── Navigation toggle ─────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── SPA page routing ──────────────────────────────────── */
const pages       = document.querySelectorAll('.page-section');
const navAnchors  = document.querySelectorAll('[data-page]');

function showPage(pageId) {
  if (!pageId) return;
  const target = document.getElementById(pageId);
  if (!target) return;

  pages.forEach(p => p.classList.remove('active'));
  target.classList.add('active');

  // Update nav highlight
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active-link', a.dataset.page === pageId);
  });

  // Reset scroll and force-reveal any hidden animation elements in the new page
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  target.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });

  // Update URL hash without scrolling
  history.replaceState(null, '', '#' + pageId);
}

// Wire up every data-page element (nav, footer, hero CTA, class-build-link)
navAnchors.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showPage(el.dataset.page);
  });
});

// Boot from hash if present, otherwise Home
const initialHash = window.location.hash.replace('#', '');
if (initialHash && document.getElementById(initialHash)) {
  showPage(initialHash);
} else {
  showPage('home');
}


/* ─── Sort runewords by star rating (high → low) ─────────── */
const rwGrid = document.querySelector('.runewords-grid');
if (rwGrid) {
  const cards = Array.from(rwGrid.querySelectorAll('.rw-card'));
  cards.sort((a, b) => {
    const stars = el => (el.querySelector('.rw-rating')?.textContent.match(/★/g) || []).length;
    return stars(b) - stars(a);
  });
  cards.forEach(card => rwGrid.appendChild(card));
}

/* ─── Runeword filter ────────────────────────────────────── */
const rwFilterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const rwCards      = document.querySelectorAll('.rw-card');

rwFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    rwFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    rwCards.forEach(card => {
      if (filter === 'all' || card.dataset.type === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── Build filter (by class) ────────────────────────────── */
const buildFilterBtns = document.querySelectorAll('.filter-btn[data-build-filter]');
const classGroups     = document.querySelectorAll('.class-group');

buildFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    buildFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.buildFilter;

    classGroups.forEach(group => {
      if (filter === 'all' || group.dataset.buildClass === filter) {
        group.classList.remove('hidden');
      } else {
        group.classList.add('hidden');
      }
    });
  });
});

// When user clicks a class card's "View Build" link, switch to Builds page and auto-select that filter
document.querySelectorAll('.class-build-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').replace('#build-', '');
    showPage('builds');
    const targetBtn = document.querySelector(`.filter-btn[data-build-filter="${target}"]`);
    if (targetBtn) targetBtn.click();
  });
});

/* ─── Horadric Cube filter ───────────────────────────────── */
const cubeFilterBtns = document.querySelectorAll('.filter-btn[data-cube-filter]');
const cubeGroups     = document.querySelectorAll('.cube-group');

cubeFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    cubeFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.cubeFilter;

    cubeGroups.forEach(group => {
      if (filter === 'all' || group.dataset.cubeCat === filter) {
        group.classList.remove('hidden');
      } else {
        group.classList.add('hidden');
      }
    });
  });
});

/* ─── Scroll reveal ──────────────────────────────────────── */
const revealElements = [
  ...document.querySelectorAll('.class-card'),
  ...document.querySelectorAll('.act-item'),
  ...document.querySelectorAll('.rw-card'),
  ...document.querySelectorAll('.tip-card'),
  ...document.querySelectorAll('.build-card'),
  ...document.querySelectorAll('.cube-card'),
];

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

/* ─── Stat bars animate on scroll ───────────────────────── */
const statBars = document.querySelectorAll('.fill');

statBars.forEach(bar => {
  const targetWidth = bar.style.width;
  bar.style.width = '0%';

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  barObserver.observe(bar);
});

/* ─── Active nav link on page switch ─────────────────────
   (Handled inside showPage() above — no scroll observer needed
    since only one section is visible at a time.) */

