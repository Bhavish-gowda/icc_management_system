# 🏏 ICC Cricket Management System

A **fully responsive, modern frontend** for managing ICC Cricket data — including players, teams, matches, rankings, and schedules. Built as a DBMS course project using pure HTML, CSS, JavaScript, and Bootstrap 5.

---

## 📸 Screenshots

> Open `index.html` in your browser to view the live dashboard.

---

## 🚀 Features

- ✅ **Dark sports analytics theme** with glassmorphism cards and gradient accents
- ✅ **Fully responsive** — works on mobile, tablet, and desktop
- ✅ **11 connected pages** with shared navbar and sidebar navigation
- ✅ **Live match ticker** on the dashboard
- ✅ **Animated stat counters** and progress bars
- ✅ **Search functionality** with modal overlay (⌘K shortcut)
- ✅ **Dark / Light mode toggle**
- ✅ **Add/Edit modals** for Players, Countries, Matches, and Fixtures
- ✅ **Format filters** on Rankings and Schedule pages
- ✅ **Smooth hover animations** and page transitions
- ✅ **Toast notifications** for user actions
- ✅ **No backend required** — fully static, runs directly in the browser

---

## 📁 Folder Structure

```
dbms project/
│
├── index.html            # Dashboard homepage
├── countries.html        # Countries management page
├── players.html          # Players management page
├── teams.html            # Teams overview page
├── matches.html          # Live matches & recent results
├── rankings.html         # ICC Rankings (ODI / T20I / Test tabs)
├── statistics.html       # Performance analytics & top performers
├── schedule.html         # Match schedule & upcoming fixtures
├── tournaments.html      # ICC Tournaments overview
├── search.html           # Global search results page
├── about.html            # About the project
│
├── css/
│   └── style.css         # All custom styles, theme variables, components
│
└── js/
    └── script.js         # Sidebar, search modal, animations, counters
```

---

## 📄 Pages Overview

| Page | File | Description |
|------|------|-------------|
| Dashboard | `index.html` | Overview stats, live ticker, quick actions |
| Countries | `countries.html` | Country list with search and add modal |
| Players | `players.html` | Player roster with search and filter by country |
| Teams | `teams.html` | National team cards with win rate and stats |
| Matches | `matches.html` | Live scores, upcoming fixtures, recent results |
| Rankings | `rankings.html` | ICC Rankings with ODI / T20I / Test tabs |
| Statistics | `statistics.html` | Season stats, top batsmen & bowlers |
| Schedule | `schedule.html` | Full match schedule with format filter |
| Tournaments | `tournaments.html` | ICC tournament cards and winners |
| Search | `search.html` | Global search results |
| About | `about.html` | Project info and team details |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Custom styles, animations, glassmorphism, dark theme |
| **JavaScript (ES6+)** | Interactivity, search, counters, sidebar toggle |
| **Bootstrap 5.3** | Responsive grid, modals, tables, badges |
| **Font Awesome 6.5** | Icons throughout the UI |
| **Google Fonts (Inter)** | Typography |

---

## ▶️ How to Run

### Option 1 — Open directly (simplest)
Double-click `index.html`, or run in terminal:
```bash
open "index.html"
```

### Option 2 — Python local server
```bash
cd "dbms project"
python3 -m http.server 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

### Option 3 — VS Code Live Server
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Auto-reloads on every file save

> ⚠️ No Node.js, npm, or build tools required. Works out of the box.

---

## 🎨 Design System

### Color Palette
| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#0d1b2a` | Background |
| `--secondary` | `#1b2a3b` | Cards / Sidebar |
| `--accent` | `#00d4ff` | Cyan highlights |
| `--accent2` | `#00ff94` | Green highlights |
| `--text` | `#e0f4ff` | Body text |
| `--muted` | `#7a9ab5` | Secondary text |
| `--border` | `rgba(255,255,255,0.08)` | Card borders |

### Key Components
- `.stat-card` — animated dashboard metric cards
- `.content-card` — glassmorphism data panels
- `.match-card-detailed` — live/upcoming match cards
- `.custom-table` — styled data tables with hover effects
- `.badge-rank` — gold/silver/bronze ranking badges
- `.sidebar-link` — sidebar navigation items
- `.btn-primary-custom` — primary CTA button
- `.search-modal` — full-screen search overlay

---

## 📊 Sample Data Included

### Teams
India, Australia, England, Pakistan, New Zealand, South Africa

### Players
| Player | Country | Role |
|--------|---------|------|
| Virat Kohli | India | Batter |
| Rohit Sharma | India | Batter |
| Babar Azam | Pakistan | Batter |
| Steve Smith | Australia | Batter |
| Kane Williamson | New Zealand | Batter |
| Jasprit Bumrah | India | Bowler |
| Pat Cummins | Australia | Bowler |

### Rankings (ODI)
1. India (Rating: 126)
2. Australia (Rating: 121)
3. England (Rating: 118)
4. New Zealand (Rating: 115)
5. Pakistan (Rating: 112)

---

## 🔧 Customization

### Change the color theme
Edit CSS variables at the top of `css/style.css`:
```css
:root {
  --primary: #0d1b2a;
  --accent: #00d4ff;
  --accent2: #00ff94;
}
```

### Add a new page
1. Copy any existing page (e.g. `about.html`)
2. Update the `<title>` and `<h1>` content
3. Add your new HTML inside `<main class="main-content">`
4. Add a link in the sidebar of all pages

### Add a player row
In `players.html`, inside the `<tbody id="playersTableBody">`:
```html
<tr class="animate-row" data-country="India">
  <td>
    <div class="d-flex align-items-center gap-3">
      <div class="player-avatar">JB</div>
      <span class="fw-bold">Jasprit Bumrah</span>
    </div>
  </td>
  <td><span class="team-flag me-1">🇮🇳</span> India</td>
  <td><span class="role-badge bowler">Bowler</span></td>
  <td class="text-center">93</td>
  <td class="text-end">149</td>
  <td class="text-end fw-bold text-accent">586</td>
  <td class="text-end">149</td>
  <td class="text-end">
    <button class="btn-icon"><i class="fas fa-eye"></i></button>
    <button class="btn-icon"><i class="fas fa-edit"></i></button>
  </td>
</tr>
```

---

## 🗂️ Project Context

This project was built as part of a **Database Management Systems (DBMS)** course assignment. The frontend demonstrates:

- Relational data concepts (Teams → Players, Matches → Teams, Rankings → Teams)
- CRUD UI operations (Create via modals, Read via tables, Update via edit buttons)
- Data filtering and search (client-side JavaScript)
- Normalized data display across multiple interconnected pages

---

## 👨‍💻 Author

**ICC Cricket Management System**
Designed for DBMS Course Project · 2025

---

## 📝 License

This project is for **educational purposes** only.
