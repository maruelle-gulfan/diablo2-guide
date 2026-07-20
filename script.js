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

/* ─── Items filter (by MF tier) ──────────────────────────── */
const itemFilterBtns = document.querySelectorAll('.filter-btn[data-item-filter]');
const itemGroups     = document.querySelectorAll('.item-group');

itemFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    itemFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.itemFilter;

    itemGroups.forEach(group => {
      if (filter === 'all' || group.dataset.itemCat === filter) {
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
  ...document.querySelectorAll('.item-card'),
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


/* ─── Jackpot item modal ─────────────────────────────────── */
const jackpotData = {
  'deaths-fathom': {
    name: "Death's Fathom",
    slot: "Orb · Cold Sorc BiS",
    req: "Req Lvl 73 · Unique Dimensional Shard",
    class: "🧙 <strong>Builds:</strong> Blizzard Sorc, Frozen Orb Sorc, Meteorb (cold half)",
    stats: [
      "+3 to Sorceress Skill Levels",
      "<strong>+15-30% to Cold Skill Damage</strong>",
      "All Resistances +30-40",
      "+30% Faster Cast Rate"
    ],
    drops: [
      { rate: "elite", label: "TC87 EASY", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 MED", loc: "Hell Nihlathak" },
      { rate: "elite", label: "TC87 RARE", loc: "Cow King" },
      { rate: "none",  label: "NEVER",     loc: "Hell Mephisto (TC 78 too low)" }
    ],
    tip: "💡 Cold Sorc BiS weapon. Nothing comes close for Blizzard/Frozen Orb damage."
  },
  'deaths-web': {
    name: "Death's Web",
    slot: "Wand · Poisonmancer BiS",
    req: "Req Lvl 66 · Unique Unearthed Wand",
    class: "💀 <strong>Builds:</strong> Poisonmancer (Poison Nova) — the ultimate chase item",
    stats: [
      "+1-2 to All Skills",
      "<strong>+2 to Poison &amp; Bone Skills (Necromancer)</strong>",
      "<strong>-40-50% to Enemy Poison Resistance</strong> (massive!)",
      "7-12% Mana Stolen per Hit",
      "+5-10 to All Attributes · Regen Mana 10%"
    ],
    drops: [
      { rate: "elite", label: "TC87 RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 RARE", loc: "Hell Nihlathak" },
      { rate: "none",  label: "NEVER",     loc: "Meph / Andy / Diablo" }
    ],
    tip: "💡 The rarest Necromancer chase item. Turns Poison Nova into a screen-clearing nuke."
  },
  'griffons-eye': {
    name: "Griffon's Eye",
    slot: "Helm · Lightning BiS",
    req: "Req Lvl 76 · Unique Diadem",
    class: "🧙 <strong>Builds:</strong> Lightning Sorc, Nova Sorc, Javazon, Lightning Trapsin",
    stats: [
      "+1 to All Skills",
      "<strong>-15-20% to Enemy Lightning Resistance</strong>",
      "+10-25% to Lightning Skill Damage"
    ],
    drops: [
      { rate: "elite", label: "TC87 RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 RARE", loc: "Hell Nihlathak" },
      { rate: "none",  label: "NEVER",     loc: "Meph / Andy / Diablo (TC too low)" }
    ],
    tip: "💡 Doubles Lightning damage. Beats Shako for any Lightning caster. Ridiculously rare."
  },
  'crown-of-ages': {
    name: "Crown of Ages",
    slot: "Helm · Tank BiS",
    req: "Req Lvl 82 · Unique Corona",
    class: "⚖️ <strong>Builds:</strong> Tank Paladin, HC Barb/Zealot, uber killer",
    stats: [
      "+1-2 to All Skills",
      "<strong>1-2 Sockets</strong> (huge — jewel slots!)",
      "All Resistances +15-30",
      "<strong>Damage Reduced 10-15%</strong>",
      "+50 to Life · +50% Enhanced Def",
      "Cannot Be Frozen · +10-20 Strength"
    ],
    drops: [
      { rate: "elite", label: "TC87 SUPER RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 SUPER RARE", loc: "Hell Nihlathak" },
      { rate: "none",  label: "NEVER",     loc: "Meph / Andy / Diablo" }
    ],
    tip: "💡 Ultimate tank helm. 2os + all-res + DR + CBF makes it BiS for uber/HC characters."
  },
  'tyraels-might': {
    name: "Tyrael's Might",
    slot: "Armor · Legendary Chase",
    req: "Req Lvl 84 · Unique Sacred Armor · <strong>No Str Requirement!</strong>",
    class: "👥 <strong>Builds:</strong> Any class (usable regardless of Str — perfect for casters)",
    stats: [
      "+120-150% Enhanced Damage",
      "+25 to All Attributes",
      "+20% Faster Run/Walk",
      "All Resistances +20-30",
      "<strong>Cannot Be Frozen</strong>",
      "Slain Monsters Rest in Peace",
      "+200% Damage to Demons · +50% Damage to Undead",
      "<strong>Indestructible</strong> · Requirements -100%"
    ],
    drops: [
      { rate: "elite", label: "TC87 ULTRA RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 ULTRA RARE", loc: "Hell Nihlathak" },
      { rate: "none",  label: "NEVER",     loc: "Meph / Andy / Diablo / Cow King" }
    ],
    tip: "💡 The rarest unique armor in D2. Usable at level 1 (no Str req). If you find one — quit your job."
  },
  'windforce': {
    name: "Windforce",
    slot: "Bow · Bowazon BiS",
    req: "Req Lvl 73 · Unique Hydra Bow",
    class: "🏹 <strong>Builds:</strong> Multishot, Strafe, Guided Arrow Bowazon",
    stats: [
      "+250% Enhanced Damage",
      "+20% Increased Attack Speed",
      "6-8% Mana Stolen per Hit",
      "Knockback",
      "Massive base damage"
    ],
    drops: [
      { rate: "elite", label: "TC87 RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 RARE", loc: "Hell Nihlathak" },
      { rate: "none",  label: "NEVER",     loc: "Meph / Andy / Diablo" }
    ],
    tip: "💡 Classic Bowazon endgame bow. Only rivaled by Faith runeword."
  },
  'mang-songs-lesson': {
    name: "Mang Song's Lesson",
    slot: "Staff · Sorc Endgame",
    req: "Req Lvl 82 · Unique Archon Staff",
    class: "🧙 <strong>Builds:</strong> Endgame Sorc (all elements) — pure +skill nuke",
    stats: [
      "<strong>+5 to All Sorceress Skill Levels</strong>",
      "+30% Faster Cast Rate",
      "+30-40 to Energy",
      "+25-30% Damage Reduced",
      "Adds cold/lightning damage",
      "<strong>-7 to -15% to All Resistances</strong> (drawback — offset with Anya quest)"
    ],
    drops: [
      { rate: "elite", label: "TC87 SUPER RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 SUPER RARE", loc: "Hell Nihlathak" },
      { rate: "none",  label: "NEVER",     loc: "Meph / Andy / Diablo" }
    ],
    tip: "💡 +5 all Sorc skills is unmatched. The -res drawback is easily offset with res gear."
  },
  'azurewrath': {
    name: "Azurewrath",
    slot: "Phase Blade · Undead Slayer",
    req: "Req Lvl 85 · Unique Phase Blade",
    class: "⚔️ <strong>Builds:</strong> Zealot vs Undead, uber runs, Sanctuary aura tanking",
    stats: [
      "+1-2 to All Skills",
      "+30% Increased Attack Speed",
      "+200-270% Enhanced Damage",
      "<strong>Adds 250-500 Magic Damage</strong>",
      "<strong>Level 10-13 Sanctuary Aura when Equipped</strong>",
      "+25% Damage to Undead · +1000 AR vs Undead",
      "+5-10 to All Attributes",
      "Slain Monsters Rest in Peace · Indestructible"
    ],
    drops: [
      { rate: "elite", label: "TC87 SUPER RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 SUPER RARE", loc: "Hell Nihlathak" }
    ],
    tip: "💡 Sanctuary aura destroys undead. Magic damage bypasses most resistances."
  },
  'steelrend': {
    name: "Steelrend",
    slot: "Gloves · Melee Power",
    req: "Req Lvl 70 · Unique Ogre Gauntlets",
    class: "⚔️ <strong>Builds:</strong> Zealot, Barbarian, Smiter, melee tank",
    stats: [
      "+160-220% Enhanced Defense",
      "+20 to Strength",
      "+10-20 to Life",
      "<strong>40% Chance of Crushing Blow</strong>",
      "+60-100% Enhanced Damage"
    ],
    drops: [
      { rate: "elite", label: "TC87 RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 RARE", loc: "Hell Nihlathak" }
    ],
    tip: "💡 Highest % Crushing Blow on any glove. Beats Dracul's for pure damage against bosses."
  },
  'stone-of-jordan': {
    name: "Stone of Jordan (SoJ)",
    slot: "Ring · The Legend",
    req: "Req Lvl 29 · Unique Ring",
    class: "👥 <strong>Builds:</strong> All casters (Sorc, Necro, Hammerdin, Trapsin)",
    stats: [
      "<strong>+1 to All Skills</strong>",
      "+20 to Mana",
      "Increase Max Mana 25%",
      "Adds 1-12 Lightning Damage"
    ],
    drops: [
      { rate: "easy",   label: "EASY",   loc: "Hell Mephisto" },
      { rate: "medium", label: "MEDIUM", loc: "Hell Andariel / Diablo / Baal" },
      { rate: "rare",   label: "RARE",   loc: "Countess (Hell) bonus loot" }
    ],
    tip: "💡 The legendary +1 skills ring. Old-school D2 currency. Pair with BK ring."
  },
  'zod-rune': {
    name: "Zod Rune (#33)",
    slot: "Rune · Rarest in Game",
    req: "Req Lvl 69 (in runewords)",
    class: "🔮 <strong>Uses:</strong> Breath of the Dying runeword · socket for Indestructible",
    stats: [
      "<strong>Indestructible</strong> when socketed into any weapon/armor",
      "The rarest rune in Diablo 2",
      "Required for the runeword <strong>Breath of the Dying</strong> (BiS melee weapon)",
      "Also used in <strong>Death</strong> runeword"
    ],
    drops: [
      { rate: "elite", label: "TC87 ULTRA RARE", loc: "Hell Baal minions" },
      { rate: "elite", label: "TC87 ULTRA RARE", loc: "Hell Nihlathak / Cow King" },
      { rate: "rare",  label: "CUBE",   loc: "Cube up: 3× Cham = Zod (Cham is also rare!)" },
      { rate: "medium", label: "COUNTESS", loc: "Hell Countess (extremely rare)" }
    ],
    tip: "💡 Estimated 1-in-many-millions per drop. Most players never see one legit. Worth ~200+ Ist runes."
  }
};

const jackpotModal = document.getElementById('jackpotModal');
if (jackpotModal) {
  const modalName  = jackpotModal.querySelector('.jackpot-modal-name');
  const modalSlot  = jackpotModal.querySelector('.jackpot-modal-slot');
  const modalReq   = jackpotModal.querySelector('.jackpot-modal-req');
  const modalClass = jackpotModal.querySelector('.jackpot-modal-class');
  const modalStats = jackpotModal.querySelector('.jackpot-modal-stats');
  const modalDropList = jackpotModal.querySelector('.jackpot-modal-drop .drop-list');
  const modalTip   = jackpotModal.querySelector('.jackpot-modal-tip');

  function openJackpotModal(key) {
    const data = jackpotData[key];
    if (!data) return;
    modalName.textContent = data.name;
    modalSlot.textContent = data.slot;
    modalReq.innerHTML    = data.req;
    modalClass.innerHTML  = data.class;
    modalStats.innerHTML  = data.stats.map(s => `<li>${s}</li>`).join('');
    modalDropList.innerHTML = data.drops.map(d =>
      `<li><span class="drop-rate rate-${d.rate}">${d.label}</span> ${d.loc}</li>`
    ).join('');
    modalTip.innerHTML = data.tip;
    jackpotModal.hidden = false;
    jackpotModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // Focus the close button for keyboard users
    const closeBtn = jackpotModal.querySelector('.jackpot-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeJackpotModal() {
    jackpotModal.hidden = true;
    jackpotModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Wire up all jackpot buttons
  document.querySelectorAll('.jackpot-item[data-jackpot]').forEach(btn => {
    btn.addEventListener('click', () => openJackpotModal(btn.dataset.jackpot));
  });

  // Close via backdrop, close button, or Escape
  jackpotModal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeJackpotModal);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !jackpotModal.hidden) closeJackpotModal();
  });
}

/* ─── Powerspike subcategory filter ─────────────────────── */
const psFilterBtns   = document.querySelectorAll('.ps-filter-btn');
const psClassSections = document.querySelectorAll('.ps-class-section[data-ps-cat]');
const psJackpot       = document.querySelector('.ps-jackpot[data-ps-cat="jackpot"]');
const psFilterBar     = document.querySelector('.ps-filter-bar');

function applyPsFilter(filter) {
  const visibleSections = [];

  psClassSections.forEach(sec => {
    const match = (filter === 'all') || (sec.dataset.psCat === filter);
    sec.hidden = !match;
    if (match) visibleSections.push(sec);
  });

  if (psJackpot) {
    // Jackpot is always visible with "all", or when its own filter is picked
    psJackpot.hidden = !(filter === 'all' || filter === 'jackpot');
  }

  // Remove top-border divider when only one section is visible
  psClassSections.forEach(sec => sec.classList.remove('ps-filter-solo'));
  if (visibleSections.length === 1) {
    visibleSections[0].classList.add('ps-filter-solo');
  }

  // Update button state + ARIA
  psFilterBtns.forEach(btn => {
    const isActive = btn.dataset.psFilter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Smooth scroll the filter bar into view when switching
  if (psFilterBar && filter !== 'all') {
    const rect = psFilterBar.getBoundingClientRect();
    if (rect.top < 60 || rect.top > window.innerHeight - 100) {
      psFilterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

psFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => applyPsFilter(btn.dataset.psFilter));
});


/* ─── Boss Overview + Drop Modal ─────────────────────── */
const bossDropData = {
  andariel: {
    name: "Andariel — Act 1",
    tier: "Act Boss · TC 84*",
    tierClass: "tier-standard",
    loc: "📍 Catacombs Level 4",
    immunities: [
      { text: "Immune: Fire (Hell)", type: "immune" },
      { text: "Poison Nova = #1 killer" }
    ],
    strategy: [
      "Stack <strong>Poison Resist</strong> — her Poison Nova is the deadliest attack.",
      "Attack from range if possible; melee her from the sides to avoid the puke.",
      "Hell: no longer fire-immune with new patches, but check your version.",
      "Save fresh quest for a boosted quest drop after each level-up."
    ],
    tc: "mlvl 75 · TC 84 · Quest drop = biased (boosted roll)",
    drops: [
      { text: "<strong>Shako</strong> (qlvl 62), Mara's Kaleidoscope (67), SoJ, Bul-Kathos, HoZ" },
      { text: "Oculus, Vipermagi, Wizardspike, Skullder's Ire, Lidless Wall" },
      { text: "Jalal's Mane, Highlord's Wrath (65), Verdungo's (63)" },
      { text: "Magefist, Chance Guards, Frostburn, Waterwalk, String of Ears" },
      { text: "Cannot drop: Titan's Revenge, Death's Fathom, Andariel's Visage, Arachnid Mesh (all qlvl 79+, above her mlvl 75 cap)", warn: true }
    ],
    tip: "💡 Best \"single-boss\" farm for a fresh character. Quest drop is biased — save one fresh quest per difficulty for a shot at endgame gear. She caps at qlvl 75, so no true elites here — go Meph/Baal for those."
  },
  duriel: {
    name: "Duriel — Act 2",
    tier: "Act Boss · Hardest Early",
    tierClass: "tier-standard",
    loc: "📍 Tal Rasha's Chamber",
    immunities: [
      { text: "Immune: Cold", type: "immune" },
      { text: "Holy Freeze aura" }
    ],
    strategy: [
      "<strong>Hardest early boss</strong> — Holy Freeze aura chills you, he hits like a truck.",
      "Buy full-rejuv potions before the fight; open the TP <em>before</em> touching the orifice.",
      "Merc will likely die instantly — resurrect and re-summon in TP if needed.",
      "Ranged / caster builds have a much easier time than melee."
    ],
    tc: "mlvl 88 · TC 78 · Similar pool to Mephisto",
    drops: [
      { text: "<strong>Shako, Mara's, SoJ, Bul-Kathos, HoZ</strong>" },
      { text: "Oculus, Vipermagi, Skullder's Ire, Lidless Wall" },
      { text: "<strong>Arachnid Mesh, Andariel's Visage, Titan's Revenge</strong> (qlvl 83-87 possible)", elite: true },
      { text: "Highlord's Wrath, Verdungo's, Nightwing's Veil (rare)" },
      { text: "Cannot drop: Griffon's Eye, Windforce, Death's Fathom, Death's Web, Tyrael's, Crown of Ages, Mang Song's", warn: true }
    ],
    tip: "💡 Drops are actually solid (similar to Meph) but the ORIFICE grind (rebuff, TP, run in) makes him a poor farm target compared to Meph or Pindle. Only worth killing on the way past."
  },
  mephisto: {
    name: "Mephisto — Act 3",
    tier: "Act Boss · MF King · TC 78",
    tierClass: "tier-standard",
    loc: "📍 Durance of Hate Level 3",
    immunities: [
      { text: "Immune: Lightning (Hell)", type: "immune" }
    ],
    strategy: [
      "<strong>Easiest boss in the game</strong> — famous \"moat trick\": stand across the blood moat, he can't cross it.",
      "Use Fire / Cold / Physical damage in Hell (skip lightning gear here).",
      "<strong>Best MF target</strong> — level 87+ area, great TC. Meph runs are legendary.",
      "Bring +Magic Find gear; kill Council members on the way for guaranteed set drops."
    ],
    tc: "mlvl 87 · TC 78 · Highest volume farm in the game",
    drops: [
      { text: "<strong>Shako, Mara's, SoJ, Bul-Kathos, HoZ</strong>" },
      { text: "Oculus, Vipermagi, Skullder's Ire, Lidless Wall" },
      { text: "Wizardspike, Wisp Projector, Nightwing's Veil (rare)" },
      { text: "<strong>Arachnid Mesh, Andariel's Visage</strong> — borderline qlvl 87 but confirmed drops", elite: true },
      { text: "<strong>Titan's Revenge</strong> (qlvl 85), Jalal's Mane, Stormshield, Reaper's Toll" },
      { text: "Highlord's Wrath, Verdungo's, full Trang-Oul's set, most mid-elite uniques" },
      { text: "Cannot drop: Griffon's Eye, Windforce, Death's Fathom, Death's Web, Tyrael's Might, Crown of Ages, Mang Song's (true elite pool)", warn: true }
    ],
    tip: "💡 THE king of MF farming. Fast, safe, huge item volume. Arachnid + Andariel's Visage are rare-but-real drops here — most other TC87 elites require Baal/Nihlathak/Diablo."
  },
  diablo: {
    name: "Diablo — Act 4",
    tier: "Act Boss · TC 84",
    tierClass: "tier-standard",
    loc: "📍 Chaos Sanctuary — River of Flame",
    immunities: [
      { text: "No immunities" }
    ],
    strategy: [
      "<strong>Cap Fire and Lightning res at 75%</strong> — his Fire Hose and Lightning Hose will one-shot you otherwise.",
      "Break the 3 seals slowly, rest between mini-bosses (De Seis is nasty — cold-immune melee).",
      "Kite Diablo in circles; his Red Lightning Hose has a wind-up tell.",
      "Chaos Sanctuary is the best XP zone from 75-90+."
    ],
    tc: "mlvl 94 · TC 84 · Higher pool than Mephisto",
    drops: [
      { text: "All Mephisto drops PLUS:" },
      { text: "<strong>Grandfather</strong> (qlvl 81), Nord's Tenderizer, Fleshripper, Doombringer" },
      { text: "Metalgrid (qlvl 81), Astreon's Iron Ward, Steelrend, Boneflame" },
      { text: "Better ilvl on affixes = higher rare-item potential (elite bases roll better mods)" },
      { text: "Cannot drop: Griffon's Eye, Windforce, Death's Fathom, Death's Web, Tyrael's, Crown of Ages, Mang Song's (true TC 87 pool)", warn: true }
    ],
    tip: "💡 Slower than Meph but higher-quality drops. Do a full Chaos clear for the seal bosses + Diablo combo — great XP and loot combined."
  },
  baal: {
    name: "Baal — Act 5 (Throne Waves)",
    tier: "Act 5 · TC 87 Elite Pool",
    tierClass: "",
    loc: "📍 Throne of Destruction (all 5 waves)",
    immunities: [
      { text: "No immunities" },
      { text: "Cold Missiles + Mana Rift" }
    ],
    strategy: [
      "Survive <strong>5 waves</strong> in the Throne first — waves 2 (Achmel), 4 (Council), 5 (Lister the Tormentor) are hardest.",
      "Baal himself: clone illusion (deals no damage), Cold Missiles, Mana Rift (drains your mana). Face-tank if you have res + life leech.",
      "<strong>Best XP source at high level</strong> — Baal runs carry you from 90 → 99.",
      "Guaranteed rune drop from Baal Q1 in Hell — good rune farming."
    ],
    tc: "mlvl 88-99 · Waves are TC 87 — the sweet spot",
    drops: [
      { text: "<strong>Griffon's Eye, Windforce, Death's Fathom</strong>", elite: true },
      { text: "<strong>Andariel's Visage, Arachnid Mesh, Homunculus</strong>", elite: true },
      { text: "Titan's Revenge, Astreon's Iron Ward, Tyrael's Might", elite: true },
      { text: "Steelrend, Boneflame, most elite chase items", elite: true },
      { text: "Baal himself is only TC 84 (worse than his waves!)" }
    ],
    tip: "💡 Farm the WAVES more than Baal himself. Wave 5 (Lister the Tormentor pack) is prime TC 87 loot territory. Public Baal games = free elite drops."
  },
  nihlathak: {
    name: "Nihlathak — Act 5",
    tier: "Act 5 · TC 87 · Quest Boosted",
    tierClass: "",
    loc: "📍 Halls of Vaught (from Halls of Pain WP)",
    immunities: [
      { text: "Immune: Poison (Hell)", type: "immune" },
      { text: "Corpse Explosion = lethal", type: "immune" }
    ],
    strategy: [
      "<strong>Corpse Explosion</strong> is deadly — never let dead bodies pile up around you.",
      "Kill quickly with ranged/casters; melee is dangerous due to his teleport + CE combo.",
      "Rewards the <strong>Halls of Anguish key</strong> for the Pandemonium Event.",
      "Hell: guaranteed high-rune chance from his TC — worth farming."
    ],
    tc: "mlvl 90 · TC 87 (quest-boosted!)",
    drops: [
      { text: "All TC 87 elite items possible", elite: true },
      { text: "<strong>Griffon's Eye, Windforce, Death's Fathom</strong>", elite: true },
      { text: "Andariel's Visage, Arachnid Mesh, Homunculus", elite: true },
      { text: "Also drops Key of Destruction (needed for ubers)" },
      { text: "Dangerous: his Corpse Explosion can 1-shot you!", warn: true }
    ],
    tip: "💡 Elite drop pool + fast kill, but dangerous. Bring Cannot Be Frozen and clear all corpses before engaging him — CE on a full-HP corpse is a one-shot."
  },
  ancients: {
    name: "The Ancients — Act 5",
    tier: "Required Quest · Arreat Summit",
    tierClass: "tier-standard",
    loc: "📍 Arreat Summit",
    immunities: [
      { text: "Random affixes each attempt", type: "immune" }
    ],
    strategy: [
      "<strong>Three Barbarians</strong> — Talic (spinner), Madawc (thrower), Korlic (leaper). Fight all 3 at once.",
      "Re-rolled each attempt — quit + rejoin if affix combo is unwinnable (e.g. all three Fire Enchanted + Extra Strong in Hell).",
      "Bring plenty of full rejuv potions. Merc dies fast here.",
      "Kill Madawc (thrower) first — his hits from range are brutal."
    ],
    tip: "💡 Quest gate, not a farm target. Reroll the affixes until you get a manageable combo — no shame in quitting an unwinnable pull."
  },
  ubers: {
    name: "Ubers — Pandemonium Event",
    tier: "Endgame · Hellfire Torch",
    tierClass: "",
    loc: "📍 Uber Tristram (via Cube ritual)",
    immunities: [
      { text: "50% Physical Damage Reduction", type: "immune" },
      { text: "High resists across the board" }
    ],
    strategy: [
      "Farm 3 keys in Hell: <strong>Key of Terror</strong> (Countess), <strong>Key of Hate</strong> (Summoner, Arcane Sanctuary), <strong>Key of Destruction</strong> (Nihlathak).",
      "Cube 1 of each key → opens portal to one of 3 uber mini-bosses (Uber Izual, Uber Duriel, Uber Andariel).",
      "Cube their 3 body parts → portal to <strong>Uber Tristram</strong> (Uber Mephisto + Uber Diablo + Uber Baal, all together).",
      "Melee builds thrive (Smiter Paladin is meta). Pure casters struggle due to physical damage reduction."
    ],
    tc: "Reward: Hellfire Torch (unique large charm)",
    drops: [
      { text: "<strong>Hellfire Torch</strong> — +3 to a random class's skills", elite: true },
      { text: "+10-20 to all attributes", elite: true },
      { text: "+10-20% to all resists", elite: true },
      { text: "3 random Annihilus-tier bonuses" },
      { text: "Torch class is RANDOM — reroll by running more ubers" }
    ],
    tip: "💡 Smiter Paladin with Grief PB + Exile shield + max block is the gold-standard uber build. Bring anti-Mephisto lightning res too."
  },
  countess: {
    name: "The Countess",
    tier: "Rune Farm · Act 1",
    tierClass: "tier-rune",
    loc: "📍 Black Marsh → Forgotten Tower Level 5",
    strategy: [
      "5-floor tower — teleport straight down if possible.",
      "Bosspack of ghosts guards her — clear from range or curse them.",
      "Very fast run (~30 sec each with teleport, ~60 sec without)."
    ],
    tc: "Guaranteed rune drop · Hell drops up to Ist",
    drops: [
      { text: "<strong>Runes:</strong> Normal El→Ral · Nightmare El→Io · Hell El→Ist" },
      { text: "Guaranteed rune drop every kill from Nightmare onward" },
      { text: "Perfect gems, Key of Terror (needed for ubers)" },
      { text: "Low-tier uniques as bonus loot (mostly filler here)" },
      { text: "Extremely fast run (~30 seconds each with teleport)" }
    ],
    tip: "💡 The ONLY rune-focused farm in the game. Run 200+ times for high runes. Bring some MF gear too — she still drops small uniques."
  },
  travincal: {
    name: "Travincal Council",
    tier: "Act 3 · HoZ + Gold Farm",
    tierClass: "tier-standard",
    loc: "📍 Travincal (right before Durance of Hate)",
    strategy: [
      "3 packs of 3 councilmen each — 9 total unique-tier monsters.",
      "They cast Meteor and Blizzard — bring Fire + Cold res.",
      "Berserker Barbs and Hammerdins clear it in under a minute."
    ],
    tc: "3 councilmen packs · Fast HoZ + gold farm",
    drops: [
      { text: "<strong>Herald of Zakarum</strong> (their signature drop)" },
      { text: "Massive gold piles (they carry huge gold stacks)" },
      { text: "Mid-tier uniques + set items — they're mlvl 88 in Hell so drop pool is deep" },
      { text: "Runes possible but not efficient here — Countess is far better for runes" }
    ],
    tip: "💡 Best HoZ farm in the game. Also amazing as a gold-run for Gheed's Fortune discount and repair costs."
  },
  pindle: {
    name: "Pindleskin",
    tier: "Speedrun MF King · Act 5",
    tierClass: "tier-standard",
    loc: "📍 Nihlathak's red portal (Anya's Camp)",
    strategy: [
      "Take Anya's red portal → Pindle is right there with 2 minions.",
      "~5 second kill with any decent build. New game → repeat.",
      "100+ runs per hour is easily possible."
    ],
    tc: "mlvl 86 · TC 87 pool (quest-boosted!) · ~5-second kill",
    drops: [
      { text: "<strong>Shako, Mara's, SoJ, Bul-Kathos, HoZ</strong>" },
      { text: "Highlord's Wrath, Verdungo's, Grandfather (qlvl 81)" },
      { text: "<strong>Yes — CAN drop TC 87 elites:</strong> Griffon's Eye, Windforce, Death's Fathom, Arachnid, Andy's Visage, Titan's, Homunculus, Tyrael's Might", elite: true },
      { text: "Quest-boosted like Nihlathak — same elite pool access", elite: true },
      { text: "Fastest single-target boss run in the entire game" }
    ],
    tip: "💡 The speedrun MF king. Kill Pindle → new game → repeat. Because he's quest-boosted TC 87, he can drop EVERY chase unique in the game — not just mid-tier. Best drops-per-hour ratio in the game for high-MF characters."
  },
  cowking: {
    name: "Cow King",
    tier: "TC 87 · Secret Cow Level",
    tierClass: "",
    loc: "📍 Cube: Tome of TP + Wirt's Leg (must complete difficulty first)",
    strategy: [
      "Massive open area packed with Hell Bovine — huge XP.",
      "Cow King is a super-unique with Lightning Enchanted — dangerous!",
      "<strong>WARNING:</strong> Killing him closes the cow level FOREVER on that character/difficulty."
    ],
    tc: "mlvl 92 · TC 87 elite pool",
    drops: [
      { text: "All TC 87 elite items", elite: true },
      { text: "Massive gem + rune drops from the cow packs" },
      { text: "Cows drop Key of Destruction (needed for ubers)" },
      { text: "Killing the King CLOSES cow level FOREVER on that character/difficulty!", warn: true }
    ],
    tip: "💡 Farm the cows for XP + loot; AVOID killing the King unless you want him dead. One of the best XP farms in the game — cow packs shower you with runes/gems."
  }
};

const bossDropModal = document.getElementById('bossDropModal');

function openBossDropModal(key) {
  const data = bossDropData[key];
  if (!data || !bossDropModal) return;

  bossDropModal.querySelector('.jackpot-modal-name').textContent = data.name;

  const tierEl = bossDropModal.querySelector('.boss-drop-tier');
  tierEl.textContent = data.tier;
  tierEl.className = 'jackpot-modal-slot boss-drop-tier ' + (data.tierClass || '');

  bossDropModal.querySelector('.boss-drop-loc').textContent = data.loc;

  // Immunities row
  const immuneEl = bossDropModal.querySelector('.boss-drop-immune');
  immuneEl.innerHTML = '';
  if (data.immunities && data.immunities.length) {
    data.immunities.forEach(imm => {
      const span = document.createElement('span');
      span.className = 'immune-tag' + (imm.type === 'immune' ? ' immune' : '');
      span.textContent = imm.text;
      immuneEl.appendChild(span);
    });
    immuneEl.hidden = false;
  } else {
    immuneEl.hidden = true;
  }

  // TC info
  const tcEl = bossDropModal.querySelector('.boss-drop-tc');
  if (data.tc) {
    tcEl.textContent = data.tc;
    tcEl.hidden = false;
  } else {
    tcEl.hidden = true;
  }

  // Strategy section
  const stratSection = bossDropModal.querySelector('.boss-strategy-section');
  const stratList = bossDropModal.querySelector('.boss-strategy-list');
  stratList.innerHTML = '';
  if (data.strategy && data.strategy.length) {
    data.strategy.forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = line;
      stratList.appendChild(li);
    });
    stratSection.hidden = false;
  } else {
    stratSection.hidden = true;
  }

  // Drops section
  const dropsSection = bossDropModal.querySelector('.boss-drops-section');
  const list = bossDropModal.querySelector('.boss-drop-list');
  list.innerHTML = '';
  if (data.drops && data.drops.length) {
    data.drops.forEach(drop => {
      const li = document.createElement('li');
      li.innerHTML = drop.text;
      if (drop.elite) li.classList.add('drop-elite');
      if (drop.warn)  li.classList.add('drop-warn');
      list.appendChild(li);
    });
    dropsSection.hidden = false;
  } else {
    dropsSection.hidden = true;
  }

  // Tip
  const tipEl = bossDropModal.querySelector('.boss-drop-tip');
  if (data.tip) {
    tipEl.textContent = data.tip;
    tipEl.hidden = false;
  } else {
    tipEl.hidden = true;
  }

  bossDropModal.hidden = false;
  bossDropModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => bossDropModal.querySelector('.jackpot-modal-close').focus(), 60);
}

function closeBossDropModal() {
  if (!bossDropModal) return;
  bossDropModal.hidden = true;
  bossDropModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.drop-chip[data-boss]').forEach(chip => {
  chip.addEventListener('click', () => openBossDropModal(chip.dataset.boss));
});

