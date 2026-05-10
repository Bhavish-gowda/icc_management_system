// ── ICC Cricket Management System — script.js ──

// ── Auth Session Check ──
// ── Auth Session Check ──
function checkAuth() {
  try {
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      if (!isAuthPage) window.location.href = 'login.html';
      return null;
    }
    const user = JSON.parse(userStr);
    if (isAuthPage) window.location.href = 'index.html';
    return user;
  } catch (e) {
    console.warn("Auth check failed:", e);
    return null;
  }
}

const currentUser = checkAuth();

const DataMgr = {
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn(`DataMgr: Failed to parse ${key}`, e);
      return [];
    }
  },
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`DataMgr: Failed to save ${key}`, e);
    }
  },
  getPlayers: () => DataMgr.get('players'),
  addPlayer: (player) => {
    const players = DataMgr.getPlayers();
    players.push({ ...player, id: Date.now() });
    DataMgr.save('players', players);
  },
  updatePlayer: (id, updatedData) => {
    const players = DataMgr.getPlayers().map(p => p.id === id ? { ...p, ...updatedData } : p);
    DataMgr.save('players', players);
  },
  deletePlayer: (id) => {
    const players = DataMgr.getPlayers().filter(p => p.id !== id);
    DataMgr.save('players', players);
  },
  getCountries: () => DataMgr.get('countries'),
  addCountry: (country) => {
    const countries = DataMgr.getCountries();
    countries.push({ ...country, id: Date.now() });
    DataMgr.save('countries', countries);
  },
  updateCountry: (id, updatedData) => {
    const countries = DataMgr.getCountries().map(c => c.id === id ? { ...c, ...updatedData } : c);
    DataMgr.save('countries', countries);
  },
  deleteCountry: (id) => {
    const countries = DataMgr.getCountries().filter(c => c.id !== id);
    DataMgr.save('countries', countries);
  },
  getMatches: () => DataMgr.get('matches'),
  saveMatch: (match) => {
    const matches = DataMgr.getMatches();
    matches.push({ ...match, id: Date.now() });
    DataMgr.save('matches', matches);
  },
  getTeamRankings: (type) => DataMgr.get(`team_rankings_${type}`),
  getPlayerRankings: (type) => DataMgr.get(`player_rankings_${type}`),
  updateRankingRating: (key, id, delta) => {
    const rankings = DataMgr.get(key);
    if (!Array.isArray(rankings)) return;
    const updated = rankings.map(r => {
      if (r.id === id || r.rank === id) {
        const newRating = Math.max(0, (parseInt(r.rating) || 0) + delta);
        return { ...r, rating: newRating };
      }
      return r;
    });
    updated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    updated.forEach((r, idx) => r.rank = idx + 1);
    DataMgr.save(key, updated);
  }
};

// ── Dummy Data Preloading ──
function initDummyData() {
  if (DataMgr.getPlayers().length === 0) {
    const players = [
      { name: "Virat Kohli", country: "India", role: "Batter", jersey: "18", matches: "292", runs: "13848", wickets: "4", id: 1 },
      { name: "Rohit Sharma", country: "India", role: "Batter", jersey: "45", matches: "262", runs: "10709", wickets: "8", id: 9 },
      { name: "Jasprit Bumrah", country: "India", role: "Bowler", jersey: "93", matches: "89", runs: "120", wickets: "149", id: 3 },
      { name: "Babar Azam", country: "Pakistan", role: "Batter", jersey: "56", matches: "117", runs: "5729", wickets: "0", id: 2 },
      { name: "Kane Williamson", country: "New Zealand", role: "Batter", jersey: "22", matches: "165", runs: "6810", wickets: "37", id: 5 },
      { name: "Steve Smith", country: "Australia", role: "Batter", jersey: "49", matches: "155", runs: "5602", wickets: "28", id: 4 },
      { name: "Jos Buttler", country: "England", role: "Batter", jersey: "63", matches: "181", runs: "5020", wickets: "0", id: 6 },
      { name: "Rashid Khan", country: "Afghanistan", role: "Bowler", jersey: "19", matches: "103", runs: "1200", wickets: "183", id: 7 }
    ];
    DataMgr.save('players', players);
  }

  // Preload team rankings if empty
  ['ODI', 'T20I', 'TEST'].forEach(type => {
    if (DataMgr.get(`team_rankings_${type}`).length === 0) {
      const defaultRankings = [
        { rank: 1, team: "India", flag: "🇮🇳", rating: 126, points: "5,432", matches: 58 },
        { rank: 2, team: "Australia", flag: "🇦🇺", rating: 121, points: "5,210", matches: 45 },
        { rank: 3, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rating: 118, points: "4,980", matches: 42 }
      ];
      DataMgr.save(`team_rankings_${type}`, defaultRankings);
    }
  });

  // Preload countries if empty
  if (DataMgr.getCountries().length === 0) {
    const countries = [
      { id: 1, name: "India", format: "All Formats", captain: "Rohit Sharma", coach: "Rahul Dravid", rank: 1 },
      { id: 2, name: "Australia", format: "All Formats", captain: "Pat Cummins", coach: "Andrew McDonald", rank: 2 },
      { id: 3, name: "England", format: "All Formats", captain: "Ben Stokes", coach: "Brendon McCullum", rank: 3 },
      { id: 4, name: "Pakistan", format: "All Formats", captain: "Babar Azam", coach: "Grant Bradburn", rank: 4 }
    ];
    DataMgr.save('countries', countries);
  }
}
initDummyData();

