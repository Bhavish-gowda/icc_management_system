// ── ICC Cricket Management System — script.js ──

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
  setTimeout(() => toast.remove(), 3000);
}

// ── Page Loader ──
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

document.addEventListener('DOMContentLoaded', () => {

  // ── Sidebar toggle ──
  const sidebar        = document.getElementById('sidebar');
  const overlay        = document.getElementById('sidebarOverlay');
  const toggleBtns     = document.querySelectorAll('.sidebar-toggle');
  const mainContent    = document.getElementById('mainContent');

  function openSidebar()  { sidebar.classList.add('open');    overlay.style.display = 'block'; }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.style.display = 'none';  }

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

  // ── Active nav link (visual only, no preventDefault so real links work) ──
  const navLinks = document.querySelectorAll('.sidebar-link[data-page], .nav-link-custom[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) closeSidebar();
    });
  });

  // ── Search modal ──
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');

  function openSearch()  { searchModal.classList.add('open'); setTimeout(() => searchInput?.focus(), 100); }
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

  // ── Dark/Light toggle ──
  const themeToggle = document.getElementById('themeToggle');
  let isDark = true;
  themeToggle?.addEventListener('click', () => {
    isDark = !isDark;
    if (!isDark) {
      document.documentElement.style.setProperty('--primary', '#f0f4f8');
      document.documentElement.style.setProperty('--secondary', '#ffffff');
      document.documentElement.style.setProperty('--text', '#1b2a3b');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255,255,255,0.8)');
      document.documentElement.style.setProperty('--gradient', 'linear-gradient(135deg, #e0f4ff 0%, #f0f4f8 100%)');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      showToast('Light mode enabled', 'success');
    } else {
      document.documentElement.style.setProperty('--primary', '#0d1b2a');
      document.documentElement.style.setProperty('--secondary', '#1b2a3b');
      document.documentElement.style.setProperty('--text', '#e0f4ff');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255,255,255,0.05)');
      document.documentElement.style.setProperty('--gradient', 'linear-gradient(135deg, #0d1b2a 0%, #0a2640 50%, #0d2b45 100%)');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      showToast('Dark mode enabled', 'info');
    }
  });

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

  console.log('%cICC Cricket Management System', 'color:#00d4ff;font-size:18px;font-weight:bold;');
  console.log('%cFrontend loaded successfully ✓', 'color:#00ff94;font-size:13px;');
});