if (bossDropModal) {
  bossDropModal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeBossDropModal);
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && bossDropModal && !bossDropModal.hidden) {
    closeBossDropModal();
  }
});

/* ─── Tips category filter ─────────────────────── */
const tipsFilterBtns = document.querySelectorAll('.tips-filter-btn');
const tipCards       = document.querySelectorAll('.tip-card[data-tips-cat]');
const tipsFilterBar  = document.querySelector('.tips-filter-bar');

function applyTipsFilter(filter) {
  tipCards.forEach(card => {
    const match = (filter === 'all') || (card.dataset.tipsCat === filter);
    card.hidden = !match;
  });
  tipsFilterBtns.forEach(btn => {
    const isActive = btn.dataset.tipsFilter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  if (tipsFilterBar && filter !== 'all') {
    const rect = tipsFilterBar.getBoundingClientRect();
    if (rect.top < 60 || rect.top > window.innerHeight - 100) {
      tipsFilterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

tipsFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => applyTipsFilter(btn.dataset.tipsFilter));
});

/* ─── Class Picker (tab switcher) ──────────────────────── */
(function () {
  const pickerBtns = document.querySelectorAll('.class-picker-btn[data-class-btn]');
  const classCards = document.querySelectorAll('.class-card[data-class]');
  if (!pickerBtns.length || !classCards.length) return;

  // Wrap right-column content in .class-body so flex layout can stack it
  classCards.forEach(card => {
    if (card.querySelector(':scope > .class-body')) return; // idempotent
    const icon = card.querySelector(':scope > .class-icon');
    const body = document.createElement('div');
    body.className = 'class-body';
    Array.from(card.children).forEach(child => {
      if (child !== icon) body.appendChild(child);
    });
    card.appendChild(body);
  });

  function selectClass(key) {
    pickerBtns.forEach(btn => {
      const on = btn.dataset.classBtn === key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    classCards.forEach(card => {
      card.hidden = card.dataset.class !== key;
    });
  }

  pickerBtns.forEach(btn => {
    btn.addEventListener('click', () => selectClass(btn.dataset.classBtn));
  });
})();

/* ─── MF + FCR Loadout Calculator ─────────────────────── */
(function () {
  // Item database: { name, mf, fcr, note? }
  const CALC_ITEMS = {
    helm: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Tarnhelm (Skull Cap)", mf: 40, fcr: 0, note: "+1 all skills" },
      { name: "Shako / Harlequin Crest", mf: 50, fcr: 0, note: "+2 skills, +2 stats" },
      { name: "Peasant Crown", mf: 0, fcr: 0, note: "+1 skills, +20 life reg" },
      { name: "Vampire Gaze", mf: 0, fcr: 0, note: "6-8% Life Steal" },
      { name: "Andariel's Visage", mf: 0, fcr: 0, note: "20% IAS, +2 skills" },
      { name: "Nightwing's Veil", mf: 0, fcr: 0, note: "+2 skills, +5-9% cold dmg" },
      { name: "Griffon's Eye (Diadem)", mf: 0, fcr: 25, note: "-15-20% enemy lightning res" },
      { name: "Crown of Ages", mf: 0, fcr: 0, note: "+1 skills, 10-15% DR" },
      { name: "Magic Circlet + 10% FCR", mf: 0, fcr: 10, note: "Magic circlet cap: 10% FCR prefix" },
      { name: "Magic Circlet + 20% FCR (of the Magus)", mf: 0, fcr: 20, note: "20% FCR is the max suffix roll" },
      { name: "Rare Circlet + 20% FCR + 30% MF", mf: 30, fcr: 20, note: "Very rare — max FCR + max MF suffix" }
    ],
    amulet: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Mara's Kaleidoscope", mf: 0, fcr: 0, note: "+2 skills, +20-30 all res" },
      { name: "Highlord's Wrath", mf: 0, fcr: 0, note: "+1 skills, 20% IAS, DS per clvl" },
      { name: "Tal Rasha's Adjudication", mf: 0, fcr: 0, note: "+2 sorc, +42 mana (FCR only via full set bonus)" },
      { name: "The Cat's Eye", mf: 0, fcr: 0, note: "30% FRW, +30 dex" },
      { name: "Metalgrid", mf: 0, fcr: 0, note: "+90 all res" },
      { name: "Rare amulet + 10% FCR", mf: 0, fcr: 10, note: "Magic amulets cap at 10% FCR" },
      { name: "Rare amulet + 10% FCR + 30% MF", mf: 30, fcr: 10, note: "Max MF suffix (of Chance)" },
      { name: "Crafted caster amulet (+1 class, 20% FCR)", mf: 0, fcr: 20, note: "Caster recipe: fixed 10 FCR + up to 10 suffix" }
    ],
    armor: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Enigma (Mage Plate)", mf: 80, fcr: 0, note: "+2 skills, Teleport, +80% MF fixed" },
      { name: "Skullder's Ire (~clvl 95)", mf: 95, fcr: 0, note: "+1 per clvl MF (max ~99% at clvl 99)" },
      { name: "Wealth (any 4os armor)", mf: 100, fcr: 0, note: "+100% MF, +300% extra gold, +10 dex" },
      { name: "Vipermagi's Serpentskin", mf: 0, fcr: 30, note: "+1 skills, all res" },
      { name: "Ormus' Robes", mf: 0, fcr: 0, note: "+3 random sorc skill, +2 sorc" },
      { name: "Que-Hegan's Wisdom", mf: 0, fcr: 20, note: "+1 skills" },
      { name: "Chains of Honor", mf: 0, fcr: 0, note: "+2 skills, 65 res" },
      { name: "Bramble", mf: 0, fcr: 0, note: "Thorns aura" }
    ],
    weapon: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Gull (Dagger)", mf: 100, fcr: 0, note: "100% MF, no damage — offhand carry" },
      { name: "Wizardspike", mf: 0, fcr: 50, note: "+75 all res, huge FCR" },
      { name: "Heart of the Oak (Flail)", mf: 0, fcr: 40, note: "+3 skills, +40 all res" },
      { name: "Death's Fathom (Dimensional Shard)", mf: 0, fcr: 30, note: "+3 sorc, +25-40% cold dmg" },
      { name: "Eschuta's Temper (Eldritch Orb)", mf: 0, fcr: 20, note: "+3 sorc, +1-3% fire/light dmg per clvl (FCR max 20%)" },
      { name: "Suicide Branch", mf: 0, fcr: 40, note: "+1 skills, +25 all attrs" },
      { name: "Spirit (Crystal Sword)", mf: 0, fcr: 35, note: "+2 skills, +112 mana" },
      { name: "Hoto (short flail)", mf: 0, fcr: 40, note: "+3 skills, dispel magic" },
      { name: "Grief (Phase Blade)", mf: 0, fcr: 0, note: "Melee — for reference" },
      { name: "Sazabi's Cobalt Redeemer", mf: 0, fcr: 0, note: "+170% ED, +1 skills (weapon itself has no MF)" }
    ],
    offhand: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Spirit (Monarch Shield)", mf: 0, fcr: 35, note: "+2 skills, +22 vit, +89-112 mana" },
      { name: "Rhyme (any shield)", mf: 25, fcr: 0, note: "25% MF, all res, cannot be frozen" },
      { name: "Lidless Wall (Grim Shield)", mf: 0, fcr: 20, note: "+1 skills, +10 energy" },
      { name: "Homunculus (Hierophant Trophy)", mf: 0, fcr: 20, note: "+2 necro, huge res" },
      { name: "Storm Shield", mf: 0, fcr: 0, note: "35% DR, high def" },
      { name: "Sanctuary (any shield)", mf: 0, fcr: 0, note: "+250 def, cleansing aura" },
      { name: "Whitstan's Guard", mf: 0, fcr: 0, note: "55% chance to block" }
    ],
    gloves: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Chance Guards", mf: 40, fcr: 0, note: "25-40% MF" },
      { name: "Magefist", mf: 0, fcr: 20, note: "+1 fire skills, +25 mana regen" },
      { name: "Frostburn", mf: 0, fcr: 0, note: "+40% max mana" },
      { name: "Trang-Oul's Claws", mf: 0, fcr: 20, note: "+2 curses, part of Trang's set" },
      { name: "Bloodfist", mf: 0, fcr: 0, note: "+40 life, 10% IAS" },
      { name: "Crafted caster gloves (20% FCR)", mf: 0, fcr: 20, note: "FCR + FHR + mana" }
    ],
    belt: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Goldwrap", mf: 80, fcr: 0, note: "30-80% MF, +50% gold" },
      { name: "Arachnid Mesh", mf: 0, fcr: 20, note: "+1 skills, +5% max mana" },
      { name: "String of Ears", mf: 0, fcr: 0, note: "15% DR, life steal" },
      { name: "Verdungo's Hearty Cord", mf: 0, fcr: 0, note: "10-15% DR, huge life" },
      { name: "Nightsmoke", mf: 0, fcr: 0, note: "+20 all res, +50% mana" }
    ],
    boots: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "War Traveler", mf: 50, fcr: 0, note: "40-50% MF, 25% FRW, +15-25 strength" },
      { name: "Waterwalk", mf: 0, fcr: 0, note: "+65 life, 20% FRW" },
      { name: "Silkweave", mf: 0, fcr: 0, note: "+30% max mana, 20% FRW" },
      { name: "Sandstorm Trek", mf: 0, fcr: 0, note: "20% FHR, poison res" },
      { name: "Aldur's Advance", mf: 0, fcr: 0, note: "+180 life, 40% FRW (set)" },
      { name: "Rare boots + 30% FRW + res", mf: 0, fcr: 0 }
    ],
    ring1: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Nagelring", mf: 30, fcr: 0, note: "15-30% MF" },
      { name: "Stone of Jordan (SoJ)", mf: 0, fcr: 0, note: "+1 skills, +25% max mana" },
      { name: "Bul-Kathos' Wedding Band", mf: 0, fcr: 0, note: "+1 skills, life steal, +50 life" },
      { name: "Raven Frost", mf: 0, fcr: 0, note: "Cannot Be Frozen, +15-20 dex" },
      { name: "Dwarf Star", mf: 0, fcr: 0, note: "Cannot Be Frozen, +40 life, magic dmg absorb" },
      { name: "The Rising Sun", mf: 0, fcr: 0, note: "Meteor CtC, fire dmg" },
      { name: "Nature's Peace", mf: 0, fcr: 0, note: "Prevent Monster Heal, slain rest in peace" },
      { name: "Rare ring + 10% FCR", mf: 0, fcr: 10, note: "Rings can roll up to 10% FCR" },
      { name: "Rare ring + 10% FCR + res", mf: 0, fcr: 10 },
      { name: "Rare ring + 10% FCR + 15% MF", mf: 15, fcr: 10, note: "Common good roll" },
      { name: "Rare ring + 10% FCR + 30% MF (of Chance)", mf: 30, fcr: 10, note: "Max FCR + max MF suffix — very rare" },
      { name: "Rare ring + 30% MF (no FCR)", mf: 30, fcr: 0, note: "Max MF suffix (of Chance)" },
      { name: "Crafted caster ring (10 FCR + mods)", mf: 0, fcr: 10, note: "Guaranteed 10 FCR from recipe" }
    ],
    ring2: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Nagelring", mf: 30, fcr: 0, note: "15-30% MF" },
      { name: "Stone of Jordan (SoJ)", mf: 0, fcr: 0, note: "+1 skills, +25% max mana" },
      { name: "Bul-Kathos' Wedding Band", mf: 0, fcr: 0, note: "+1 skills, life steal, +50 life" },
      { name: "Raven Frost", mf: 0, fcr: 0, note: "Cannot Be Frozen, +15-20 dex" },
      { name: "Dwarf Star", mf: 0, fcr: 0, note: "Cannot Be Frozen, +40 life" },
      { name: "The Rising Sun", mf: 0, fcr: 0, note: "Meteor CtC" },
      { name: "Nature's Peace", mf: 0, fcr: 0, note: "Prevent Monster Heal" },
      { name: "Rare ring + 10% FCR", mf: 0, fcr: 10 },
      { name: "Rare ring + 10% FCR + res", mf: 0, fcr: 10 },
      { name: "Rare ring + 10% FCR + 15% MF", mf: 15, fcr: 10, note: "Common good roll" },
      { name: "Rare ring + 10% FCR + 30% MF (of Chance)", mf: 30, fcr: 10, note: "Max FCR + max MF suffix — very rare" },
      { name: "Rare ring + 30% MF (no FCR)", mf: 30, fcr: 0, note: "Max MF suffix (of Chance)" },
      { name: "Crafted caster ring (10 FCR + mods)", mf: 0, fcr: 10 }
    ],
    charms: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "Annihilus (small charm)", mf: 15, fcr: 0, note: "+1 skills, +10-20 all stats/res" },
      { name: "Hellfire Torch", mf: 0, fcr: 0, note: "+3 class skills, +20 stats, +20 res" },
      { name: "Gheed's Fortune (grand charm)", mf: 40, fcr: 0, note: "20-40% MF, 80-160% extra gold, -10-15% vendor prices" },
      { name: "Anni + Torch", mf: 15, fcr: 0, note: "Both endgame charms equipped" },
      { name: "Anni + Torch + Gheed's", mf: 55, fcr: 0, note: "All 3 unique charms — best single-slot MF" },
      { name: "8× MF small charms (7% each)", mf: 56, fcr: 0, note: "Fortune charms — big MF bank" },
      { name: "Anni + Torch + 6× MF SC (7%)", mf: 57, fcr: 0, note: "Endgame farming loadout" },
      { name: "Anni + Torch + 8× MF SC", mf: 71, fcr: 0, note: "Max small-charm MF bank" },
      { name: "Anni + Torch + Gheed's + 6× MF SC", mf: 97, fcr: 0, note: "Ultimate MF charm loadout" },
      { name: "Anni + Torch + Gheed's + 4× MF SC", mf: 83, fcr: 0, note: "Balanced MF + skiller room" },
      { name: "Anni + Torch + 4× skiller GC", mf: 15, fcr: 0, note: "Damage-focused loadout" },
      { name: "Anni + Torch + 3× 10 FHR SC", mf: 15, fcr: 0, note: "Defensive loadout" }
    ],
    sockets: [
      { name: "— None —", mf: 0, fcr: 0 },
      { name: "1× Ist rune (weapon)", mf: 30, fcr: 0, note: "Ist = +30% MF in weapon" },
      { name: "1× Ist rune (armor/helm/shield)", mf: 25, fcr: 0, note: "Ist = +25% MF in armor/helm/shield" },
      { name: "2× Ist (Shako + Skullder's)", mf: 50, fcr: 0, note: "25% × 2 armor slots" },
      { name: "3× Ist (helm + armor + weapon)", mf: 80, fcr: 0, note: "25 + 25 + 30 = 80% MF" },
      { name: "4× Ist (helm + armor + shield + weapon)", mf: 105, fcr: 0, note: "25 + 25 + 25 + 30 = 105% MF" },
      { name: "5× Ist runes", mf: 130, fcr: 0, note: "add second armor slot (rare)" },
      { name: "6× Ist runes", mf: 155, fcr: 0, note: "realistic max on caster" },
      { name: "P Topaz × 4 (4os armor)", mf: 96, fcr: 0, note: "P Topaz in armor = 24% MF each" },
      { name: "P Topaz × 3 (3os helm)", mf: 72, fcr: 0, note: "e.g. cube-rolled Shako alternative" }
    ]
  };

  // FCR breakpoint tables: [fcr_needed, frames_result]
  // Fewer frames = faster cast. Base is entry with fcr 0.
  const CALC_FCR_BP = {
    sorc:  { name: "Sorc (Teleport / Spells)",
             bp: [ [0,13], [9,12], [20,11], [37,10], [63,9], [105,8], [200,7] ] },
    necro: { name: "Necromancer",
             bp: [ [0,15], [9,14], [18,13], [30,12], [48,11], [75,10], [125,9] ] },
    pally: { name: "Paladin (Hammerdin)",
             bp: [ [0,15], [9,14], [18,13], [30,12], [48,11], [75,10], [125,9] ] },
    druid: { name: "Druid (Human form)",
             bp: [ [0,15], [4,14], [10,13], [19,12], [30,11], [46,10], [68,9], [99,8], [163,7] ] },
    sin:   { name: "Assassin",
             bp: [ [0,17], [8,16], [16,15], [27,14], [42,13], [65,12], [102,11], [174,10] ] },
    ama:   { name: "Amazon",
             bp: [ [0,20], [7,19], [15,18], [23,17], [35,16], [52,15], [78,14], [117,13], [194,12] ] },
    barb:  { name: "Barbarian (Leap / Warcries)",
             bp: [ [0,15], [9,14], [20,13], [37,12], [63,11], [105,10] ] }
  };

  // Presets: pre-selected item indexes per slot
  const CALC_PRESETS = {
    // Mephisto MF farmer — cold sorc: max MF while holding 63% FCR breakpoint
    meph: {
      helm: 2,      // Shako
      amulet: 1,    // Mara's
      armor: 2,     // Skullder's (MF + socket for Ist)
      weapon: 4,    // Death's Fathom
      offhand: 1,   // Spirit (Monarch)
      gloves: 1,    // Chance Guards
      belt: 2,      // Arachnid
      boots: 1,     // War Traveler
      ring1: 1,     // Nagelring
      ring2: 10,    // Rare 10 FCR + 15 MF
      charms: 7,    // Anni + Torch + 6 MF SC
      sockets: 4    // 3× Ist (Shako + Skullder's + weapon)
    },
    // Chaos Sanctuary XP/damage focus — max damage, hold 63% FCR
    chaos: {
      helm: 7,      // Griffon's Eye
      amulet: 1,    // Mara's
      armor: 4,     // Vipermagi
      weapon: 3,    // HotO
      offhand: 1,   // Spirit
      gloves: 2,    // Magefist
      belt: 2,      // Arachnid
      boots: 2,     // Waterwalk
      ring1: 8,     // Rare 10 FCR
      ring2: 9,     // Rare 10 FCR + res
      charms: 11,   // Anni + Torch + 4 skillers
      sockets: 0    // None — damage focus
    },
    // Pure MF speed farmer — Wealth + Gull + max MF everywhere (low FCR)
    speed: {
      helm: 1,      // Tarnhelm
      amulet: 1,    // Mara's
      armor: 3,     // Wealth (+100% MF)
      weapon: 1,    // Gull (+100% MF)
      offhand: 2,   // Rhyme (+25% MF)
      gloves: 1,    // Chance Guards
      belt: 1,      // Goldwrap
      boots: 1,     // War Traveler
      ring1: 1,     // Nagelring
      ring2: 1,     // Nagelring
      charms: 9,    // Anni + Torch + Gheed's + 6× MF SC
      sockets: 5    // 4× Ist runes
    },
    reset: null
  };

  const slotSelects = document.querySelectorAll('.calc-select[data-slot]');
  const classSelect = document.getElementById('calcClass');
  const presetBtns  = document.querySelectorAll('.calc-preset-btn');

  const fcrTotalEl   = document.getElementById('calcFcrTotal');
  const fcrDetailEl  = document.getElementById('calcFcrDetail');
  const fcrBarEl     = document.getElementById('calcFcrBar');
  const fcrBpHintEl  = document.getElementById('calcFcrBpHint');
  const mfTotalEl    = document.getElementById('calcMfTotal');
  const mfBarEl      = document.getElementById('calcMfBar');
  const effUniqueEl  = document.getElementById('calcEffUnique');
  const effSetEl     = document.getElementById('calcEffSet');
  const effRareEl    = document.getElementById('calcEffRare');
  const verdictEl    = document.getElementById('calcVerdict');

  if (!slotSelects.length || !classSelect) return;

  // Populate all selects
  function populateSlots() {
    slotSelects.forEach(sel => {
      const slot = sel.dataset.slot;
      const items = CALC_ITEMS[slot] || [];
      sel.innerHTML = '';
      items.forEach((it, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = it.note ? `${it.name}  ·  ${it.note}` : it.name;
        sel.appendChild(opt);
      });
    });
  }

  function getSelected() {
    const totals = { mf: 0, fcr: 0 };
    slotSelects.forEach(sel => {
      const slot = sel.dataset.slot;
      const idx = parseInt(sel.value, 10) || 0;
      const item = (CALC_ITEMS[slot] || [])[idx];
      if (item) {
        totals.mf  += item.mf  || 0;
        totals.fcr += item.fcr || 0;
      }
    });
    return totals;
  }

  function getBreakpoint(fcr, classKey) {
    const table = CALC_FCR_BP[classKey] || CALC_FCR_BP.sorc;
    let hit = table.bp[0];
    let next = null;
    for (let i = 0; i < table.bp.length; i++) {
      if (fcr >= table.bp[i][0]) {
        hit = table.bp[i];
        next = table.bp[i + 1] || null;
      } else {
        break;
      }
    }
    return { hit, next, tableName: table.name, cap: table.bp[table.bp.length - 1] };
  }

  function updateVerdict(totals, bp) {
    let cls = 'calc-verdict';
    let icon = '💡';
    let text = '';
    const effU = totals.mf * 250 / (totals.mf + 250);
    const isCapFcr = totals.fcr >= bp.cap[0];
    const hitsBreakpoint = bp.hit[0] > 0; // any real breakpoint reached
    const slowCasts = bp.hit[1] > bp.cap[1] + 3;

    if (totals.mf === 0 && totals.fcr === 0) {
      text = 'Pick items to see your farming verdict.';
    }
    // 🏆 Best-possible HYBRID — genuinely hard to build (200+ MF while hitting a real FCR breakpoint)
    else if (totals.mf >= 250 && hitsBreakpoint && !slowCasts) {
      cls += ' verdict-good';
      icon = '🏆';
      text = `Elite hybrid caster — ${totals.mf}% MF (${effU.toFixed(0)}% effective on uniques) at ${bp.hit[0]}% FCR / ${bp.hit[1]}f casts. Excellent balance; the trade-off is well tuned.`;
    }
    // 💰 Extreme MF farmer (Wealth + Gull tier) — max drops, slow casts expected
    else if (totals.mf >= 500) {
      cls += ' verdict-good';
      icon = '💰';
      text = `Loot-goblin build — ${totals.mf}% raw MF (${effU.toFixed(0)}% effective on uniques). Diminishing returns kicking in hard past ~300%. Perfect for chest/council runs.`;
    }
    // ⭐ Solid MF farmer — reasonable both stats
    else if (totals.mf >= 150 && hitsBreakpoint && !slowCasts) {
      cls += ' verdict-good';
      icon = '⭐';
      text = `Solid farmer — ${totals.mf}% MF (${effU.toFixed(0)}% effective) at ${bp.hit[0]}% FCR / ${bp.hit[1]}f. Fast kills + decent drops.`;
    }
    // ⚡ Pure FCR/damage — low MF, high speed (fine for XP/rushing/PvM chaos)
    else if (totals.mf < 150 && isCapFcr) {
      cls += ' verdict-warn';
      icon = '⚡';
      text = `Pure speed/damage build — ${totals.fcr}% FCR (max ${bp.cap[1]}f), only ${totals.mf}% MF. Great for XP, Chaos, PvP, or rushing; skip for MF farming.`;
    }
    // ⚡ Reached breakpoint but low MF
    else if (totals.mf < 150 && hitsBreakpoint) {
      cls += ' verdict-warn';
      icon = '⚡';
      text = `Damage-focused (${bp.hit[0]}% FCR / ${bp.hit[1]}f) with only ${totals.mf}% MF. Consider Chance Guards + War Traveler for easy MF gains.`;
    }
    // 🐢 High MF but casts are painful
    else if (totals.mf >= 200 && slowCasts) {
      cls += ' verdict-warn';
      icon = '🐢';
      text = `${totals.mf}% MF is nice, but ${bp.hit[1]}-frame casts are slow. Even one FCR breakpoint often out-farms +100% MF. Try Spirit shield or Magefist.`;
    }
    // ⚠️ Broken — no MF and no FCR breakpoint
    else if (totals.mf < 50 && !hitsBreakpoint) {
      cls += ' verdict-bad';
      icon = '⚠️';
      text = `Weak loadout: ${totals.mf}% MF, no FCR breakpoint hit. Pick some real items.`;
    }
    else {
      cls += ' verdict-warn';
      text = `Mixed build: ${totals.mf}% MF (${effU.toFixed(0)}% effective on uniques) at ${bp.hit[0] || 0}% FCR / ${bp.hit[1]}f. Room to specialize.`;
    }

    verdictEl.className = cls;
    verdictEl.querySelector('.calc-verdict-icon').textContent = icon;
    verdictEl.querySelector('.calc-verdict-text').textContent = text;
  }

  function recalculate() {
    const totals = getSelected();
    const classKey = classSelect.value;
    const bp = getBreakpoint(totals.fcr, classKey);

    // FCR display
    fcrTotalEl.textContent = totals.fcr + '%';
    fcrDetailEl.textContent = `${bp.hit[1]} frames per cast (${bp.tableName})`;
    if (bp.next) {
      const need = bp.next[0] - totals.fcr;
      fcrBpHintEl.textContent = `➜ Next breakpoint at ${bp.next[0]}% FCR (need +${need}%) = ${bp.next[1]} frames.`;
      fcrBpHintEl.classList.remove('hit');
    } else {
      fcrBpHintEl.textContent = `✔ You've hit the maximum FCR breakpoint (${bp.cap[1]} frames).`;
      fcrBpHintEl.classList.add('hit');
    }
    // FCR bar width — progress toward cap
    const fcrPct = Math.min(100, (totals.fcr / bp.cap[0]) * 100);
    fcrBarEl.style.width = fcrPct + '%';

    // MF display
    mfTotalEl.textContent = totals.mf + '%';
    // MF bar — visualize against "1000% is huge" scale
    const mfPct = Math.min(100, (totals.mf / 500) * 100);
    mfBarEl.style.width = mfPct + '%';

    // Effective MF
    const effU = totals.mf * 250 / (totals.mf + 250);
    const effS = totals.mf * 500 / (totals.mf + 500);
    const effR = totals.mf * 600 / (totals.mf + 600);
    effUniqueEl.textContent = (totals.mf === 0 ? 0 : effU).toFixed(0) + '%';
    effSetEl.textContent    = (totals.mf === 0 ? 0 : effS).toFixed(0) + '%';
    effRareEl.textContent   = (totals.mf === 0 ? 0 : effR).toFixed(0) + '%';

    updateVerdict(totals, bp);
  }

  function applyPreset(key) {
    if (key === 'reset') {
      slotSelects.forEach(sel => { sel.value = '0'; });
    } else {
      const preset = CALC_PRESETS[key];
      if (!preset) return;
      slotSelects.forEach(sel => {
        const slot = sel.dataset.slot;
        if (preset[slot] !== undefined) sel.value = String(preset[slot]);
      });
    }
    recalculate();
  }

  populateSlots();
  slotSelects.forEach(sel => sel.addEventListener('change', recalculate));
  classSelect.addEventListener('change', recalculate);
  presetBtns.forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
  recalculate();
})();