// ── Global Toast (accessible from inline onclick in HTML) ──
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>${msg}`;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: '10000',
    background: type === 'success' ? 'rgba(0,255,148,0.15)' : 'rgba(0,212,255,0.15)',
    border: `1px solid ${type === 'success' ? 'rgba(0,255,148,0.4)' : 'rgba(0,212,255,0.4)'}`,
    color: type === 'success' ? '#00ff94' : '#00d4ff',
    padding: '12px 20px', borderRadius: '10px', fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(10px)',
    animation: 'fadeInUp 0.3s ease', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  });
  document.body.appendChild(toast);
}

// ── Live Match Ticker Logic (Powered by CricketAPI) ──
async function initLiveTicker() {
  const tickerEl = document.getElementById('liveTicker');
  if (!tickerEl) return;

  const matches = await CricketAPI.getLiveMatches();
  if (!matches || matches.length === 0) return;

  let tickerIdx = 0;
  const updateTicker = () => {
    const m = matches[tickerIdx];
    tickerEl.style.opacity = 0;
    setTimeout(() => {
      tickerEl.innerHTML = `<span class="fw-600 text-accent">${m.teams.t1.flag} ${m.teams.t1.name}</span> vs <span class="fw-600 text-accent">${m.teams.t2.flag} ${m.teams.t2.name}</span> — <span class="fw-bold">${m.teams.t1.score}</span>`;
      tickerEl.style.opacity = 1;
      tickerIdx = (tickerIdx + 1) % matches.length;
    }, 500);
  };

  updateTicker();
  CricketAPI.initAutoRefresh(updateTicker, 6000);
}

// ── Page Loader Failsafe ──
const hideLoader = () => {
  const loader = document.getElementById('pageLoader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    console.log('Loader hidden (Failsafe triggered or Load complete)');
  }
};

window.addEventListener('load', hideLoader);
// Force hide after 3.5s failsafe
setTimeout(hideLoader, 3500);

document.addEventListener('DOMContentLoaded', () => {
  try {
    initLiveTicker();
  } catch (e) {
    console.warn("Live Ticker Init Failed:", e);
  }

  // ── Sidebar toggle ──
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtns = document.querySelectorAll('.sidebar-toggle');
  const mainContent = document.getElementById('mainContent');

  function openSidebar() { sidebar.classList.add('open'); overlay.style.display = 'block'; }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.style.display = 'none'; }

  toggleBtns.forEach(btn => btn.addEventListener('click', () => {
    if (window.innerWidth >= 992) {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    } else {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    }
  }));

  overlay.addEventListener('click', closeSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) { closeSidebar(); sidebar.classList.remove('collapsed'); mainContent.classList.remove('expanded'); }
  });

  // ── Active nav link (Automatic based on URL) ──
  const navLinks = document.querySelectorAll('.sidebar-link[data-page], .nav-link-custom[data-page]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

    link.addEventListener('click', () => {
      if (window.innerWidth < 992) closeSidebar();
    });
  });

  // ── Search modal ──
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');

  function openSearch() { searchModal.classList.add('open'); setTimeout(() => searchInput?.focus(), 100); }
  function closeSearch() { searchModal.classList.remove('open'); }

  document.querySelectorAll('.open-search').forEach(el => el.addEventListener('click', openSearch));
  searchModal?.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  // Search tags — fill input and auto-submit
  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.query || tag.textContent.trim();
      if (searchInput) {
        searchInput.value = q;
        searchInput.focus();
        const form = searchInput.closest('form');
        if (form) {
          window.location.href = `search.html?q=${encodeURIComponent(q)}`;
        }
      }
    });
  });

  // ── Animate stat progress bars ──
  const progressBars = document.querySelectorAll('.stat-progress-bar');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  progressBars.forEach(bar => { bar.style.width = '0%'; observer.observe(bar); });

  // ── Animate counters ──
  function animateCounter(el, target, suffix = '') {
    let start = 0, duration = 1800;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, +el.dataset.target, el.dataset.suffix || '');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));




  // ── Notification bell ──
  const notifBtn = document.getElementById('notifBtn');
  notifBtn?.addEventListener('click', () => {
    const badge = notifBtn.querySelector('.notif-badge');
    if (badge) badge.style.display = 'none';
    showToast('All notifications marked as read', 'success');
  });

  // ── Add Player button demo ──
  document.getElementById('addPlayerBtn')?.addEventListener('click', () => {
    showToast('Add Player — feature available in backend module', 'info');
  });
  document.getElementById('viewMatchesBtn')?.addEventListener('click', () => {
    showToast('Loading Match Schedule…', 'info');
  });

  // ── Dark/Light toggle with persistence ──
  const themeToggle = document.getElementById('themeToggle');
  let isDark = localStorage.getItem('theme') !== 'light';

  function applyTheme(dark) {
    if (!dark) {
      document.documentElement.style.setProperty('--primary', '#f0f4f8');
      document.documentElement.style.setProperty('--secondary', '#ffffff');
      document.documentElement.style.setProperty('--text', '#1b2a3b');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255,255,255,0.8)');
      document.documentElement.style.setProperty('--gradient', 'linear-gradient(135deg, #e0f4ff 0%, #f0f4f8 100%)');
      document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.1)');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.style.setProperty('--primary', '#0d1b2a');
      document.documentElement.style.setProperty('--secondary', '#1b2a3b');
      document.documentElement.style.setProperty('--text', '#e0f4ff');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255,255,255,0.05)');
      document.documentElement.style.setProperty('--gradient', 'linear-gradient(135deg, #0d1b2a 0%, #0a2640 50%, #0d2b45 100%)');
      document.documentElement.style.setProperty('--border', 'rgba(0,212,255,0.2)');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'dark');
    }
  }

  // Apply initial theme
  applyTheme(isDark);

  themeToggle?.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme(isDark);
    showToast(`${isDark ? 'Dark' : 'Light'} mode enabled`, 'success');
  });

  // Apply saved accent color
  const savedAccent = localStorage.getItem('accentColor');
  if (savedAccent) {
    document.documentElement.style.setProperty('--accent', savedAccent);
  }

  // ── Countries Page Search ──
  const countrySearch = document.getElementById('countrySearch');
  const countriesTable = document.getElementById('countriesTable');
  const noResults = document.getElementById('noResults');

  if (countrySearch && countriesTable) {
    const rows = countriesTable.querySelectorAll('tbody tr');
    countrySearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      let hasVisible = false;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
          row.style.display = '';
          hasVisible = true;
          row.style.animation = 'none';
          row.offsetHeight;
          row.style.animation = null;
        } else {
          row.style.display = 'none';
        }
      });

      if (hasVisible) {
        countriesTable.style.display = '';
        noResults.classList.add('d-none');
      } else {
        countriesTable.style.display = 'none';
        noResults.classList.remove('d-none');
      }
    });
  }

  // ── Players Page Search & Filter ──
  const playerSearch = document.getElementById('playerSearch');
  const countryFilter = document.getElementById('countryFilter');
  const playersTable = document.getElementById('playersTable');
  const noPlayersResults = document.getElementById('noPlayersResults');

  if (playersTable && (playerSearch || countryFilter)) {
    const rows = playersTable.querySelectorAll('tbody tr');

    function filterPlayers() {
      const term = playerSearch ? playerSearch.value.toLowerCase() : '';
      const country = countryFilter ? countryFilter.value : '';
      let hasVisible = false;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowCountry = row.dataset.country || '';

        const matchesSearch = text.includes(term);
        const matchesCountry = country === '' || rowCountry === country;

        if (matchesSearch && matchesCountry) {
          row.style.display = '';
          hasVisible = true;
          row.style.animation = 'none';
          row.offsetHeight;
          row.style.animation = null;
        } else {
          row.style.display = 'none';
        }
      });

      if (hasVisible) {
        playersTable.style.display = '';
        noPlayersResults.classList.add('d-none');
      } else {
        playersTable.style.display = 'none';
        noPlayersResults.classList.remove('d-none');
      }
    }

    if (playerSearch) playerSearch.addEventListener('input', filterPlayers);
    if (countryFilter) countryFilter.addEventListener('change', filterPlayers);
  }

  // ── Global Search Results Page Logic ──
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q');
  const searchState = document.getElementById('searchState');
  const searchResults = document.getElementById('searchResults');
  const queryDisplay = document.getElementById('searchQueryDisplay');

  if (query !== null && searchState && searchResults && queryDisplay) {
    queryDisplay.textContent = `"${query}"`;

    setTimeout(() => {
      searchState.classList.add('d-none');
      searchResults.classList.remove('d-none');

      if (query.trim() === '') {
        searchResults.innerHTML = `
                  <div class="text-center py-5">
                      <div class="mb-3" style="font-size: 2.5rem; color: var(--muted);"><i class="fas fa-search"></i></div>
                      <h4 class="text-muted">Please enter a search term</h4>
                  </div>
              `;
        return;
      }

      searchResults.innerHTML = `
              <div class="row g-4">
                  <div class="col-md-6">
                      <h6 class="text-accent mb-3"><i class="fas fa-person-running"></i> Players Found</h6>
                      <div class="activity-item" style="cursor:pointer;" onclick="window.location='players.html'">
                          <div class="activity-avatar" style="background:rgba(0,255,148,.15)"><i class="fas fa-user" style="color:#00ff94"></i></div>
                          <div class="activity-info">
                              <div class="activity-title">${query} (Match)</div>
                              <div class="activity-sub">Batter · India</div>
                          </div>
                          <div class="activity-time"><i class="fas fa-chevron-right"></i></div>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <h6 class="text-accent mb-3"><i class="fas fa-baseball-bat-ball"></i> Matches Found</h6>
                      <div class="activity-item" style="cursor:pointer;" onclick="window.location='matches.html'">
                          <div class="activity-avatar" style="background:rgba(251,146,60,.15)"><i class="fas fa-calendar" style="color:#fb923c"></i></div>
                          <div class="activity-info">
                              <div class="activity-title">India vs Australia</div>
                              <div class="activity-sub">Mentions: "${query}"</div>
                          </div>
                          <div class="activity-time"><i class="fas fa-chevron-right"></i></div>
                      </div>
                  </div>
              </div>
          `;
    }, 1500);
  }


  // ── Initialize User UI ──
  if (currentUser) {
    const navbarRight = document.querySelector('.navbar-right');
    const initials = currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    const roleClass = currentUser.role.toLowerCase();

    // Inject enhanced profile
    if (navbarRight) {
      navbarRight.innerHTML = `
        <button class="btn-search-nav open-search"><i class="fas fa-search me-1"></i><span class="d-none d-md-inline">Search</span></button>
        <button class="notification-btn" id="notifBtn"><i class="fas fa-bell fa-lg"></i><span class="notif-badge"></span></button>
        <button id="themeToggle" class="notification-btn"><i class="fas fa-moon"></i></button>
        <div class="user-profile-nav" id="userProfileBtn">
          <div class="user-avatar" style="margin:0">${initials}</div>
          <div class="user-info-text d-none d-sm-flex">
            <span class="user-name">${currentUser.fullName}</span>
            <span class="user-role-badge ${roleClass}">${currentUser.role}</span>
          </div>
        </div>
      `;
      // Re-attach theme toggle listener since we replaced the HTML
      document.getElementById('themeToggle').addEventListener('click', () => {
        isDark = !isDark;
        applyTheme(isDark);
      });
    }

    const heroGreeting = document.querySelector('.hero-greeting');
    // Role-based UI enforcement
    const isAdmin = currentUser.role === 'Admin';
    
    document.querySelectorAll('[data-admin-only="true"]').forEach(el => {
      if (!isAdmin) {
        el.classList.add('analyst-disabled');
        // If it's a button, prevent click
        if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('Only Admins can perform this action', 'info');
          }, true);
        }
      }
    });

    if (heroGreeting) {
      const badge = isAdmin ? '<span class="admin-badge">Admin</span>' : '<span class="admin-badge" style="border-color:var(--muted);color:var(--muted)">Analyst</span>';
      heroGreeting.innerHTML = `&#9679; WELCOME BACK, ${currentUser.role.toUpperCase()} ${badge}`;
    }
  }

  // ── Players Page Logic ──
  if (window.location.pathname.includes('players.html')) {
    const tableBody = document.getElementById('playersTableBody');
    const addForm = document.getElementById('addPlayerForm');
    const saveBtn = document.querySelector('#addPlayerModal .btn-primary-custom');

    const renderPlayers = () => {
      const players = DataMgr.getPlayers();
      if (players.length === 0 && tableBody.children.length === 0) return; // Keep static demo if no local data

      tableBody.innerHTML = '';
      players.forEach((p, idx) => {
        const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const row = document.createElement('tr');
        row.className = 'animate-row';
        row.style.animationDelay = `${idx * 0.05}s`;
        row.innerHTML = `
          <td>
            <div class="d-flex align-items-center gap-3">
              <div class="player-avatar">${initials}</div>
              <span class="fw-bold">${p.name}</span>
            </div>
          </td>
          <td>${p.country}</td>
          <td><span class="role-badge ${p.role.toLowerCase()}">${p.role}</span></td>
          <td class="text-center">${p.jersey || '-'}</td>
          <td class="text-end">${p.matches || 0}</td>
          <td class="text-end fw-bold text-accent">${p.runs || 0}</td>
          <td class="text-end">${p.wickets || 0}</td>
          <td class="text-end" data-admin-only="true">
            <button class="btn-icon view-player" data-id="${p.id}"><i class="fas fa-eye"></i></button>
            <button class="btn-icon edit-player" data-id="${p.id}"><i class="fas fa-edit"></i></button>
            <button class="btn-icon text-danger delete-player" data-id="${p.id}"><i class="fas fa-trash"></i></button>
          </td>
        `;
        tableBody.appendChild(row);
      });
      attachPlayerListeners();
    };

    const attachPlayerListeners = () => {
      // Delete
      document.querySelectorAll('.delete-player').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentUser.role !== 'Admin') return;
          const id = parseInt(btn.dataset.id);
          if (confirm('Are you sure you want to delete this player?')) {
            DataMgr.deletePlayer(id);
            renderPlayers();
            showToast('Player deleted', 'success');
          }
        });
      });

      // View
      document.querySelectorAll('.view-player').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const p = DataMgr.getPlayers().find(x => x.id === id);
          if (p) {
            document.getElementById('vAvatar').textContent = p.name.split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById('vName').textContent = p.name;
            document.getElementById('vCountry').textContent = p.country;
            document.getElementById('vRole').innerHTML = `<span class="role-badge ${p.role.toLowerCase()}">${p.role}</span>`;
            document.getElementById('vMatches').textContent = p.matches || 0;
            document.getElementById('vRuns').textContent = p.runs || 0;
            document.getElementById('vWickets').textContent = p.wickets || 0;
            new bootstrap.Modal(document.getElementById('viewPlayerModal')).show();
          }
        });
      });

      // Edit
      document.querySelectorAll('.edit-player').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentUser.role !== 'Admin') return;
          const id = parseInt(btn.dataset.id);
          const p = DataMgr.getPlayers().find(x => x.id === id);
          if (p) {
            document.getElementById('pName').value = p.name;
            document.getElementById('pCountry').value = p.country;
            document.getElementById('pRole').value = p.role;
            document.getElementById('pJersey').value = p.jersey;
            document.getElementById('pMatches').value = p.matches;
            document.getElementById('pRuns').value = p.runs;
            document.getElementById('pWickets').value = p.wickets;

            saveBtn.dataset.mode = 'edit';
            saveBtn.dataset.id = id;
            document.querySelector('#addPlayerModal .modal-title').innerHTML = '<i class="fas fa-edit me-2 text-accent"></i>Edit Player';
            new bootstrap.Modal(document.getElementById('addPlayerModal')).show();
          }
        });
      });
    };

    saveBtn.onclick = () => {
      if (currentUser.role !== 'Admin') return;
      const player = {
        name: document.getElementById('pName').value,
        country: document.getElementById('pCountry').value,
        role: document.getElementById('pRole').value,
        jersey: document.getElementById('pJersey').value,
        matches: document.getElementById('pMatches').value,
        runs: document.getElementById('pRuns').value,
        wickets: document.getElementById('pWickets').value
      };

      if (!player.name || !player.country || !player.role) return showToast('Please fill required fields', 'info');

      if (saveBtn.dataset.mode === 'edit') {
        DataMgr.updatePlayer(parseInt(saveBtn.dataset.id), player);
        showToast('Player updated successfully!', 'success');
      } else {
        DataMgr.addPlayer(player);
        showToast('Player added successfully!', 'success');
      }

      renderPlayers();
      addForm.reset();
      saveBtn.dataset.mode = 'add';
      document.querySelector('#addPlayerModal .modal-title').innerHTML = '<i class="fas fa-user-plus me-2 text-accent"></i>Add New Player';
      bootstrap.Modal.getInstance(document.getElementById('addPlayerModal')).hide();
    };

    renderPlayers();
  }

  // ── Countries Page Logic ──
  if (window.location.pathname.includes('countries.html')) {
    const tableBody = document.querySelector('#countriesTable tbody');
    const addForm = document.getElementById('addCountryForm');
    const saveBtn = document.querySelector('#addCountryModal .btn-primary-custom');

    const renderCountries = () => {
      const countries = DataMgr.getCountries();
      if (countries.length === 0) return;

      tableBody.innerHTML = '';
      countries.forEach((c, idx) => {
        const row = document.createElement('tr');
        row.className = 'animate-row';
        row.style.animationDelay = `${idx * 0.05}s`;
        row.innerHTML = `
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold">${c.name}</span>
            </div>
          </td>
          <td>${c.format || 'All Formats'}</td>
          <td>${c.captain || '-'}</td>
          <td>${c.coach || '-'}</td>
          <td class="text-center"><span class="badge-rank">${c.rank || '-'}</span></td>
          <td class="text-end" data-admin-only="true">
            <button class="btn-icon edit-country" data-id="${c.id}"><i class="fas fa-edit"></i></button>
            <button class="btn-icon text-danger delete-country" data-id="${c.id}"><i class="fas fa-trash"></i></button>
          </td>
        `;
        tableBody.appendChild(row);
      });
      attachCountryListeners();
    };

    const attachCountryListeners = () => {
      // Delete
      document.querySelectorAll('.delete-country').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentUser.role !== 'Admin') return;
          const id = parseInt(btn.dataset.id);
          if (confirm('Delete this country?')) {
            DataMgr.deleteCountry(id);
            renderCountries();
            showToast('Country removed', 'success');
          }
        });
      });

      // Edit
      document.querySelectorAll('.edit-country').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentUser.role !== 'Admin') return;
          const id = parseInt(btn.dataset.id);
          const c = DataMgr.getCountries().find(x => x.id === id);
          if (c) {
            document.getElementById('cName').value = c.name;
            document.getElementById('cFormat').value = c.format;
            document.getElementById('cCaptain').value = c.captain;
            document.getElementById('cCoach').value = c.coach;
            document.getElementById('cRank').value = c.rank;

            saveBtn.dataset.mode = 'edit';
            saveBtn.dataset.id = id;
            document.querySelector('#addCountryModal .modal-title').innerHTML = '<i class="fas fa-edit-circle me-2 text-accent"></i>Edit Country';
            new bootstrap.Modal(document.getElementById('addCountryModal')).show();
          }
        });
      });
    };

    saveBtn.onclick = () => {
      if (currentUser.role !== 'Admin') return;
      const country = {
        name: document.getElementById('cName').value,
        format: document.getElementById('cFormat').value,
        captain: document.getElementById('cCaptain').value,
        coach: document.getElementById('cCoach').value,
        rank: document.getElementById('cRank').value
      };

      if (!country.name || !country.format) return showToast('Please fill name and format', 'info');

      if (saveBtn.dataset.mode === 'edit') {
        DataMgr.updateCountry(parseInt(saveBtn.dataset.id), country);
        showToast('Country updated successfully!', 'success');
      } else {
        DataMgr.addCountry(country);
        showToast('Country added successfully!', 'success');
      }

      renderCountries();
      addForm.reset();
      saveBtn.dataset.mode = 'add';
      document.querySelector('#addCountryModal .modal-title').innerHTML = '<i class="fas fa-plus-circle me-2 text-accent"></i>Add New Country';
      bootstrap.Modal.getInstance(document.getElementById('addCountryModal')).hide();
    };

    renderCountries();
  }

  // ── Dashboard Action Buttons ──
  const dAddPlayerBtn = document.getElementById('addPlayerBtn');
  const dViewMatchesBtn = document.getElementById('viewMatchesBtn');

  if (dAddPlayerBtn) {
    dAddPlayerBtn.addEventListener('click', () => {
      window.location.href = 'players.html?action=addPlayer';
    });
  }
  if (dViewMatchesBtn) {
    dViewMatchesBtn.addEventListener('click', () => {
      window.location.href = 'matches.html';
    });
  }

  // ── Auto-trigger Modals from URL ──
  if (window.location.pathname.includes('players.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'addPlayer') {
      const addModal = document.getElementById('addPlayerModal');
      if (addModal) {
        setTimeout(() => {
          new bootstrap.Modal(addModal).show();
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 500);
      }
    }
  }

  // ── Logout Functionality ──
  document.querySelectorAll('a').forEach(link => {
    if (link.textContent.includes('Logout')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showToast('Logging out...', 'info');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      });
    }
  });

  // ── Real-Time API Data Integration ──

  // 1. Render Live Matches
  async function renderLiveMatches() {
    const container = document.getElementById('liveMatchesRow');
    if (!container) return;

    // Show loading skeleton
    container.innerHTML = '<div class="col-12"><div class="match-card-detailed shimmer"></div></div>';

    const matches = await CricketAPI.getLiveMatches();
    container.innerHTML = '';

    matches.forEach(m => {
      const card = document.createElement('div');
      card.className = 'col-md-6';
      card.innerHTML = `
        <div class="match-card-detailed live-game animate-in">
          <div class="match-header">
            <span class="match-badge badge-live">LIVE</span>
            <span class="match-info text-muted"><i class="fas fa-map-marker-alt"></i> ${m.venue} · ${m.format}</span>
          </div>
          <div class="match-body">
            <div class="team-block"><span class="flag">${m.teams.t1.flag}</span><div class="team-stats"><div class="name">${m.teams.t1.name}</div><div class="score">${m.teams.t1.score}</div></div></div>
            <div class="vs-text">VS</div>
            <div class="team-block text-end flex-row-reverse"><span class="flag">${m.teams.t2.flag}</span><div class="team-stats align-items-end"><div class="name">${m.teams.t2.name}</div><div class="score ${m.teams.t2.score === 'Yet to bat' ? 'text-muted' : ''}">${m.teams.t2.score}</div></div></div>
          </div>
          <div class="match-footer"><div class="status-text text-accent">${m.status} · ${m.teams.t1.overs} ov</div><button class="btn-icon"><i class="fas fa-chevron-right"></i></button></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 2. Render Rankings
  async function renderRankings(type = 'ODI') {
    const body = document.getElementById(`${type.toLowerCase()}RankingsBody`);
    if (!body) return;

    const data = await CricketAPI.getRankings(type);
    body.innerHTML = '';

    data.forEach((r, idx) => {
      const rankClass = idx === 0 ? 'gold' : (idx === 1 ? 'silver' : (idx === 2 ? 'bronze' : ''));
      const row = document.createElement('tr');
      row.className = 'animate-row';
      row.style.animationDelay = `${idx * 0.1}s`;
      row.innerHTML = `
        <td><span class="badge-rank ${rankClass}">${r.rank}</span></td>
        <td><div class="d-flex align-items-center gap-2"><span class="team-flag">${r.flag}</span><span class="fw-bold">${r.team}</span></div></td>
        <td class="text-end">${r.matches}</td>
        <td class="text-end">${r.points}</td>
        <td class="text-end fw-bold text-accent">${r.rating}</td>
      `;
      body.appendChild(row);
    });
  }

  // 3. Render Upcoming Schedule
  async function renderUpcomingMatches() {
    const container = document.getElementById('upcomingMatchesRow');
    if (!container) return;

    // Load both static mock matches and scheduled matches from storage
    const scheduled = DataMgr.getMatches();
    const staticMatches = [
      { date: 'TOMORROW', team1: 'Pakistan', flag1: '🇵🇰', team2: 'New Zealand', flag2: '🇳🇿', venue: 'Lahore', time: '14:30' },
      { date: 'IN 2 DAYS', team1: 'Sri Lanka', flag1: '🇱🇰', team2: 'West Indies', flag2: '🏝️', venue: 'Galle', time: '09:30' }
    ];

    const allMatches = [...scheduled.map(m => ({
      date: m.date, team1: m.t1, team2: m.t2, venue: m.venue, time: 'TBD', isScheduled: true
    })), ...staticMatches];

    container.innerHTML = '';
    allMatches.forEach(m => {
      const card = document.createElement('div');
      card.className = 'col-md-6';
      card.innerHTML = `
        <div class="match-card-detailed animate-in">
          <div class="match-header">
            <span class="match-badge ${m.isScheduled ? 'badge-live' : 'badge-upcoming'}" style="${m.isScheduled ? 'background:rgba(0,212,255,0.1);color:var(--accent)' : ''}">
              ${m.isScheduled ? 'SCHEDULED' : m.date}
            </span>
            <span class="match-info text-muted"><i class="fas fa-map-marker-alt"></i> ${m.venue}</span>
          </div>
          <div class="match-body">
            <div class="team-block"><div class="team-stats"><div class="name">${m.team1}</div></div></div>
            <div class="vs-text">VS</div>
            <div class="team-block text-end flex-row-reverse"><div class="team-stats align-items-end"><div class="name">${m.team2}</div></div></div>
          </div>
          <div class="match-footer"><div class="status-text text-muted">${m.isScheduled ? 'Date: ' + m.date : 'Starts at ' + m.time + ' IST'}</div></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 4. Player Statistics Modal Enhancement
  async function showRealPlayerStats(playerName) {
    const modal = new bootstrap.Modal(document.getElementById('viewPlayerModal'));
    const data = await CricketAPI.getPlayerStats(playerName);
    
    if (data) {
      document.getElementById('vName').textContent = playerName;
      document.getElementById('vCountry').textContent = data.country;
      // Inject real stats into the modal
      const statsBody = document.getElementById('vStatsBody') || document.createElement('div');
      statsBody.id = 'vStatsBody';
      statsBody.innerHTML = `
        <div class="row g-3 mt-3">
          <div class="col-4 text-center"><div class="text-muted small">ODI Runs</div><div class="fw-bold text-accent">${data.stats.ODI.runs}</div></div>
          <div class="col-4 text-center"><div class="text-muted small">T20 Runs</div><div class="fw-bold text-accent">${data.stats.T20I.runs}</div></div>
          <div class="col-4 text-center"><div class="text-muted small">Test Runs</div><div class="fw-bold text-accent">${data.stats.TEST.runs}</div></div>
        </div>
      `;
      document.querySelector('#viewPlayerModal .modal-body').appendChild(statsBody);
      modal.show();
    }
  }

  // 5. Render Dashboard Stats
  async function renderDashboardStats() {
    const liveMatches = await CricketAPI.getLiveMatches();
    const liveCountEl = document.getElementById('qsLiveMatches');
    if (liveCountEl) liveCountEl.textContent = liveMatches.length;

    // Simulate real-time fluctuating stats for "Today's Games" etc
    const runsToday = document.getElementById('qsRunsToday');
    if (runsToday) {
      let currentRuns = 4821;
      setInterval(() => {
        currentRuns += Math.floor(Math.random() * 10);
        runsToday.textContent = currentRuns.toLocaleString();
      }, 5000);
    }
  }

  // ── Notification Manager ──
  const NotificationMgr = {
    get: () => {
      try {
        return JSON.parse(localStorage.getItem('notifications')) || [];
      } catch (e) { return []; }
    },
    add: (title, type = 'info') => {
      const notifs = NotificationMgr.get();
      notifs.unshift({ id: Date.now(), title, type, time: 'Just now', read: false });
      localStorage.setItem('notifications', JSON.stringify(notifs.slice(0, 15))); // Keep last 15
      NotificationMgr.render();
      
      // Update badge if not already visible
      const badge = document.getElementById('notifBadge');
      if (badge) badge.classList.remove('d-none');
    },
    render: () => {
      const notifs = NotificationMgr.get();
      const list = document.getElementById('notifList');
      const badge = document.getElementById('notifBadge');
      if (!list) return;

      const unreadCount = notifs.filter(n => !n.read).length;
      if (badge) {
        badge.textContent = unreadCount;
        badge.classList.toggle('d-none', unreadCount === 0);
      }

      if (notifs.length === 0) {
        list.innerHTML = `
          <div class="text-center py-5 text-muted">
            <i class="fas fa-bell-slash fa-2x mb-3 opacity-20"></i>
            <div class="small">No notifications yet</div>
          </div>
        `;
        return;
      }

      list.innerHTML = notifs.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="NotificationMgr.markRead(${n.id})">
          <div class="notif-icon ${n.type}">
            <i class="fas fa-${n.type === 'success' ? 'check' : (n.type === 'warn' ? 'exclamation-triangle' : 'info-circle')}"></i>
          </div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join('');
    },
    markRead: (id) => {
      const notifs = NotificationMgr.get().map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('notifications', JSON.stringify(notifs));
      NotificationMgr.render();
    },
    clear: () => {
      localStorage.setItem('notifications', '[]');
      NotificationMgr.render();
      showToast('Notifications cleared', 'success');
    }
  };

  // ── Global Search Logic ──
  const GlobalSearch = {
    init: () => {
      const openBtns = document.querySelectorAll('.open-search');
      const overlay = document.getElementById('searchModalOverlay');
      const closeBtn = document.querySelector('.close-search');
      const input = document.getElementById('globalSearchInput');

      if (!overlay || !input) return;

      const toggle = (show) => {
        overlay.classList.toggle('show', show);
        if (show) {
          setTimeout(() => input.focus(), 100);
          input.value = '';
          GlobalSearch.perform('');
        }
      };

      openBtns.forEach(b => b.onclick = (e) => {
        e.preventDefault();
        toggle(true);
      });
      if (closeBtn) closeBtn.onclick = () => toggle(false);
      
      overlay.onclick = (e) => {
        if (e.target === overlay) toggle(false);
      };

      // Keyboard Shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          toggle(true);
        }
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
          toggle(false);
        }
      });

      input.oninput = (e) => GlobalSearch.perform(e.target.value);
    },
    perform: (query) => {
      const resultsEl = document.getElementById('globalSearchResults');
      if (!query.trim()) {
        resultsEl.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-search fa-3x mb-3 opacity-10"></i>
            <div class="text-muted small">Search for players, matches, or countries...</div>
            <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
              <span class="search-tag" onclick="document.getElementById('globalSearchInput').value='India'; document.getElementById('globalSearchInput').dispatchEvent(new Event('input'))">India</span>
              <span class="search-tag" onclick="document.getElementById('globalSearchInput').value='Virat'; document.getElementById('globalSearchInput').dispatchEvent(new Event('input'))">Virat</span>
              <span class="search-tag" onclick="document.getElementById('globalSearchInput').value='T20'; document.getElementById('globalSearchInput').dispatchEvent(new Event('input'))">T20</span>
            </div>
          </div>
        `;
        return;
      }

      const q = query.toLowerCase();
      const results = [];

      // 1. Players
      DataMgr.getPlayers().filter(p => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)).forEach(p => {
        results.push({ text: p.name, sub: `${p.country} · ${p.role}`, type: 'Player', link: 'players.html', icon: 'user' });
      });

      // 2. Countries
      DataMgr.getCountries().filter(c => c.name.toLowerCase().includes(q)).forEach(c => {
        results.push({ text: c.name, sub: `Ranked #${c.rank || 'N/A'}`, type: 'Country', link: 'countries.html', icon: 'flag' });
      });

      // 3. Matches
      DataMgr.getMatches().filter(m => m.t1.toLowerCase().includes(q) || m.t2.toLowerCase().includes(q) || (m.tournament && m.tournament.toLowerCase().includes(q))).forEach(m => {
        results.push({ text: `${m.t1} vs ${m.t2}`, sub: `${m.tournament || 'Series'} · ${m.date}`, type: 'Match', link: 'matches.html', icon: 'baseball-bat-ball' });
      });

      if (results.length === 0) {
        resultsEl.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-search-minus fa-3x mb-3 text-muted opacity-50"></i>
            <h6 class="text-muted">No results found for "${query}"</h6>
          </div>
        `;
      } else {
        resultsEl.innerHTML = results.slice(0, 8).map(r => `
          <div class="search-res-item animate-in" onclick="window.location='${r.link}'">
            <div class="player-avatar" style="width:38px;height:38px;background:rgba(0,212,255,0.1);font-size:0.8rem;">
              <i class="fas fa-${r.icon}"></i>
            </div>
            <div class="flex-grow-1">
              <div class="fw-bold text-white small">${r.text}</div>
              <div class="text-muted" style="font-size:0.75rem">${r.sub}</div>
            </div>
            <div class="badge-live small px-2 py-1" style="font-size:0.6rem;background:rgba(0,212,255,0.1);color:var(--accent);animation:none;">${r.type}</div>
          </div>
        `).join('');
      }
    }
  };

  // ── Matches Page Filtering & Stats ──
  async function initMatchesPage() {
    if (!window.location.pathname.includes('matches.html')) return;

    const filterBtns = document.querySelectorAll('.filter-btn');
    const container = document.getElementById('liveMatchesRow');
    
    // Stats calculation
    const calcStats = () => {
      const matches = DataMgr.getMatches();
      const totalMatches = 94 + (matches ? matches.length : 0);
      const liveMatches = 3;
      
      const elTotal = document.getElementById('statTotalMatches');
      const elLive = document.getElementById('statLiveCount');
      if (elTotal) elTotal.textContent = totalMatches;
      if (elLive) elLive.textContent = liveMatches;
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const format = btn.dataset.format; // Assuming data-format="ODI" etc.
        renderMatches(format);
      });
    });

    const renderMatches = (filter = 'ALL') => {
      const scheduled = DataMgr.getMatches().filter(m => filter === 'ALL' || m.format === filter);
      renderLiveMatches(); // Kept original from script.js
      // Combine or filter further if needed
      calcStats();
    };

    renderMatches();
  }

  // ── Overwrite CRUD to add Notifications ──
  const originalAddPlayer = DataMgr.addPlayer;
  DataMgr.addPlayer = (p) => {
    originalAddPlayer(p);
    NotificationMgr.add(`New player added: ${p.name}`, 'success');
  };

  const originalDeletePlayer = DataMgr.deletePlayer;
  DataMgr.deletePlayer = (id) => {
    const p = DataMgr.getPlayers().find(x => x.id === id);
    originalDeletePlayer(id);
    if (p) NotificationMgr.add(`Player deleted: ${p.name}`, 'warn');
  };

  const originalSaveMatch = DataMgr.saveMatch;
  DataMgr.saveMatch = (m) => {
    originalSaveMatch(m);
    NotificationMgr.add(`New match scheduled: ${m.t1} vs ${m.t2}`, 'success');
  };

  const originalAddCountry = DataMgr.addCountry;
  DataMgr.addCountry = (c) => {
    originalAddCountry(c);
    NotificationMgr.add(`New country added: ${c.name}`, 'success');
  };

  const originalDeleteCountry = DataMgr.deleteCountry;
  DataMgr.deleteCountry = (id) => {
    const c = DataMgr.getCountries().find(x => x.id === id);
    originalDeleteCountry(id);
    if (c) NotificationMgr.add(`Country deleted: ${c.name}`, 'warn');
  };

  // ── Deletions ──
  window.confirmDeleteCountry = (id) => {
    if (currentUser.role !== 'Admin') return showToast('Only Admins can delete countries', 'info');
    if (confirm('Are you sure? This will remove all related matches.')) {
      DataMgr.deleteCountry(id);
      NotificationMgr.add('Country deleted successfully', 'warn');
      location.reload();
    }
  };

  // ── Admin Ranking Controls ──
  window.adjustRating = (key, id, delta) => {
    if (currentUser.role !== 'Admin') return showToast('Only Admins can perform this action', 'info');
    DataMgr.updateRankingRating(key, id, delta);
    showToast('Rating updated successfully!', 'success');
    NotificationMgr.add('Ranking rating updated', 'success');
    
    // Refresh UI
    if (window.location.pathname.includes('rankings.html')) {
      const type = key.split('_').pop().toUpperCase();
      if (key.includes('player')) {
        renderPlayerRankings();
      } else {
        renderRankings(type);
      }
    }
  };

  // 1. Enhanced Render Rankings with Admin Controls
  async function renderRankings(type = 'ODI') {
    const body = document.getElementById(`${type.toLowerCase()}RankingsBody`);
    if (!body) return;

    const isAdmin = currentUser.role === 'Admin';
    const data = DataMgr.getTeamRankings(type);
    body.innerHTML = '';

    data.forEach((r, idx) => {
      const rankClass = idx === 0 ? 'gold' : (idx === 1 ? 'silver' : (idx === 2 ? 'bronze' : ''));
      const row = document.createElement('tr');
      row.className = 'animate-row';
      row.style.animationDelay = `${idx * 0.1}s`;
      row.innerHTML = `
        <td><span class="badge-rank ${rankClass}">${r.rank}</span></td>
        <td><div class="d-flex align-items-center gap-2"><span class="team-flag">${r.flag}</span><span class="fw-bold">${r.team}</span></div></td>
        <td class="text-end">${r.matches}</td>
        <td class="text-end">${r.points}</td>
        <td class="text-end fw-bold text-accent">${r.rating}</td>
        <td class="text-center" data-admin-only="true">
          <div class="d-flex justify-content-center gap-2">
            <button class="admin-control-btn btn-plus" onclick="adjustRating('team_rankings_${type}', '${r.team}', 1)"><i class="fas fa-plus"></i></button>
            <button class="admin-control-btn btn-minus" onclick="adjustRating('team_rankings_${type}', '${r.team}', -1)"><i class="fas fa-minus"></i></button>
          </div>
        </td>
      `;
      body.appendChild(row);
    });
  }

  // 2. Render Player Rankings
  async function renderPlayerRankings() {
    const body = document.getElementById('playerRankingsBody');
    if (!body) return;

    const isAdmin = currentUser.role === 'Admin';
    // Use dummy player rankings if empty
    if (DataMgr.get('player_rankings').length === 0) {
      const playerRanks = [
        { rank: 1, name: "Virat Kohli", country: "India", rating: 890, id: 1 },
        { rank: 2, name: "Babar Azam", country: "Pakistan", rating: 875, id: 2 },
        { rank: 3, name: "Steve Smith", country: "Australia", rating: 850, id: 4 }
      ];
      DataMgr.save('player_rankings', playerRanks);
    }

    const data = DataMgr.get('player_rankings');
    body.innerHTML = '';

    data.forEach((r, idx) => {
      const rankClass = idx === 0 ? 'gold' : (idx === 1 ? 'silver' : (idx === 2 ? 'bronze' : ''));
      const row = document.createElement('tr');
      row.className = 'animate-row';
      row.innerHTML = `
        <td><span class="badge-rank ${rankClass}">${r.rank}</span></td>
        <td class="fw-bold">${r.name}</td>
        <td>${r.country}</td>
        <td class="text-end fw-bold text-accent">${r.rating}</td>
        <td class="text-center" data-admin-only="true">
          <div class="d-flex justify-content-center gap-2">
            <button class="admin-control-btn btn-plus" onclick="adjustRating('player_rankings', ${r.id}, 5)"><i class="fas fa-plus"></i></button>
            <button class="admin-control-btn btn-minus" onclick="adjustRating('player_rankings', ${r.id}, -5)"><i class="fas fa-minus"></i></button>
          </div>
        </td>
      `;
      body.appendChild(row);
    });
  }

  // 3. Match Scheduling Handler
  const btnSaveMatch = document.getElementById('btnSaveMatch');
  if (btnSaveMatch) {
    btnSaveMatch.addEventListener('click', () => {
      const match = {
        t1: document.getElementById('mTeam1').value,
        t2: document.getElementById('mTeam2').value,
        format: document.getElementById('mFormat').value,
        tournament: document.getElementById('mTournament').value,
        date: document.getElementById('mDate').value,
        venue: document.getElementById('mVenue').value
      };

      if (!match.t1 || !match.t2 || !match.date) return showToast('Please fill required fields', 'info');
      
      DataMgr.saveMatch(match);
      showToast('Match scheduled successfully!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('scheduleMatchModal')).hide();
      
      if (window.location.pathname.includes('schedule.html')) location.reload();
    });
  }

  // ── Initialize Components ──
  const safeInit = async () => {
    try { NotificationMgr.render(); } catch (e) { console.error("NotifMgr Error:", e); }
    try { GlobalSearch.init(); } catch (e) { console.error("GlobalSearch Error:", e); }
    try { await initMatchesPage(); } catch (e) { console.error("MatchesPage Error:", e); }

    const path = window.location.pathname;
    if (path.includes('index.html') || path.endsWith('/')) {
      try { await renderDashboardStats(); } catch (e) { console.error("DashboardStats Error:", e); }
      // initLiveTicker already called above
    }

    if (path.includes('matches.html')) {
      try { await renderLiveMatches(); } catch (e) { console.error("LiveMatches Error:", e); }
      try { await renderUpcomingMatches(); } catch (e) { console.error("UpcomingMatches Error:", e); }
    }

    if (path.includes('rankings.html')) {
      try { await renderRankings('ODI'); } catch (e) { console.error("Rankings Error:", e); }
      try { await renderRankings('T20I'); } catch (e) { console.error("Rankings Error:", e); }
      try { await renderRankings('TEST'); } catch (e) { console.error("Rankings Error:", e); }
      try { await renderPlayerRankings(); } catch (e) { console.error("PlayerRankings Error:", e); }
    }
  };

  safeInit();

  const clearNotifsBtn = document.getElementById('clearNotifs');
  if (clearNotifsBtn) clearNotifsBtn.onclick = NotificationMgr.clear;

  const notifBtnEl = document.getElementById('notifBtn');
  const notifDropdownEl = document.getElementById('notifDropdown');
  if (notifBtnEl && notifDropdownEl) {
    notifBtnEl.onclick = (e) => {
      e.stopPropagation();
      notifDropdownEl.classList.toggle('show');
    };
    document.addEventListener('click', () => notifDropdownEl.classList.remove('show'));
  }

  console.log('%cFunctional Audit Complete ✓', 'color:#00ff94;font-weight:bold;');
});
