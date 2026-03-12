<div align="center">


# ✈️ Jadoo — Travel & Discover

**A fully responsive, multi-page travel web application built with vanilla HTML, CSS, and JavaScript.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-f1a501?style=for-the-badge)](https://mark-atef.github.io/Landing-Page-Project/)
[![Repository](https://img.shields.io/badge/📁_Repository-GitHub-14183e?style=for-the-badge)](https://github.com/Mark-Atef/Landing-Page-Project)
[![License](https://img.shields.io/badge/📄_License-Educational-df6951?style=for-the-badge)](#license)

</div>

---

## 👤 Author

**Mark Atef Awad Yacoub**
— Built during the **Web Masters Front-End Training Program** · Phase 2

---

## 🌍 Project Overview

Jadoo is a **full-featured, multi-page travel web application** that allows users to explore destinations, search for hotels and flights, and manage their trip bookings — all from a clean, modern interface that works beautifully across every screen size.

What began as a responsive landing page in Phase 1 has been completely re-engineered into a **production-grade frontend application**, incorporating JavaScript-driven interactivity, a dark mode system, simulated authentication, a payment flow, and a personal bookings dashboard.

---

## 📄 Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page — Hero, Services, Top Destinations, Trip Steps, Testimonials, Newsletter |
| `destinations.html` | Browse & filter destinations with search, sorting, and category chips |
| `hotels.html` | Hotel search with filter sidebar, card grid/list toggle, and room detail modal |
| `flights.html` | Flight search with route display, stops filter, airline filter, and price sort |
| `bookings.html` | Personal dashboard — Upcoming Trips, Past Trips, Favourites, and Profile settings |

---

## 🚀 Technologies Used

### Core
- **HTML5** — Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`)
- **CSS3** — Custom Properties, Flexbox, CSS Grid, `clamp()`, `backdrop-filter`, CSS animations
- **Vanilla JavaScript (ES6+)** — Classes, `async/await`, `IntersectionObserver`, `localStorage`, DOM manipulation

### Tooling & Libraries
- **Font Awesome 6** — Icon library for UI icons
- **Google Fonts — Volkhov** — Serif display font for headings
- **CSS Custom Properties (Design Tokens)** — Centralised colour, spacing, and typography system in `variables.css`

---

## ✨ Features

### 🎨 UI & Design
- **Dark Mode** — Full dark theme with toggle switch, persisted in `localStorage`
- **Smooth Scroll Animations** — `.reveal` utility class with `IntersectionObserver` fade-in-up effect
- **Animated Hero** — Floating plane animations and responsive traveller image
- **Professional Card Design** — Hover lifts, image zoom, coloured shadows, gradient badges
- **Scroll-to-Top Button** — Appears on scroll with a smooth fade-in animation

### 📱 Responsive Design
- **Mobile-first breakpoints** — Tested across 320px, 375px, 576px, 768px, 991px, 1200px+
- **Hamburger Menu** — Slide-in mobile navigation with overlay and focus trap
- **Adaptive Layouts** — Grid/Flexbox reflow for every section across all screen widths

### 🔍 Search & Filter
- **Destination Search** — Filter by name, date, and traveller count
- **Hotel Filters** — Price range slider, star rating, amenities, guest score
- **Flight Filters** — Price, stops, airline, departure time
- **Sort Controls** — Sort by price, rating, popularity, or duration
- **Grid / List View Toggle** — Switch between card grid and list layout (hotels & destinations)

### 🗓️ Bookings Dashboard
- **Stats Overview** — Live counts of upcoming trips, total trips, and total spent
- **Trip Cards** — Status badges (Confirmed / Pending / Completed), progress bars, days-to-go
- **Trip Detail Modal** — Full itinerary breakdown with download and calendar actions
- **Favourites Tab** — Saved destinations with quick-book buttons
- **Profile Management** — Editable personal info, payment methods, and preferences (currency, language, notifications)

### 🔐 Authentication & Payment
- **Login / Sign-Up Modal** — Email & password form with Google / Facebook social buttons
- **Session Persistence** — User state saved in `localStorage` and reflected across pages
- **Payment Modal** — Order summary, card input form, and simulated payment processing
- **Notification Toasts** — Success / Error / Info banners for all user actions

### 🌐 Internationalisation
- **EN / AR Language Toggle** — Switches navigation and key UI text; applies `dir="rtl"` to the document
- **RTL Support** — Navbar, hero, and footer reflow correctly in Arabic layout

---

## 🗂️ Project Structure

```
jadoo/
│
├── index.html                        ← Landing page
├── destinations.html                 ← Destinations browser
├── hotels.html                       ← Hotel search
├── flights.html                      ← Flight search
├── bookings.html                     ← Personal dashboard
│
├── css/
│   ├── variables.css                 ← Design tokens (colours, spacing, typography)
│   ├── styles.css                    ← Global styles, navbar, hero, all index sections
│   ├── mobile.css                    ← Hamburger menu, scroll-to-top, loader, media queries
│   ├── Authentication_Payment_Modal.css  ← Auth modal, payment modal, toast notifications
│   ├── destinations.css              ← Destinations page styles
│   ├── hotels.css                    ← Hotels page styles
│   ├── flights.css                   ← Flights page styles
│   └── bookings.css                  ← Dashboard styles
│
├── js/
│   ├── main.js                       ← App init, dark mode, language, auth, API, payment
│   ├── mobile.js                     ← Hamburger menu, scroll-to-top, lazy loading, performance
│   ├── destinations.js               ← Destinations page logic
│   ├── hotels.js                     ← Hotels page logic
│   ├── flights.js                    ← Flights page logic
│   └── bookings.js                   ← Dashboard logic
│
├── images/                           ← All static image assets
│   ├── Traveller 1.png
│   ├── Decore.png
│   ├── plane.png
│   ├── Rectangle 14.png / .jpg
│   ├── Rectangle 14 (1).png
│   ├── Rectangle 17.jpg
│   ├── Mask Group.png
│   ├── Image.png
│   ├── Google Play.png
│   ├── Play Store.png
│   ├── Group 48.png / 50.png / 77.png
│   ├── power-supply 1.png
│   └── download.ico
│
└── README.md
```

---

## 🏗️ Architecture

### JavaScript Module Pattern
Each page has a dedicated JS class that encapsulates all its logic:

```
window.jadooApp (JadooApp)
├── navbarScroll  (NavbarScroll)   — scroll-based navbar style
├── darkMode      (DarkMode)       — theme toggle + localStorage
├── language      (LanguageManager)— EN/AR switcher + RTL
├── auth          (AuthManager)    — login/signup modals + session
├── api           (APIManager)     — mock data endpoints
└── payment       (PaymentManager) — payment modal + booking save

DestinationsPage  — destinations.js (standalone class)
HotelsPage        — hotels.js       (standalone class)
FlightsPage       — flights.js      (standalone class)
BookingsPage      — bookings.js     (standalone class)
```

### CSS Architecture
```
variables.css  →  Design tokens only (no rules)
     ↓
styles.css     →  Global reset + shared components + all index.html sections
     ↓
mobile.css     →  Utility classes + responsive breakpoints (320px → 1200px+)
     ↓
[page].css     →  Page-specific styles that extend the global system
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target | Behaviour |
|------------|--------|-----------|
| `≤ 575px` | Small phones | Single column, stacked nav, simplified hero |
| `576–730px` | Large phones | Two-column cards, side-by-side hero |
| `731–991px` | Tablets | Sidebar hidden, grid collapses, row testimonial |
| `992px–1199px` | Small desktop | Full layout with sidebar |
| `≥ 1200px` | Large desktop | Max-width container, full sidebar, multi-column grids |

---

## 🧠 Key Lessons Learned

### From Phase 1 → Phase 2 Growth

| Phase 1 | Phase 2 |
|---------|---------|
| HTML + CSS only | HTML + CSS + JavaScript |
| Single page | 5 interconnected pages |
| Static layout | Dynamic, data-driven UI |
| Basic responsiveness | Mobile-first with tested breakpoints |
| No interactivity | Auth, payment, dark mode, filtering, sorting |
| Inline colours | Full CSS Custom Properties design system |

### Technical Skills Gained
- **Class-based JavaScript** — Encapsulating features into reusable, maintainable classes
- **DOM manipulation at scale** — Dynamically building card grids, modals, and dashboards from data
- **`localStorage` for state** — Persisting user sessions, dark mode, bookings, and favourites
- **`IntersectionObserver`** — Scroll-triggered animations and lazy image loading without jQuery
- **CSS `clamp()`** — Fluid typography that scales between min and max without breakpoints
- **`backdrop-filter`** — Glassmorphism effects on stat cards and modals
- **Accessible markup** — ARIA labels, focus management, keyboard navigation, `prefers-reduced-motion`
- **Component thinking** — Designing shared components (cards, modals, filters) reused across pages

---

## ▶️ How to Run

No build tools, no dependencies, no installation required.

```bash
# 1. Clone the repository
git clone https://github.com/Mark-Atef/Landing-Page-Project.git

# 2. Open in your browser — that's it
open index.html
```

> **Tip:** For the best experience, open with a local server (e.g. VS Code **Live Server** extension) to avoid any browser restrictions on local file access.

---

## 🔗 Links

| | |
|--|--|
| 🌐 **Live Demo** | [mark-atef.github.io/Landing-Page-Project](https://mark-atef.github.io/Landing-Page-Project/) |
| 📁 **Repository** | (https://github.com/Mark-Atef/Jadoo-Travel.git) |

---

## 📬 Contact

Feel free to reach out for feedback, collaboration, or questions:

| Platform | Link |
|----------|------|
| 📧 Email | [yacoub.markatef@gmail.com](mailto:yacoub.markatef@gmail.com) |
| 💼 LinkedIn | [linkedin.com/in/mark-yacoub-005711255](https://www.linkedin.com/in/mark-yacoub-005711255) |
| 🐙 GitHub | [github.com/Mark-Atef](https://github.com/Mark-Atef) |

---

## 🎓 Training Programme

This project was developed as part of the **Web Masters Front-End Development Training Programme**, a professional programme focused on real-world project development and industry-standard practices.

- **Phase 1** — Responsive landing page with HTML5 and CSS3
- **Phase 2** — Full multi-page application with JavaScript, OOP patterns, and UX design systems

---

## 📄 License

This project is built for **educational purposes** as part of a structured training programme.
You are welcome to reference the code for learning. Please do not redistribute or claim it as your own.

---

<div align="center">

**Thank you for checking out Jadoo! ✈️**

*— Mark Yacoub*

</div>