/* ─── Holy Grail Tracker ────────────────────────────────── */
(function () {
  const STORAGE_KEY = 'd2grail_v1';

  // Items initially marked found (from user's existing list — kept for backward compat)
  const INITIAL_FOUND = new Set([
    'shako', 'arachnid', 'vipermagi', 'lidless', 'magefist', 'war-trav',
    'tal-belt', 'herald', 'jalals', 'titans', 'shaftstop', 'bul-kathos',
    'eschutas', 'marrowwalk', 'chance-guards', 'duriels', 'guardian-angel'
  ]);

  /* ═══════════════════ MASTER ITEM REGISTRY ══════════════════════
     One source of truth for every unique tracked in the grail.
     Fields:
       id         — stable checkbox / storage key
       name       — display name
       slot       — helm|body|shield|belt|boots|gloves|ring|amulet|weapon|
                    orb|wand|scepter|pelt|barbhelm|palashield|necroshield|
                    jav|amabow|amaspear|jewel|charm
       tier       — s | excellent | solid | budget | junk
       classItem  — (optional) only usable by: amazon|necro|sorc|pala|barb|druid|sin
       boss       — array of famous farm targets that drop it
     ══════════════════════════════════════════════════════════════ */
  const ITEMS = [
    // ─── HELMS (universal) ──────────────────────────────
    { id:'shako',        name:"Harlequin Crest (Shako)",  slot:'helm', tier:'s',         boss:['mephisto','diablo','baal'] },
    { id:'kira',         name:"Kira's Guardian",          slot:'helm', tier:'s',         boss:['baal','diablo'] },
    { id:'nightwings',   name:"Nightwing's Veil",         slot:'helm', tier:'s',         boss:['mephisto','diablo','baal'] },
    { id:'griffons',     name:"Griffon's Eye",            slot:'helm', tier:'s',         boss:['baal','diablo','pit'] },
    { id:'crown-ages',   name:"Crown of Ages",            slot:'helm', tier:'s',         boss:['baal'] },
    { id:'andariels',    name:"Andariel's Visage",        slot:'helm', tier:'excellent', boss:['baal','nihlathak','pindle'] },
    { id:'vgaze',        name:"Vampire Gaze",             slot:'helm', tier:'excellent', boss:['mephisto','pindle'] },
    { id:'giant-skull',  name:"Giant Skull",              slot:'helm', tier:'solid',     boss:['baal','diablo'] },
    { id:'veil-steel',   name:"Veil of Steel",            slot:'helm', tier:'solid',     boss:['baal','diablo'] },
    { id:'steelshade',   name:"Steelshade",               slot:'helm', tier:'solid',     boss:['baal','diablo'] },
    { id:'blackhorns',   name:"Blackhorn's Face",         slot:'helm', tier:'solid',     boss:['mephisto','baal'] },
    { id:'rockstopper',  name:"Rockstopper",              slot:'helm', tier:'solid',     boss:['mephisto','baal'] },
    { id:'crown-thieves',name:"Crown of Thieves",         slot:'helm', tier:'solid',     boss:['mephisto','baal'] },
    { id:'stealskull',   name:"Stealskull",               slot:'helm', tier:'solid',     boss:['countess','mephisto'] },
    { id:'peasant-crown',name:"Peasant Crown",            slot:'helm', tier:'budget',    boss:['countess','pindle'] },
    { id:'tarnhelm',     name:"Tarnhelm",                 slot:'helm', tier:'budget',    boss:['countess','pindle'] },
    { id:'undead-crown', name:"Undead Crown",             slot:'helm', tier:'budget',    boss:['countess'] },
    { id:'face-horror',  name:"The Face of Horror",       slot:'helm', tier:'junk',      boss:['countess'] },
    { id:'wormskull',    name:"Wormskull",                slot:'helm', tier:'junk',      boss:['countess'] },
    { id:'howltusk',     name:"Howltusk",                 slot:'helm', tier:'budget',    boss:['countess','pindle'] },
    { id:'duskdeep',     name:"Duskdeep",                 slot:'helm', tier:'junk',      boss:['countess'] },
    { id:'coif-glory',   name:"Coif of Glory",            slot:'helm', tier:'junk',      boss:['countess'] },
    { id:'darksight',    name:"Darksight Helm",           slot:'helm', tier:'budget',    boss:['mephisto','pindle'] },

    // ─── BARBARIAN PRIMAL HELMS ─────────────────────────
    { id:'arreats',      name:"Arreat's Face",            slot:'barbhelm', tier:'s',        classItem:'barb', boss:['baal'] },
    { id:'wolfhowl',     name:"Wolfhowl",                 slot:'barbhelm', tier:'s',        classItem:'barb', boss:['baal'] },
    { id:'halaberds',    name:"Halaberd's Reign",         slot:'barbhelm', tier:'solid',    classItem:'barb', boss:['baal'] },
    { id:'demonhorn',    name:"Demonhorn's Edge",         slot:'barbhelm', tier:'solid',    classItem:'barb', boss:['baal','diablo'] },
    { id:'valk-wing',    name:"Valkyrie Wing",            slot:'barbhelm', tier:'solid',    classItem:'barb', boss:['mephisto','baal'] },

    // ─── DRUID PELTS ────────────────────────────────────
    { id:'jalals',       name:"Jalal's Mane",             slot:'pelt', tier:'s',           classItem:'druid', boss:['baal','diablo'] },
    { id:'ravenlore',    name:"Ravenlore",                slot:'pelt', tier:'excellent',   classItem:'druid', boss:['baal','diablo'] },
    { id:'cerebus',      name:"Cerebus",                  slot:'pelt', tier:'solid',       classItem:'druid', boss:['mephisto','baal'] },
    { id:'spirit-keeper',name:"Spirit Keeper",            slot:'pelt', tier:'solid',       classItem:'druid', boss:['baal'] },
    { id:'wolfhead',     name:"Wolfhead",                 slot:'pelt', tier:'budget',      classItem:'druid', boss:['countess','pindle'] },

    // ─── BODY ARMOR ─────────────────────────────────────
    { id:'tyraels',      name:"Tyrael's Might",           slot:'body', tier:'s',         boss:['baal','uber'] },
    { id:'shaftstop',    name:"Shaftstop",                slot:'body', tier:'excellent', boss:['mephisto','baal'] },
    { id:'duriels',      name:"Duriel's Shell",           slot:'body', tier:'excellent', boss:['duriel','baal'] },
    { id:'guardian-angel',name:"Guardian Angel",          slot:'body', tier:'solid',     boss:['mephisto','baal'] },
    { id:'skullders',    name:"Skullder's Ire",           slot:'body', tier:'excellent', boss:['mephisto','baal'] },
    { id:'que-hegans',   name:"Que-Hegan's Wisdom",       slot:'body', tier:'solid',     boss:['mephisto','baal'] },
    { id:'gladiators',   name:"Gladiator's Bane",         slot:'body', tier:'excellent', boss:['baal','diablo'] },
    { id:'templars',     name:"Templar's Might",          slot:'body', tier:'solid',     boss:['baal','diablo'] },
    { id:'atmas-wail',   name:"Atma's Wail",              slot:'body', tier:'solid',     boss:['mephisto','baal'] },
    { id:'corpsemourn',  name:"Corpsemourn",              slot:'body', tier:'solid',     boss:['mephisto','baal'] },
    { id:'black-hades',  name:"Black Hades",              slot:'body', tier:'solid',     boss:['baal','diablo'] },
    { id:'ormus',        name:"Ormus' Robes",             slot:'body', tier:'excellent', boss:['baal','diablo'] },
    { id:'vipermagi',    name:"Skin of the Vipermagi",    slot:'body', tier:'solid',     boss:['mephisto','pindle'] },
    { id:'iron-pelt',    name:"Iron Pelt",                slot:'body', tier:'budget',    boss:['pindle','mephisto'] },
    { id:'toothrow',     name:"Toothrow",                 slot:'body', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'arkaine',      name:"Arkaine's Valor",          slot:'body', tier:'excellent', boss:['baal','diablo'] },
    { id:'leviathan',    name:"Leviathan",                slot:'body', tier:'solid',     boss:['baal','diablo'] },
    { id:'steel-carapace',name:"Steel Carapace",          slot:'body', tier:'solid',     boss:['baal','diablo'] },
    { id:'rattlecage',   name:"Rattlecage",               slot:'body', tier:'budget',    boss:['countess','mephisto'] },
    { id:'goldskin',     name:"Goldskin",                 slot:'body', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'silks',        name:"Silks of the Victor",      slot:'body', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'twitchthroe',  name:"Twitchthroe",              slot:'body', tier:'junk',      boss:['countess'] },
    { id:'boneflesh',    name:"Boneflesh",                slot:'body', tier:'junk',      boss:['countess'] },
    { id:'rockfleece',   name:"Rockfleece",               slot:'body', tier:'budget',    boss:['countess','pindle'] },
    { id:'iceblink',     name:"Iceblink",                 slot:'body', tier:'budget',    boss:['countess','pindle'] },
    { id:'hawkmail',     name:"Hawkmail",                 slot:'body', tier:'junk',      boss:['countess'] },
    { id:'darkglow',     name:"Darkglow",                 slot:'body', tier:'junk',      boss:['countess'] },
    { id:'venom-ward',   name:"Venom Ward",               slot:'body', tier:'junk',      boss:['countess'] },
    { id:'tal-armor',    name:"Tal Rasha's Guardianship", slot:'body', tier:'excellent', boss:['mephisto','baal'] },

    // ─── SHIELDS (universal) ────────────────────────────
    { id:'stormshield',  name:"Stormshield",              slot:'shield', tier:'excellent', boss:['mephisto','baal'] },
    { id:'lidless',      name:"Lidless Wall",             slot:'shield', tier:'excellent', boss:['mephisto','baal'] },
    { id:'gerkes',       name:"Gerke's Sanctuary",        slot:'shield', tier:'solid',     boss:['mephisto','baal'] },
    { id:'moser',        name:"Moser's Blessed Circle",   slot:'shield', tier:'solid',     boss:['countess','mephisto'] },
    { id:'spirit-ward',  name:"Spirit Ward",              slot:'shield', tier:'solid',     boss:['baal','diablo'] },
    { id:'blackoak',     name:"Blackoak Shield",          slot:'shield', tier:'solid',     boss:['mephisto','baal'] },
    { id:'radaments-sphere',name:"Radament's Sphere",     slot:'shield', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'headhunter',   name:"Head Hunter's Glory",      slot:'shield', tier:'solid',     boss:['baal','diablo'] },
    { id:'visceratuant', name:"Visceratuant",             slot:'shield', tier:'budget',    boss:['countess','pindle'] },
    { id:'stormguild',   name:"Stormguild",               slot:'shield', tier:'budget',    boss:['countess','pindle'] },
    { id:'steelclash',   name:"Steelclash",               slot:'shield', tier:'budget',    boss:['countess','pindle'] },
    { id:'wall-eyeless', name:"Wall of the Eyeless",      slot:'shield', tier:'junk',      boss:['countess'] },

    // ─── PALADIN SHIELDS ────────────────────────────────
    { id:'herald',       name:"Herald of Zakarum",        slot:'palashield', tier:'excellent', classItem:'pala', boss:['mephisto','baal'] },
    { id:'alma-negra',   name:"Alma Negra",               slot:'palashield', tier:'solid',     classItem:'pala', boss:['baal'] },
    { id:'dragonscale',  name:"Dragonscale",              slot:'palashield', tier:'solid',     classItem:'pala', boss:['baal'] },

    // ─── NECRO SHRUNKEN HEADS ───────────────────────────
    { id:'homunculus',   name:"Homunculus",               slot:'necroshield', tier:'solid',     classItem:'necro', boss:['mephisto','baal'] },
    { id:'boneflame',    name:"Boneflame",                slot:'necroshield', tier:'solid',     classItem:'necro', boss:['baal'] },
    { id:'darkforce',    name:"Darkforce Spawn",          slot:'necroshield', tier:'solid',     classItem:'necro', boss:['baal','diablo'] },
    { id:'umbral-disk',  name:"Umbral Disk",              slot:'necroshield', tier:'budget',    classItem:'necro', boss:['mephisto','pindle'] },

    // ─── BELTS ──────────────────────────────────────────
    { id:'arachnid',     name:"Arachnid Mesh",            slot:'belt', tier:'s',         boss:['mephisto','baal'] },
    { id:'verdungos',    name:"Verdungo's Hearty Cord",   slot:'belt', tier:'excellent', boss:['mephisto','baal'] },
    { id:'tgods',        name:"Thundergod's Vigor",       slot:'belt', tier:'excellent', boss:['baal','diablo'] },
    { id:'string-ears',  name:"String of Ears",           slot:'belt', tier:'solid',     boss:['mephisto','baal'] },
    { id:'nosferatus',   name:"Nosferatu's Coil",         slot:'belt', tier:'solid',     boss:['mephisto','baal'] },
    { id:'goldwrap',     name:"Goldwrap",                 slot:'belt', tier:'solid',     boss:['countess','pindle'] },
    { id:'razortail',    name:"Razortail",                slot:'belt', tier:'solid',     boss:['mephisto','baal'] },
    { id:'snowclash',    name:"Snowclash",                slot:'belt', tier:'solid',     boss:['baal','diablo'] },
    { id:'gloom-trap',   name:"Gloom's Trap",             slot:'belt', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'bladebuckle',  name:"Bladebuckle",              slot:'belt', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'lenymo',       name:"Lenymo",                   slot:'belt', tier:'junk',      boss:['countess'] },
    { id:'snakecord',    name:"Snakecord",                slot:'belt', tier:'junk',      boss:['countess'] },
    { id:'nightsmoke',   name:"Nightsmoke",               slot:'belt', tier:'budget',    boss:['countess','pindle'] },
    { id:'tal-belt',     name:"Tal Rasha's Fine-Spun Cloth", slot:'belt', tier:'excellent', boss:['mephisto','baal'] },

    // ─── BOOTS ──────────────────────────────────────────
    { id:'war-trav',     name:"War Traveler",             slot:'boots', tier:'excellent', boss:['mephisto','baal'] },
    { id:'sandstorm',    name:"Sandstorm Trek",           slot:'boots', tier:'excellent', boss:['mephisto','pit'] },
    { id:'gore-rider',   name:"Gore Rider",               slot:'boots', tier:'excellent', boss:['baal','nihlathak'] },
    { id:'shadow-dancer',name:"Shadow Dancer",            slot:'boots', tier:'solid',     boss:['baal','diablo'] },
    { id:'marrowwalk',   name:"Marrowwalk",               slot:'boots', tier:'solid',     boss:['baal','nihlathak'] },
    { id:'water-walk',   name:"Water Walk",               slot:'boots', tier:'solid',     boss:['mephisto','baal'] },
    { id:'silkweave',    name:"Silkweave",                slot:'boots', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'inferno-stride',name:"Infernostride",           slot:'boots', tier:'solid',     boss:['mephisto','pindle'] },
    { id:'goblin-toe',   name:"Goblin Toe",               slot:'boots', tier:'budget',    boss:['countess','pindle'] },
    { id:'tearhaunch',   name:"Tearhaunch",               slot:'boots', tier:'budget',    boss:['countess'] },
    { id:'hotspur',      name:"Hotspur",                  slot:'boots', tier:'junk',      boss:['countess'] },
    { id:'gorefoot',     name:"Gorefoot",                 slot:'boots', tier:'junk',      boss:['countess'] },
    { id:'treads-cthon', name:"Treads of Cthon",          slot:'boots', tier:'junk',      boss:['countess'] },
    { id:'aldurs-advance',name:"Aldur's Advance",         slot:'boots', tier:'solid',     boss:['baal','diablo'] },

    // ─── GLOVES ─────────────────────────────────────────
    { id:'draculs',      name:"Dracul's Grasp",           slot:'gloves', tier:'excellent', boss:['mephisto','baal'] },
    { id:'steelrend',    name:"Steelrend",                slot:'gloves', tier:'excellent', boss:['baal','diablo'] },
    { id:'soul-drainer', name:"Soul Drainer",             slot:'gloves', tier:'solid',     boss:['mephisto','baal'] },
    { id:'lava-gout',    name:"Lava Gout",                slot:'gloves', tier:'solid',     boss:['mephisto','baal'] },
    { id:'magefist',     name:"Magefist",                 slot:'gloves', tier:'solid',     boss:['countess','mephisto'] },
    { id:'frostburn',    name:"Frostburn",                slot:'gloves', tier:'solid',     boss:['mephisto','pindle'] },
    { id:'chance-guards',name:"Chance Guards",            slot:'gloves', tier:'solid',     boss:['countess','pindle'] },
    { id:'venom-grip',   name:"Venom Grip",               slot:'gloves', tier:'budget',    boss:['countess','pindle'] },
    { id:'gravepalm',    name:"Gravepalm",                slot:'gloves', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'ghoulhide',    name:"Ghoulhide",                slot:'gloves', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'hellmouth',    name:"Hellmouth",                slot:'gloves', tier:'solid',     boss:['baal','diablo'] },
    { id:'bloodfist',    name:"Bloodfist",                slot:'gloves', tier:'budget',    boss:['countess','pindle'] },
    { id:'hand-broc',    name:"The Hand of Broc",         slot:'gloves', tier:'junk',      boss:['countess'] },

    // ─── RINGS ──────────────────────────────────────────
    { id:'soj',          name:"Stone of Jordan",          slot:'ring', tier:'s',         boss:['nm-anda','baal','diablo'] },
    { id:'bul-kathos',   name:"Bul-Kathos' Wedding Band", slot:'ring', tier:'s',         boss:['baal','diablo'] },
    { id:'raven-frost',  name:"Raven Frost",              slot:'ring', tier:'excellent', boss:['countess','mephisto'] },
    { id:'wisp',         name:"Wisp Projector",           slot:'ring', tier:'excellent', boss:['diablo','baal'] },
    { id:'nagelring',    name:"Nagelring",                slot:'ring', tier:'solid',     boss:['countess','pindle'] },
    { id:'manald',       name:"Manald Heal",              slot:'ring', tier:'solid',     boss:['countess','pindle'] },
    { id:'dwarf-star',   name:"Dwarf Star",               slot:'ring', tier:'solid',     boss:['countess','pindle'] },
    { id:'nature-peace', name:"Nature's Peace",           slot:'ring', tier:'solid',     boss:['mephisto','baal'] },
    { id:'carrion-wind', name:"Carrion Wind",             slot:'ring', tier:'solid',     boss:['mephisto','baal'] },

    // ─── AMULETS ────────────────────────────────────────
    { id:'mara',         name:"Mara's Kaleidoscope",      slot:'amulet', tier:'s',         boss:['mephisto','baal'] },
    { id:'highlords',    name:"Highlord's Wrath",         slot:'amulet', tier:'excellent', boss:['mephisto','baal'] },
    { id:'metalgrid',    name:"Metalgrid",                slot:'amulet', tier:'excellent', boss:['baal'] },
    { id:'atmas-scarab', name:"Atma's Scarab",            slot:'amulet', tier:'solid',     boss:['mephisto','baal'] },
    { id:'cats-eye',     name:"The Cat's Eye",            slot:'amulet', tier:'solid',     boss:['mephisto','baal'] },
    { id:'rising-sun',   name:"The Rising Sun",           slot:'amulet', tier:'solid',     boss:['mephisto','baal'] },
    { id:'seraph-hymn',  name:"Seraph's Hymn",            slot:'amulet', tier:'solid',     boss:['baal','diablo'] },
    { id:'eye-etlich',   name:"The Eye of Etlich",        slot:'amulet', tier:'budget',    boss:['countess','pindle'] },
    { id:'mahim-oak',    name:"The Mahim-Oak Curio",      slot:'amulet', tier:'budget',    boss:['countess','pindle'] },
    { id:'nokozan',      name:"Nokozan Relic",            slot:'amulet', tier:'junk',      boss:['countess'] },
    { id:'saracens',     name:"Saracen's Chance",         slot:'amulet', tier:'budget',    boss:['countess','pindle'] },
    { id:'tal-ammy',     name:"Tal Rasha's Adjudication", slot:'amulet', tier:'excellent', boss:['mephisto','baal'] },

    // ─── SORCERESS ORBS ─────────────────────────────────
    { id:'oculus',       name:"The Oculus",               slot:'orb', tier:'solid',       classItem:'sorc', boss:['mephisto','baal'] },
    { id:'eschutas',     name:"Eschuta's Temper",         slot:'orb', tier:'excellent',   classItem:'sorc', boss:['baal','diablo'] },
    { id:'deaths-fathom',name:"Death's Fathom",           slot:'orb', tier:'s',           classItem:'sorc', boss:['pit','baal','diablo'] },
    { id:'tal-orb',      name:"Tal Rasha's Lidless Eye",  slot:'orb', tier:'excellent',   classItem:'sorc', boss:['mephisto','baal'] },

    // ─── NECROMANCER WANDS ──────────────────────────────
    { id:'deaths-web',   name:"Death's Web",              slot:'wand', tier:'s',           classItem:'necro', boss:['baal','pit'] },
    { id:'boneshade',    name:"Boneshade",                slot:'wand', tier:'excellent',   classItem:'necro', boss:['baal','diablo'] },
    { id:'blackhand',    name:"Blackhand Key",            slot:'wand', tier:'solid',       classItem:'necro', boss:['mephisto','baal'] },
    { id:'suicide-branch',name:"Suicide Branch",          slot:'wand', tier:'solid',       classItem:'necro', boss:['countess','mephisto'] },
    { id:'arm-leoric',   name:"Arm of King Leoric",       slot:'wand', tier:'budget',      classItem:'necro', boss:['countess','mephisto'] },
    { id:'ume-lament',   name:"Ume's Lament",             slot:'wand', tier:'budget',      classItem:'necro', boss:['countess'] },
    { id:'gravenspine',  name:"Gravenspine",              slot:'wand', tier:'budget',      classItem:'necro', boss:['countess','pindle'] },
    { id:'torch-iro',    name:"Torch of Iro",             slot:'wand', tier:'junk',        classItem:'necro', boss:['countess'] },
    { id:'maelstrom',    name:"Maelstrom",                slot:'wand', tier:'junk',        classItem:'necro', boss:['countess'] },
    { id:'carin-shard',  name:"Carin Shard",              slot:'wand', tier:'junk',        classItem:'necro', boss:['countess'] },

    // ─── PALADIN SCEPTERS ───────────────────────────────
    { id:'astreons',     name:"Astreon's Iron Ward",      slot:'scepter', tier:'excellent',classItem:'pala', boss:['baal','diablo'] },
    { id:'heavens-light',name:"Heaven's Light",           slot:'scepter', tier:'solid',    classItem:'pala', boss:['baal','diablo'] },
    { id:'hand-bl',      name:"The Hand of Blessed Light",slot:'scepter', tier:'solid',    classItem:'pala', boss:['baal','diablo'] },
    { id:'redeemer',     name:"The Redeemer",             slot:'scepter', tier:'solid',    classItem:'pala', boss:['baal','diablo'] },
    { id:'stormeye',     name:"Stormeye",                 slot:'scepter', tier:'solid',    classItem:'pala', boss:['mephisto','baal'] },
    { id:'fetid-sprinkler',name:"The Fetid Sprinkler",    slot:'scepter', tier:'solid',    classItem:'pala', boss:['mephisto','baal'] },
    { id:'zakarum-hand', name:"Zakarum's Hand",           slot:'scepter', tier:'solid',    classItem:'pala', boss:['mephisto','baal'] },
    { id:'knell-striker',name:"Knell Striker",            slot:'scepter', tier:'budget',   classItem:'pala', boss:['countess','pindle'] },
    { id:'rusthandle',   name:"Rusthandle",               slot:'scepter', tier:'budget',   classItem:'pala', boss:['countess','pindle'] },

    // ─── AMAZON JAVELINS / BOWS / SPEARS ────────────────
    { id:'titans',       name:"Titan's Revenge",          slot:'jav', tier:'s',            classItem:'amazon', boss:['mephisto','baal'] },
    { id:'thunderstroke',name:"Thunderstroke",            slot:'jav', tier:'excellent',    classItem:'amazon', boss:['baal','diablo'] },
    { id:'stoneraven',   name:"Stoneraven",               slot:'jav', tier:'solid',        classItem:'amazon', boss:['baal','diablo'] },
    { id:'demon-arch',   name:"Demon's Arch",             slot:'jav', tier:'solid',        classItem:'amazon', boss:['baal','diablo'] },
    { id:'impaler',      name:"The Impaler",              slot:'jav', tier:'budget',       classItem:'amazon', boss:['pindle','mephisto'] },
    { id:'lycander-aim', name:"Lycander's Aim",           slot:'amabow', tier:'solid',     classItem:'amazon', boss:['mephisto','baal'] },
    { id:'lycander-flank',name:"Lycander's Flank",        slot:'amaspear', tier:'solid',   classItem:'amazon', boss:['mephisto','baal'] },
    { id:'eaglehorn',    name:"Eaglehorn",                slot:'amabow', tier:'s',         classItem:'amazon', boss:['baal','diablo'] },
    { id:'kuko',         name:"Kuko Shakaku",             slot:'amabow', tier:'solid',     classItem:'amazon', boss:['mephisto','baal'] },
    { id:'skystrike',    name:"Skystrike",                slot:'amabow', tier:'budget',    classItem:'amazon', boss:['countess','mephisto'] },
    { id:'witchwild',    name:"Witchwild String",         slot:'amabow', tier:'solid',     classItem:'amazon', boss:['mephisto','baal'] },
    { id:'magewrath',    name:"Magewrath",                slot:'amabow', tier:'solid',     classItem:'amazon', boss:['mephisto','baal'] },
    { id:'goldstrike',   name:"Goldstrike Arch",          slot:'amabow', tier:'solid',     classItem:'amazon', boss:['baal','diablo'] },
    { id:'endlesshail',  name:"Endlesshail",              slot:'amabow', tier:'budget',    classItem:'amazon', boss:['countess','pindle'] },
    { id:'riphook',      name:"Riphook",                  slot:'amabow', tier:'junk',      classItem:'amazon', boss:['countess'] },
    { id:'cliffkiller',  name:"Cliffkiller",              slot:'amabow', tier:'budget',    classItem:'amazon', boss:['countess','pindle'] },
    { id:'blastbark',    name:"Blastbark",                slot:'amabow', tier:'junk',      classItem:'amazon', boss:['countess'] },

    // ─── ASSASSIN KATARS ────────────────────────────────
    { id:'bartucs',      name:"Bartuc's Cut-Throat",      slot:'weapon', tier:'excellent', classItem:'sin', boss:['baal','diablo'] },
    { id:'jade-talon',   name:"Jade Talon",               slot:'weapon', tier:'solid',     classItem:'sin', boss:['baal','diablo'] },
    { id:'firelizard',   name:"Firelizard's Talons",      slot:'weapon', tier:'solid',     classItem:'sin', boss:['baal','diablo'] },
    { id:'shadowkiller', name:"Shadow Killer",            slot:'weapon', tier:'solid',     classItem:'sin', boss:['baal','diablo'] },
    { id:'chaos-talon',  name:"Chaos Talon",              slot:'weapon', tier:'solid',     classItem:'sin', boss:['baal','diablo'] },

    // ─── UNIVERSAL WEAPONS (melee/caster) ───────────────
    { id:'grandfather',  name:"The Grandfather",          slot:'weapon', tier:'s',         boss:['baal','diablo'] },
    { id:'doombringer',  name:"Doombringer",              slot:'weapon', tier:'excellent', boss:['baal','diablo'] },
    { id:'messerschmidts',name:"Messerschmidt's Reaver",  slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'baranars',     name:"Baranar's Star",           slot:'weapon', tier:'solid',     boss:['nihlathak','baal'] },
    { id:'hellslayer',   name:"Hellslayer",               slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'azurewrath',   name:"Azurewrath",               slot:'weapon', tier:'excellent', boss:['cows','baal'] },
    { id:'lightsabre',   name:"Lightsabre",               slot:'weapon', tier:'excellent', boss:['mephisto','baal'] },
    { id:'mang-songs',   name:"Mang Song's Lesson",       slot:'weapon', tier:'s',         classItem:'sorc', boss:['baal'] },
    { id:'ribcracker',   name:"Ribcracker",               slot:'weapon', tier:'solid',     boss:['mephisto','baal'] },
    { id:'bonehew',      name:"Bonehew",                  slot:'weapon', tier:'solid',     boss:['baal','diablo','cows'] },
    { id:'wizardspike',  name:"Wizardspike",              slot:'weapon', tier:'excellent', boss:['mephisto','baal'] },
    { id:'gull',         name:"Gull Dagger",              slot:'weapon', tier:'solid',     boss:['countess'] },
    { id:'reapers',      name:"Reaper's Toll",            slot:'weapon', tier:'excellent', boss:['countess','baal'] },
    { id:'bloodletter',  name:"Bloodletter",              slot:'weapon', tier:'solid',     boss:['mephisto','baal'] },
    { id:'stormspire',   name:"Stormspire",               slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'ethereal-edge',name:"Ethereal Edge",            slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'flamebellow',  name:"Flamebellow",              slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'earthshifter', name:"Earth Shifter",            slot:'weapon', tier:'excellent', boss:['baal','diablo'] },
    { id:'stormlash',    name:"Stormlash",                slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'schaefers',    name:"Schaefer's Hammer",        slot:'weapon', tier:'excellent', boss:['baal','diablo'] },
    { id:'butchers-pupil',name:"The Butcher's Pupil",     slot:'weapon', tier:'budget',    boss:['countess','mephisto'] },
    { id:'buriza',       name:"Buriza-Do Kyanon",         slot:'weapon', tier:'solid',     boss:['mephisto','pindle'] },
    { id:'hone-sundan',  name:"Hone Sundan",              slot:'weapon', tier:'solid',     boss:['countess','mephisto'] },
    { id:'widowmaker',   name:"Widowmaker",               slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'windforce',    name:"Windforce",                slot:'weapon', tier:'s',         boss:['baal','diablo'] },
    { id:'crainte-vomir',name:"Crainte Vomir",            slot:'weapon', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'headstriker',  name:"Headstriker",              slot:'weapon', tier:'budget',    boss:['countess','mephisto'] },
    { id:'blackbog-sharp',name:"Blackbog's Sharp",        slot:'weapon', tier:'budget',    boss:['countess','pindle'] },
    { id:'suwayyah',     name:"Jade Talon",               slot:'weapon', tier:'solid',     classItem:'sin', boss:['baal','diablo'], skip:true }, // dupe placeholder — filtered out

    // ─── RAINBOW FACETS ─────────────────────────────────
    { id:'facet-cold',   name:"Rainbow Facet — Cold",     slot:'jewel', tier:'s', boss:['pit','baal','diablo'] },
    { id:'facet-fire',   name:"Rainbow Facet — Fire",     slot:'jewel', tier:'s', boss:['pit','baal','diablo'] },
    { id:'facet-light',  name:"Rainbow Facet — Lightning",slot:'jewel', tier:'s', boss:['pit','baal','diablo'] },
    { id:'facet-poison', name:"Rainbow Facet — Poison",   slot:'jewel', tier:'s', boss:['pit','baal','diablo'] },

    // ─── CHARMS ─────────────────────────────────────────
    { id:'anni',         name:"Annihilus (Unique SC)",    slot:'charm', tier:'s',         boss:['uber'] },
    { id:'torch',        name:"Hellfire Torch (LC)",      slot:'charm', tier:'s',         boss:['uber'] },
    { id:'gheeds',       name:"Gheed's Fortune (GC)",     slot:'charm', tier:'excellent', boss:['countess','mephisto'] },
  ].filter(it => !it.skip);

  const NAME_BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i.name]));
  const ITEM_BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const UNIQUE_IDS = new Set(ITEMS.map(i => i.id));

  /* ═══════════════════ VIEW DEFINITIONS ═══════════════════ */

  // View: By Tier
  const TIER_CATEGORIES = [
    { id:'tier-s',      view:'tier', title:'⭐ S-Tier — Jackpot Drops',
      sub:'The rarest, most valuable finds in the game.',
      items: ITEMS.filter(i => i.tier === 's').map(i => i.id) },
    { id:'tier-exc',    view:'tier', title:'🔥 Excellent Items',
      sub:'Top-tier gear that anchors most endgame builds.',
      items: ITEMS.filter(i => i.tier === 'excellent').map(i => i.id) },
    { id:'tier-solid',  view:'tier', title:'✅ Solid Uniques',
      sub:'Reliable role-players — worth picking up.',
      items: ITEMS.filter(i => i.tier === 'solid').map(i => i.id) },
    { id:'tier-budget', view:'tier', title:'💰 Budget & Starter Uniques',
      sub:'Cheap or low-ilvl uniques — great early progression.',
      items: ITEMS.filter(i => i.tier === 'budget').map(i => i.id) },
    { id:'tier-junk',   view:'tier', title:'🗑️ Grail Fillers',
      sub:'Low-level, mostly worthless — still needed for a complete grail.',
      items: ITEMS.filter(i => i.tier === 'junk').map(i => i.id) },
  ];

  // View: By Slot
  const SLOT_META = {
    helm:'⛑️ Helms',           body:'🛡️ Body Armor',       shield:'🛡️ Shields',
    belt:'👗 Belts',            boots:'👢 Boots',            gloves:'🧤 Gloves',
    ring:'💍 Rings',            amulet:'📿 Amulets',
    weapon:'⚔️ Weapons',        orb:'🔮 Sorc Orbs',          wand:'🩸 Necro Wands',
    scepter:'🛡️ Paladin Scepters', pelt:'🌿 Druid Pelts',     barbhelm:'🐺 Barb Helms',
    jav:'⚡ Ama Javelins',       amabow:'🏹 Ama Bows',        amaspear:'🔱 Ama Spears',
    palashield:'🛡️ Paladin Shields', necroshield:'💀 Necro Shields',
    jewel:'💎 Jewels (Facets)', charm:'🍀 Charms'
  };
  const SLOT_ORDER = ['helm','body','shield','belt','boots','gloves','ring','amulet','weapon','orb','wand','scepter','pelt','barbhelm','jav','amabow','amaspear','palashield','necroshield','jewel','charm'];
  const SLOT_CATEGORIES = SLOT_ORDER.map(slot => ({
    id:'slot-'+slot, view:'slot', title:SLOT_META[slot],
    items: ITEMS.filter(i => i.slot === slot).map(i => i.id)
  })).filter(c => c.items.length);

  // View: By Class (class-specific + universal)
  const CLASS_META = {
    all:    { title:'👥 Universal Uniques (All Classes)',  sub:'Wearable by any character — the core of every build.' },
    amazon: { title:'🏹 Amazon-Only Uniques',              sub:'Amazon bows, spears, and javelins.' },
    necro:  { title:'💀 Necromancer-Only Uniques',         sub:'Wands and shrunken-head shields.' },
    sorc:   { title:'🔥 Sorceress-Only Uniques',           sub:'Sorc orbs — pure +skills nukes.' },
    pala:   { title:'🛡️ Paladin-Only Uniques',             sub:'Scepters (+aura/skills) and paladin shields.' },
    barb:   { title:'⚔️ Barbarian-Only Uniques',           sub:'Primal helms (barbarian tribal helms).' },
    druid:  { title:'🌿 Druid-Only Uniques',               sub:'Druid pelts (+shapeshifting / summoning skills).' },
    sin:    { title:'🗡️ Assassin-Only Uniques',            sub:'Katar-family claw weapons.' }
  };
  const CLASS_ORDER = ['all','amazon','necro','sorc','pala','barb','druid','sin'];
  const CLASS_CATEGORIES = CLASS_ORDER.map(c => ({
    id:'class-'+c, view:'class', title:CLASS_META[c].title, sub:CLASS_META[c].sub,
    items: ITEMS.filter(i => c === 'all' ? !i.classItem : i.classItem === c).map(i => i.id)
  }));

  // View: By Boss (famous farm targets)
  const BOSSES = [
    { id:'countess',  boss:'countess',
      title:'👑 The Countess — Hell (Forgotten Tower Lvl 5)',
      sub:'Rune drop specialist. Also drops all low-ilvl uniques (Gull, Manald, Nagelring, Stealskull, etc.). Fast 30s runs.' },
    { id:'andariel',  boss:'nm-anda',
      title:'👹 Nightmare Andariel — Quest Drop',
      sub:'THE ONLY reliable Stone of Jordan farm off-Baal. Bugged quest drop has SoJ in its TC.' },
    { id:'duriel',    boss:'duriel',
      title:'🐛 Duriel — Any Difficulty (Tomb of Tal Rasha)',
      sub:"Famous for Duriel's Shell. Guaranteed rare/unique on first kill per difficulty." },
    { id:'mephisto',  boss:'mephisto',
      title:'⚡ Mephisto — Hell (Durance of Hate Lvl 3)',
      sub:'THE MF king. Easiest boss-per-run. Drops nearly every mid-to-high-tier unique.' },
    { id:'pindle',    boss:'pindle',
      title:"🧟 Pindleskin — Hell (Nihlathak's Temple)",
      sub:'1-screen run. Kill within 30 seconds. High density of mid-tier unique drops.' },
    { id:'nihlathak', boss:'nihlathak',
      title:'❄️ Nihlathak — Hell (Halls of Vaught)',
      sub:'Corpse Explosion nightmare, but consistently drops Gore Rider / Marrowwalk / Baranar\'s Star.' },
    { id:'diablo',    boss:'diablo',
      title:'🔥 Diablo — Hell (Chaos Sanctuary)',
      sub:"Endgame chase-item boss. Grandfather, Windforce, Griffon's, Doombringer — all high-ilvl uniques." },
    { id:'baal',      boss:'baal',
      title:'👑 Baal — Hell (Throne of Destruction)',
      sub:'Highest-ilvl boss in the game. Drops every unique. The endgame trophy farm.' },
    { id:'pit',       boss:'pit',
      title:'💀 The Pit / Ancient Tunnels — Hell (Level 85 Areas)',
      sub:"Rainbow Facets, Death's Web, Death's Fathom, Griffon's Eye. Only true LV85 outdoor zones." },
    { id:'cows',      boss:'cows',
      title:'🐄 Cow Level — Hell (Secret Cow Level)',
      sub:'Insane density. Azurewrath, Bonehew, and bulk rune drops.' },
    { id:'uber',      boss:'uber',
      title:'🔴 Uber Tristram — Pandemonium Event',
      sub:"Diablo Clone & Pandemonium bosses — the ONLY source of Annihilus, Hellfire Torch, and Tyrael's Might." },
  ];
  const BOSS_CATEGORIES = BOSSES.map(b => ({
    id:'boss-'+b.id, view:'boss', title:b.title, sub:b.sub,
    items: ITEMS.filter(i => (i.boss||[]).includes(b.boss)).map(i => i.id)
  })).filter(c => c.items.length);

  // View: Routes (farming wishlists)
  const ROUTE_CATEGORIES = [
    { id:'route-meph', view:'route', title:'🎯 Hell Mephisto Run ⭐⭐⭐⭐⭐',
      sub:'Fastest single-boss MF loop. Still owes you these prizes:',
      items: ['mara','sandstorm','andariels','draculs','vgaze','reapers','raven-frost','tal-belt','tal-ammy','nightwings','lidless','oculus','wizardspike','skullders','shaftstop'] },
    { id:'route-nma',  view:'route', title:'🎯 Nightmare Andariel — SoJ Hunt ⭐⭐⭐⭐⭐',
      sub:'The exclusive Stone of Jordan farm — nowhere else outside Baal.',
      items: ['soj'] },
    { id:'route-at',   view:'route', title:'🎯 Ancient Tunnels / Pit ⭐⭐⭐⭐⭐',
      sub:'True level-85 area. All facets + top-tier caster gear.',
      items: ['deaths-fathom','griffons','deaths-web','tyraels','facet-cold','facet-fire','facet-light','facet-poison'] },
    { id:'route-baal', view:'route', title:'🎯 Baal / Worldstone Keep ⭐⭐⭐⭐⭐',
      sub:'End-game trophy hunting — every rare unique.',
      items: ['crown-ages','mang-songs','tyraels','windforce','deaths-fathom','griffons','grandfather','doombringer','arreats','wolfhowl','earthshifter','schaefers'] },
    { id:'route-uber', view:'route', title:'🎯 Uber Tristram Prep',
      sub:'Kill the 3 uber bosses — earn Annihilus + Hellfire Torch.',
      items: ['anni','torch','tyraels'] },
    { id:'route-wishlist', view:'route', title:'🏅 Wishlist — Next 10 to Find',
      sub:'Your dream picks. Focus your runs here.',
      items: ['soj','mara','sandstorm','andariels','reapers','nightwings','deaths-fathom','griffons','facet-cold','tyraels'] },
  ];

  const ALL_CATEGORIES = [
    ...TIER_CATEGORIES,
    ...BOSS_CATEGORIES,
    ...CLASS_CATEGORIES,
    ...SLOT_CATEGORIES,
    ...ROUTE_CATEGORIES,
  ];

  // ═══ Persistence ═══
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) {}
    return new Set(INITIAL_FOUND);
  }
  function saveState(set) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set))); } catch (e) {}
  }
  const found = loadState();

  const GRAIL_TOTAL = UNIQUE_IDS.size;

  // ═══ DOM ═══
  const catRoot = document.getElementById('grailCategories');
  if (!catRoot) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function makeItem(id) {
    const it = ITEM_BY_ID[id];
    if (!it) return '';
    const isFound = found.has(id);
    return `<li><label class="grail-item${isFound?' found':''}" data-id="${esc(id)}">
      <input type="checkbox" data-grail="${esc(id)}"${isFound?' checked':''}>
      <span class="grail-name">${esc(it.name)}</span>
    </label></li>`;
  }

  function makeCategory(cat) {
    const total = cat.items.length;
    const foundCount = cat.items.filter(id => found.has(id)).length;
    const list = cat.items.map(makeItem).join('');
    return `<details class="grail-category" data-view="${esc(cat.view)}" data-cat-id="${esc(cat.id)}">
      <summary>
        <span class="grail-summary-title">${esc(cat.title)}</span>
        <span class="grail-category-count"><span class="cat-found">${foundCount}</span> / ${total}</span>
      </summary>
      <div class="grail-body">
        ${cat.sub ? `<p class="grail-category-sub">${esc(cat.sub)}</p>` : ''}
        <ul class="grail-list">${list}</ul>
      </div>
    </details>`;
  }

  // Render
  catRoot.innerHTML = ALL_CATEGORIES.map(makeCategory).join('');

  // Progress refs
  const foundEl   = document.getElementById('grailFound');
  const totalEl   = document.getElementById('grailTotal');
  const percentEl = document.getElementById('grailPercent');
  const fillEl    = document.getElementById('grailFill');
  const barEl     = document.getElementById('grailBar');
  totalEl.textContent = GRAIL_TOTAL;

  function updateProgress() {
    const foundCount = Array.from(UNIQUE_IDS).filter(id => found.has(id)).length;
    const total = GRAIL_TOTAL;
    const pct = total ? Math.round((foundCount / total) * 100) : 0;
    foundEl.textContent = foundCount;
    percentEl.textContent = pct + '%';
    fillEl.style.width = pct + '%';
    barEl.setAttribute('aria-valuenow', pct);

    // Per-category counts
    document.querySelectorAll('.grail-category').forEach(catEl => {
      const items = catEl.querySelectorAll('.grail-item');
      const catFound = Array.from(items).filter(i => i.classList.contains('found')).length;
      const cnt = catEl.querySelector('.cat-found');
      if (cnt) cnt.textContent = catFound;
    });
  }

  // Sync all checkboxes with same ID (item can appear in multiple views)
  function toggleItem(id, isChecked) {
    if (isChecked) found.add(id); else found.delete(id);
    saveState(found);
    document.querySelectorAll(`.grail-item[data-id="${CSS.escape(id)}"]`).forEach(el => {
      el.classList.toggle('found', isChecked);
      const cb = el.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = isChecked;
    });
    updateProgress();
  }

  catRoot.addEventListener('change', e => {
    const cb = e.target.closest('input[type="checkbox"][data-grail]');
    if (!cb) return;
    toggleItem(cb.dataset.grail, cb.checked);
  });

  // Found / Missing filter
  const filterBtns = document.querySelectorAll('.grail-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.grailFilter;
      filterBtns.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      catRoot.classList.remove('filter-found','filter-missing');
      if (f === 'found')   catRoot.classList.add('filter-found');
      if (f === 'missing') catRoot.classList.add('filter-missing');
    });
  });

  // View switcher (Tier / Boss / Class / Slot / Route / All)
  const viewBtns = document.querySelectorAll('.grail-view-btn');
  function setView(view) {
    viewBtns.forEach(b => {
      const on = b.dataset.grailView === view;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.grail-category').forEach(el => {
      const match = view === 'all' || el.dataset.view === view;
      el.style.display = match ? '' : 'none';
    });
  }
  viewBtns.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.grailView)));
  setView('tier');   // default landing view

  // Expand / Collapse all (only affects currently-visible categories)
  const expandBtn   = document.getElementById('grailExpand');
  const collapseBtn = document.getElementById('grailCollapse');
  if (expandBtn) expandBtn.addEventListener('click', () => {
    document.querySelectorAll('.grail-category').forEach(d => {
      if (d.style.display !== 'none') d.open = true;
    });
  });
  if (collapseBtn) collapseBtn.addEventListener('click', () => {
    document.querySelectorAll('.grail-category').forEach(d => { d.open = false; });
  });

  // Reset
  const resetBtn = document.getElementById('grailReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Clear ALL grail progress? This cannot be undone.')) return;
      found.clear();
      saveState(found);
      document.querySelectorAll('.grail-item').forEach(el => {
        el.classList.remove('found');
        const cb = el.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = false;
      });
      updateProgress();
    });
  }

  updateProgress();
})();


