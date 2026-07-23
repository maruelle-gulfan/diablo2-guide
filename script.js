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

/* ─── Class-card "View Build" links → jump to builds page + preselect class in interactive viewer ─── */
document.querySelectorAll('.class-build-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').replace('#build-', '');
    showPage('builds');
    // Sync the new interactive viewer's class dropdown
    const classSel = document.getElementById('d2-class-select');
    if (classSel) {
      classSel.value = target;
      classSel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    // Smooth scroll to the viewer
    document.getElementById('builds')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  // Item database: { name, mf, fcr, note?, classes?: [] }
  //   classes: if present, item only shows for those classes.  Absent = all classes.
  //   Class keys match the <select> values: sorc, necro, pally, druid, sin, ama, barb
  const CALC_ITEMS = {
    helm: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal helms
      { name: "Tarnhelm (Skull Cap)", mf: 40, fcr: 0, note: "+1 all skills" },
      { name: "Shako / Harlequin Crest", mf: 50, fcr: 0, note: "+2 skills, +2 stats" },
      { name: "Peasant Crown", mf: 0, fcr: 0, note: "+1 skills, +20 life reg" },
      { name: "Vampire Gaze", mf: 0, fcr: 0, note: "6-8% Life Steal" },
      { name: "Andariel's Visage", mf: 0, fcr: 0, note: "20% IAS, +2 skills" },
      { name: "Nightwing's Veil", mf: 0, fcr: 0, note: "+2 skills, +5-9% cold dmg" },
      { name: "Griffon's Eye (Diadem)", mf: 0, fcr: 25, note: "-15-20% enemy lightning res" },
      { name: "Crown of Ages", mf: 0, fcr: 0, note: "+1 skills, 10-15% DR" },
      { name: "Kira's Guardian (Tiara)", mf: 0, fcr: 0, note: "Cannot Be Frozen, +50-70 all res" },
      { name: "Magic Circlet + 10% FCR", mf: 0, fcr: 10, note: "Magic circlet cap: 10% FCR prefix" },
      { name: "Magic Circlet + 20% FCR (of the Magus)", mf: 0, fcr: 20, note: "20% FCR is the max suffix roll" },
      { name: "Rare Circlet + 20% FCR + 30% MF", mf: 30, fcr: 20, note: "Very rare — max FCR + max MF suffix" },
      // ─── Druid pelts ───
      { name: "Jalal's Mane (Totemic Mask)", mf: 0, fcr: 20, note: "+2 druid, +30 str/energy", classes: ['druid'] },
      { name: "Ravenlore (Sky Spirit)",       mf: 0, fcr: 0,  note: "+3 druid elemental, +250-350% fire dmg", classes: ['druid'] },
      { name: "Cerebus' Bite (Blood Spirit)", mf: 0, fcr: 0,  note: "+2 druid shape-shifting, +25-50 life", classes: ['druid'] },
      // ─── Barbarian helms ───
      { name: "Arreat's Face (Slayer Guard)", mf: 0, fcr: 0, note: "+2 barb combat, +30 str, LL", classes: ['barb'] },
      { name: "Wolfhowl (Fury Visor)",         mf: 0, fcr: 0, note: "+3-4 werewolf, +2 barb (barb only)", classes: ['barb'] },
      { name: "Halaberd's Reign (Corona)",     mf: 0, fcr: 0, note: "+2 barb combat, all res, +40 str/dex", classes: ['barb'] },
      { name: "Demonhorn's Edge (Destroyer Helm)", mf: 0, fcr: 0, note: "+2 warcries, +25% deadly strike", classes: ['barb'] }
    ],
    amulet: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal
      { name: "Mara's Kaleidoscope", mf: 0, fcr: 0, note: "+2 skills, +20-30 all res" },
      { name: "Highlord's Wrath", mf: 0, fcr: 0, note: "+1 skills, 20% IAS, DS per clvl" },
      { name: "The Cat's Eye", mf: 0, fcr: 0, note: "30% FRW, +30 dex" },
      { name: "Metalgrid", mf: 0, fcr: 0, note: "+90 all res" },
      { name: "Atma's Scarab", mf: 0, fcr: 0, note: "Amp Damage CtC, life reg" },
      { name: "Saracen's Chance", mf: 0, fcr: 0, note: "+12 all attrs, all res" },
      { name: "Rare amulet + 10% FCR", mf: 0, fcr: 10, note: "Magic amulets cap at 10% FCR" },
      { name: "Rare amulet + 10% FCR + 30% MF", mf: 30, fcr: 10, note: "Max MF suffix (of Chance)" },
      { name: "Crafted caster amulet (+1 class, 20% FCR)", mf: 0, fcr: 20, note: "Caster recipe: fixed 10 FCR + up to 10 suffix" },
      // ─── Sorc set piece ───
      { name: "Tal Rasha's Adjudication (Amulet)", mf: 0, fcr: 0, note: "+2 sorc, +42 mana (FCR via full set bonus)", classes: ['sorc'] },
      // ─── Class-skill crafted amulet ───
      { name: "Crafted class-skill amulet (Sorc +1 fire/cold/light + FCR)", mf: 0, fcr: 20, note: "Crafted caster amulet, +1 to sorc tree", classes: ['sorc'] },
      { name: "Crafted class-skill amulet (Necro summon/poison/curse + FCR)", mf: 0, fcr: 20, note: "Crafted caster amulet, +1 to necro tree", classes: ['necro'] },
      { name: "Crafted class-skill amulet (Pala combat/offensive/defensive)", mf: 0, fcr: 10, note: "Crafted caster amulet, +1 to pala tree", classes: ['pally'] },
      { name: "Crafted class-skill amulet (Druid elemental/summon/shape)", mf: 0, fcr: 10, note: "Crafted caster amulet, +1 to druid tree", classes: ['druid'] }
    ],
    armor: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal armors
      { name: "Enigma (Mage Plate)", mf: 80, fcr: 0, note: "+2 skills, Teleport, +80% MF fixed" },
      { name: "Skullder's Ire (~clvl 95)", mf: 95, fcr: 0, note: "+1 per clvl MF (max ~99% at clvl 99)" },
      { name: "Wealth (any 4os armor)", mf: 100, fcr: 0, note: "+100% MF, +300% extra gold, +10 dex" },
      { name: "Vipermagi's Serpentskin", mf: 0, fcr: 30, note: "+1 skills, all res" },
      { name: "Que-Hegan's Wisdom", mf: 0, fcr: 20, note: "+1 skills, +20% FCR" },
      { name: "Chains of Honor (Dol-Um-Ber-Ist)", mf: 0, fcr: 0, note: "+2 skills, +65 res, +8% DR (Ist grants MF but stat says 0 fcr)" },
      { name: "Bramble (Ral-Ohm-Sur-Eth)", mf: 0, fcr: 0, note: "Level 15-21 Thorns aura" },
      { name: "Duress (Shael-Um-Thul)", mf: 0, fcr: 0, note: "+15% CB, +33% OW, cold res" },
      { name: "Guardian Angel", mf: 0, fcr: 0, note: "+15% all max res, +30 dex" },
      // ─── Sorceress armors ───
      { name: "Ormus' Robes (Dusk Shroud)", mf: 0, fcr: 10, note: "+3 to random sorc skill, +5-15% cold/fire/light dmg", classes: ['sorc'] },
      // ─── Necromancer armor ───
      { name: "Trang-Oul's Scales (Chaos Armor)", mf: 0, fcr: 0, note: "+2 poison/curse, cold absorb (set)", classes: ['necro'] },
      // ─── Paladin armor ───
      { name: "Templar's Might (Sacred Armor)", mf: 0, fcr: 0, note: "+2 pala offensive, +250-350% ED, +40 str/vit", classes: ['pally'] },
      // ─── Amazon / physical DPS ───
      { name: "Fortitude (Chains of Honor base — El-Sol-Dol-Lo)", mf: 0, fcr: 0, note: "+300% ED, +1 skills, all res" },
      // ─── Barb armor ───
      { name: "Immortal King's Soul Cage (Sacred Armor)", mf: 0, fcr: 0, note: "+2 combat, high def (set)", classes: ['barb'] }
    ],
    weapon: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal weapons
      { name: "Gull (Dagger)", mf: 100, fcr: 0, note: "100% MF, no damage — offhand carry" },
      { name: "Wizardspike (Bone Knife)", mf: 0, fcr: 50, note: "+75 all res, huge FCR" },
      { name: "Heart of the Oak (Flail)", mf: 0, fcr: 40, note: "+3 skills, +40 all res" },
      { name: "Spirit (Crystal Sword)", mf: 0, fcr: 35, note: "+2 skills, +112 mana" },
      { name: "Suicide Branch (Burnt Wand)", mf: 0, fcr: 40, note: "+1 skills, +25 all attrs" },
      { name: "Grief (Phase Blade)", mf: 0, fcr: 0, note: "Melee ED — for reference (Grief has no FCR)" },
      { name: "Last Wish (Berserker Axe)", mf: 0, fcr: 0, note: "Might aura, CtC Life Tap" },
      { name: "Beast (Berserker Axe / Scourge)", mf: 0, fcr: 0, note: "Fanaticism aura, +40% IAS" },
      { name: "Insight (any polearm/staff — for merc & druid)", mf: 0, fcr: 0, note: "Meditation aura, +1-6 crit strike" },
      // ─── Sorceress orbs ───
      { name: "Death's Fathom (Dimensional Shard)", mf: 0, fcr: 30, note: "+3 sorc, +25-40% cold dmg", classes: ['sorc'] },
      { name: "Eschuta's Temper (Eldritch Orb)",     mf: 0, fcr: 20, note: "+3 sorc, +1-3% fire/light dmg per clvl", classes: ['sorc'] },
      { name: "The Oculus (Swirling Crystal)",       mf: 50, fcr: 30, note: "+3 sorc, +50% MF (Sorc BiS budget orb)", classes: ['sorc'] },
      // ─── Necromancer wands ───
      { name: "Death's Web (Unearthed Wand)",   mf: 0, fcr: 10, note: "+2 poison/bone, -40-50% enemy poison res", classes: ['necro'] },
      { name: "Blackhand Key (Grim Wand)",      mf: 0, fcr: 20, note: "+2 curses, +2 poison/bone", classes: ['necro'] },
      { name: "Boneshade (Lich Wand)",          mf: 0, fcr: 20, note: "+3-5 bone spells, huge fcr", classes: ['necro'] },
      // ─── Paladin scepters ───
      { name: "Heaven's Light (Mighty Scepter)", mf: 0, fcr: 0, note: "+3-6 zeal, socketed", classes: ['pally'] },
      { name: "Astreon's Iron Ward (Caduceus)",  mf: 0, fcr: 20, note: "+2 pala skills, all res, deadly strike", classes: ['pally'] },
      // ─── Druid weapons ───
      { name: "Ribcracker (Quarterstaff)",  mf: 0, fcr: 0, note: "Stunning bonker, +200-300% ED", classes: ['druid'] },
      { name: "Spirit (Broad Sword — Druid FCR)", mf: 0, fcr: 35, note: "+2 skills — druid Wind/Hurricane FCR path", classes: ['druid'] },
      // ─── Amazon bows / javelins ───
      { name: "Windforce (Hydra Bow)",       mf: 0, fcr: 0, note: "+250% ED, 20% mana leech", classes: ['ama'] },
      { name: "Titan's Revenge (Ceremonial Javelin)", mf: 0, fcr: 0, note: "+2 ama, replenishes, +190% ED", classes: ['ama'] },
      { name: "Widowmaker (Ward Bow)",       mf: 0, fcr: 0, note: "+50-80% ED, GA, all skills", classes: ['ama'] },
      { name: "Buriza-Do Kyanon (Ballista)", mf: 0, fcr: 0, note: "Pierce, freeze, deadly strike", classes: ['ama'] },
      // ─── Assassin claws ───
      { name: "Bartuc's Cut-Throat (Greater Talons)", mf: 0, fcr: 0, note: "+1 sin, +150-200% ED, 30% IAS", classes: ['sin'] },
      { name: "Firelizard's Talons (Feral Claws)",     mf: 0, fcr: 0, note: "+2 traps, fire dmg, IAS", classes: ['sin'] },
      { name: "Chaos runeword (Claws — Fal-Ohm-Um)",   mf: 0, fcr: 0, note: "+35% IAS, Whirlwind CtC", classes: ['sin'] },
      // ─── Barb / general melee ───
      { name: "Breath of the Dying (Berserker Axe)", mf: 50, fcr: 0, note: "+50% MF, +200% ED — Vex/Hel/El/Eld/Zod", classes: ['barb','pally','druid','sin','ama'] },
      { name: "Sazabi's Cobalt Redeemer (Cryptic Sword)", mf: 0, fcr: 0, note: "+170% ED, +1 skills (weapon)" }
    ],
    offhand: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal shields
      { name: "Spirit (Monarch Shield)", mf: 0, fcr: 35, note: "+2 skills, +22 vit, +89-112 mana" },
      { name: "Rhyme (any shield)", mf: 25, fcr: 0, note: "25% MF, all res, cannot be frozen" },
      { name: "Lidless Wall (Grim Shield)", mf: 0, fcr: 20, note: "+1 skills, +10 energy" },
      { name: "Storm Shield", mf: 0, fcr: 0, note: "35% DR, high def" },
      { name: "Sanctuary (any shield)", mf: 0, fcr: 0, note: "+250 def, cleansing aura" },
      { name: "Whitstan's Guard", mf: 0, fcr: 0, note: "55% chance to block" },
      { name: "Splendor (any shield — 2os)", mf: 20, fcr: 25, note: "+1 skills, +20% MF, +25% FCR (Eth-Lum)" },
      { name: "Ancient's Pledge (any shield — 3os)", mf: 0, fcr: 0, note: "+35-50 all res (Ral-Ort-Tal)" },
      // ─── Necromancer heads ───
      { name: "Homunculus (Hierophant Trophy)", mf: 0, fcr: 20, note: "+2 necro, +20 all res, huge block", classes: ['necro'] },
      { name: "Boneflame (Succubus Skull)",     mf: 0, fcr: 20, note: "+2 necro, +2 poison/bone, curse CtC", classes: ['necro'] },
      { name: "Darkforce Spawn (Bloodlord Skull)", mf: 0, fcr: 20, note: "+2 necro, all res, high block", classes: ['necro'] },
      { name: "Trang-Oul's Wing (Cantor Trophy)",   mf: 0, fcr: 0, note: "+1 necro, cold absorb (set)", classes: ['necro'] },
      // ─── Paladin shields ───
      { name: "Herald of Zakarum (Gilded Shield)", mf: 0, fcr: 0, note: "+2 pala combat, +30 str/vit, all res", classes: ['pally'] },
      { name: "Alma Negra (Sacred Rondache)",       mf: 0, fcr: 0, note: "+1 pala, per-level skill bonuses", classes: ['pally'] },
      { name: "Dragonscale (Sacred Targe)",          mf: 0, fcr: 0, note: "+3 pala shield skills, absorbs", classes: ['pally'] },
      { name: "Exile runeword (Vortex/Kurast/Sacred Targe)", mf: 0, fcr: 0, note: "Defiance aura, +1-2 pala skills (Vex-Ohm-Ist-Dol)", classes: ['pally'] },
      // ─── Assassin claws (offhand) ───
      { name: "Bartuc's Cut-Throat (offhand)",   mf: 0, fcr: 0, note: "+1 sin, +150-200% ED, 30% IAS", classes: ['sin'] },
      { name: "Jade Talon (Wrist Sword)",         mf: 0, fcr: 0, note: "+3 martial arts, all res", classes: ['sin'] }
    ],
    gloves: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal
      { name: "Chance Guards", mf: 40, fcr: 0, note: "25-40% MF" },
      { name: "Magefist", mf: 0, fcr: 20, note: "+1 fire skills, +25 mana regen" },
      { name: "Frostburn", mf: 0, fcr: 0, note: "+40% max mana" },
      { name: "Bloodfist", mf: 0, fcr: 0, note: "+40 life, 10% IAS" },
      { name: "Dracul's Grasp", mf: 0, fcr: 0, note: "7-10% Life Tap, +open wounds" },
      { name: "Steelrend (Ogre Gauntlets)", mf: 0, fcr: 0, note: "+40 str, 60-80% ED" },
      { name: "Crafted caster gloves (20% FCR)", mf: 0, fcr: 20, note: "FCR + FHR + mana" },
      // ─── Necromancer gloves ───
      { name: "Trang-Oul's Claws (Chaos Gloves)", mf: 0, fcr: 20, note: "+2 curses, +25% cold res (set)", classes: ['necro'] },
      // ─── Assassin gloves (Bartuc's-like via craft) ───
      { name: "Crafted blood gloves (Sin — +2 martial arts)", mf: 0, fcr: 0, note: "+2 martial arts, IAS, LL", classes: ['sin'] }
    ],
    belt: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal
      { name: "Goldwrap", mf: 80, fcr: 0, note: "30-80% MF, +50% gold" },
      { name: "Arachnid Mesh", mf: 0, fcr: 20, note: "+1 skills, +5% max mana" },
      { name: "String of Ears", mf: 0, fcr: 0, note: "15% DR, life steal" },
      { name: "Verdungo's Hearty Cord", mf: 0, fcr: 0, note: "10-15% DR, huge life" },
      { name: "Nightsmoke", mf: 0, fcr: 0, note: "+20 all res, +50% mana" },
      { name: "Thundergod's Vigor (War Belt)", mf: 0, fcr: 0, note: "+3 lightning fury/mastery (ama), +20 str/vit" },
      { name: "Snowclash (Battle Belt)", mf: 0, fcr: 0, note: "+2 cold, +45 cold absorb" },
      { name: "Razortail (Sharkskin Belt)", mf: 0, fcr: 0, note: "Pierce, +15 max dmg" }
    ],
    boots: [
      { name: "— None —", mf: 0, fcr: 0 },
      // Universal
      { name: "War Traveler", mf: 50, fcr: 0, note: "40-50% MF, 25% FRW, +15-25 strength" },
      { name: "Waterwalk", mf: 0, fcr: 0, note: "+65 life, 20% FRW" },
      { name: "Silkweave", mf: 0, fcr: 0, note: "+30% max mana, 20% FRW" },
      { name: "Sandstorm Trek (Scarabshell Boots)", mf: 0, fcr: 0, note: "20% FHR, +40-70 vit/str" },
      { name: "Gore Rider (War Boots)", mf: 0, fcr: 0, note: "+10-15% CB, +10% deadly strike, +open wounds" },
      { name: "Aldur's Advance (Battle Boots)", mf: 0, fcr: 0, note: "+180 life, 40% FRW (set)" },
      { name: "Rare boots + 30% FRW + res", mf: 0, fcr: 0 },
      // ─── Necromancer boots ───
      { name: "Marrowwalk (Boneweave Boots)", mf: 0, fcr: 0, note: "+2 necro, +2 skele mastery, oskills", classes: ['necro'] },
      // ─── Druid boots ───
      { name: "Shadow Dancer (Myrmidon Greaves)", mf: 0, fcr: 0, note: "+2 shadow disciplines, +25-35 dex", classes: ['sin'] }
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

  // Presets: pre-selected items per slot, looked up by NAME (survives class filtering).
  // If a preset item is not usable by the current class, it's simply skipped.
  //
  // A slot value can be either:
  //   • a string — one item name used for every class, or
  //   • an object { default: "…", sorc: "…", druid: "…", … } — class-specific
  //     override plus a safe universal fallback.  Missing classes use `default`.
  const CALC_PRESETS = {
    // Mephisto MF farmer — hold 63% FCR breakpoint while stacking MF
    meph: {
      helm:    "Shako / Harlequin Crest",
      amulet:  "Mara's Kaleidoscope",
      armor:   "Skullder's Ire (~clvl 95)",
      // HoTo = safe caster fallback for any class; class BiS overrides
      weapon: {
        default: "Heart of the Oak (Flail)",
        sorc:    "Death's Fathom (Dimensional Shard)",  // +3 sorc, cold dmg
        necro:   "Heart of the Oak (Flail)",             // +3 skills, 40 FCR
        pally:   "Heart of the Oak (Flail)",             // Hammerdin MF weapon
        druid:   "Heart of the Oak (Flail)",             // Wind druid FCR
        sin:     "Bartuc's Cut-Throat (Greater Talons)", // MA/trap sin
        ama:     "Titan's Revenge (Ceremonial Javelin)", // Javazon MF
        barb:    "Breath of the Dying (Berserker Axe)"   // +50% MF baked-in
      },
      offhand: {
        default: "Spirit (Monarch Shield)",
        necro:   "Homunculus (Hierophant Trophy)",       // Necro BiS shield
        pally:   "Herald of Zakarum (Gilded Shield)",    // Pally BiS
        sin:     "Bartuc's Cut-Throat (offhand)",        // dual-claw
        ama:     "— None —",                              // bow/jav = 2H
        barb:    "— None —"                               // 2H / dual wield
      },
      gloves:  "Chance Guards",
      belt:    "Arachnid Mesh",
      boots:   "War Traveler",
      ring1:   "Nagelring",
      ring2:   "Rare ring + 10% FCR + 15% MF",
      charms:  "Anni + Torch + 6× MF SC (7%)",
      sockets: "3× Ist (helm + armor + weapon)"
    },
    // Chaos Sanctuary XP/damage focus — max damage, hold 63% FCR
    chaos: {
      helm:    "Griffon's Eye (Diadem)",
      amulet:  "Mara's Kaleidoscope",
      armor:   "Vipermagi's Serpentskin",
      weapon: {
        default: "Heart of the Oak (Flail)",
        sorc:    "Death's Fathom (Dimensional Shard)",   // top cold dmg
        necro:   "Death's Web (Unearthed Wand)",         // -50% enemy pois res
        pally:   "Heart of the Oak (Flail)",             // Hammerdin BiS
        druid:   "Heart of the Oak (Flail)",             // Wind druid BiS
        sin:     "Chaos runeword (Claws — Fal-Ohm-Um)",  // Trapsin Chaos
        ama:     "Titan's Revenge (Ceremonial Javelin)", // Javazon LF spam
        barb:    "Grief (Phase Blade)"                    // WW barb Chaos
      },
      offhand: {
        default: "Spirit (Monarch Shield)",
        necro:   "Homunculus (Hierophant Trophy)",
        pally:   "Herald of Zakarum (Gilded Shield)",
        sin:     "Bartuc's Cut-Throat (offhand)",
        ama:     "— None —",
        barb:    "— None —"
      },
      gloves:  "Magefist",
      belt:    "Arachnid Mesh",
      boots:   "Waterwalk",
      ring1:   "Rare ring + 10% FCR",
      ring2:   "Rare ring + 10% FCR + res",
      charms:  "Anni + Torch + 4× skiller GC",
      sockets: "— None —"
    },
    // Pure MF speed farmer — Wealth + Gull + max MF everywhere (low FCR)
    speed: {
      helm:    "Tarnhelm (Skull Cap)",
      amulet:  "Mara's Kaleidoscope",
      armor:   "Wealth (any 4os armor)",
      weapon:  "Gull (Dagger)",             // universal — every class can wield
      offhand: "Rhyme (any shield)",        // universal
      gloves:  "Chance Guards",
      belt:    "Goldwrap",
      boots:   "War Traveler",
      ring1:   "Nagelring",
      ring2:   "Nagelring",
      charms:  "Anni + Torch + Gheed's + 6× MF SC",
      sockets: "4× Ist (helm + armor + shield + weapon)"
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

  // True if the item is usable by the currently-selected class.
  function itemAllowedForClass(item, classKey) {
    if (!item) return false;
    if (!item.classes) return true;         // no restriction = all classes
    return item.classes.includes(classKey);
  }

  // Populate all selects, filtered by the currently-selected class.
  // Option `value` is the item's FULL-array index (not filtered index), so
  // getSelected() and CALC_PRESETS name→index lookups keep working when the
  // filter changes.  Current selections are preserved by name across re-populates.
  function populateSlots() {
    const classKey = classSelect.value;
    slotSelects.forEach(sel => {
      const slot = sel.dataset.slot;
      const items = CALC_ITEMS[slot] || [];
      // Remember what was picked before we blow away the options.
      const prevIdx = parseInt(sel.value, 10) || 0;
      const prevName = items[prevIdx] ? items[prevIdx].name : null;

      sel.innerHTML = '';
      items.forEach((it, idx) => {
        if (!itemAllowedForClass(it, classKey)) return;
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = it.note ? `${it.name}  ·  ${it.note}` : it.name;
        sel.appendChild(opt);
      });

      // Restore previous selection if the item is still available.
      if (prevName) {
        const stillThere = Array.from(sel.options).find(o => {
          const item = items[parseInt(o.value, 10)];
          return item && item.name === prevName;
        });
        sel.value = stillThere ? stillThere.value : (sel.options[0] ? sel.options[0].value : '0');
      }
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
      const classKey = classSelect.value;
      slotSelects.forEach(sel => {
        const slot = sel.dataset.slot;
        const raw = preset[slot];
        if (raw == null) return;
        // A preset value can be a plain string or a {default, <class>: …} map.
        const wantedName = (typeof raw === 'string')
          ? raw
          : (raw[classKey] || raw.default);
        if (!wantedName) return;
        const items = CALC_ITEMS[slot] || [];
        const idx = items.findIndex(it => it.name === wantedName);
        if (idx < 0) return;
        // Only apply if that item is currently visible for this class.
        const item = items[idx];
        if (!itemAllowedForClass(item, classKey)) return;
        const opt = Array.from(sel.options).find(o => parseInt(o.value, 10) === idx);
        if (opt) sel.value = String(idx);
      });
    }
    recalculate();
  }

  populateSlots();
  slotSelects.forEach(sel => sel.addEventListener('change', recalculate));
  classSelect.addEventListener('change', () => {
    populateSlots();   // re-filter items for the new class first
    recalculate();
  });
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
    { id:'nightwings',   name:"Nightwing's Veil",         slot:'helm', tier:'s',         noActBoss:true, boss:['diablo','baal','pit','pindle','nihlathak'] },
    { id:'griffons',     name:"Griffon's Eye",            slot:'helm', tier:'s',         noActBoss:true, boss:['baal','diablo','pit','pindle','nihlathak'] },
    { id:'crown-ages',   name:"Crown of Ages",            slot:'helm', tier:'s',         noActBoss:true, boss:['baal','diablo','pit','pindle','nihlathak'] },
    { id:'andariels',    name:"Andariel's Visage",        slot:'helm', tier:'excellent', boss:['baal','nihlathak','pindle','mephisto'] },
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
    { id:'tyraels',      name:"Tyrael's Might",           slot:'body', tier:'s',         qlvl:87, noActBoss:true, boss:['baal','diablo','uber'] },
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
    { id:'arachnid',     name:"Arachnid Mesh",            slot:'belt', tier:'s',         qlvl:87, boss:['mephisto','baal','diablo','pit'] },
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
    { id:'war-trav',     name:"War Traveler",             slot:'boots', tier:'excellent', boss:['mephisto','baal','nm-anda'] },
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
    { id:'magefist',     name:"Magefist",                 slot:'gloves', tier:'solid',     boss:['countess','mephisto','nm-anda'] },
    { id:'frostburn',    name:"Frostburn",                slot:'gloves', tier:'solid',     boss:['mephisto','pindle'] },
    { id:'chance-guards',name:"Chance Guards",            slot:'gloves', tier:'solid',     boss:['countess','pindle'] },
    { id:'venom-grip',   name:"Venom Grip",               slot:'gloves', tier:'budget',    boss:['countess','pindle'] },
    { id:'gravepalm',    name:"Gravepalm",                slot:'gloves', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'ghoulhide',    name:"Ghoulhide",                slot:'gloves', tier:'budget',    boss:['mephisto','pindle'] },
    { id:'hellmouth',    name:"Hellmouth",                slot:'gloves', tier:'solid',     boss:['baal','diablo'] },
    { id:'bloodfist',    name:"Bloodfist",                slot:'gloves', tier:'budget',    boss:['countess','pindle'] },
    { id:'hand-broc',    name:"The Hand of Broc",         slot:'gloves', tier:'junk',      boss:['countess'] },

    // ─── RINGS ──────────────────────────────────────────
    { id:'soj',          name:"Stone of Jordan",          slot:'ring', tier:'s',         boss:['nm-anda','baal','diablo','mephisto'] },
    { id:'bul-kathos',   name:"Bul-Kathos' Wedding Band", slot:'ring', tier:'s',         boss:['baal','diablo','nm-anda','mephisto'] },
    { id:'raven-frost',  name:"Raven Frost",              slot:'ring', tier:'excellent', boss:['countess','mephisto','nm-anda'] },
    { id:'wisp',         name:"Wisp Projector",           slot:'ring', tier:'excellent', boss:['diablo','baal','nm-anda'] },
    { id:'nagelring',    name:"Nagelring",                slot:'ring', tier:'solid',     boss:['countess','pindle'] },
    { id:'manald',       name:"Manald Heal",              slot:'ring', tier:'solid',     boss:['countess','pindle'] },
    { id:'dwarf-star',   name:"Dwarf Star",               slot:'ring', tier:'solid',     boss:['countess','pindle','nm-anda'] },
    { id:'nature-peace', name:"Nature's Peace",           slot:'ring', tier:'solid',     boss:['mephisto','baal','nm-anda'] },
    { id:'carrion-wind', name:"Carrion Wind",             slot:'ring', tier:'solid',     boss:['mephisto','baal'] },

    // ─── AMULETS ────────────────────────────────────────
    { id:'mara',         name:"Mara's Kaleidoscope",      slot:'amulet', tier:'s',         boss:['mephisto','baal','nm-anda'] },
    { id:'highlords',    name:"Highlord's Wrath",         slot:'amulet', tier:'excellent', boss:['mephisto','baal','nm-anda'] },
    { id:'metalgrid',    name:"Metalgrid",                slot:'amulet', tier:'excellent', boss:['baal'] },
    { id:'atmas-scarab', name:"Atma's Scarab",            slot:'amulet', tier:'solid',     boss:['mephisto','baal'] },
    { id:'cats-eye',     name:"The Cat's Eye",            slot:'amulet', tier:'solid',     boss:['mephisto','baal'] },
    { id:'rising-sun',   name:"The Rising Sun",           slot:'amulet', tier:'solid',     boss:['mephisto','baal'] },
    { id:'seraph-hymn',  name:"Seraph's Hymn",            slot:'amulet', tier:'solid',     boss:['baal','diablo'] },
    { id:'eye-etlich',   name:"The Eye of Etlich",        slot:'amulet', tier:'budget',    boss:['countess','pindle'] },
    { id:'mahim-oak',    name:"The Mahim-Oak Curio",      slot:'amulet', tier:'budget',    boss:['countess','pindle'] },
    { id:'nokozan',      name:"Nokozan Relic",            slot:'amulet', tier:'junk',      boss:['countess'] },
    { id:'saracens',     name:"Saracen's Chance",         slot:'amulet', tier:'budget',    boss:['countess','pindle'] },
    { id:'tal-ammy',     name:"Tal Rasha's Adjudication", slot:'amulet', tier:'excellent', boss:['mephisto','baal','nm-anda'] },

    // ─── SORCERESS ORBS ─────────────────────────────────
    { id:'oculus',       name:"The Oculus",               slot:'orb', tier:'solid',       classItem:'sorc', boss:['mephisto','baal'] },
    { id:'eschutas',     name:"Eschuta's Temper",         slot:'orb', tier:'excellent',   classItem:'sorc', boss:['baal','diablo','mephisto'] },
    { id:'deaths-fathom',name:"Death's Fathom",           slot:'orb', tier:'s',           classItem:'sorc', noActBoss:true, boss:['pit','pindle','nihlathak','baal','diablo'] },
    { id:'tal-orb',      name:"Tal Rasha's Lidless Eye",  slot:'orb', tier:'excellent',   classItem:'sorc', boss:['mephisto','baal'] },

    // ─── NECROMANCER WANDS ──────────────────────────────
    { id:'deaths-web',   name:"Death's Web",              slot:'wand', tier:'s',           classItem:'necro', noActBoss:true, boss:['baal','pit','pindle','nihlathak','diablo'] },
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
    { id:'astreons',     name:"Astreon's Iron Ward",      slot:'scepter', tier:'excellent',classItem:'pala', noActBoss:true, boss:['baal','diablo','pit','pindle','nihlathak'] },
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
    { id:'eaglehorn',    name:"Eaglehorn",                slot:'amabow', tier:'s',         classItem:'amazon', noActBoss:true, boss:['baal','diablo','pit','pindle','nihlathak'] },
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
    { id:'grandfather',  name:"The Grandfather",          slot:'weapon', tier:'s',         noActBoss:true, boss:['pit','pindle','nihlathak','baal','diablo'] },
    { id:'doombringer',  name:"Doombringer",              slot:'weapon', tier:'excellent', boss:['baal','diablo'] },
    { id:'messerschmidts',name:"Messerschmidt's Reaver",  slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'baranars',     name:"Baranar's Star",           slot:'weapon', tier:'solid',     boss:['nihlathak','baal'] },
    { id:'hellslayer',   name:"Hellslayer",               slot:'weapon', tier:'solid',     boss:['baal','diablo'] },
    { id:'azurewrath',   name:"Azurewrath",               slot:'weapon', tier:'excellent', qlvl:87, boss:['cows','baal','mephisto','diablo'] },
    { id:'lightsabre',   name:"Lightsabre",               slot:'weapon', tier:'excellent', boss:['mephisto','baal'] },
    { id:'mang-songs',   name:"Mang Song's Lesson",       slot:'weapon', tier:'s',         classItem:'sorc', noActBoss:true, boss:['baal','diablo','pit','pindle','nihlathak'] },
    { id:'ribcracker',   name:"Ribcracker",               slot:'weapon', tier:'solid',     boss:['mephisto','baal'] },
    { id:'bonehew',      name:"Bonehew",                  slot:'weapon', tier:'solid',     boss:['baal','diablo','cows'] },
    { id:'wizardspike',  name:"Wizardspike",              slot:'weapon', tier:'excellent', boss:['mephisto','baal'] },
    { id:'gull',         name:"Gull Dagger",              slot:'weapon', tier:'solid',     boss:['countess'] },
    { id:'reapers',      name:"Reaper's Toll",            slot:'weapon', tier:'excellent', boss:['countess','baal','mephisto'] },
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
    { id:'windforce',    name:"Windforce",                slot:'weapon', tier:'s',         noActBoss:true, boss:['baal','diablo','pit','pindle','nihlathak'] },
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
      sub:'Rune drop specialist. Also drops low-ilvl uniques (Gull, Nagelring, Stealskull, etc.). Fast 30s runs. Pool covers budget/junk uniques.' },
    { id:'andariel',  boss:'nm-anda',
      title:"👹 Andariel — Hell / Nightmare Quest Drop",
      sub:"Best for JEWELRY: SoJ, BK, Raven Frost, Mara's, Highlord's, Wisp Projector, Nature's Peace. NM Andariel quest drop is the only reliable off-Baal SoJ farm. Cannot drop Elite orbs/wands/bows/tiara-helms/sacred-armor." },
    { id:'duriel',    boss:'duriel',
      title:'🐛 Duriel — Any Difficulty (Tomb of Tal Rasha)',
      sub:"Famous for Duriel's Shell. Guaranteed rare/unique on first kill per difficulty. Act 2 quest boss — no Elite base drops." },
    { id:'mephisto',  boss:'mephisto',
      title:'⚡ Mephisto — Hell (Durance of Hate Lvl 3)',
      sub:"THE MF king (mlvl 87). Rolls most S/Excellent/Solid uniques. Cannot drop TC81/84/87 Elite bases: Death's Fathom, Griffon's, Death's Web, Crown of Ages, Nightwing's, Windforce, Tyrael's, Mang Song's, Grandfather, Eaglehorn." },
    { id:'pindle',    boss:'pindle',
      title:"🧟 Pindleskin — Hell (Nihlathak's Temple)",
      sub:'1-screen LV86 super-unique. Rolls almost every Elite unique — including Death\'s Fathom, Griffon\'s, Death\'s Web, Nightwing\'s, Crown of Ages, Windforce, Mang Song\'s. Cannot drop qlvl-87 items (Arachnid, Azurewrath, Tyrael\'s).' },
    { id:'nihlathak', boss:'nihlathak',
      title:'❄️ Nihlathak — Hell (Halls of Vaught)',
      sub:'LV86 boss. Same drop pool as Pindle — every Elite unique except qlvl-87 items.' },
    { id:'diablo',    boss:'diablo',
      title:'🔥 Diablo — Hell (Chaos Sanctuary)',
      sub:"LV94. Drops EVERYTHING — Grandfather, Windforce, Griffon's, Doombringer, Death's Fathom, Tyrael's, all runes to Zod." },
    { id:'baal',      boss:'baal',
      title:'👑 Baal — Hell (Throne of Destruction)',
      sub:'Highest-ilvl boss (LV99 minions). Drops every item in the game — no restrictions.' },
    { id:'pit',       boss:'pit',
      title:'💀 The Pit / Ancient Tunnels — Hell (Level 85 Areas)',
      sub:"Champion & Unique packs (mlvl 87) can drop EVERY unique in the game: Death's Fathom, Griffon's, Death's Web, Arachnid, Tyrael's, Azurewrath, Windforce, Crown of Ages, Nightwing's. THE Holy Grail farming area." },
    { id:'cows',      boss:'cows',
      title:'🐄 Cow Level — Hell (Secret Cow Level)',
      sub:'LV81 zone with insane density. Azurewrath, Bonehew, and bulk rune drops.' },
    { id:'uber',      boss:'uber',
      title:'🔴 Uber Tristram — Pandemonium Event',
      sub:"Diablo Clone & Pandemonium bosses — the ONLY source of Annihilus, Hellfire Torch, and Tyrael's Might." },
  ];

  /* Compute per-boss drop pools.
     REALITY: In Hell, monsters in LV85 zones (Pit, Ancient Tunnels, Worldstone Keep,
     Throne of Destruction, Chaos Sanctuary, Nihlathak's Temple) can roll almost
     ANY unique because they meet the qlvl of every non-uber item. So a "true"
     drop list for those bosses is huge. We build the list by union-ing:
       1. items explicitly tagged for that boss
       2. items in that boss's implicit drop pool (based on tier)
     Uber-exclusive items (Anni / Torch) are excluded from non-uber pools. */

  // Items that ONLY drop from uber tristram
  const UBER_ONLY = new Set(
    ITEMS.filter(i => (i.boss||[]).length === 1 && i.boss[0] === 'uber').map(i => i.id)
  );

  // Item pools indexed by tier (used for LV85+ zone expansion)
  const POOL_BY_TIER = {
    s:         ITEMS.filter(i => i.tier === 's'         && !UBER_ONLY.has(i.id)).map(i => i.id),
    excellent: ITEMS.filter(i => i.tier === 'excellent' && !UBER_ONLY.has(i.id)).map(i => i.id),
    solid:     ITEMS.filter(i => i.tier === 'solid'     && !UBER_ONLY.has(i.id)).map(i => i.id),
    budget:    ITEMS.filter(i => i.tier === 'budget'    && !UBER_ONLY.has(i.id)).map(i => i.id),
    junk:      ITEMS.filter(i => i.tier === 'junk'      && !UBER_ONLY.has(i.id)).map(i => i.id),
  };

  // What each boss/zone can realistically drop (by tier).
  // NOTE: Act bosses (Andariel, Duriel, Mephisto) use `[]` — they only show
  // items explicitly tagged with their boss id. This avoids inventing drops
  // that the boss's special TC actually excludes. LV85+ zones use tier
  // expansion because they legitimately roll from the full unique pool
  // (subject to qlvl gate for qlvl-87 items like Arachnid/Azurewrath/Tyrael's).
  const BOSS_TIER_POOL = {
    countess:  ['budget','junk'],           // low-ilvl niche + explicit tags
    'nm-anda': [],                          // explicit tags only (act boss TC)
    duriel:    [],                          // explicit tags only (act boss TC)
    mephisto:  [],                          // explicit tags only (act boss TC)
    pindle:    ['s','excellent','solid'],   // LV86 super-unique — real drop pool
    nihlathak: ['s','excellent','solid'],   // LV86 boss — real drop pool
    diablo:    ['s','excellent','solid'],   // LV94 — everything
    baal:      ['s','excellent','solid'],   // LV99 — everything
    pit:       ['s','excellent','solid'],   // LV85 zone — everything via champions
    cows:      ['excellent','solid'],       // Hell cows LV81 — mid-tier
    uber:      [],                          // explicit-tagged only
  };

  /* Boss / area monster level. Used to gate qlvl-locked drops.
     For a unique to drop, monster ilvl (= mlvl) must be >= unique's qlvl.
     e.g. Arachnid Mesh (qlvl 87) doesn't drop from Pindle (mlvl 86). */
  const BOSS_MLVL = {
    countess:  74,
    'nm-anda': 86,   // Hell Andariel + quest-drop bug
    duriel:    83,
    mephisto:  87,
    pindle:    86,
    nihlathak: 86,
    diablo:    94,
    baal:      99,
    pit:       87,   // area lvl 85 + champion/unique mlvl bonus
    cows:      81,
    uber:      110,
  };

  /* Act bosses (Andariel, Duriel, Mephisto) use a special "boss" treasure
     class that excludes certain Elite bases (Tiara, Corona, Spired Helm,
     Dimensional Shard, Lich Wand, Hydra/Crusader Bow, Sacred Armor, Elder Staff,
     Colossus Blade). Items flagged `noActBoss:true` are filtered out of these
     bosses' tier-expanded pools. */
  const ACT_BOSSES = new Set(['mephisto','nm-anda','duriel']);

  const BOSS_CATEGORIES = BOSSES.map(b => {
    const explicit = ITEMS.filter(i => (i.boss||[]).includes(b.boss)).map(i => i.id);
    const isActBoss = ACT_BOSSES.has(b.boss);
    // Tier expansion — apply act-boss TC filter
    const tierPool = (BOSS_TIER_POOL[b.boss] || [])
      .flatMap(t => POOL_BY_TIER[t] || [])
      .filter(id => {
        const it = ITEM_BY_ID[id];
        if (isActBoss && it.noActBoss) return false;
        return true;
      });
    const merged   = Array.from(new Set([...explicit, ...tierPool]));
    // For non-uber bosses, keep uber-exclusive items out of the general pool
    let cleaned   = b.boss === 'uber' ? merged : merged.filter(id => !UBER_ONLY.has(id));
    // Enforce qlvl: item.qlvl must be <= boss mlvl
    const mlvl = BOSS_MLVL[b.boss] ?? 99;
    cleaned = cleaned.filter(id => {
      const q = ITEM_BY_ID[id].qlvl;
      return q == null || q <= mlvl;
    });
    // Sort by tier priority so best items appear first
    const TIER_ORDER = { s:0, excellent:1, solid:2, budget:3, junk:4 };
    cleaned.sort((a, bId) => {
      const ta = TIER_ORDER[ITEM_BY_ID[a].tier] ?? 9;
      const tb = TIER_ORDER[ITEM_BY_ID[bId].tier] ?? 9;
      if (ta !== tb) return ta - tb;
      return ITEM_BY_ID[a].name.localeCompare(ITEM_BY_ID[bId].name);
    });
    return { id:'boss-'+b.id, view:'boss', title:b.title, sub:b.sub, items: cleaned };
  }).filter(c => c.items.length);

  // View: Routes (farming wishlists)
  const ROUTE_CATEGORIES = [
    { id:'route-meph', view:'route', title:'🎯 Hell Mephisto Run ⭐⭐⭐⭐⭐',
      sub:'Fastest single-boss MF loop. Still owes you these prizes:',
      items: ['mara','sandstorm','andariels','draculs','vgaze','reapers','raven-frost','tal-belt','tal-ammy','nightwings','lidless','oculus','wizardspike','skullders','shaftstop'] },
    { id:'route-nma',  view:'route', title:'🎯 Andariel — Jewelry & SoJ Hunt ⭐⭐⭐⭐⭐',
      sub:'NM Andariel bugged quest drop = only reliable SoJ farm off-Baal. Hell Andariel great for rings/amulets/gloves.',
      items: ['soj','bul-kathos','raven-frost','nature-peace','dwarf-star','wisp','mara','highlords','tal-ammy','magefist','war-trav'] },
    { id:'route-meph2',view:'route', title:'🎯 Hell Mephisto — Meph-Safe Items ⭐⭐⭐⭐⭐',
      sub:'Meph CANNOT drop Elite-TC items (Fathom, Griffon\'s, Death\'s Web, Crown of Ages, Nightwing\'s, Windforce, Tyrael\'s, Mang Song\'s, Grandfather, Eaglehorn). Focus on these instead:',
      items: ['shako','kira','arachnid','mara','highlords','bul-kathos','soj','herald','stormshield','oculus','eschutas','reapers','titans','andariels','vgaze','draculs','tal-armor','tal-ammy','skullders','shaftstop','ormus','vipermagi','sandstorm','war-trav','azurewrath','lidless','wizardspike','nature-peace'] },
    { id:'route-at',   view:'route', title:'🎯 Ancient Tunnels / Pit ⭐⭐⭐⭐⭐',
      sub:'True level-85 zones — can roll every non-uber unique (including Death\'s Fathom, Grandfather, Windforce). Top targets:',
      items: [
        // S-tier chase items
        'shako','kira','nightwings','griffons','crown-ages',
        'tyraels','arachnid','mara','soj','bul-kathos',
        'deaths-fathom','deaths-web','windforce','grandfather','eaglehorn','mang-songs','titans',
        'facet-cold','facet-fire','facet-light','facet-poison',
        // Excellent-tier
        'andariels','vgaze','shaftstop','duriels','skullders','gladiators','ormus','arkaine','tal-armor',
        'stormshield','lidless','herald',
        'verdungos','tgods','tal-belt','war-trav','sandstorm','gore-rider',
        'draculs','steelrend','raven-frost','wisp',
        'highlords','metalgrid','tal-ammy',
        'eschutas','tal-orb','boneshade','astreons',
        'thunderstroke','bartucs','doombringer','azurewrath','lightsabre',
        'reapers','wizardspike','earthshifter','schaefers'
      ] },
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

/* ═══════════════════════════════════════════════════════════════
   D2 Interactive Build Viewer — paperdoll + slot-click modal
   ═══════════════════════════════════════════════════════════════ */
(function () {
  const viewer = document.getElementById('d2-viewer');
  if (!viewer) return;

  // Build database. Each build has character metadata + per-slot BiS data.
  // quality: 'unique' | 'set' | 'magic' | 'rare' | 'runeword' | 'crafted' | 'normal'
  const BUILDS = {
    smiter: {
      name: 'SMITER',
      label: 'Smiter',
      className: 'PALADIN',
      class: 'paladin',
      tier: 'S',
      stars: 5,
      role: 'Uber Killer',
      content: 'Endgame',
      damage: 'Skill-based (Smite)',
      aura: 'FANATICISM',
      defense: '11,017',
      stats: { str: '156', dex: '136', vit: '407', energy: '35',
               life: '3324 / 3333', mana: '142 / 369', stamina: '987 / 987' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 All Attrs · +10–20 All Res · +5–10% Exp' },
        { name: 'Hellfire Torch (Pal)',   quality: 'unique', stats: '+3 Paladin Skills · +10 All Attrs · +10–20 All Res' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Paladin Combat Skills — stacks Holy Shield levels & block' },
        { name: 'Small Charms (fillers)', quality: 'magic',  stats: '20 Life / 5+ All Res / +3 Max Dmg / FHR — cap resists & fill life' }
      ],
      skills: [
        { name: 'Smite',           lvl: 20, tree: 'Combat',           tier: 'max' },
        { name: 'Holy Shield',     lvl: 20, tree: 'Combat',           tier: 'max' },
        { name: 'Fanaticism',      lvl: 20, tree: 'Offensive Auras',  tier: 'max' },
        { name: 'Salvation',       lvl: 20, tree: 'Defensive Auras',  tier: 'max' },
        { name: 'Charge',          lvl: 1,  tree: 'Combat',           tier: 'high' },
        { name: 'Zeal',            lvl: 1,  tree: 'Combat',           tier: 'high' },
        { name: 'Blessed Hammer',  lvl: 1,  tree: 'Combat',           tier: 'high' },
        { name: 'Redemption',      lvl: 1,  tree: 'Defensive Auras',  tier: 'high' },
        { name: 'Might',           lvl: 1,  tree: 'Offensive Auras',  tier: 'prereq' },
        { name: 'Vigor',           lvl: 1,  tree: 'Offensive Auras',  tier: 'prereq' },
        { name: 'Prayer',          lvl: 1,  tree: 'Defensive Auras',  tier: 'prereq' },
        { name: 'Cleansing',       lvl: 1,  tree: 'Defensive Auras',  tier: 'prereq' },
        { name: 'Defiance',        lvl: 1,  tree: 'Defensive Auras',  tier: 'prereq' }
      ],
      slots: {
        helm: {
          name: "Guillaume's Face", base: 'Winged Helm', quality: 'unique', icon: '⛑',
          stats: [
            '+120–150% Enhanced Damage',
            '35% Chance of Crushing Blow',
            '15% Deadly Strike',
            '+15 to Strength',
            '+15% Increased Attack Speed'
          ],
          sockets: '1os via Larzuk — socket with Ber (DR) or 15% IAS Jewel',
          alts: [
            "Andariel's Visage — Venom aura + 20% IAS, huge tank stats",
            "Arreat's Face — for a Barb-hybrid Smiter (skills + IAS)"
          ]
        },
        weapon: {
          name: 'Grief', base: 'Phase Blade (5 sockets) — Runeword', quality: 'runeword', icon: '🗡',
          stats: [
            'Eth · Tir · Lo · Mal · Ral',
            '35% Chance to Cast Level 15 Venom on Striking',
            '+30–40% Increased Attack Speed',
            'Damage +340–400',
            'Ignore Target\'s Defense',
            '-25% Target Defense',
            '+(1.875 per Character Level) 1.875–185 Attack Rating'
          ],
          sockets: '5os Phase Blade base (indestructible, ultra-fast attack speed breakpoints)',
          alts: [
            "Astreon's Iron Ward — unique Caduceus, +1 all skills, huge FCR (aura swap)",
            "Last Wish — for Life Tap + Might aura synergy"
          ]
        },
        shield: {
          name: 'Herald of Zakarum', base: 'Gilded Shield', quality: 'unique', icon: '⛨',
          stats: [
            '+2 to Paladin Skill Levels',
            '+20 to Strength & Vitality',
            '+195% Enhanced Defense',
            'All Resistances +50',
            '+150% Damage vs Undead & Demons',
            '+2 to Combat Skills (Paladin only)'
          ],
          sockets: '1os via Larzuk — socket with Um (all-res) or 15% IAS Jewel',
          alts: [
            "Exile Runeword — 4os Vortex Shield, Life Tap aura + Defiance",
            "Spirit — cheap FCR option for Auradin hybrids"
          ]
        },
        armor: {
          name: 'Enigma', base: 'Mage Plate / Archon Plate (3os) — Runeword', quality: 'runeword', icon: '🛡',
          stats: [
            'Jah · Ith · Ber',
            '+2 to All Skills',
            '+45% Faster Run/Walk',
            '+750–775 Defense',
            '+(0.75 per Character Level) 0.75–74 to Strength',
            'Increase Maximum Life 5%',
            'Damage Reduction 8%',
            'Level 1 Teleport (as skill)'
          ],
          sockets: '3os body armor (Mage Plate for low-str, Archon Plate for higher def)',
          alts: [
            "Fortitude — massive +300% ED and life boost if you can't afford Enigma",
            "Chains of Honor — +2 skills, +65 res, huge DR"
          ]
        },
        gloves: {
          name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
          stats: [
            '25% Chance of Open Wounds',
            '7–10% Life Stolen per Hit',
            '5% Chance to Cast Level 10 Life Tap on Striking',
            '+10–15 to Strength',
            '+50 Poison Damage over 4 Seconds'
          ],
          sockets: '0os — cannot be socketed (gloves aren\'t socketable)',
          alts: [
            "Steelrend — pure damage/CB alternative (no Life Tap proc)",
            "Trang-Oul's Claws — for Poisonmancer merc swap only"
          ]
        },
        belt: {
          name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
          stats: [
            '+30–40 to Vitality',
            '10–15% Damage Reduction',
            '+100–120 to Life',
            '+10% Faster Hit Recovery',
            'Replenish Life +10–13'
          ],
          sockets: '0os — belts cannot be socketed',
          alts: [
            "Thundergod's Vigor — for +20 max lightning res on lightning ubers",
            "Arachnid Mesh — only if you're an Auradin caster hybrid"
          ]
        },
        boots: {
          name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
          stats: [
            '+160–200% Enhanced Defense',
            '15% Chance of Deadly Strike',
            '10% Chance of Open Wounds',
            '15% Chance of Crushing Blow',
            '+20% Faster Run/Walk',
            'Requirements -50%'
          ],
          sockets: '0os — boots cannot be socketed',
          alts: [
            "Sandstorm Trek — MF/farming variant (poison res + stamina)",
            "War Traveler — MF Smiter for chaos runs"
          ]
        },
        amulet: {
          name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
          stats: [
            '+1 to All Skills',
            'Deadly Strike +% per Character Level (up to +37% at lvl 99)',
            '+20% Increased Attack Speed',
            'Lightning Resistance +35%',
            '+1 to Light Radius'
          ],
          sockets: '0os — amulets cannot be socketed',
          alts: [
            "Mara's Kaleidoscope — +2 skills, +20–30 all resistances (safer)",
            "Metalgrid — huge +AR and all-res if you need to hit"
          ]
        },
        ring1: {
          name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
          stats: [
            '+150–250 to Attack Rating',
            'Adds 15–45 Cold Damage',
            '+15–20 to Dexterity',
            '+40 Mana',
            'Cold Absorb 20%',
            'Cannot Be Frozen'
          ],
          sockets: '0os — rings cannot be socketed',
          alts: [
            "Bul-Kathos' Wedding Band — +1 skills, +life (BiS 2nd slot)",
            "Rare AR/leech/resist ring (Stone of Jordan alt)"
          ]
        },
        ring2: {
          name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
          stats: [
            '+1 to All Skills',
            '+50 to Life (+0.5 per level)',
            '3–5% Life Stolen per Hit',
            '+15–20 to Strength'
          ],
          sockets: '0os — rings cannot be socketed',
          alts: [
            "Stone of Jordan — +1 skills + huge mana (mana-hungry variants)",
            "Rare Dual Leech ring — LL+ML with resists for defense"
          ]
        },
        merc: {
          name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
          stats: [
            'Weapon: Insight → Reaper\'s Toll (Decrepify proc + IAS)',
            'Armor: Fortitude Runeword (+300% ED, +200% ED aura, huge life)',
            'Helm: Andariel\'s Visage (Venom + IAS + huge stats)',
            '',
            '► Reaper\'s Decrepify halves boss physical resist & slows attack speed',
            '► Andariel\'s Venom stacks with your Grief for extra poison damage'
          ],
          sockets: 'Reaper\'s = 0os (unique fixed) • Fortitude = 4os body (El+Sol+Dol+Lo) • Andy\'s = 1os via Larzuk (Ber or Cham)',
          alts: [
            "Pride Runeword polearm — Concentration aura for FoH swap builds",
            "Infinity polearm — for Auradin hybrids running Conviction"
          ]
        }
      }
    },

    /* ═════════════ AMAZON ═════════════ */
    javazon: {
      name: 'JAVAZON', label: 'Javazon',
      className: 'AMAZON', class: 'amazon',
      tier: 'S', stars: 5,
      role: 'Lightning Cows', content: 'MF / Farming',
      damage: 'Charged Strike / Lightning Fury',
      aura: 'VALKYRIE',
      defense: '4,200',
      stats: { str: '156', dex: '340', vit: '250', energy: '20',
               life: '2,450 / 2,450', mana: '180 / 240', stamina: '650 / 650' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 All Attrs · +10–20 All Res · +5–10% Exp' },
        { name: 'Hellfire Torch (Ama)',   quality: 'unique', stats: '+3 Amazon Skills · +10 All Attrs · +10–20 All Res' },
        { name: 'Java Skiller GC ×4–6',   quality: 'magic',  stats: '+1 Javelin & Spear Skills — boosts Fury/CS/LB' },
        { name: 'Small Charms (fillers)', quality: 'magic',  stats: '20 Life / 5+ All Res / +3 Max Dmg — cap resists' }
      ],
      skills: [
        { name: 'Lightning Fury',   lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Charged Strike',   lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Lightning Bolt',   lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Power Strike',     lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Valkyrie',         lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Decoy',            lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Pierce',           lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Griffon's Eye", base: 'Diadem', quality: 'unique', icon: '⛑',
                  stats: ['+1 All Skills','-15–20% to Enemy Lightning Res','+10–15% Lightning Skill Damage'],
                  sockets: '1os via Larzuk — Ist (MF) or 15% IAS Jewel',
                  alts: ["Andariel's Visage — +2 skills, 20% IAS, venom"] },
        weapon: { name: "Titan's Revenge", base: 'Ceremonial Javelin', quality: 'unique', icon: '🗡',
                  stats: ['+2 Amazon Skills','Replenishes Javelins','+180–200% ED','+30–40 Strength'],
                  alts: ["Thunderstroke — +2 Light Skills, huge lightning damage"] },
        shield: { name: 'Stormshield', base: 'Monarch', quality: 'unique', icon: '⛨',
                  stats: ['35% Damage Reduction','25% Chance to Block','+30 Strength'],
                  alts: ['Spirit Monarch — for FCR/caster hybrid builds'] },
        armor:  { name: 'Enigma', base: 'Mage Plate 3os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Jah · Ith · Ber','+2 All Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor — 65 all res + DR','Fortitude — +300% ED'] },
        gloves: { name: 'Bloodfist', base: 'Heavy Gloves', quality: 'unique', icon: '🧤',
                  stats: ['+40 Life','10% IAS','+5–10 Minimum Damage'],
                  alts: ["Trang-Oul's Claws — 20% FCR + +2 Curses"] },
        belt:   { name: 'Razortail', base: 'Sharkskin Belt', quality: 'unique', icon: '▬',
                  stats: ['+15% Piercing Attack','+15 Dexterity','+40–50 Max Damage'],
                  alts: ["Verdungo's Hearty Cord — +100–120 Life, DR"] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['25% Better Magic Find','+10 Vitality','+15% ED'],
                  alts: ['Gore Rider — 15% CB / 10% DS for CS strikes'] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 All Skills','+Deadly Strike per Char Level','20% IAS'],
                  alts: ["Mara's Kaleidoscope — +2 skills, +20–30 All Res"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Cannot Be Frozen','+15–20 Dexterity','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 All Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity (Cryptic Axe) — Conviction aura','Fortitude Archon Plate','Andariel\'s Visage'],
                  alts: ["Reaper's Toll polearm — Decrepify on strike"] }
      }
    },

    freezingArrow: {
      name: 'FREEZING ARROW', label: 'Freezing Arrow',
      className: 'AMAZON', class: 'amazon',
      tier: 'A', stars: 4,
      role: 'Cold Bow', content: 'MF / Farming',
      damage: 'Freezing Arrow (Cold AoE)',
      aura: 'MEDITATION (Merc)',
      defense: '2,800',
      stats: { str: '95', dex: '280', vit: '180', energy: '25',
               life: '1,700 / 1,700', mana: '220 / 260', stamina: '540 / 540' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 All Attrs · +10–20 All Res' },
        { name: 'Hellfire Torch (Ama)',   quality: 'unique', stats: '+3 Amazon Skills · +10 All Attrs' },
        { name: 'Bow Skiller GC ×4–6',    quality: 'magic',  stats: '+1 Bow & Crossbow Skills — stacks FA damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ All Res / +3 Max Dmg' }
      ],
      skills: [
        { name: 'Freezing Arrow',   lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Ice Arrow',        lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Cold Arrow',       lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Penetrate',        lvl: 20, tree: 'Passive & Magic', tier: 'max' },
        { name: 'Critical Strike',  lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' },
        { name: 'Valkyrie',         lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Decoy',            lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Pierce',           lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Andariel's Visage", base: 'Demonhead', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','20% IAS','+8–10 Life Steal','Level 15 Venom when equipped'],
                  sockets: '1os via Larzuk — 15% IAS Jewel or Ral (fire res patch)',
                  alts: ["Griffon's Eye — swap for lightning bow hybrids"] },
        weapon: { name: 'Faith', base: 'Grand Matron Bow 4os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Ohm · Jah · Lem · Eld','Level 12–15 Fanaticism Aura','+1–2 All Skills','+330% ED'],
                  alts: ['Windforce — physical dmg + KB','Ice Bow (rare) for cold-only'] },
        shield: { name: '(No Shield — Bow build)', base: '2-Handed Weapon', quality: 'normal', icon: '⛨',
                  stats: ['Bowazons wield bows two-handed — shield slot unused'],
                  alts: ['Some hybrids swap to Stormshield for tanking'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate 4os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['El · Sol · Dol · Lo','+300% Enhanced Damage','+200% ED (armor)','+8% FCR'],
                  alts: ['Enigma — teleport mobility','Treachery — 25% IAS + Fade'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Damage to Demons','+50% Fire Resist'],
                  alts: ["Bloodfist — +40 Life + 10% IAS"] },
        belt:   { name: 'Razortail', base: 'Sharkskin Belt', quality: 'unique', icon: '▬',
                  stats: ['+15% Piercing Attack','+15 Dexterity','+40–50 Max Damage'],
                  alts: ['Goldwrap — 10% IAS + gold find for MF runs'] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['25% Better Magic Find','+10 Vitality','+15% ED'],
                  alts: ['Sandstorm Trek — poison res + str/vit'] },
        amulet: { name: "Cat's Eye", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+25 Defense','+30 Dexterity','20% IAS','30% FRW'],
                  alts: ["Highlord's Wrath — +1 skills + DS"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Cannot Be Frozen','+15–20 Dexterity','+150–250 AR'] },
        ring2:  { name: 'Nagelring', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+15–30% Magic Find','+50 Attack Rating'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might — boosts merc physical damage','Insight polearm — Meditation aura for merc mana','Fortitude Archon Plate — huge merc life & damage','Andariel’s Visage — Venom + 20% IAS'],
                  alts: ['Infinity Cryptic Axe — Conviction aura breaks Immunes (endgame)','Reaper’s Toll — procs Decrepify on hit'] }
      }
    },

    multishot: {
      name: 'MULTISHOT', label: 'Multishot',
      className: 'AMAZON', class: 'amazon',
      tier: 'B', stars: 3,
      role: 'Physical Bow', content: 'General',
      damage: 'Multishot / Guided Arrow',
      aura: 'FANATICISM (Faith)',
      defense: '3,100',
      stats: { str: '95', dex: '310', vit: '200', energy: '15',
               life: '1,900 / 1,900', mana: '140 / 180', stamina: '620 / 620' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 All Attrs · +10–20 All Res' },
        { name: 'Hellfire Torch (Ama)',   quality: 'unique', stats: '+3 Amazon Skills · +10 All Attrs' },
        { name: 'Bow Skiller GC ×4–6',    quality: 'magic',  stats: '+1 Bow & Crossbow — Multishot boost' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / +max dmg / res' }
      ],
      skills: [
        { name: 'Multishot',        lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Guided Arrow',     lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Strafe',           lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Critical Strike',  lvl: 20, tree: 'Passive & Magic', tier: 'max' },
        { name: 'Penetrate',        lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Pierce',           lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Andariel's Visage", base: 'Demonhead', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','20% IAS','Venom proc'],
                  sockets: '1os via Larzuk — 15% IAS Jewel',
                  alts: ['+2 Bow Skills Circlet with sockets'] },
        weapon: { name: 'Faith', base: 'Grand Matron Bow — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Ohm · Jah · Lem · Eld','Fanaticism Aura (dmg + IAS)','+330% ED'],
                  alts: ['Windforce — KB','Eaglehorn — +1 skills, huge AR'] },
        shield: { name: '(No Shield — 2H Bow)', base: '2-Handed Weapon', quality: 'normal', icon: '⛨',
                  stats: ['Bows are 2-handed — no shield'],
                  alts: [] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Enigma for teleport','Treachery for IAS+Fade'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Damage to Demons'],
                  alts: ["Dracul's Grasp — Life Tap on striking"] },
        belt:   { name: 'Razortail', base: 'Sharkskin Belt', quality: 'unique', icon: '▬',
                  stats: ['+15% Piercing Attack','+15 Dex','+40–50 Max Dmg'],
                  alts: ["Nosferatu's Coil — 10% IAS + Life Leech"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% Crushing Blow','10% Deadly Strike','15% Open Wounds'],
                  alts: ['War Traveler — 25% MF'] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 All Skills','+DS per Char Level','20% IAS'],
                  alts: ["Cat's Eye — 20% IAS + 30 Dex"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Cannot Be Frozen','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Rare Dex Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+10–15 Dexterity','+70+ AR','+Life/Res'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might — boosts your bow & merc damage','Insight polearm — Meditation aura for merc mana','Fortitude Archon Plate — huge merc life & damage','Andariel’s Visage — Venom + 20% IAS'],
                  alts: ['Infinity Cryptic Axe — Conviction aura breaks Immunes (endgame)','Reaper’s Toll — procs Decrepify on hit'] }
      }
    },

    budgetJavazon: {
      name: 'BUDGET JAVAZON', label: 'Budget Javazon',
      className: 'AMAZON', class: 'amazon',
      tier: 'B', stars: 3,
      role: 'Starter', content: 'Leveling',
      damage: 'Charged Strike / Lightning Fury',
      aura: 'VALKYRIE',
      defense: '1,800',
      stats: { str: '90', dex: '200', vit: '150', energy: '15',
               life: '1,200 / 1,200', mana: '120 / 150', stamina: '480 / 480' },
      charms: [
        { name: 'Java Skiller GC ×1–3',   quality: 'magic',  stats: '+1 Javelin & Spear — save these for later!' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5 All Res / +max dmg — cap resists first' },
        { name: 'Gheed\'s Fortune',       quality: 'unique', stats: 'Optional — +MF, +Gold, vendor discount' }
      ],
      skills: [
        { name: 'Charged Strike',   lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Lightning Fury',   lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Power Strike',     lvl: 20, tree: 'Javelin & Spear', tier: 'high' },
        { name: 'Lightning Bolt',   lvl: 20, tree: 'Javelin & Spear', tier: 'high' },
        { name: 'Valkyrie',         lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Tal Rasha's Horadric Crest", base: 'Death Mask', quality: 'set', icon: '⛑',
                  stats: ['+2 All Skills (with set)','+30 Mana','+45 Life','+15% All Res'],
                  alts: ['Peasant Crown — +1 skills, cheap'] },
        weapon: { name: "Titan's Revenge", base: 'Ceremonial Javelin', quality: 'unique', icon: '🗡',
                  stats: ['+2 Ama Skills','Replenishes Javelins','+180–200% ED'],
                  alts: ['Stormstrike — +2 Light Skills, budget alt'] },
        shield: { name: "Ancient's Pledge", base: 'Kite Shield 3os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Ral · Ort · Tal','+50% All Res','+50% ED'],
                  alts: ['Rhyme (Shael+Eth) — CBF + MF'] },
        armor:  { name: 'Skin of the Vipermagi', base: 'Serpentskin Armor', quality: 'unique', icon: '🛡',
                  stats: ['+1 All Skills','+30% FCR','+20–35 All Res'],
                  alts: ['Smoke Runeword — 50 all res + FRW'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire Skills','20% FCR','25% Mana Regen'],
                  alts: ['Rare +2 Amazon gloves'] },
        belt:   { name: 'String of Ears', base: 'Demonhide Sash', quality: 'unique', icon: '▬',
                  stats: ['15% Damage Reduction','+150 AR','6–8% Life Steal'],
                  alts: ['Razortail — Piercing Attack'] },
        boots:  { name: 'Goblin Toe', base: 'Light Plated Boots', quality: 'unique', icon: '👢',
                  stats: ['25% Crushing Blow','+15 Def','+1 Life per Level'],
                  alts: ['Waterwalk — +40 Dex + Life'] },
        amulet: { name: 'Rare +2 Javelin & Spear', base: 'Amulet', quality: 'rare', icon: '📿',
                  stats: ['+2 Javelin & Spear','+Life/Res/FRW','+Attributes'],
                  alts: ["Highlord's Wrath — if you can afford"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Cannot Be Frozen','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Rare Life/Res Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+40+ Life','+15%+ Res','+AR/Stats'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation for mana','Treachery Dusk Shroud','Any 3os helm'],
                  alts: [] }
      }
    },

    strafeazon: {
      name: 'STRAFEAZON', label: 'Strafeazon',
      className: 'AMAZON', class: 'amazon',
      tier: 'A', stars: 4,
      role: 'Physical Bow', content: 'Boss Killer',
      damage: 'Strafe / Guided Arrow',
      aura: 'FANATICISM (Faith)',
      defense: '3,000',
      stats: { str: '95', dex: '320', vit: '200', energy: '15',
               life: '1,850 / 1,850', mana: '130 / 170', stamina: '620 / 620' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Ama)',   quality: 'unique', stats: '+3 Amazon Skills · +Stats · +Res' },
        { name: 'Bow Skiller GC ×4–6',    quality: 'magic',  stats: '+1 Bow & Crossbow — Strafe damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5 Res / +3 Max Dmg' }
      ],
      skills: [
        { name: 'Strafe',           lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Guided Arrow',     lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Multishot',        lvl: 20, tree: 'Bow & Crossbow',  tier: 'max' },
        { name: 'Critical Strike',  lvl: 20, tree: 'Passive & Magic', tier: 'max' },
        { name: 'Penetrate',        lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Valkyrie',         lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Pierce',           lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Andariel's Visage", base: 'Demonhead', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','20% IAS','Venom proc','+8–10 Life Steal'],
                  sockets: '1os via Larzuk — 15% IAS Jewel',
                  alts: ["Griffon's Eye for lightning bow builds"] },
        weapon: { name: 'Faith', base: 'Grand Matron Bow — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Fanaticism Aura (huge IAS + dmg)','+330% ED','+1–2 All Skills'],
                  alts: ['Windforce — KB physical bow','Eaglehorn — +1 skills, huge AR'] },
        shield: { name: '(No Shield — 2H Bow)', base: '2-Handed Weapon', quality: 'normal', icon: '⛨',
                  stats: ['Bows occupy both hands'], alts: [] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Enigma for teleport mobility'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Damage to Demons'],
                  alts: [] },
        belt:   { name: 'Razortail', base: 'Sharkskin Belt', quality: 'unique', icon: '▬',
                  stats: ['+15% Piercing Attack','+15 Dex','+40–50 Max Dmg'],
                  alts: ['String of Ears — 15% DR + Life Leech'] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Char Level','20% IAS'],
                  alts: ["Cat's Eye for 20% IAS + Dex"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Raven Frost #2 or Rare AR Ring', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Double Ravens for AR/Dex','or Rare with LL/AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks LI)','Fortitude Archon Plate','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    spearazon: {
      name: 'SPEARAZON', label: 'Spearazon (Fend/Impale)',
      className: 'AMAZON', class: 'amazon',
      tier: 'B', stars: 3,
      role: 'Melee Amazon', content: 'PvP',
      damage: 'Fend (multi-hit combo)',
      aura: 'FANATICISM (merc/Torch)',
      defense: '4,500',
      stats: { str: '156', dex: '240', vit: '250', energy: '20',
               life: '2,300 / 2,300', mana: '150 / 190', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 All Attrs' },
        { name: 'Hellfire Torch (Ama)',   quality: 'unique', stats: '+3 Amazon Skills · +Stats' },
        { name: 'Java Skiller GC ×4–6',   quality: 'magic',  stats: '+1 Javelin & Spear — Fend damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Fend',             lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Jab',              lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Impale',           lvl: 20, tree: 'Javelin & Spear', tier: 'max' },
        { name: 'Critical Strike',  lvl: 20, tree: 'Passive & Magic', tier: 'max' },
        { name: 'Penetrate',        lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Valkyrie',         lvl: 1,  tree: 'Passive & Magic', tier: 'high' },
        { name: 'Pierce',           lvl: 1,  tree: 'Passive & Magic', tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Andariel's Visage", base: 'Demonhead', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','20% IAS','Venom proc'],
                  alts: ["Guillaume's Face — CB/DS/Str"] },
        weapon: { name: "Lycander's Flank", base: 'Ceremonial Pike', quality: 'unique', icon: '🗡',
                  stats: ['+2 Amazon Skills','+40 Str/Dex','+220% ED','+180% ED to Demons'],
                  alts: ['Hone Sundan — CB proc','Ghostflame — fire dmg + Ignore Def'] },
        shield: { name: '(2H Spear — no shield)', base: '2-Handed Weapon', quality: 'normal', icon: '⛨',
                  stats: ['Spears require both hands'], alts: [] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Chains of Honor — 65 all res'] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap on Striking','+10–15 Str','+7–10% Life Leech'],
                  alts: ['Laying of Hands — 20% IAS + demon dmg'] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ["Thundergod's Vigor — Light Absorb"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Mara's Kaleidoscope — +2 skills + Res"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 All Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Reaper\'s Toll — Decrepify proc','Treachery — 25% IAS + Fade','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    /* ═════════════ ASSASSIN ═════════════ */
    trapsin: {
      name: 'TRAPSIN', label: 'Trapsin',
      className: 'ASSASSIN', class: 'assassin',
      tier: 'S', stars: 5,
      role: 'Lightning Traps', content: 'Endgame',
      damage: 'Lightning Sentry / Death Sentry',
      aura: 'FADE',
      defense: '3,800',
      stats: { str: '90', dex: '110', vit: '380', energy: '35',
               life: '3,100 / 3,100', mana: '200 / 240', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 All Attrs · +Res' },
        { name: 'Hellfire Torch (Sin)',   quality: 'unique', stats: '+3 Assassin Skills · +Stats · +Res' },
        { name: 'Trap Skiller GC ×6–8',   quality: 'magic',  stats: '+1 Traps — stacks LS/DS damage massively' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Lightning Sentry', lvl: 20, tree: 'Traps',           tier: 'max' },
        { name: 'Death Sentry',     lvl: 20, tree: 'Traps',           tier: 'max' },
        { name: 'Shock Web',        lvl: 20, tree: 'Traps',           tier: 'max' },
        { name: 'Charged Bolt Sen.',lvl: 20, tree: 'Traps',           tier: 'max' },
        { name: 'Fade',             lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Shadow Master',    lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Burst of Speed',   lvl: 1,  tree: 'Shadow Disc.',    tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Griffon's Eye", base: 'Diadem', quality: 'unique', icon: '⛑',
                  stats: ['+1 All Skills','-15–20% Enemy Light Res','+10–15% Light Skill Dmg'],
                  sockets: '1os via Larzuk — Ist (MF) or Cham (CBF)',
                  alts: ['Harlequin Crest (Shako) — +2 skills, +MF'] },
        weapon: { name: "Bartuc's Cut-Throat", base: 'Greater Talons', quality: 'unique', icon: '🗡',
                  stats: ['+2 Martial Arts Skills','+1 Assassin Skills','+150–200% ED','30% IAS'],
                  alts: ['Chaos Runic Talons — Whirlwind + Cold Enchant proc'] },
        shield: { name: '+3 Lightning Sentry Claw', base: 'Runic Talons', quality: 'magic', icon: '⛨',
                  stats: ['+3 Lightning Sentry','+3 Death Sentry','+3 Shock Web','+3 Fire Blast'],
                  alts: ["Bartuc's Cut-Throat — dual Bartuc's for +Skills"] },
        armor:  { name: 'Enigma', base: 'Mage Plate 3os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Jah · Ith · Ber','+2 All Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor — 65 all res'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Cold Res','+30% Poison Res'],
                  alts: ['Magefist — +1 Fire, 20% FCR'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 All Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['25% MF','+10 Vit','+15% ED'],
                  alts: ['Shadow Dancer — +2 Shadow Skills'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 All Attrs'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 All Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks LI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    kicksin: {
      name: 'KICKSIN', label: 'Kicksin (Dragon Talon)',
      className: 'ASSASSIN', class: 'assassin',
      tier: 'A', stars: 4,
      role: 'Uber Killer', content: 'Uber Tristram',
      damage: 'Dragon Talon (Boots dmg)',
      aura: 'FADE',
      defense: '4,900',
      stats: { str: '156', dex: '180', vit: '340', energy: '25',
               life: '2,900 / 2,900', mana: '160 / 200', stamina: '820 / 820' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sin)',   quality: 'unique', stats: '+3 Assassin Skills · +Stats · +Res' },
        { name: 'MA Skiller GC ×4–6',     quality: 'magic',  stats: '+1 Martial Arts — Dragon Talon damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / +max dmg' }
      ],
      skills: [
        { name: 'Dragon Talon',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Dragon Flight',    lvl: 1,  tree: 'Martial Arts',    tier: 'high' },
        { name: 'Venom',            lvl: 20, tree: 'Shadow Disc.',    tier: 'max' },
        { name: 'Weapon Block',     lvl: 20, tree: 'Shadow Disc.',    tier: 'max' },
        { name: 'Fade',             lvl: 20, tree: 'Shadow Disc.',    tier: 'max' },
        { name: 'Shadow Master',    lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Burst of Speed',   lvl: 1,  tree: 'Shadow Disc.',    tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Guillaume's Face", base: 'Winged Helm', quality: 'unique', icon: '⛑',
                  stats: ['35% CB','15% DS','+120% ED','+15 Str'],
                  sockets: '1os via Larzuk — Ber (DR) or 15% IAS',
                  alts: ["Andariel's Visage — venom + 20% IAS"] },
        weapon: { name: 'Chaos', base: 'Runic Talons 3os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Fal · Ohm · Um','+9 to WW','+240% ED','35% Cold Enchant proc'],
                  alts: ["Bartuc's Cut-Throat — +2 MA skills"] },
        shield: { name: "Bartuc's Cut-Throat (Off)", base: 'Greater Talons', quality: 'unique', icon: '⛨',
                  stats: ['+2 MA Skills','+1 Sin Skills','30% IAS','+150–200% ED'],
                  alts: ['+3 Dragon Talon Rare Claw'] },
        armor:  { name: 'Enigma', base: 'Mage Plate 3os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Fortitude — +300% ED'] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap on Striking','+10–15 Str','+7–10% LL'],
                  alts: [] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ["Thundergod's Vigor for light absorb"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW','+160% ED'],
                  alts: ['Only Gore Rider for Kicksin — CB/DS'] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Mara's Kaleidoscope"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Reaper\'s Toll — Decrepify proc for Ubers','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    wwsin: {
      name: 'WHIRLWIND', label: 'Whirlwind',
      className: 'ASSASSIN', class: 'assassin',
      tier: 'A', stars: 4,
      role: 'Whirlwind', content: 'Endgame',
      damage: 'Whirlwind (from Chaos)',
      aura: 'FADE',
      defense: '4,400',
      stats: { str: '156', dex: '180', vit: '320', energy: '25',
               life: '2,700 / 2,700', mana: '160 / 200', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sin)',   quality: 'unique', stats: '+3 Sin Skills · +Stats' },
        { name: 'MA Skiller GC ×4–6',     quality: 'magic',  stats: '+1 Martial Arts — boosts Venom + Weapon Block' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / +max dmg' }
      ],
      skills: [
        { name: 'Whirlwind (Chaos)',lvl: '+9',tree: 'Weapon RW',      tier: 'max' },
        { name: 'Venom',            lvl: 20, tree: 'Shadow Disc.',    tier: 'max' },
        { name: 'Weapon Block',     lvl: 20, tree: 'Shadow Disc.',    tier: 'max' },
        { name: 'Claw Mastery',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Shadow Master',    lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Fade',             lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Burst of Speed',   lvl: 1,  tree: 'Shadow Disc.',    tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Guillaume's Face", base: 'Winged Helm', quality: 'unique', icon: '⛑',
                  stats: ['35% CB','15% DS','+120% ED','+15 Str'],
                  alts: ["Andariel's Visage — venom + IAS"] },
        weapon: { name: 'Chaos', base: 'Suwayyah 3os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Fal · Ohm · Um','+9 to Whirlwind','+240% ED','35% Cold Enchant proc'],
                  alts: [] },
        shield: { name: 'Chaos (Off-hand)', base: 'Suwayyah — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Second Chaos claw or','Fury Runic Talons for LL/DS'],
                  alts: ['Rare +3 WW claw'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Enigma teleport','Chains of Honor for res'] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap','+10–15 Str','+7–10% LL'],
                  alts: [] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ["Nosferatu's Coil — 10% IAS + LL"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Mara's Kaleidoscope"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might — pairs with your Whirlwind physical damage','Insight polearm — Meditation aura for merc mana','Fortitude Archon Plate — huge merc life & damage','Andariel’s Visage — Venom + 20% IAS'],
                  alts: ['Infinity Cryptic Axe — Conviction aura breaks Immunes (endgame)','Reaper’s Toll — procs Decrepify on hit'] }
      }
    },

    budgetTrapsin: {
      name: 'BUDGET TRAPSIN', label: 'Budget Trapsin',
      className: 'ASSASSIN', class: 'assassin',
      tier: 'B', stars: 3,
      role: 'Starter', content: 'Farming',
      damage: 'Lightning Sentry / Death Sentry',
      aura: 'FADE',
      defense: '2,000',
      stats: { str: '80', dex: '90', vit: '250', energy: '25',
               life: '1,700 / 1,700', mana: '160 / 190', stamina: '620 / 620' },
      charms: [
        { name: 'Trap Skiller GC ×1–3',   quality: 'magic',  stats: '+1 Traps — save for later!' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5 Res / FHR — cap resists first' },
        { name: "Gheed's Fortune",        quality: 'unique', stats: 'MF/gold/vendor discount — great early charm' }
      ],
      skills: [
        { name: 'Lightning Sentry', lvl: 20, tree: 'Traps',           tier: 'max' },
        { name: 'Death Sentry',     lvl: 20, tree: 'Traps',           tier: 'max' },
        { name: 'Shock Web',        lvl: 20, tree: 'Traps',           tier: 'high' },
        { name: 'Fade',             lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Shadow Warrior',   lvl: 1,  tree: 'Shadow Disc.',    tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Lore', base: 'Helm 2os — Runeword', quality: 'runeword', icon: '⛑',
                  stats: ['Ort · Sol','+1 All Skills','+30% Lightning Res','+10 Energy'],
                  alts: ['+3 Trap Circlet with sockets'] },
        weapon: { name: 'Rare +3 LS / +3 DS Claw', base: 'Suwayyah', quality: 'rare', icon: '🗡',
                  stats: ['+3 Lightning Sentry','+3 Death Sentry','+2 Traps','20% IAS'],
                  alts: ['Any +Trap Claw is great early'] },
        shield: { name: '+3 Trap Claw', base: 'Runic Talons', quality: 'magic', icon: '⛨',
                  stats: ['+3 LS / +3 DS','+3 Shock Web','+3 Fire Blast'],
                  alts: [] },
        armor:  { name: 'Skin of the Vipermagi', base: 'Serpentskin Armor', quality: 'unique', icon: '🛡',
                  stats: ['+1 All Skills','30% FCR','+20–35 All Res'],
                  alts: ['Smoke Runeword — 50 all res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Trang-Oul's Claws for +2 curses"] },
        belt:   { name: 'Goldwrap', base: 'Heavy Belt', quality: 'unique', icon: '▬',
                  stats: ['10% IAS','+30–50% Gold Find'],
                  alts: ['String of Ears — 15% DR'] },
        boots:  { name: 'Silkweave', base: 'Mesh Boots', quality: 'unique', icon: '👢',
                  stats: ['+30 Mana Regen','+30% FRW','+20 Def'],
                  alts: ['Waterwalk — +40 Dex + Life'] },
        amulet: { name: 'Rare +2 Assassin Amulet', base: 'Amulet', quality: 'rare', icon: '📿',
                  stats: ['+2 Assassin Skills','+FCR','+Life/Res'],
                  alts: ['Any +Skills Amulet'] },
        ring1:  { name: 'Rare Life/Mana Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+40+ Life','+50+ Mana','+Res'] },
        ring2:  { name: 'Rare Life/Res Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+Life','+All Res','+Attrs'] },
        merc:   { name: 'Act 2 Prayer Merc', base: 'Hell Combat · Prayer Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Prayer','Insight polearm — Meditation for mana','Treachery','Any 3os helm'],
                  alts: [] }
      }
    },

    phoenixStriker: {
      name: 'PHOENIX STRIKER', label: 'Phoenix Striker (MA)',
      className: 'ASSASSIN', class: 'assassin',
      tier: 'A', stars: 4,
      role: 'Charge-Up MA', content: 'General',
      damage: 'Phoenix Strike + Dragon Talon',
      aura: 'FADE / BoS',
      defense: '4,600',
      stats: { str: '95', dex: '160', vit: '340', energy: '25',
               life: '2,800 / 2,800', mana: '170 / 210', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sin)',   quality: 'unique', stats: '+3 Assassin Skills · +Stats' },
        { name: 'MA Skiller GC ×4–6',     quality: 'magic',  stats: '+1 Martial Arts — Phoenix Strike dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Phoenix Strike',   lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Dragon Talon',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Cobra Strike',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Claw Mastery',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Weapon Block',     lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Venom',            lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Fade',             lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Burst of Speed',   lvl: 1,  tree: 'Shadow Disc.',    tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Guillaume's Face", base: 'Winged Helm', quality: 'unique', icon: '⛑',
                  stats: ['35% CB','15% DS','+120% ED','+15 Str'],
                  alts: ["Andariel's Visage — venom + IAS"] },
        weapon: { name: "Bartuc's Cut-Throat", base: 'Greater Talons', quality: 'unique', icon: '🗡',
                  stats: ['+2 MA Skills','+1 Sin Skills','30% IAS','+150–200% ED'],
                  alts: ['Chaos Runic Talons — WW + Cold Enchant'] },
        shield: { name: 'Chaos Runic Talons (Off)', base: 'Runic Talons — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+9 WW option','+240% ED','35% CE proc'],
                  alts: ["Second Bartuc's for +Skills"] },
        armor:  { name: 'Chains of Honor', base: 'Dusk Shroud 4os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Dol · Um · Ber · Ist','+2 Skills','+65% All Res','+8% DR'],
                  alts: ['Fortitude — +300% ED'] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap','+10–15 Str','+7–10% LL'],
                  alts: [] },
        belt:   { name: "Thundergod's Vigor", base: 'War Belt', quality: 'unique', icon: '▬',
                  stats: ['+200 Light Dmg','+10–20 Str/Vit','+10% Max Light Res'],
                  alts: ["Verdungo's for +Life/DR"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Mara's Kaleidoscope"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks LI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    bladeFury: {
      name: 'BLADE FURY', label: 'Blade Fury',
      className: 'ASSASSIN', class: 'assassin',
      tier: 'B', stars: 3,
      role: 'Ranged Poison', content: 'PvP',
      damage: 'Blade Fury + Poison DoT',
      aura: 'BURST OF SPEED',
      defense: '3,200',
      stats: { str: '90', dex: '120', vit: '320', energy: '35',
               life: '2,600 / 2,600', mana: '190 / 230', stamina: '720 / 720' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sin)',   quality: 'unique', stats: '+3 Assassin Skills · +Stats' },
        { name: 'MA Skiller GC ×4–6',     quality: 'magic',  stats: '+1 Martial Arts — Blade Fury dmg' },
        { name: 'Poison Small Charms',    quality: 'magic',  stats: '+Poison Dmg / 20 Life / 5 Res' }
      ],
      skills: [
        { name: 'Blade Fury',       lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Blade Shield',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Blade Sentinel',   lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Claw Mastery',     lvl: 20, tree: 'Martial Arts',    tier: 'max' },
        { name: 'Venom',            lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Shadow Master',    lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' },
        { name: 'Fade',             lvl: 1,  tree: 'Shadow Disc.',    tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Harlequin Crest (Shako)', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 All Attrs per Level','+50% MF','10% DR'],
                  alts: ['+3 MA Circlet with sockets'] },
        weapon: { name: "Death's Web", base: 'Unearthed Wand', quality: 'unique', icon: '🗡',
                  stats: ['+2 Skills','+40–50% Poison Skill Dmg','-40–50% Poison Res','+10 All Attrs'],
                  alts: ['+3 MA Rare Claw for Blade Fury'] },
        shield: { name: '+3 Martial Arts Claw', base: 'Runic Talons', quality: 'magic', icon: '⛨',
                  stats: ['+3 MA Skills','+2 Blade Fury','+2 Blade Shield'],
                  alts: [] },
        armor:  { name: 'Bramble', base: 'Dusk Shroud 4os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Ral · Ohm · Sur · Eth','Thorns Aura','+50% Poison Skill Dmg','+25–50% Poison Res'],
                  alts: ['Chains of Honor for res+DR'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Cold/Poison Res'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 All Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['War Traveler — 25% MF'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 All Attrs'],
                  alts: ['+3 MA Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might — boosts your Blade Fury physical damage','Insight polearm — Meditation aura for merc mana','Fortitude Archon Plate — huge merc life & damage','Andariel’s Visage — Venom + 20% IAS'],
                  alts: ['Infinity Cryptic Axe — Conviction aura breaks Immunes (endgame)','Reaper’s Toll — procs Decrepify on hit'] }
      }
    },

    /* ═════════════ BARBARIAN ═════════════ */
    wwBarb: {
      name: 'WHIRLWIND', label: 'Whirlwind',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'S', stars: 5,
      role: 'Whirlwind', content: 'Endgame',
      damage: 'Whirlwind (Grief PB)',
      aura: 'BATTLE ORDERS',
      defense: '5,200',
      stats: { str: '156', dex: '160', vit: '400', energy: '10',
               life: '3,600 / 3,600', mana: '110 / 140', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barbarian Skills · +Stats · +Res' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Combat Skills — WW/Mastery boost' },
        { name: 'Warcry Skiller GC ×2–3', quality: 'magic',  stats: '+1 Warcries — Battle Orders life boost' }
      ],
      skills: [
        { name: 'Whirlwind',        lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Berserk',          lvl: 1,  tree: 'Combat Skills',   tier: 'high' },
        { name: 'Sword Mastery',    lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Shout',            lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Command',   lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Increased Speed',  lvl: 1,  tree: 'Combat Masteries',tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Arreat's Face", base: 'Slayer Guard', quality: 'unique', icon: '⛑',
                  stats: ['+2 Barb Skills','+2 Combat Skills','20% IAS','+150 AR'],
                  sockets: '1os via Larzuk — Ber (DR) or 15% IAS Jewel',
                  alts: ["Guillaume's Face — CB/DS for BvC"] },
        weapon: { name: 'Grief', base: 'Phase Blade 5os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Eth · Tir · Lo · Mal · Ral','+30–40% IAS','+340–400 Dmg','Ignore Target Def'],
                  alts: ['Grief Berserker Axe — physical dmg swap','Beast BA — Fanaticism aura'] },
        shield: { name: 'Grief (Off-hand)', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Dual-wielding — 2nd weapon for WW','Second Grief maximizes damage'],
                  alts: ['Beast Berserker Axe — Fanaticism aura'] },
        armor:  { name: 'Enigma', base: 'Mage Plate 3os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Jah · Ith · Ber','+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Fortitude for pure damage','Chains of Honor for res'] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap on Striking','+10–15 Str','+7–10% LL'],
                  alts: ['Steelrend — +50% ED + 10% CB'] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ["Nosferatu's Coil — 10% IAS + LL"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ['Metalgrid — AR + Res'] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    frenzyBarb: {
      name: 'FRENZY', label: 'Frenzy',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'A', stars: 4,
      role: 'Speed Farmer', content: 'General',
      damage: 'Frenzy (dual-wield)',
      aura: 'BATTLE ORDERS',
      defense: '4,800',
      stats: { str: '156', dex: '180', vit: '380', energy: '10',
               life: '3,400 / 3,400', mana: '110 / 140', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barb Skills · +Stats' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Combat — Frenzy/Double Swing dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Frenzy',           lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Double Swing',     lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Taunt',            lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Sword Mastery',    lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Shout',            lvl: 1,  tree: 'Warcries',        tier: 'high' }
      ],
      slots: {
        helm:   { name: "Arreat's Face", base: 'Slayer Guard', quality: 'unique', icon: '⛑',
                  stats: ['+2 Barb Skills','+2 Combat Skills','20% IAS','+150 AR'],
                  alts: ["Guillaume's Face — CB/DS/Str"] },
        weapon: { name: 'Grief', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+30–40% IAS','+340–400 Dmg','Ignore Target Def'],
                  alts: [] },
        shield: { name: 'Grief (Off-hand)', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Dual-wield 2nd weapon','Second Grief or rare fast IAS sword'],
                  alts: [] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Enigma teleport','Chains of Honor for res'] },
        gloves: { name: 'Steelrend', base: 'Ogre Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+50% ED','10% CB','+20 Str','+70+ Life'],
                  alts: ['Laying of Hands — 20% IAS + demon dmg'] },
        belt:   { name: 'String of Ears', base: 'Demonhide Sash', quality: 'unique', icon: '▬',
                  stats: ['15% DR','+150 AR','6–8% LL'],
                  alts: ["Verdungo's Hearty Cord — +Life"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ['Metalgrid — AR + Res'] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Rare LL/IAS Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+Life Leech','+Attack Rating','+Attrs'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    berserker: {
      name: 'BERSERKER', label: 'Berserker',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'B', stars: 3,
      role: 'PI Killer', content: 'General',
      damage: 'Berserk (Magic Damage)',
      aura: 'BATTLE ORDERS',
      defense: '4,600',
      stats: { str: '156', dex: '150', vit: '380', energy: '10',
               life: '3,400 / 3,400', mana: '110 / 140', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barb Skills · +Stats' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Combat — Berserk damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Berserk',          lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Shout',            lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Sword Mastery',    lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Iron Skin',        lvl: 1,  tree: 'Combat Masteries',tier: 'high' },
        { name: 'Battle Command',   lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Howl',             lvl: 1,  tree: 'Warcries',        tier: 'prereq' },
        { name: 'Taunt',            lvl: 1,  tree: 'Warcries',        tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Arreat's Face", base: 'Slayer Guard', quality: 'unique', icon: '⛑',
                  stats: ['+2 Barb Skills','+2 Combat Skills','20% IAS','+150 AR'],
                  alts: ["Guillaume's Face — CB/DS"] },
        weapon: { name: 'Grief', base: 'Berserker Axe — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+340–400 Dmg','+30–40% IAS','Ignore Target Def'],
                  alts: ['Breath of the Dying — +200% ED, huge magic dmg','Doombringer BA — magic dmg'] },
        shield: { name: 'Stormshield', base: 'Monarch', quality: 'unique', icon: '⛨',
                  stats: ['35% DR','25% Block','+30 Str','+60% Cold Res'],
                  alts: ['(dual-wield alternative)'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: 'Steelrend', base: 'Ogre Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+50% ED','10% CB','+20 Str'],
                  alts: ["Dracul's Grasp — Life Tap"] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ['String of Ears — 15% DR'] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Cat's Eye — 20% IAS + Dex"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Defiance Merc', base: 'Hell Defensive · Defiance Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Defiance','Insight polearm — Meditation','Andariel\'s Visage','Treachery'],
                  alts: [] }
      }
    },

    budgetBarb: {
      name: 'BUDGET WW', label: 'Budget Whirlwind',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'B', stars: 3,
      role: 'Starter', content: 'Leveling',
      damage: 'Whirlwind (Oath)',
      aura: 'BATTLE ORDERS',
      defense: '2,800',
      stats: { str: '120', dex: '130', vit: '280', energy: '10',
               life: '2,400 / 2,400', mana: '90 / 120', stamina: '780 / 780' },
      charms: [
        { name: 'Combat Skiller GC ×1–3', quality: 'magic',  stats: '+1 Combat — save for later!' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5 Res / IAS — cap resists' },
        { name: "Gheed's Fortune",        quality: 'unique', stats: 'Optional MF/gold charm' }
      ],
      skills: [
        { name: 'Whirlwind',        lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Sword Mastery',    lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Shout',            lvl: 1,  tree: 'Warcries',        tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Rockstopper', base: 'Sallet', quality: 'unique', icon: '⛑',
                  stats: ['+30% Fire/Light/Cold Res','+15% FHR','10% DR','+30% Life'],
                  alts: ['Peasant Crown — +1 skills, cheap'] },
        weapon: { name: 'Oath', base: 'Berserker Axe 4os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Shael · Pul · Mal · Lum','+50% IAS','+210–340% ED','Cannot Be Frozen'],
                  alts: ['Any 4os BA — great budget WW weapon'] },
        shield: { name: 'Oath (Off-hand)', base: 'Berserker Axe — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Second Oath for dual-wield WW'],
                  alts: ['Rare +Skills BA'] },
        armor:  { name: 'Duress', base: 'Dusk Shroud 3os — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Shael · Um · Thul','+15% Crushing Blow','+33% Open Wounds','+50 Cold Dmg'],
                  alts: ['Stone — great budget armor'] },
        gloves: { name: 'Bloodfist', base: 'Heavy Gloves', quality: 'unique', icon: '🧤',
                  stats: ['+40 Life','10% IAS','+5 Max Dmg'],
                  alts: ["Sigon's Gage — +10 Str + IAS"] },
        belt:   { name: 'String of Ears', base: 'Demonhide Sash', quality: 'unique', icon: '▬',
                  stats: ['15% DR','+150 AR','6–8% LL'],
                  alts: ['Goldwrap — 10% IAS + gold find'] },
        boots:  { name: 'Goblin Toe', base: 'Light Plated Boots', quality: 'unique', icon: '👢',
                  stats: ['25% Crushing Blow','+15 Def','+1 Life per Lvl'],
                  alts: ['Gore Rider — endgame'] },
        amulet: { name: "Cat's Eye", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+30 Dex','20% IAS','30% FRW'],
                  alts: ["Highlord's Wrath — if you can find one"] },
        ring1:  { name: 'Manald Heal', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Heal +5–8 Life','+8–12 Mana'] },
        ring2:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Rockstopper','Duriel\'s Shell'],
                  alts: [] }
      }
    },

    concentrateBarb: {
      name: 'CONCENTRATE', label: 'Concentrate',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'A', stars: 4,
      role: 'HC-Safe Melee', content: 'Hardcore',
      damage: 'Concentrate (Un-interruptable)',
      aura: 'BATTLE ORDERS',
      defense: '6,200',
      stats: { str: '156', dex: '160', vit: '420', energy: '10',
               life: '3,800 / 3,800', mana: '110 / 140', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barb Skills · +Stats' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Combat — Concentrate damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Concentrate',      lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Cry',       lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Sword Mastery',    lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Iron Skin',        lvl: 1,  tree: 'Combat Masteries',tier: 'high' },
        { name: 'Battle Command',   lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Shout',            lvl: 1,  tree: 'Warcries',        tier: 'high' }
      ],
      slots: {
        helm:   { name: "Arreat's Face", base: 'Slayer Guard', quality: 'unique', icon: '⛑',
                  stats: ['+2 Barb Skills','+2 Combat Skills','20% IAS'],
                  alts: ["Kira's Guardian for CBF + Res"] },
        weapon: { name: 'Breath of the Dying', base: 'Colossus Blade 6os — RW', quality: 'runeword', icon: '🗡',
                  stats: ['Vex · Hel · El · Eld · Zod · Eth','+50% IAS','+350–400% ED','Indestructible'],
                  alts: ['Grief PB — cheaper alt'] },
        shield: { name: 'Stormshield', base: 'Monarch', quality: 'unique', icon: '⛨',
                  stats: ['35% DR','25% Block','+30 Str','+60% Cold Res'],
                  alts: [] },
        armor:  { name: 'Chains of Honor', base: 'Dusk Shroud — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Dol · Um · Ber · Ist','+2 Skills','+65% All Res','+8% DR'],
                  alts: ['Fortitude for damage'] },
        gloves: { name: 'Steelrend', base: 'Ogre Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+50% ED','10% CB','+20 Str'],
                  alts: ["Dracul's Grasp — Life Tap"] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ['String of Ears — 15% DR'] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ['Metalgrid — AR + Res'] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Defiance Merc', base: 'Hell Defensive · Defiance Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Defiance (huge merc def)','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    singer: {
      name: 'SINGER', label: 'Singer (War Cry)',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'B', stars: 3,
      role: 'PvP Caster', content: 'PvP',
      damage: 'War Cry (Magic Dmg)',
      aura: 'BATTLE ORDERS',
      defense: '4,000',
      stats: { str: '95', dex: '90', vit: '380', energy: '35',
               life: '3,200 / 3,200', mana: '260 / 300', stamina: '820 / 820' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barb Skills · +Stats' },
        { name: 'Warcry Skiller GC ×6–8', quality: 'magic',  stats: '+1 Warcries — massive War Cry dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'War Cry',          lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Cry',       lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Command',   lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Shout',            lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Iron Skin',        lvl: 1,  tree: 'Combat Masteries',tier: 'prereq' },
        { name: 'Natural Resist',   lvl: 1,  tree: 'Combat Masteries',tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Halaberd's Reign", base: 'Corona', quality: 'unique', icon: '⛑',
                  stats: ['+2 Barb Skills','+2 Warcry Skills','+150–200 Def'],
                  alts: ['+3 War Cry Rare Helm'] },
        weapon: { name: 'Call to Arms', base: 'Flail 5os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Amn · Ral · Mal · Ist · Ohm','+1–6 BO','+1–4 Battle Command','+1–6 Prayer'],
                  alts: ['Heart of the Oak for FCR'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch 4os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Tal · Thul · Ort · Amn','+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor — Res'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Cold/Poison Res'],
                  alts: ['Magefist — +1 Fire, 20% FCR'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['Waterwalk — +40 Dex + Life'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 Attrs'],
                  alts: ['+3 Warcry Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Rare FCR Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+10% FCR','+Life','+Mana','+Res'] },
        merc:   { name: 'Act 2 Prayer Merc', base: 'Hell Combat · Prayer Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Prayer','Insight polearm — Meditation','Treachery','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    throwBarb: {
      name: 'THROW', label: 'Throw',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'B', stars: 3,
      role: 'Ranged Melee', content: 'General',
      damage: 'Double Throw (Lacerator)',
      aura: 'BATTLE ORDERS',
      defense: '4,200',
      stats: { str: '156', dex: '200', vit: '360', energy: '10',
               life: '3,200 / 3,200', mana: '110 / 140', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barb Skills · +Stats' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Combat — Throw damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Double Throw',     lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Double Swing',     lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Throw',            lvl: 1,  tree: 'Combat Skills',   tier: 'prereq' },
        { name: 'Throwing Mastery', lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Iron Skin',        lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Command',   lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Shout',            lvl: 1,  tree: 'Warcries',        tier: 'high' }
      ],
      slots: {
        helm:   { name: "Arreat's Face", base: 'Slayer Guard', quality: 'unique', icon: '⛑',
                  stats: ['+2 Barb Skills','+2 Combat Skills','20% IAS'],
                  alts: ["Andariel's Visage — venom + IAS"] },
        weapon: { name: 'Lacerator', base: 'Winged Axe', quality: 'unique', icon: '🗡',
                  stats: ['33% Chance of Amp Damage','20% IAS','+200% ED','+80–120 Fire Dmg'],
                  alts: ['Warshrike — throwing star, +2 skills','Eth throwers for physical dmg'] },
        shield: { name: 'Lacerator (Off-hand)', base: 'Winged Axe', quality: 'unique', icon: '⛨',
                  stats: ['Second Lacerator — dual-wield','More Amp Damage procs'],
                  alts: ['Warshrike off-hand'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+8% FCR'],
                  alts: ['Enigma teleport'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Dmg to Demons'],
                  alts: ["Dracul's Grasp — Life Tap on Strike"] },
        belt:   { name: "Thundergod's Vigor", base: 'War Belt', quality: 'unique', icon: '▬',
                  stats: ['+200 Light Dmg','+10–20 Str/Vit','+10% Max Light Res'],
                  alts: ['Razortail — +Pierce'] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: ['War Traveler — 25% MF'] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ['Metalgrid — AR + Res'] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Angelic Ring', base: 'Ring', quality: 'set', icon: '◯',
                  stats: ['+Attack Rating (huge with Angelic Ammy)','+Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    ikBarb: {
      name: 'IMMORTAL KING', label: 'Immortal King',
      className: 'BARBARIAN', class: 'barbarian',
      tier: 'A', stars: 4,
      role: 'Set Meta', content: 'Endgame',
      damage: 'Whirlwind (IK Maul)',
      aura: 'BATTLE ORDERS',
      defense: '6,800',
      stats: { str: '250', dex: '110', vit: '350', energy: '10',
               life: '3,500 / 3,500', mana: '110 / 140', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Barb)',  quality: 'unique', stats: '+3 Barb Skills · +Stats' },
        { name: 'Combat Skiller GC ×4–6', quality: 'magic',  stats: '+1 Combat — WW/Frenzy dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / +max dmg' }
      ],
      skills: [
        { name: 'Whirlwind',        lvl: 20, tree: 'Combat Skills',   tier: 'max' },
        { name: 'Mace Mastery',     lvl: 20, tree: 'Combat Masteries',tier: 'max' },
        { name: 'Frenzy',           lvl: 1,  tree: 'Combat Skills',   tier: 'high' },
        { name: 'Battle Orders',    lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Shout',            lvl: 20, tree: 'Warcries',        tier: 'max' },
        { name: 'Battle Command',   lvl: 1,  tree: 'Warcries',        tier: 'high' },
        { name: 'Iron Skin',        lvl: 1,  tree: 'Combat Masteries',tier: 'high' },
        { name: 'Increased Speed',  lvl: 1,  tree: 'Combat Masteries',tier: 'prereq' },
        { name: 'Natural Resist',   lvl: 1,  tree: 'Combat Masteries',tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Immortal King's Will", base: 'Avenger Guard', quality: 'set', icon: '⛑',
                  stats: ['+2 Combat Skills (set)','+65% ED (set)','+40 Def','+3 Level 8 Whirlwind'],
                  alts: ['Full IK set required for aura bonuses'] },
        weapon: { name: "Immortal King's Stone Crusher", base: 'Ogre Maul', quality: 'set', icon: '🗡',
                  stats: ['+200% ED','+150 Damage','+40% IAS (set)','+3 Combat Skills'],
                  alts: [] },
        shield: { name: '(IK is 2H Maul)', base: '2-Handed', quality: 'normal', icon: '⛨',
                  stats: ['Ogre Maul is 2-handed — no shield'], alts: [] },
        armor:  { name: "Immortal King's Soul Cage", base: 'Sacred Armor', quality: 'set', icon: '🛡',
                  stats: ['+400 Def','+50 Life','+2 Skills (set)','+All Res (set)'],
                  alts: [] },
        gloves: { name: "Immortal King's Forge", base: 'War Gauntlets', quality: 'set', icon: '🧤',
                  stats: ['+65% ED','+65 AR','+20 Str/Dex','12% IAS'],
                  alts: [] },
        belt:   { name: "Immortal King's Detail", base: 'War Belt', quality: 'set', icon: '▬',
                  stats: ['+65% ED','+40 AR','+30 All Res','+25 Str'],
                  alts: [] },
        boots:  { name: "Immortal King's Pillar", base: 'War Boots', quality: 'set', icon: '👢',
                  stats: ['+65% ED','+40 AR','+44 Life','+20 Str'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Cat's Eye — 20% IAS + Dex"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    /* ═════════════ DRUID ═════════════ */
    windDruid: {
      name: 'WIND', label: 'Wind',
      className: 'DRUID', class: 'druid',
      tier: 'S', stars: 5,
      role: 'Elemental Caster', content: 'Endgame',
      damage: 'Tornado / Hurricane',
      aura: 'HEART OF WOLVERINE',
      defense: '3,600',
      stats: { str: '95', dex: '90', vit: '380', energy: '35',
               life: '2,900 / 2,900', mana: '340 / 400', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Druid)', quality: 'unique', stats: '+3 Druid Skills · +Stats · +Res' },
        { name: 'Elemental Skiller ×6–8', quality: 'magic',  stats: '+1 Elemental — Tornado/Hurricane dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Tornado',          lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Hurricane',        lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Twister',          lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Cyclone Armor',    lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Arctic Blast',     lvl: 1,  tree: 'Elemental',       tier: 'prereq' },
        { name: 'Oak Sage',         lvl: 1,  tree: 'Summoning',       tier: 'high' },
        { name: 'Heart of Wolverine',lvl: 1, tree: 'Summoning',       tier: 'high' }
      ],
      slots: {
        helm:   { name: "Jalal's Mane", base: 'Totemic Mask', quality: 'unique', icon: '⛑',
                  stats: ['+2 Druid Skills','+30 All Res','+20 Str','+20% FHR'],
                  sockets: '1os via Larzuk — Um (all res) or 15% IAS Jewel',
                  alts: ['Ravenlore — +3 Elemental, cold res debuff'] },
        weapon: { name: 'Heart of the Oak', base: 'Flail 4os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Ko · Vex · Pul · Thul','+3 All Skills','+40% FCR','+75% Damage to Demons'],
                  alts: ['Spirit Sword — budget FCR'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch 4os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Tal · Thul · Ort · Amn','+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Trang-Oul's Claws — +2 curses + FCR"] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['Waterwalk — +40 Dex + Life'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 Attrs'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might — boosts your Tornado physical damage','Insight polearm — Meditation aura for merc mana','Fortitude Archon Plate — huge merc life & damage','Andariel’s Visage — Venom + 20% IAS'],
                  alts: ['Infinity Cryptic Axe — Conviction aura breaks Immunes (endgame)','Reaper’s Toll — procs Decrepify on hit'] }
      }
    },

    fireDruid: {
      name: 'FIRE', label: 'Fire',
      className: 'DRUID', class: 'druid',
      tier: 'B', stars: 3,
      role: 'Boss Burner', content: 'General',
      damage: 'Fissure / Volcano / Armageddon',
      aura: 'HEART OF WOLVERINE',
      defense: '3,200',
      stats: { str: '95', dex: '90', vit: '340', energy: '35',
               life: '2,600 / 2,600', mana: '320 / 380', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Druid)', quality: 'unique', stats: '+3 Druid Skills · +Stats' },
        { name: 'Elemental Skiller ×6–8', quality: 'magic',  stats: '+1 Elemental — Fissure/Volcano dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Fissure',          lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Volcano',          lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Molten Boulder',   lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Armageddon',       lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Firestorm',        lvl: 1,  tree: 'Elemental',       tier: 'prereq' },
        { name: 'Heart of Wolverine',lvl: 1, tree: 'Summoning',       tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Ravenlore', base: 'Sky Spirit', quality: 'unique', icon: '⛑',
                  stats: ['+3 Elemental Skills','-15% Enemy Fire Res','+20 Energy'],
                  alts: ["Jalal's Mane — +2 skills"] },
        weapon: { name: 'Heart of the Oak', base: 'Flail — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+3 Skills','+40% FCR','+75% Dmg vs Demons'],
                  alts: ['Wizardspike — 50% FCR budget','Eschuta\'s — +3 Fire Skills'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['Homunculus — +2 skills + Res'] },
        armor:  { name: 'Chains of Honor', base: 'Dusk Shroud — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+65% All Res','+8% DR'],
                  alts: ['Enigma for teleport'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Elemental Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks FI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    summonDruid: {
      name: 'SUMMON', label: 'Summon',
      className: 'DRUID', class: 'druid',
      tier: 'B', stars: 3,
      role: 'Beast Master', content: 'Hardcore',
      damage: 'Grizzly + Wolves + Spirits',
      aura: 'OAK SAGE (Life)',
      defense: '4,000',
      stats: { str: '95', dex: '90', vit: '380', energy: '25',
               life: '3,100 / 3,100', mana: '200 / 240', stamina: '820 / 820' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Druid)', quality: 'unique', stats: '+3 Druid Skills · +Stats' },
        { name: 'Summon Skiller ×6–8',    quality: 'magic',  stats: '+1 Summoning — pet HP/dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Grizzly',          lvl: 20, tree: 'Summoning',       tier: 'max' },
        { name: 'Dire Wolves',      lvl: 20, tree: 'Summoning',       tier: 'max' },
        { name: 'Spirit of Barbs',  lvl: 20, tree: 'Summoning',       tier: 'max' },
        { name: 'Heart of Wolverine',lvl: 20,tree: 'Summoning',       tier: 'max' },
        { name: 'Ravens',           lvl: 1,  tree: 'Summoning',       tier: 'prereq' },
        { name: 'Oak Sage',         lvl: 1,  tree: 'Summoning',       tier: 'prereq' },
        { name: 'Summon Spirit Wolf',lvl: 1, tree: 'Summoning',       tier: 'prereq' },
        { name: 'Poison Creeper',   lvl: 1,  tree: 'Summoning',       tier: 'prereq' }
      ],
      slots: {
        helm:   { name: "Jalal's Mane", base: 'Totemic Mask', quality: 'unique', icon: '⛑',
                  stats: ['+2 Druid Skills','+30 All Res','+20 Str'],
                  alts: ['Ravenlore — for elemental hybrids'] },
        weapon: { name: 'Beast', base: 'Berserker Axe 5os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Ber · Tir · Um · Mal · Lum','Level 9 Fanaticism Aura','+40% IAS','+240–270% ED'],
                  alts: ['Heart of the Oak for FCR caster'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['Rhyme — CBF + MF budget'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Bramble — Thorns Aura','Chains of Honor'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Trang-Oul's Claws — FCR + curses"] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: ["Verdungo's — Life+DR"] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['Waterwalk'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Summon Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    rabiesWolf: {
      name: 'RABIES WOLF', label: 'Rabies Werewolf',
      className: 'DRUID', class: 'druid',
      tier: 'B', stars: 3,
      role: 'PvP Poison', content: 'PvP',
      damage: 'Rabies (Poison DoT)',
      aura: 'HEART OF WOLVERINE',
      defense: '5,200',
      stats: { str: '156', dex: '110', vit: '380', energy: '25',
               life: '3,200 / 3,200', mana: '180 / 220', stamina: '820 / 820' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Druid)', quality: 'unique', stats: '+3 Druid Skills · +Stats' },
        { name: 'Shape-Shift Skiller ×6', quality: 'magic',  stats: '+1 Shape-Shifting — Rabies dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Rabies',           lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Poison Creeper',   lvl: 20, tree: 'Summoning',       tier: 'max' },
        { name: 'Poison Dagger',    lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Werewolf',         lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Lycanthropy',      lvl: 1,  tree: 'Shape-Shifting',  tier: 'high' },
        { name: 'Feral Rage',       lvl: 1,  tree: 'Shape-Shifting',  tier: 'prereq' },
        { name: 'Heart of Wolverine',lvl: 1, tree: 'Summoning',       tier: 'high' },
        { name: 'Oak Sage',         lvl: 1,  tree: 'Summoning',       tier: 'high' }
      ],
      slots: {
        helm:   { name: "Jalal's Mane", base: 'Totemic Mask', quality: 'unique', icon: '⛑',
                  stats: ['+2 Druid Skills','+30 All Res','+20 Str'],
                  alts: ["Andariel's Visage — Venom + IAS"] },
        weapon: { name: 'Beast', base: 'Berserker Axe — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Fanaticism Aura','+40% IAS','+240–270% ED'],
                  alts: ["Death's Web — -40% Poison Res enemies"] },
        shield: { name: 'Stormshield', base: 'Monarch', quality: 'unique', icon: '⛨',
                  stats: ['35% DR','25% Block','+30 Str'],
                  alts: ['Homunculus — +2 skills + Res'] },
        armor:  { name: 'Bramble', base: 'Dusk Shroud — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Ral · Ohm · Sur · Eth','Thorns Aura','+50% Poison Skill Dmg'],
                  alts: ['Enigma for teleport'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Cold/Poison Res'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: ["Verdungo's for +Life/DR"] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['Gore Rider'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Shape-Shift Rare Amulet'] },
        ring1:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        ring2:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    furyWolf: {
      name: 'FURY WOLF', label: 'Fury Werewolf',
      className: 'DRUID', class: 'druid',
      tier: 'A', stars: 4,
      role: 'Melee Shape-Shift', content: 'General',
      damage: 'Fury (Werewolf combo)',
      aura: 'HEART OF WOLVERINE',
      defense: '5,600',
      stats: { str: '156', dex: '150', vit: '380', energy: '15',
               life: '3,300 / 3,300', mana: '140 / 180', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Druid)', quality: 'unique', stats: '+3 Druid Skills · +Stats' },
        { name: 'Shape-Shift Skiller ×6', quality: 'magic',  stats: '+1 Shape-Shifting — Fury dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / +max dmg' }
      ],
      skills: [
        { name: 'Werewolf',         lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Lycanthropy',      lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Fury',             lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Feral Rage',       lvl: 1,  tree: 'Shape-Shifting',  tier: 'high' },
        { name: 'Rabies',           lvl: 1,  tree: 'Shape-Shifting',  tier: 'high' },
        { name: 'Heart of Wolverine',lvl: 20,tree: 'Summoning',       tier: 'max' }
      ],
      slots: {
        helm:   { name: "Jalal's Mane", base: 'Totemic Mask', quality: 'unique', icon: '⛑',
                  stats: ['+2 Druid Skills','+30 All Res','+20 Str'],
                  alts: ["Cerebus' Bite — +2 Shape-Shift","Andariel's Visage"] },
        weapon: { name: 'Grief', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+340–400 Dmg','+30–40% IAS','ITD'],
                  alts: ['Beast BA — Fanaticism aura'] },
        shield: { name: 'Stormshield', base: 'Monarch', quality: 'unique', icon: '⛨',
                  stats: ['35% DR','25% Block','+30 Str'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Fortitude — +300% ED'] },
        gloves: { name: 'Steelrend', base: 'Ogre Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+50% ED','10% CB','+20 Str'],
                  alts: ["Dracul's Grasp — Life Tap"] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ['String of Ears — 15% DR'] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ['Metalgrid — AR + Res'] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    fireClawWolf: {
      name: 'FIRE CLAW WOLF', label: 'Fire Claw Werewolf',
      className: 'DRUID', class: 'druid',
      tier: 'B', stars: 3,
      role: 'Elemental Melee', content: 'General',
      damage: 'Fire Claws (elemental melee)',
      aura: 'HEART OF WOLVERINE',
      defense: '5,000',
      stats: { str: '156', dex: '120', vit: '360', energy: '25',
               life: '3,000 / 3,000', mana: '190 / 230', stamina: '850 / 850' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Druid)', quality: 'unique', stats: '+3 Druid Skills · +Stats' },
        { name: 'Shape-Shift Skiller ×4', quality: 'magic',  stats: '+1 Shape-Shifting — Fire Claws dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Fire Claws',       lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Volcano',          lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Molten Boulder',   lvl: 20, tree: 'Elemental',       tier: 'max' },
        { name: 'Werewolf',         lvl: 20, tree: 'Shape-Shifting',  tier: 'max' },
        { name: 'Lycanthropy',      lvl: 1,  tree: 'Shape-Shifting',  tier: 'high' },
        { name: 'Heart of Wolverine',lvl: 1, tree: 'Summoning',       tier: 'high' },
        { name: 'Oak Sage',         lvl: 1,  tree: 'Summoning',       tier: 'high' }
      ],
      slots: {
        helm:   { name: "Jalal's Mane", base: 'Totemic Mask', quality: 'unique', icon: '⛑',
                  stats: ['+2 Druid Skills','+30 All Res'],
                  alts: ['Ravenlore — +3 Elemental'] },
        weapon: { name: 'Ribcracker', base: 'Quarterstaff', quality: 'unique', icon: '🗡',
                  stats: ['+15% IAS','+300% ED','40% Chance CB','+50% Def'],
                  alts: ['Eth Reaper\'s Toll — Decrepify proc','Passion Runeword'] },
        shield: { name: 'Stormshield', base: 'Monarch', quality: 'unique', icon: '⛨',
                  stats: ['35% DR','25% Block','+30 Str'],
                  alts: ['Spirit Monarch — FCR hybrid'] },
        armor:  { name: 'Chains of Honor', base: 'Dusk Shroud — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+65% All Res','+8% DR'],
                  alts: ['Fortitude for damage'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Dracul's Grasp — Life Tap"] },
        belt:   { name: "Verdungo's Hearty Cord", base: 'Mithril Coil', quality: 'unique', icon: '▬',
                  stats: ['+100–120 Life','+30–40 Vit','10–15% DR'],
                  alts: ["Thundergod's — Light Absorb"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: ['Sandstorm Trek — Str/Vit'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Elemental Rare Amulet'] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    /* ═════════════ NECROMANCER ═════════════ */
    summonmancer: {
      name: 'SUMMONMANCER', label: 'Summonmancer',
      className: 'NECROMANCER', class: 'necromancer',
      tier: 'S', stars: 5,
      role: 'Skeleton Army', content: 'Endgame',
      damage: 'Skeleton Army + Curses',
      aura: 'AMPLIFY DAMAGE',
      defense: '2,800',
      stats: { str: '60', dex: '55', vit: '380', energy: '35',
               life: '2,700 / 2,700', mana: '320 / 380', stamina: '620 / 620' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Necro)', quality: 'unique', stats: '+3 Necro Skills · +Stats · +Res' },
        { name: 'Summon Skiller ×6–8',    quality: 'magic',  stats: '+1 Summoning — Skeleton dmg/life' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Raise Skeleton',      lvl: 20, tree: 'Summoning',    tier: 'max' },
        { name: 'Skeleton Mastery',    lvl: 20, tree: 'Summoning',    tier: 'max' },
        { name: 'Raise Skeletal Mage', lvl: 20, tree: 'Summoning',    tier: 'max' },
        { name: 'Summon Resist',       lvl: 20, tree: 'Summoning',    tier: 'max' },
        { name: 'Amplify Damage',      lvl: 1,  tree: 'Curses',       tier: 'high' },
        { name: 'Decrepify',           lvl: 1,  tree: 'Curses',       tier: 'high' },
        { name: 'Corpse Explosion',    lvl: 1,  tree: 'Poison/Bone',  tier: 'high' },
        { name: 'Bone Armor',          lvl: 1,  tree: 'Poison/Bone',  tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Harlequin Crest (Shako)', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  sockets: '1os via Larzuk — Um (all res) or Ist (MF)',
                  alts: ['White Runeword — +3 Skeleton Mastery, cheap'] },
        weapon: { name: 'Call to Arms', base: 'Flail 5os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Amn · Ral · Mal · Ist · Ohm','+1–6 BO','+1–4 Battle Command','+1 Skills'],
                  alts: ['Heart of the Oak — FCR + skills'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch 4os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Tal · Thul · Ort · Amn','+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['Homunculus — +2 Necro Skills'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Cold/Poison Res'],
                  alts: ['Magefist'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['Marrowwalk — +2 Skeleton Mastery bug'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 Attrs'],
                  alts: ['+3 Summon Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: "Bul-Kathos' Wedding Band", base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+50 Life'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might (buffs skeletons)','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    bonemancer: {
      name: 'BONEMANCER', label: 'Bonemancer',
      className: 'NECROMANCER', class: 'necromancer',
      tier: 'A', stars: 4,
      role: 'PvM/PvP Caster', content: 'General',
      damage: 'Bone Spear / Bone Spirit',
      aura: 'AMPLIFY DAMAGE',
      defense: '3,200',
      stats: { str: '60', dex: '55', vit: '380', energy: '35',
               life: '2,700 / 2,700', mana: '360 / 420', stamina: '620 / 620' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Necro)', quality: 'unique', stats: '+3 Necro Skills · +Stats' },
        { name: 'Poison/Bone Skiller ×8', quality: 'magic',  stats: '+1 Poison/Bone — Bone Spear dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Bone Spear',        lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Bone Spirit',       lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Bone Wall',         lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Bone Prison',       lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Bone Armor',        lvl: 1,  tree: 'Poison/Bone',    tier: 'high' },
        { name: 'Corpse Explosion',  lvl: 1,  tree: 'Poison/Bone',    tier: 'high' },
        { name: 'Amplify Damage',    lvl: 1,  tree: 'Curses',         tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  alts: ['White Runeword — +3 Bone Spear/Spirit, best in slot!'] },
        weapon: { name: 'Heart of the Oak', base: 'Flail — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+3 Skills','+40% FCR','+75% Dmg vs Demons'],
                  alts: ['Wizardspike — 50% FCR budget'] },
        shield: { name: 'Homunculus', base: 'Hierophant Trophy', quality: 'unique', icon: '⛨',
                  stats: ['+2 Necro Skills','20% FCR','+40 All Res','+300% Def'],
                  alts: ['Spirit Monarch — FCR + res'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Trang-Oul's Claws — +2 curses"] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Poison/Bone Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (Bone Spear ignores)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    poisonNova: {
      name: 'POISON NOVA', label: 'Poison Nova',
      className: 'NECROMANCER', class: 'necromancer',
      tier: 'A', stars: 4,
      role: 'AoE Poison', content: 'General',
      damage: 'Poison Nova (+Lower Res)',
      aura: 'LOWER RESIST',
      defense: '3,000',
      stats: { str: '60', dex: '55', vit: '360', energy: '35',
               life: '2,600 / 2,600', mana: '340 / 400', stamina: '620 / 620' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Necro)', quality: 'unique', stats: '+3 Necro Skills · +Stats' },
        { name: 'Poison/Bone Skiller ×8', quality: 'magic',  stats: '+1 Poison/Bone — Nova dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Poison Nova',       lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Poison Explosion',  lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Poison Dagger',     lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Lower Resist',      lvl: 20, tree: 'Curses',         tier: 'max' },
        { name: 'Amplify Damage',    lvl: 1,  tree: 'Curses',         tier: 'high' },
        { name: 'Corpse Explosion',  lvl: 1,  tree: 'Poison/Bone',    tier: 'high' },
        { name: 'Bone Armor',        lvl: 1,  tree: 'Poison/Bone',    tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  alts: ['White Runeword — cheap +3 Nova'] },
        weapon: { name: "Death's Web", base: 'Unearthed Wand', quality: 'unique', icon: '🗡',
                  stats: ['+2 Poison/Bone','+1 All Skills','-40–50% Poison Res enemies'],
                  alts: ['Heart of the Oak — hybrid'] },
        shield: { name: 'Homunculus', base: 'Hierophant Trophy', quality: 'unique', icon: '⛨',
                  stats: ['+2 Necro Skills','20% FCR','+40 All Res'],
                  alts: ['Spirit Monarch'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Cold/Poison Res'],
                  alts: ['Magefist'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Poison Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    budgetSummonmancer: {
      name: 'BUDGET SUMMON', label: 'Budget Summonmancer',
      className: 'NECROMANCER', class: 'necromancer',
      tier: 'B', stars: 3,
      role: 'Starter', content: 'Leveling',
      damage: 'Skeletons + Corpse Explosion',
      aura: 'AMPLIFY DAMAGE',
      defense: '1,900',
      stats: { str: '50', dex: '45', vit: '280', energy: '35',
               life: '2,100 / 2,100', mana: '250 / 300', stamina: '580 / 580' },
      charms: [
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' },
        { name: 'Summon Skiller ×1–3',    quality: 'magic',  stats: '+1 Summoning if found — save for later' },
        { name: "Gheed's Fortune",        quality: 'unique', stats: 'Optional MF/gold charm' }
      ],
      skills: [
        { name: 'Raise Skeleton',      lvl: 20, tree: 'Summoning',    tier: 'max' },
        { name: 'Skeleton Mastery',    lvl: 20, tree: 'Summoning',    tier: 'max' },
        { name: 'Summon Resist',       lvl: 1,  tree: 'Summoning',    tier: 'high' },
        { name: 'Amplify Damage',      lvl: 1,  tree: 'Curses',       tier: 'high' },
        { name: 'Corpse Explosion',    lvl: 1,  tree: 'Poison/Bone',  tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Lore', base: '2os Helm — Runeword', quality: 'runeword', icon: '⛑',
                  stats: ['Ort · Sol','+1 All Skills','+10 Energy','+2 Mana per Kill'],
                  alts: ['Peasant Crown — +1 Skills'] },
        weapon: { name: 'White', base: '2os Wand — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Dol · Io','+3 Bone Spear','+3 Bone Armor','+1 Skeleton Mastery'],
                  alts: ['Rare +3 Skeleton Mastery Wand'] },
        shield: { name: 'Rhyme', base: '2os Shield — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Shael · Eth','+25% All Res','CBF','25% MF'],
                  alts: ['Boneflame — magic dmg + skills'] },
        armor:  { name: 'Stealth', base: '2os Body Armor — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Tal · Eth','+25% FRW','+25% FCR','+6 Dex'],
                  alts: ['Smoke — +50 All Res budget'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Chance Guards — MF"] },
        belt:   { name: 'Goldwrap', base: 'Heavy Belt', quality: 'unique', icon: '▬',
                  stats: ['+30% MF','+10% IAS','+25–75 Gold Find'],
                  alts: ['Tal Rasha\'s belt — +Life'] },
        boots:  { name: 'Silkweave', base: 'Mesh Boots', quality: 'unique', icon: '👢',
                  stats: ['+30% FRW','+80 Mana','+15 Def'],
                  alts: ['Waterwalk — +Life if found'] },
        amulet: { name: '+2 Necro Rare', base: 'Amulet', quality: 'rare', icon: '📿',
                  stats: ['+2 Necro Skills','+Res','+Life/Mana'],
                  alts: ["Mara's — endgame"] },
        ring1:  { name: 'Manald Heal', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Heal +5–8 Life','+8–12 Mana'] },
        ring2:  { name: 'Nagelring', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+15–30% MF','+50–75 AR','+15 Def'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Smoke armor','Tal Rasha\'s helm'],
                  alts: [] }
      }
    },

    explosionNecro: {
      name: 'CORPSE EXPLOSION', label: 'Corpse Explosion',
      className: 'NECROMANCER', class: 'necromancer',
      tier: 'A', stars: 4,
      role: 'Speed Farm', content: 'Farming',
      damage: 'Corpse Explosion Chain',
      aura: 'AMPLIFY DAMAGE',
      defense: '3,000',
      stats: { str: '60', dex: '55', vit: '350', energy: '35',
               life: '2,500 / 2,500', mana: '320 / 380', stamina: '620 / 620' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Necro)', quality: 'unique', stats: '+3 Necro Skills · +Stats' },
        { name: 'Poison/Bone Skiller ×6', quality: 'magic',  stats: '+1 Poison/Bone — CE radius' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Corpse Explosion',  lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Bone Armor',        lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Bone Wall',         lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Amplify Damage',    lvl: 20, tree: 'Curses',         tier: 'max' },
        { name: 'Decrepify',         lvl: 1,  tree: 'Curses',         tier: 'high' },
        { name: 'Lower Resist',      lvl: 1,  tree: 'Curses',         tier: 'high' },
        { name: 'Raise Skeleton',    lvl: 1,  tree: 'Summoning',      tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  alts: [] },
        weapon: { name: 'Heart of the Oak', base: 'Flail — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+3 Skills','+40% FCR','+75% Dmg Demons'],
                  alts: ["Death's Web for +2 Poison/Bone"] },
        shield: { name: 'Homunculus', base: 'Hierophant Trophy', quality: 'unique', icon: '⛨',
                  stats: ['+2 Necro Skills','20% FCR','+40 All Res'],
                  alts: ['Spirit Monarch'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: [] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Res'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['+25% MF','+10 Vit/Str','+15% FRW'],
                  alts: ['Sandstorm Trek'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Nagelring', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+30% MF','+75 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    daggermancer: {
      name: 'DAGGERMANCER', label: 'Daggermancer',
      className: 'NECROMANCER', class: 'necromancer',
      tier: 'B', stars: 3,
      role: 'Poison Melee', content: 'General',
      damage: 'Poison Dagger + Melee',
      aura: 'AMPLIFY DAMAGE',
      defense: '4,000',
      stats: { str: '95', dex: '110', vit: '340', energy: '25',
               life: '2,600 / 2,600', mana: '220 / 260', stamina: '680 / 680' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Necro)', quality: 'unique', stats: '+3 Necro Skills · +Stats' },
        { name: 'Poison/Bone Skiller ×6', quality: 'magic',  stats: '+1 Poison/Bone — dagger dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Poison Dagger',     lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Poison Explosion',  lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Poison Nova',       lvl: 20, tree: 'Poison/Bone',    tier: 'max' },
        { name: 'Lower Resist',      lvl: 20, tree: 'Curses',         tier: 'max' },
        { name: 'Bone Armor',        lvl: 1,  tree: 'Poison/Bone',    tier: 'high' },
        { name: 'Amplify Damage',    lvl: 1,  tree: 'Curses',         tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF'],
                  alts: [] },
        weapon: { name: 'Plague', base: 'Dagger 3os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Cham · Shael · Um','+1–2 All Skills','25% Chance Lower Resist','+Poison Dmg'],
                  alts: ["Death's Web wand"] },
        shield: { name: 'Homunculus', base: 'Hierophant Trophy', quality: 'unique', icon: '⛨',
                  stats: ['+2 Necro Skills','20% FCR','+40 All Res'],
                  alts: ['Spirit Monarch'] },
        armor:  { name: 'Bramble', base: 'Dusk Shroud — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Thorns Aura','+50% Poison Skill Dmg'],
                  alts: ['Enigma for teleport'] },
        gloves: { name: "Trang-Oul's Claws", base: 'Heavy Bracers', quality: 'set', icon: '🧤',
                  stats: ['+2 Necro Curses','20% FCR','+30% Res'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    /* ═════════════ PALADIN (extras) ═════════════ */
    hammerdin: {
      name: 'HAMMERDIN', label: 'Hammerdin',
      className: 'PALADIN', class: 'paladin',
      tier: 'S', stars: 5,
      role: 'Meta King', content: 'Endgame',
      damage: 'Blessed Hammer + Concentration',
      aura: 'CONCENTRATION',
      defense: '2,800',
      stats: { str: '65', dex: '65', vit: '380', energy: '35',
               life: '2,800 / 2,800', mana: '380 / 440', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6–8',    quality: 'magic',  stats: '+1 Combat Skills — Hammer dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Blessed Hammer',    lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Concentration',     lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Vigor',             lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Blessed Aim',       lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Holy Bolt',         lvl: 1,  tree: 'Combat Skills',  tier: 'prereq' },
        { name: 'Redemption',        lvl: 1,  tree: 'Offensive Auras',tier: 'high' },
        { name: 'Prayer',            lvl: 1,  tree: 'Defensive Auras',tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  sockets: '1os via Larzuk — Um (all res) or Ist (MF)',
                  alts: ['Griffon\'s Eye — light hybrids only'] },
        weapon: { name: 'Heart of the Oak', base: 'Flail 4os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Ko · Vex · Pul · Thul','+3 All Skills','+40% FCR','+75% Dmg Demons'],
                  alts: ['Call to Arms on swap for BO'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch 4os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Tal · Thul · Ort · Amn','+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['Herald of Zakarum + Um — cheaper'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Jah · Ith · Ber','+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ["Trang-Oul's Claws — +2 curses + FCR"] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: ['Waterwalk — +40 Dex + Life'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 Attrs'],
                  alts: ['+3 Combat Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    zealot: {
      name: 'ZEALOT', label: 'Zealot',
      className: 'PALADIN', class: 'paladin',
      tier: 'A', stars: 4,
      role: 'Melee Speed', content: 'General',
      damage: 'Zeal (5-hit combo)',
      aura: 'FANATICISM',
      defense: '5,600',
      stats: { str: '156', dex: '160', vit: '380', energy: '15',
               life: '3,000 / 3,000', mana: '140 / 180', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6',      quality: 'magic',  stats: '+1 Combat — Zeal damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Zeal',              lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Sacrifice',         lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Fanaticism',        lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Holy Shield',       lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Salvation',         lvl: 1,  tree: 'Defensive Auras',tier: 'high' },
        { name: 'Might',             lvl: 1,  tree: 'Offensive Auras',tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  alts: ["Andariel's Visage — venom + IAS","Guillaume's Face — CB/DS"] },
        weapon: { name: 'Grief', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+30–40% IAS','+340–400 Dmg','Ignore Target Def'],
                  alts: ['Last Wish — Might aura procs'] },
        shield: { name: 'Herald of Zakarum', base: 'Gilded Shield', quality: 'unique', icon: '⛨',
                  stats: ['+2 Pally Skills','+2 Combat Skills','+150% ED','+All Attrs'],
                  alts: ['Exile — Defiance aura'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+15 All Res'],
                  alts: ['Enigma for teleport'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Dmg to Demons'],
                  alts: ["Dracul's Grasp — Life Tap on Strike"] },
        belt:   { name: 'String of Ears', base: 'Demonhide Sash', quality: 'unique', icon: '▬',
                  stats: ['15% DR','+150 AR','6–8% LL'],
                  alts: ["Verdungo's — +Life"] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: 'Angelic Amulet', base: 'Amulet', quality: 'set', icon: '📿',
                  stats: ['+3 Skills (with Angelic Ring)','+20 Str','+12 Dex'],
                  alts: ["Highlord's Wrath — IAS + DS"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Angelic Halo', base: 'Ring', quality: 'set', icon: '◯',
                  stats: ['+Massive AR (with Angelic Ammy)','+Life per Level'] },
        merc:   { name: 'Act 2 Holy Freeze Merc', base: 'Nightmare Defensive · Holy Freeze Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Holy Freeze (chill)','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    foh: {
      name: 'FOH', label: 'Fist of Heavens',
      className: 'PALADIN', class: 'paladin',
      tier: 'A', stars: 4,
      role: 'Uber/PvM', content: 'Endgame',
      damage: 'Fist of Heavens + Conviction',
      aura: 'CONVICTION',
      defense: '3,000',
      stats: { str: '65', dex: '65', vit: '380', energy: '35',
               life: '2,700 / 2,700', mana: '360 / 420', stamina: '780 / 780' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6–8',    quality: 'magic',  stats: '+1 Combat — FoH damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Fist of Heavens',   lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Holy Bolt',         lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Holy Shock',        lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Conviction',        lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Redemption',        lvl: 1,  tree: 'Offensive Auras',tier: 'high' },
        { name: 'Salvation',         lvl: 1,  tree: 'Defensive Auras',tier: 'high' }
      ],
      slots: {
        helm:   { name: "Griffon's Eye", base: 'Diadem', quality: 'unique', icon: '⛑',
                  stats: ['+1 Skills','-15–20% Enemy Light Res','+10–15% Light Skill Dmg'],
                  alts: ['Shako — +2 Skills'] },
        weapon: { name: 'Heart of the Oak', base: 'Flail — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+3 Skills','+40% FCR','+75% Dmg Demons'],
                  alts: ['Wizardspike — 50% FCR budget'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['Herald of Zakarum'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit','+50% Poison Res'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction stacks','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    budgetHammerdin: {
      name: 'BUDGET HDIN', label: 'Budget Hammerdin',
      className: 'PALADIN', class: 'paladin',
      tier: 'B', stars: 3,
      role: 'Starter', content: 'Leveling',
      damage: 'Blessed Hammer (early)',
      aura: 'CONCENTRATION',
      defense: '2,200',
      stats: { str: '55', dex: '55', vit: '280', energy: '35',
               life: '2,100 / 2,100', mana: '260 / 300', stamina: '720 / 720' },
      charms: [
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' },
        { name: 'Combat Skiller ×1–3',    quality: 'magic',  stats: '+1 Combat if found — save for later' },
        { name: "Gheed's Fortune",        quality: 'unique', stats: 'Optional MF/gold charm' }
      ],
      skills: [
        { name: 'Blessed Hammer',    lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Concentration',     lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Blessed Aim',       lvl: 1,  tree: 'Combat Skills',  tier: 'high' },
        { name: 'Vigor',             lvl: 1,  tree: 'Combat Skills',  tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Lore', base: '2os Helm — Runeword', quality: 'runeword', icon: '⛑',
                  stats: ['Ort · Sol','+1 All Skills','+10 Energy'],
                  alts: ['Peasant Crown'] },
        weapon: { name: 'Ancient\'s Pledge / Insight', base: 'Flail or Polearm — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Insight — Meditation Aura solves mana','+35% FCR ring/shield combo'],
                  alts: ['+3 Blessed Hammer Rare Wand + Spirit sword'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['Rhyme — cheap CBF'] },
        armor:  { name: 'Stealth', base: '2os Body Armor — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Tal · Eth','+25% FRW','+25% FCR','+6 Dex'],
                  alts: ['Smoke — +50 Res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Goldwrap', base: 'Heavy Belt', quality: 'unique', icon: '▬',
                  stats: ['+30% MF','+10% IAS','+25–75 Gold Find'],
                  alts: ['Tal Rasha\'s belt'] },
        boots:  { name: 'Silkweave', base: 'Mesh Boots', quality: 'unique', icon: '👢',
                  stats: ['+30% FRW','+80 Mana','+15 Def'],
                  alts: ['War Traveler for MF'] },
        amulet: { name: '+2 Combat Rare', base: 'Amulet', quality: 'rare', icon: '📿',
                  stats: ['+2 Combat Skills','+FCR','+Res'],
                  alts: ["Mara's Kaleidoscope"] },
        ring1:  { name: 'Nagelring', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+15–30% MF','+50–75 AR'] },
        ring2:  { name: 'Manald Heal', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Heal +5–8 Life','+8–12 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Smoke armor','Tal Rasha\'s helm'],
                  alts: [] }
      }
    },

    auradin: {
      name: 'AURADIN', label: 'Auradin (Dream)',
      className: 'PALADIN', class: 'paladin',
      tier: 'A', stars: 4,
      role: 'Uber Killer', content: 'Endgame',
      damage: 'Holy Shock + Dream Auras',
      aura: 'HOLY SHOCK + DREAM',
      defense: '4,800',
      stats: { str: '156', dex: '110', vit: '360', energy: '25',
               life: '2,900 / 2,900', mana: '220 / 260', stamina: '850 / 850' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6',      quality: 'magic',  stats: '+1 Combat — Zeal + Holy Shock' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Zeal',              lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Holy Shock',        lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Resist Lightning',  lvl: 20, tree: 'Defensive Auras',tier: 'max' },
        { name: 'Holy Shield',       lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Salvation',         lvl: 1,  tree: 'Defensive Auras',tier: 'high' },
        { name: 'Fanaticism',        lvl: 1,  tree: 'Offensive Auras',tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Dream', base: 'Bone Visage 3os — Runeword', quality: 'runeword', icon: '⛑',
                  stats: ['Io · Jah · Pul','Level 15 Holy Shock Aura','+20–30% FHR','+30 All Res'],
                  alts: ['Shako for +Skills alternative'] },
        weapon: { name: 'Hand of Justice (HoJ)', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Sur · Cham · Amn · Lo','Level 16 Holy Fire','+33% IAS','+280–330% ED'],
                  alts: ['Grief for pure Zeal damage'] },
        shield: { name: 'Dream', base: 'Troll Nest 3os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Io · Jah · Pul','Level 15 Holy Shock Aura','+30 All Res','+50 Life'],
                  alts: ['Two Dreams stack for max damage'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+15 All Res'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap on Striking','+10–15 Str','+7–10% LL'],
                  alts: ['Laying of Hands — demon dmg'] },
        belt:   { name: "Thundergod's Vigor", base: 'War Belt', quality: 'unique', icon: '▬',
                  stats: ['+200 Light Dmg','+10–20 Str/Vit','+10% Max Light Res'],
                  alts: ['String of Ears — 15% DR'] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: ["Mara's Kaleidoscope"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Wisp Projector', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+10–20% Light Absorb','+5% Max Light Res','Summon Wisp'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks LI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    tesladin: {
      name: 'TESLADIN', label: 'Tesladin (Dragon)',
      className: 'PALADIN', class: 'paladin',
      tier: 'A', stars: 4,
      role: 'Melee Caster', content: 'General',
      damage: 'Zeal + Holy Fire (Dragon)',
      aura: 'HOLY FIRE (Dragon)',
      defense: '5,000',
      stats: { str: '156', dex: '110', vit: '360', energy: '25',
               life: '2,900 / 2,900', mana: '220 / 260', stamina: '850 / 850' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6',      quality: 'magic',  stats: '+1 Combat — Zeal + Holy Fire' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Zeal',              lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Holy Fire',         lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Resist Fire',       lvl: 20, tree: 'Defensive Auras',tier: 'max' },
        { name: 'Holy Shield',       lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Salvation',         lvl: 1,  tree: 'Defensive Auras',tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Dragon', base: '3os Helm — Runeword', quality: 'runeword', icon: '⛑',
                  stats: ['Sur · Lo · Sol','Level 14 Holy Fire Aura','+3–5 Skills','+45 All Res'],
                  alts: ['Shako'] },
        weapon: { name: 'Hand of Justice', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Level 16 Holy Fire','+33% IAS','+280–330% ED','Freeze Target'],
                  alts: ['Grief for pure damage'] },
        shield: { name: 'Dragon', base: '3os Shield — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Level 14 Holy Fire Aura','+3–5 Skills','+45 All Res','+50 Life'],
                  alts: ['Herald of Zakarum'] },
        armor:  { name: 'Dragon', base: '3os Body — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Level 14 Holy Fire Aura','+3–5 Skills','+45 All Res'],
                  alts: ['Chains of Honor'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Dmg to Demons'],
                  alts: [] },
        belt:   { name: "Thundergod's Vigor", base: 'War Belt', quality: 'unique', icon: '▬',
                  stats: ['+200 Light Dmg','+10–20 Str/Vit','+10% Max Light Res'],
                  alts: [] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: [] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Rare LL/AR Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+Life Leech','+AR','+Attrs'] },
        merc:   { name: 'Act 2 Holy Freeze Merc', base: 'Nightmare Defensive · Holy Freeze Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Holy Freeze','Infinity polearm — Conviction','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    charger: {
      name: 'CHARGER', label: 'Charger',
      className: 'PALADIN', class: 'paladin',
      tier: 'B', stars: 3,
      role: 'PvP Rusher', content: 'PvP',
      damage: 'Charge (1-shot burst)',
      aura: 'CONCENTRATION',
      defense: '5,200',
      stats: { str: '156', dex: '160', vit: '380', energy: '15',
               life: '3,000 / 3,000', mana: '140 / 180', stamina: '900 / 900' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6',      quality: 'magic',  stats: '+1 Combat — Charge damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FHR' }
      ],
      skills: [
        { name: 'Charge',            lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Might',             lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Holy Shield',       lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Vigor',             lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Concentration',     lvl: 1,  tree: 'Combat Skills',  tier: 'high' },
        { name: 'Fanaticism',        lvl: 1,  tree: 'Offensive Auras',tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','10% DR'],
                  alts: ["Andariel's Visage — venom + IAS"] },
        weapon: { name: 'Grief', base: 'Phase Blade — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+30–40% IAS','+340–400 Dmg','Ignore Target Def'],
                  alts: ['Baranar\'s Star — massive AR/CB'] },
        shield: { name: 'Herald of Zakarum', base: 'Gilded Shield', quality: 'unique', icon: '⛨',
                  stats: ['+2 Pally Skills','+2 Combat Skills','+150% ED'],
                  alts: ['Exile — Defiance aura'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW (crucial for Charge)','+1 Teleport'],
                  alts: [] },
        gloves: { name: "Dracul's Grasp", base: 'Vampirebone Gloves', quality: 'unique', icon: '🧤',
                  stats: ['25% Life Tap on Striking','+10–15 Str','+7–10% LL'],
                  alts: ['Steelrend'] },
        belt:   { name: 'String of Ears', base: 'Demonhide Sash', quality: 'unique', icon: '▬',
                  stats: ['15% DR','+150 AR','6–8% LL'],
                  alts: [] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: 'Angelic Amulet', base: 'Amulet', quality: 'set', icon: '📿',
                  stats: ['+3 Skills (with Angelic Ring)','+20 Str'],
                  alts: ["Highlord's Wrath"] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Angelic Halo', base: 'Ring', quality: 'set', icon: '◯',
                  stats: ['+Massive AR (with Angelic Ammy)','+Life per Level'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Insight polearm — Meditation','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    avenger: {
      name: 'AVENGER', label: 'Avenger',
      className: 'PALADIN', class: 'paladin',
      tier: 'A', stars: 4,
      role: 'Elemental Melee', content: 'General',
      damage: 'Vengeance (3-Element)',
      aura: 'CONVICTION',
      defense: '5,000',
      stats: { str: '156', dex: '160', vit: '360', energy: '15',
               life: '2,900 / 2,900', mana: '150 / 190', stamina: '850 / 850' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Pally)', quality: 'unique', stats: '+3 Paladin Skills · +Stats' },
        { name: 'Combat Skiller ×6',      quality: 'magic',  stats: '+1 Combat — Vengeance damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Vengeance',         lvl: 20, tree: 'Combat Skills',  tier: 'max' },
        { name: 'Conviction',        lvl: 20, tree: 'Offensive Auras',tier: 'max' },
        { name: 'Resist Fire',       lvl: 20, tree: 'Defensive Auras',tier: 'max' },
        { name: 'Resist Cold',       lvl: 20, tree: 'Defensive Auras',tier: 'max' },
        { name: 'Holy Shield',       lvl: 1,  tree: 'Combat Skills',  tier: 'high' },
        { name: 'Sacrifice',         lvl: 1,  tree: 'Combat Skills',  tier: 'prereq' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','10% DR'],
                  alts: ["Griffon's Eye — light hybrids"] },
        weapon: { name: 'Kingslayer', base: 'Berserker Axe 4os — RW', quality: 'runeword', icon: '🗡',
                  stats: ['Mal · Um · Gul · Fal','+30% IAS','+230–270% ED','Prevent Monster Heal'],
                  alts: ['Grief for pure damage','Last Wish for Might procs'] },
        shield: { name: 'Herald of Zakarum', base: 'Gilded Shield', quality: 'unique', icon: '⛨',
                  stats: ['+2 Pally Skills','+2 Combat Skills','+150% ED'],
                  alts: ['Exile Runeword'] },
        armor:  { name: 'Fortitude', base: 'Archon Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+300% ED','+200% ED (armor)','+15 All Res'],
                  alts: ['Enigma for teleport'] },
        gloves: { name: 'Laying of Hands', base: 'Bramble Mitts', quality: 'set', icon: '🧤',
                  stats: ['20% IAS','+350% Dmg to Demons'],
                  alts: [] },
        belt:   { name: 'String of Ears', base: 'Demonhide Sash', quality: 'unique', icon: '▬',
                  stats: ['15% DR','+150 AR','6–8% LL'],
                  alts: [] },
        boots:  { name: 'Gore Rider', base: 'War Boots', quality: 'unique', icon: '👢',
                  stats: ['15% CB','10% DS','15% OW'],
                  alts: [] },
        amulet: { name: "Highlord's Wrath", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+1 Skills','+DS per Level','20% IAS'],
                  alts: [] },
        ring1:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        ring2:  { name: 'Rare LL/AR Ring', base: 'Ring', quality: 'rare', icon: '◯',
                  stats: ['+Life Leech','+AR','+Attrs'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction stacks','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    /* ═════════════ SORCERESS ═════════════ */
    frozenOrb: {
      name: 'FROZEN ORB', label: 'Frozen Orb',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'S', stars: 5,
      role: 'Speed Farmer', content: 'Farming',
      damage: 'Frozen Orb + Cold Mastery',
      aura: 'ENERGY SHIELD',
      defense: '2,600',
      stats: { str: '60', dex: '55', vit: '350', energy: '75',
               life: '2,400 / 2,400', mana: '600 / 700', stamina: '580 / 580' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills · +Stats · +Res' },
        { name: 'Cold Skiller ×6–8',      quality: 'magic',  stats: '+1 Cold — Orb damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR / FHR' }
      ],
      skills: [
        { name: 'Frozen Orb',        lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Cold Mastery',      lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Ice Bolt',          lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Ice Blast',         lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Static Field',      lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  sockets: '1os via Larzuk — Um (all res) or Ist (MF)',
                  alts: ['Nightwing\'s Veil — +2 Skills + Cold Skill Dmg'] },
        weapon: { name: 'Heart of the Oak', base: 'Flail 4os — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['Ko · Vex · Pul · Thul','+3 All Skills','+40% FCR','+75% Dmg Demons'],
                  alts: ['Death\'s Fathom — +3 Cold Skills','Eschuta\'s Temper — +3 Cold/Light'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch 4os — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Tal · Thul · Ort · Amn','+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor for res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ['Chance Guards — MF'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['+25% MF','+10 Vit/Str','+15% FRW'],
                  alts: ['Sandstorm Trek — Str/Vit'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res','+5 Attrs'],
                  alts: ['+3 Cold Skills Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks CI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    blizzard: {
      name: 'BLIZZARD', label: 'Blizzard',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'S', stars: 5,
      role: 'Boss Killer', content: 'Endgame',
      damage: 'Blizzard + Cold Mastery',
      aura: 'ENERGY SHIELD',
      defense: '2,600',
      stats: { str: '60', dex: '55', vit: '350', energy: '75',
               life: '2,400 / 2,400', mana: '600 / 700', stamina: '580 / 580' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills · +Stats' },
        { name: 'Cold Skiller ×6–8',      quality: 'magic',  stats: '+1 Cold — Blizzard damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Blizzard',          lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Ice Blast',         lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Glacial Spike',     lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Cold Mastery',      lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Ice Bolt',          lvl: 1,  tree: 'Cold Spells',    tier: 'prereq' },
        { name: 'Static Field',      lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' }
      ],
      slots: {
        helm:   { name: "Nightwing's Veil", base: 'Spired Helm', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+8–15% Cold Skill Damage','-5–9% Enemy Cold Res'],
                  alts: ['Shako for MF/DR'] },
        weapon: { name: "Death's Fathom", base: 'Dimensional Shard', quality: 'unique', icon: '🗡',
                  stats: ['+3 Cold Skills','+15–30% Cold Skill Dmg','+25% All Res'],
                  alts: ['Heart of the Oak — FCR + skills','Eschuta\'s Temper'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: [] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ['Frostburn — +40% Max Mana'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['+25% MF','+10 Vit/Str','+15% FRW'],
                  alts: ['Sandstorm Trek'] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Cold Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana','+25% Max Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks CI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    hydra: {
      name: 'HYDRA', label: 'Hydra',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'B', stars: 3,
      role: 'Set & Forget', content: 'General',
      damage: 'Hydra (3-headed fire)',
      aura: 'ENERGY SHIELD',
      defense: '2,400',
      stats: { str: '60', dex: '55', vit: '340', energy: '75',
               life: '2,300 / 2,300', mana: '580 / 680', stamina: '580 / 580' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills' },
        { name: 'Fire Skiller ×6',        quality: 'magic',  stats: '+1 Fire — Hydra damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Hydra',             lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Bolt',         lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Ball',         lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Mastery',      lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF'],
                  alts: ["Nightwing's Veil"] },
        weapon: { name: "Eschuta's Temper", base: 'Eldritch Orb', quality: 'unique', icon: '🗡',
                  stats: ['+3 Fire/Light Skills','+10–20% Fire/Light Dmg','+40% Mana'],
                  alts: ['Heart of the Oak'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: [] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Fire Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks FI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    nova: {
      name: 'NOVA', label: 'Nova',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'A', stars: 4,
      role: 'AoE Speed', content: 'Farming',
      damage: 'Nova + Static Field',
      aura: 'ENERGY SHIELD',
      defense: '2,600',
      stats: { str: '60', dex: '55', vit: '350', energy: '75',
               life: '2,400 / 2,400', mana: '600 / 700', stamina: '580 / 580' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills' },
        { name: 'Lightning Skiller ×6',   quality: 'magic',  stats: '+1 Light — Nova damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Nova',              lvl: 20, tree: 'Lightning',      tier: 'max' },
        { name: 'Lightning Mastery', lvl: 20, tree: 'Lightning',      tier: 'max' },
        { name: 'Static Field',      lvl: 20, tree: 'Lightning',      tier: 'max' },
        { name: 'Charged Bolt',      lvl: 1,  tree: 'Lightning',      tier: 'prereq' },
        { name: 'Lightning',         lvl: 1,  tree: 'Lightning',      tier: 'prereq' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' }
      ],
      slots: {
        helm:   { name: "Griffon's Eye", base: 'Diadem', quality: 'unique', icon: '⛑',
                  stats: ['+1 Skills','-15–20% Enemy Light Res','+10–15% Light Dmg'],
                  alts: ['Shako'] },
        weapon: { name: "Eschuta's Temper", base: 'Eldritch Orb', quality: 'unique', icon: '🗡',
                  stats: ['+3 Fire/Light Skills','+10–20% Fire/Light Dmg'],
                  alts: ['Heart of the Oak'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: [] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['+25% MF','+10 Vit/Str'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks LI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    meteor: {
      name: 'METEOR', label: 'Meteor',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'B', stars: 3,
      role: 'Fire Boss', content: 'General',
      damage: 'Meteor + Fire Ball',
      aura: 'ENERGY SHIELD',
      defense: '2,400',
      stats: { str: '60', dex: '55', vit: '340', energy: '75',
               life: '2,300 / 2,300', mana: '580 / 680', stamina: '580 / 580' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills' },
        { name: 'Fire Skiller ×6',        quality: 'magic',  stats: '+1 Fire — Meteor damage' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Meteor',            lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Ball',         lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Bolt',         lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Mastery',      lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats'],
                  alts: ["Nightwing's Veil"] },
        weapon: { name: "Eschuta's Temper", base: 'Eldritch Orb', quality: 'unique', icon: '🗡',
                  stats: ['+3 Fire/Light Skills','+10–20% Fire/Light Dmg'],
                  alts: ['Heart of the Oak'] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: [] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks FI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    budgetSorc: {
      name: 'BUDGET COLD', label: 'Budget Cold',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'B', stars: 3,
      role: 'Starter', content: 'Leveling',
      damage: 'Frozen Orb + Static',
      aura: 'ENERGY SHIELD',
      defense: '1,800',
      stats: { str: '45', dex: '35', vit: '260', energy: '75',
               life: '2,000 / 2,000', mana: '450 / 550', stamina: '540 / 540' },
      charms: [
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' },
        { name: 'Cold Skiller ×1–3',      quality: 'magic',  stats: '+1 Cold if found — save' },
        { name: "Gheed's Fortune",        quality: 'unique', stats: 'Optional MF/gold charm' }
      ],
      skills: [
        { name: 'Frozen Orb',        lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Cold Mastery',      lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Static Field',      lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Lore', base: '2os Helm — Runeword', quality: 'runeword', icon: '⛑',
                  stats: ['Ort · Sol','+1 All Skills','+10 Energy'],
                  alts: ['Peasant Crown — +1 skills'] },
        weapon: { name: 'Spirit Sword', base: 'Crystal Sword 4os — RW', quality: 'runeword', icon: '🗡',
                  stats: ['Tal · Thul · Ort · Amn','+2 Skills','+25–35% FCR','+55 All Res'],
                  alts: ['Wizardspike — 50% FCR mid-tier'] },
        shield: { name: 'Ancient\'s Pledge', base: '3os Shield — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['Ral · Ort · Tal','+50% Resistances','Cheap early defense'],
                  alts: ['Spirit Monarch endgame'] },
        armor:  { name: 'Stealth', base: '2os Body — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['Tal · Eth','+25% FRW','+25% FCR','+6 Dex'],
                  alts: ['Smoke — +50 All Res'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ['Chance Guards — MF'] },
        belt:   { name: 'Goldwrap', base: 'Heavy Belt', quality: 'unique', icon: '▬',
                  stats: ['+30% MF','+10% IAS','+25–75 Gold Find'],
                  alts: ['Tal Rasha\'s belt'] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['+25% MF','+10 Vit/Str','+15% FRW'],
                  alts: ['Silkweave — mana boost'] },
        amulet: { name: '+2 Sorc Rare', base: 'Amulet', quality: 'rare', icon: '📿',
                  stats: ['+2 Sorc Skills','+Res','+Life/Mana'],
                  alts: ["Mara's Kaleidoscope"] },
        ring1:  { name: 'Nagelring', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+15–30% MF','+50–75 AR'] },
        ring2:  { name: 'Manald Heal', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['Heal +5–8 Life','+8–12 Mana'] },
        merc:   { name: 'Act 2 Prayer Merc', base: 'Hell Combat · Prayer Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Prayer','Insight polearm — Meditation','Smoke armor','Tal Rasha\'s helm'],
                  alts: [] }
      }
    },

    meteorb: {
      name: 'METEORB', label: 'Meteorb',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'S', stars: 5,
      role: 'All-Purpose', content: 'General',
      damage: 'Meteor + Frozen Orb hybrid',
      aura: 'ENERGY SHIELD',
      defense: '2,600',
      stats: { str: '60', dex: '55', vit: '350', energy: '75',
               life: '2,400 / 2,400', mana: '600 / 700', stamina: '580 / 580' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats · +Res' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills · +Stats' },
        { name: 'Cold/Fire Skiller mix',  quality: 'magic',  stats: '+1 Cold and Fire — split boost' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / FCR' }
      ],
      skills: [
        { name: 'Frozen Orb',        lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Cold Mastery',      lvl: 20, tree: 'Cold Spells',    tier: 'max' },
        { name: 'Meteor',            lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Mastery',      lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Ball',         lvl: 1,  tree: 'Fire',           tier: 'prereq' },
        { name: 'Warmth',            lvl: 1,  tree: 'Fire',           tier: 'high' },
        { name: 'Static Field',      lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF','10% DR'],
                  alts: ["Nightwing's Veil for Cold hybrid"] },
        weapon: { name: 'Heart of the Oak', base: 'Flail — Runeword', quality: 'runeword', icon: '🗡',
                  stats: ['+3 Skills','+40% FCR','+75% Dmg Demons'],
                  alts: ["Eschuta's Temper — +3 Fire/Light"] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: [] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: [] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: [] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'War Traveler', base: 'Battle Boots', quality: 'unique', icon: '👢',
                  stats: ['+25% MF','+10 Vit/Str','+15% FRW'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: [] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might','Infinity polearm — Conviction (breaks CI/FI)','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    },

    enchantress: {
      name: 'ENCHANTRESS', label: 'Enchantress',
      className: 'SORCERESS', class: 'sorceress',
      tier: 'B', stars: 3,
      role: 'Party Buffer', content: 'General',
      damage: 'Enchant + Melee/Ranged',
      aura: 'ENERGY SHIELD',
      defense: '3,600',
      stats: { str: '95', dex: '110', vit: '340', energy: '35',
               life: '2,400 / 2,400', mana: '380 / 440', stamina: '650 / 650' },
      charms: [
        { name: 'Annihilus',              quality: 'unique', stats: '+1 All Skills · +20 Stats' },
        { name: 'Hellfire Torch (Sorc)',  quality: 'unique', stats: '+3 Sorc Skills' },
        { name: 'Fire Skiller ×6',        quality: 'magic',  stats: '+1 Fire — Enchant fire dmg' },
        { name: 'Small Charms',           quality: 'magic',  stats: '20 Life / 5+ Res / IAS' }
      ],
      skills: [
        { name: 'Enchant',           lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Mastery',      lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Warmth',            lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Fire Bolt',         lvl: 20, tree: 'Fire',           tier: 'max' },
        { name: 'Teleport',          lvl: 1,  tree: 'Lightning',      tier: 'high' },
        { name: 'Static Field',      lvl: 1,  tree: 'Lightning',      tier: 'high' }
      ],
      slots: {
        helm:   { name: 'Shako', base: 'Shako', quality: 'unique', icon: '⛑',
                  stats: ['+2 All Skills','+2 Stats','+50% MF'],
                  alts: ['Peasant Crown — cheap +1 Skills'] },
        weapon: { name: 'Demon Machine', base: 'Chu-Ko-Nu', quality: 'unique', icon: '🗡',
                  stats: ['+150 Def','+40% IAS','+95 Fire Dmg','Fires Explosive Bolts'],
                  alts: ["Eschuta's Temper — +3 Fire","Passion — Berserk on swap"] },
        shield: { name: 'Spirit Monarch', base: 'Monarch — Runeword', quality: 'runeword', icon: '⛨',
                  stats: ['+2 Skills','25–35% FCR','+55 All Res'],
                  alts: ['(if using bow — no shield)'] },
        armor:  { name: 'Enigma', base: 'Mage Plate — Runeword', quality: 'runeword', icon: '🛡',
                  stats: ['+2 Skills','+45% FRW','+1 Teleport'],
                  alts: ['Chains of Honor'] },
        gloves: { name: 'Magefist', base: 'Light Gauntlets', quality: 'unique', icon: '🧤',
                  stats: ['+1 Fire','20% FCR','25% Mana Regen'],
                  alts: ['Laying of Hands — 20% IAS + demons'] },
        belt:   { name: 'Arachnid Mesh', base: 'Spiderweb Sash', quality: 'unique', icon: '▬',
                  stats: ['+1 Skills','20% FCR','+90–120 Mana'],
                  alts: [] },
        boots:  { name: 'Sandstorm Trek', base: 'Scarabshell Boots', quality: 'unique', icon: '👢',
                  stats: ['+20% FRW','+10–15 Str/Vit'],
                  alts: [] },
        amulet: { name: "Mara's Kaleidoscope", base: 'Amulet', quality: 'unique', icon: '📿',
                  stats: ['+2 All Skills','+20–30 All Res'],
                  alts: ['+3 Fire Rare Amulet'] },
        ring1:  { name: 'Stone of Jordan', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['+1 Skills','+20 Mana'] },
        ring2:  { name: 'Raven Frost', base: 'Ring', quality: 'unique', icon: '◯',
                  stats: ['CBF','+15–20 Dex','+150–250 AR'] },
        merc:   { name: 'Act 2 Might Merc', base: 'Nightmare Offensive · Might Aura', quality: 'normal', icon: '🗡',
                  stats: ['Aura: Might (+Enchant on merc = massive dmg)','Infinity polearm','Fortitude','Andariel\'s Visage'],
                  alts: [] }
      }
    }
    // Additional builds can be added here later — the viewer auto-populates.
  };

  // ─── DOM refs ───
  const buildSelect = document.getElementById('d2-build-select');
  const classSelect = document.getElementById('d2-class-select');
  const nameplate   = document.getElementById('d2-nameplate');
  const classplate  = document.getElementById('d2-classplate');
  const tierEl      = document.getElementById('d2-tier');
  const starsEl     = document.getElementById('d2-stars');
  const roleEl      = document.getElementById('d2-role');
  const contentEl   = document.getElementById('d2-content');
  const damageEl    = document.getElementById('d2-damage');
  const auraEl      = document.getElementById('d2-aura');
  const defenseEl   = document.getElementById('d2-defense');
  const charmListEl = document.getElementById('d2-charm-list');
  const skillListEl = document.getElementById('d2-skill-list');

  const modal       = document.getElementById('d2-item-modal');
  const ttName      = document.getElementById('d2-tt-name');
  const ttBase      = document.getElementById('d2-tt-base');
  const ttStats     = document.getElementById('d2-tt-stats');
  const ttSockets   = document.getElementById('d2-tt-sockets');
  const ttSocketTxt = document.getElementById('d2-tt-socket-text');
  const ttAlts      = document.getElementById('d2-tt-alts');
  const ttAltList   = document.getElementById('d2-tt-alt-list');

  const charmsModal  = document.getElementById('d2-charms-modal');
  const skillsModal  = document.getElementById('d2-skills-modal');
  const openCharmsBtn= document.getElementById('d2-open-charms');
  const openSkillsBtn= document.getElementById('d2-open-skills');

  const slotBtns    = viewer.querySelectorAll('.d2-slot, .d2-merc-slot');

  // ─── Render one build into the paperdoll + stats ───
  function renderBuild(key) {
    const b = BUILDS[key];
    if (!b) return;

    nameplate.textContent  = b.name;
    classplate.textContent = b.className;

    // Tier / stars / role / content
    if (tierEl) {
      const tier = (b.tier || 'B').toUpperCase();
      tierEl.textContent = tier;
      tierEl.setAttribute('data-tier', tier);
    }
    if (starsEl) {
      const n = Math.max(0, Math.min(5, b.stars || 0));
      starsEl.innerHTML = '★'.repeat(n) + '<span class="empty">' + '☆'.repeat(5 - n) + '</span>';
      starsEl.setAttribute('aria-label', `${n} out of 5 stars`);
    }
    if (roleEl)    roleEl.textContent    = (b.role    || '—').toUpperCase();
    if (contentEl) contentEl.textContent = (b.content || '—').toUpperCase();

    damageEl.textContent   = b.damage;
    auraEl.textContent     = b.aura;
    defenseEl.textContent  = b.defense;

    // Inventory / Charms list
    if (charmListEl) {
      charmListEl.innerHTML = (b.charms || []).map(c =>
        `<li class="d2-charm-item q-${c.quality || 'magic'}">
           <span class="d2-charm-name">${c.name}</span>
           <span class="d2-charm-stats">${c.stats || ''}</span>
         </li>`
      ).join('');
    }

    // Skill Allocation list
    if (skillListEl) {
      skillListEl.innerHTML = (b.skills || []).map(s =>
        `<li class="d2-skill-item ${s.tier || ''}">
           <span>
             <span class="d2-skill-name">${s.name}</span>
             <span class="d2-skill-tree">${s.tree || ''}</span>
           </span>
           <span class="d2-skill-lvl">${s.lvl}</span>
         </li>`
      ).join('');
    }

    // Update the primary attribute values (STR/DEX/VIT/ENR)
    const attrMap = { str: 'd2-attr-str', dex: 'd2-attr-dex', vit: 'd2-attr-vit', nrg: 'd2-attr-nrg' };
    ['str', 'dex', 'vit'].forEach(k => {
      const row = document.getElementById(attrMap[k]);
      if (row) row.querySelector('.d2-attr-val').textContent = b.stats[k] || '—';
    });
    const nrgRow = document.getElementById('d2-attr-nrg');
    if (nrgRow) nrgRow.querySelector('.d2-attr-val').textContent = b.stats.energy || '—';

    // Life/Mana/Stamina in the side cells
    const vitSide = document.getElementById('d2-attr-vit');
    if (vitSide) {
      const parts = vitSide.querySelectorAll('.d2-side-val');
      if (parts[0]) parts[0].textContent = b.stats.stamina || '—';
      if (parts[1]) { parts[1].textContent = b.stats.life || '—'; parts[1].classList.add('d2-side-blue'); }
    }
    const nrgSide = document.getElementById('d2-attr-nrg');
    if (nrgSide) {
      const manaEl = nrgSide.querySelector('.d2-side-val');
      if (manaEl) manaEl.textContent = b.stats.mana || '—';
    }

    // Populate each slot — the LABEL stays as the slot name ("Weapon", "Helm", etc.).
    // We only toggle a quality class on the slot for the D2 color/glow, and mark it clickable.
    const QUALITY_CLASSES = ['q-unique','q-set','q-magic','q-rare','q-runeword','q-crafted','q-normal'];
    slotBtns.forEach(btn => {
      const slotKey = btn.dataset.slot;
      const item    = b.slots[slotKey];

      // Clean previous quality/state classes
      btn.classList.remove('has-item', 'empty', ...QUALITY_CLASSES);

      if (!item) {
        btn.classList.add('empty');
        return;
      }

      btn.classList.add('has-item', 'q-' + (item.quality || 'normal'));
    });
  }

  // ─── Modal open/close ───
  function openItemModal(item) {
    if (!item) return;
    ttName.textContent = item.name;
    ttName.className   = 'd2-tt-name q-' + (item.quality || 'normal');
    ttBase.textContent = item.base || '';

    ttStats.innerHTML = '';
    (item.stats || []).forEach(s => {
      const li = document.createElement('li');
      // Blank line acts as separator
      if (!s.trim()) { li.innerHTML = '&nbsp;'; li.style.padding = '0.15rem 0'; }
      else if (s.startsWith('►')) { li.className = 'tt-gold'; li.textContent = s; }
      else if (s.startsWith('+') || s.includes('%') || /\d/.test(s)) { li.textContent = s; }
      else { li.textContent = s; }
      ttStats.appendChild(li);
    });

    if (item.sockets) {
      ttSockets.hidden = false;
      ttSocketTxt.textContent = item.sockets;
    } else {
      ttSockets.hidden = true;
    }

    ttAltList.innerHTML = '';
    if (item.alts && item.alts.length) {
      ttAlts.hidden = false;
      item.alts.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        ttAltList.appendChild(li);
      });
    } else {
      ttAlts.hidden = true;
    }

    modal.hidden = false;
    // Focus the close button for keyboard users
    setTimeout(() => modal.querySelector('.d2-item-close')?.focus(), 20);
  }
  function closeItemModal() {
    modal.hidden = true;
  }

  // ─── Wire events ───
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentBuild = BUILDS[buildSelect.value];
      if (!currentBuild) return;
      const item = currentBuild.slots[btn.dataset.slot];
      if (!item) return;
      openItemModal(item);
    });
  });

  buildSelect.addEventListener('change', () => renderBuild(buildSelect.value));

  // ─── Class filter: rebuild the Build dropdown to only show matching builds ───
  function refreshBuildOptions(classFilter) {
    const prev = buildSelect.value;
    const matches = Object.entries(BUILDS).filter(([, b]) =>
      classFilter === 'all' || b.class === classFilter
    );
    buildSelect.innerHTML = '';
    if (!matches.length) {
      const opt = document.createElement('option');
      opt.value = ''; opt.disabled = true; opt.selected = true;
      opt.textContent = '— No builds yet for this class —';
      buildSelect.appendChild(opt);
      buildSelect.disabled = true;
      return;
    }
    buildSelect.disabled = false;
    matches.forEach(([key, b]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = b.label || (b.name.charAt(0) + b.name.slice(1).toLowerCase());
      buildSelect.appendChild(opt);
    });
    // Preserve previous selection if it survived the filter, otherwise pick first
    const keys = matches.map(([k]) => k);
    buildSelect.value = keys.includes(prev) ? prev : keys[0];
    renderBuild(buildSelect.value);
  }

  if (classSelect) {
    classSelect.addEventListener('change', () => refreshBuildOptions(classSelect.value));
  }

  // ─── Open/close info modals (charms + skills) ───
  function openInfoModal(m) {
    if (!m) return;
    m.hidden = false;
    setTimeout(() => m.querySelector('.d2-item-close')?.focus(), 20);
  }
  function closeInfoModal(m) { if (m) m.hidden = true; }

  openCharmsBtn?.addEventListener('click', () => openInfoModal(charmsModal));
  openSkillsBtn?.addEventListener('click', () => openInfoModal(skillsModal));

  [charmsModal, skillsModal].forEach(m => {
    if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-modal]')) closeInfoModal(m);
    });
  });

  // Close on backdrop click, close-button click, or Escape key
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]')) closeItemModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modal.hidden)        closeItemModal();
      if (charmsModal && !charmsModal.hidden) closeInfoModal(charmsModal);
      if (skillsModal && !skillsModal.hidden) closeInfoModal(skillsModal);
    }
  });

  // Initial render — respects the initially-selected class filter
  refreshBuildOptions(classSelect ? classSelect.value : 'all');
})();



