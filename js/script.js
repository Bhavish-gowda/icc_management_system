// ── ICC Cricket Management System — script.js ──

// ── Auth Session Check ──
function checkAuth() {
  const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user && !isAuthPage) {
    window.location.href = 'login.html';
  } else if (user && isAuthPage) {
    window.location.href = 'index.html';
  }
  return user;
}

const currentUser = checkAuth();

// ── Centralized Data Management ──
const DataMgr = {
  get: (key) => JSON.parse(localStorage.getItem(key)) || [],
  save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

  // Players
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

  // Countries
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
  }
};

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

// ── Live Match Ticker Logic ──
function initLiveTicker() {
  const ticker = document.getElementById('liveTicker');
  if (!ticker) return;
  const updates = [
    "IND 287/4 (42.3) vs ENG",
    "Kohli 84* (92) | Shami 3/42",
    "AUS leads by 40 runs vs RSA",
    "Upcoming: PAK vs NZ @ 14:30",
    "Babar 5,421 career runs reached"
  ];
  ticker.style.transition = 'opacity 0.5s ease';
  let i = 0;
  ticker.textContent = updates[0];
  setInterval(() => {
    ticker.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % updates.length;
      ticker.textContent = updates[i];
      ticker.style.opacity = 1;
    }, 500);
  }, 5000);
}

// ── Page Loader ──
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initLiveTicker();

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

  // ── Live match ticker ──
  const liveScores = [
    { home: '🇮🇳 India', away: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', score: '287/4 (42.3 ov)', status: 'LIVE' },
    { home: '🇦🇺 Australia', away: '🇿🇦 South Africa', score: '312/6 (50 ov)', status: 'DONE' },
    { home: '🇵🇰 Pakistan', away: '🇳🇿 New Zealand', score: 'Tomorrow 14:30 IST', status: 'UPCOMING' },
  ];
  let tickerIdx = 0;
  const tickerEl = document.getElementById('liveTicker');
  function updateTicker() {
    if (!tickerEl) return;
    const d = liveScores[tickerIdx];
    tickerEl.innerHTML = `<span class="fw-600">${d.home}</span> vs <span class="fw-600">${d.away}</span> — ${d.score}`;
    tickerIdx = (tickerIdx + 1) % liveScores.length;
  }
  updateTicker();
  setInterval(updateTicker, 4000);

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
    if (heroGreeting) {
      heroGreeting.innerHTML = `&#9679; WELCOME BACK, ${currentUser.role.toUpperCase()}`;
    }

    // Role-based button restriction
    if (currentUser.role === 'Analyst') {
      const restrictedBtns = document.querySelectorAll('[data-bs-target*="Add"], .btn-primary-custom:not(.btn-search-nav), .btn-icon.text-danger');
      restrictedBtns.forEach(btn => {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          showToast('Only Admins can perform this action', 'info');
        }, true);
      });
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
          <td class="text-end">
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
          <td class="text-end">
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

  console.log('%cICC Cricket Management System', 'color:#00d4ff;font-size:18px;font-weight:bold;');
  console.log('%cFrontend loaded successfully ✓', 'color:#00ff94;font-size:13px;');
});
