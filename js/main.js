// ==========================================
// MAIN.JS - Core functionality for Jadoo Travel Website
// Features: Dark Mode, Multi-language, Auth, API Integration, Navbar scroll
// ==========================================

'use strict';


/* ------ Scroll Reveal (Intersection Observer) ------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Only animate once
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ------ Progress Bar Animation ------ */
const progressFill = document.getElementById('progressFill');
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      progressFill.style.width = '40%';
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (progressFill) progressObserver.observe(progressFill);


// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  apiKeys: {
    flights: 'demo_flight_api_key',
    hotels: 'demo_hotel_api_key',
  },
  apiEndpoints: {
    flights: 'https://api.amadeus.com/v2/shopping/flight-offers',
    hotels: 'https://api.amadeus.com/v3/shopping/hotel-offers',
  },
  languages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: 'USD',
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
const STATE = {
  currentUser: null,
  darkMode: false,
  language: 'en',
  cart: [],
  bookings: [],
};

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
class NavbarScroll {
  constructor() {
    this.init();
  }

  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    console.log('📜 Navbar scroll effect initialized');
  }
}

// ==========================================
// DARK MODE
// ==========================================
class DarkMode {
  constructor() {
    this.init();
  }

  init() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      this.enable();
    }

    this.createToggle();
  }

  createToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.addEventListener('click', () => this.toggle());

    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      navActions.appendChild(toggle);
    }
  }

  enable() {
    document.body.classList.add('dark-mode');
    STATE.darkMode = true;
    localStorage.setItem('darkMode', 'true');
  }

  disable() {
    document.body.classList.remove('dark-mode');
    STATE.darkMode = false;
    localStorage.setItem('darkMode', 'false');
  }

  toggle() {
    if (STATE.darkMode) {
      this.disable();
    } else {
      this.enable();
    }
  }
}

// ==========================================
// MULTI-LANGUAGE SUPPORT
// ==========================================
const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      destinations: 'Destinations',
      hotels: 'Hotels',
      flights: 'Flights',
      bookings: 'Bookings',
      login: 'Login',
      signup: 'Sign up',
    },
    hero: {
      subtitle: 'Best destinations around the world',
      title: 'Travel, enjoy and live a new and full life',
      description: 'Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening.',
      cta: 'Find out more',
      demo: 'Play Demo',
    },
    services: {
      category: 'CATEGORY',
      title: 'We Offer Best Services',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      destinations: 'الوجهات',
      hotels: 'الفنادق',
      flights: 'الرحلات',
      bookings: 'الحجوزات',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
    },
    hero: {
      subtitle: 'أفضل الوجهات حول العالم',
      title: 'سافر، استمتع وعش حياة جديدة ومليئة',
      description: 'استمتع بتجربة سفر لا تُنسى مع خدماتنا المتميزة.',
      cta: 'اكتشف المزيد',
      demo: 'شاهد العرض',
    },
    services: {
      category: 'الفئة',
      title: 'نقدم أفضل الخدمات',
    },
  },
};

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || CONFIG.defaultLanguage;
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.createLanguageSwitch();
  }

  createLanguageSwitch() {
    const langElement = document.querySelector('.lang');
    if (!langElement) return;

    langElement.textContent = this.currentLang.toUpperCase();
    langElement.style.cursor = 'pointer';

    langElement.addEventListener('click', () => {
      const newLang = this.currentLang === 'en' ? 'ar' : 'en';
      this.switchLanguage(newLang);
    });
  }

  switchLanguage(lang) {
    this.currentLang = lang;
    STATE.language = lang;
    localStorage.setItem('language', lang);
    this.applyLanguage(lang);

    document.querySelector('.lang').textContent = lang.toUpperCase();
  }

  applyLanguage(lang) {
    if (lang === 'ar') {
      document.body.classList.add('rtl');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.body.classList.remove('rtl');
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }

    this.translatePage(lang);
  }

  translatePage(lang) {
    const translations = TRANSLATIONS[lang];
    if (!translations) return;

    // Translate navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
      const href = link.getAttribute('href');
      if (href.includes('index.html') || href === '/') {
        link.textContent = translations.nav.home;
      } else if (href.includes('destinations.html')) {
        link.textContent = translations.nav.destinations;
      } else if (href.includes('hotels.html')) {
        link.textContent = translations.nav.hotels;
      } else if (href.includes('flights.html')) {
        link.textContent = translations.nav.flights;
      } else if (href.includes('bookings.html')) {
        link.textContent = translations.nav.bookings;
      }
    });

    // Translate auth buttons
    const loginBtn = document.querySelector('.login');
    const signupBtn = document.querySelector('.signup');
    if (loginBtn && translations.nav) loginBtn.textContent = translations.nav.login;
    if (signupBtn && translations.nav) signupBtn.textContent = translations.nav.signup;
  }

  t(key) {
    const keys = key.split('.');
    let value = TRANSLATIONS[this.currentLang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }
}

// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================
class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      STATE.currentUser = JSON.parse(savedUser);
      this.updateUI();
    }

    const loginBtn = document.querySelector('.login');
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showLoginModal();
      });
    }

    const signupBtn = document.querySelector('.signup');
    if (signupBtn) {
      signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (STATE.currentUser) {
          this.logout();
        } else {
          this.showSignupModal();
        }
      });
    }
  }

  showLoginModal() {
    const modal = this.createAuthModal('login');
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  }

  showSignupModal() {
    const modal = this.createAuthModal('signup');
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  }

  createAuthModal(type) {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-modal-content">
        <button class="auth-modal-close">&times;</button>
        <h2>${type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <form class="auth-form" id="authForm">
          ${type === 'signup' ? '<input type="text" placeholder="Full Name" required>' : ''}
          <input type="email" placeholder="Email" required id="authEmail">
          <input type="password" placeholder="Password" required id="authPassword">
          ${type === 'login' ? '<label><input type="checkbox"> Remember me</label>' : ''}
          <button type="submit" class="btn-primary">${type === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        <div class="auth-divider">OR</div>
        <button class="auth-social">Continue with Google</button>
        <button class="auth-social">Continue with Facebook</button>
        <p class="auth-switch">
          ${type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <a href="#" id="authSwitch">${type === 'login' ? 'Sign up' : 'Login'}</a>
        </p>
      </div>
    `;

    modal.querySelector('.auth-modal-close').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });

    modal.querySelector('#authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = modal.querySelector('#authEmail').value;
      const password = modal.querySelector('#authPassword').value;

      if (type === 'login') {
        this.login(email, password);
      } else {
        this.signup(email, password);
      }

      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });

    modal.querySelector('#authSwitch').addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        if (type === 'login') {
          this.showSignupModal();
        } else {
          this.showLoginModal();
        }
      }, 300);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    });

    return modal;
  }

  login(email, password) {
    const user = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      avatar: 'https://ui-avatars.com/api/?name=' + email.split('@')[0],
    };

    STATE.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.updateUI();

    this.showNotification('Login successful!', 'success');
  }

  signup(email, password) {
    this.login(email, password);
  }

  logout() {
    STATE.currentUser = null;
    localStorage.removeItem('user');
    this.updateUI();
    this.showNotification('Logged out successfully', 'info');
  }

  updateUI() {
    const loginBtn = document.querySelector('.login');
    const signupBtn = document.querySelector('.signup');

    if (STATE.currentUser) {
      if (loginBtn) loginBtn.textContent = STATE.currentUser.name;
      if (signupBtn) {
        signupBtn.textContent = 'Logout';
      }
    } else {
      if (loginBtn) loginBtn.textContent = 'Login';
      if (signupBtn) signupBtn.textContent = 'Sign up';
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ==========================================
// API INTEGRATION
// ==========================================
class APIManager {
  async searchFlights(params) {
    try {
      console.log('Searching flights:', params);

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        data: [
          {
            id: 1,
            airline: 'Emirates',
            flightNumber: 'EK402',
            from: params.from,
            to: params.to,
            departure: '08:30',
            arrival: '12:45',
            duration: '4h 15m',
            price: 420,
            direct: true,
          },
          {
            id: 2,
            airline: 'Egyptair',
            flightNumber: 'MS770',
            from: params.from,
            to: params.to,
            departure: '06:00',
            arrival: '14:30',
            duration: '6h 30m',
            price: 350,
            direct: false,
            stops: ['AUH'],
          },
        ],
      };
    } catch (error) {
      console.error('Flight search error:', error);
      return { success: false, error: error.message };
    }
  }

  async searchHotels(params) {
    try {
      console.log('Searching hotels:', params);

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Grand Hotel Rome',
            location: 'City Center',
            stars: 5,
            rating: 4.8,
            reviews: 234,
            price: 250,
            amenities: ['wifi', 'pool', 'parking'],
            image: './images/hotel1.jpg',
          },
          {
            id: 2,
            name: 'Hotel Plaza',
            location: 'Historic Center',
            stars: 4,
            rating: 4.6,
            reviews: 189,
            price: 180,
            amenities: ['wifi', 'restaurant'],
            image: './images/hotel2.jpg',
          },
        ],
      };
    } catch (error) {
      console.error('Hotel search error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDestinations() {
    return {
      success: true,
      data: [
        { id: 1, name: 'Rome, Italy', price: 5420, duration: '10 Days', image: './images/Rectangle 14.png' },
        { id: 2, name: 'London, UK', price: 4200, duration: '12 Days', image: './images/Rectangle 14.jpg' },
        { id: 3, name: 'Full Europe', price: 15000, duration: '28 Days', image: './images/Rectangle 14 (1).png' },
        { id: 4, name: 'Paris, France', price: 4800, duration: '8 Days', image: './images/paris.jpg' },
        { id: 5, name: 'Tokyo, Japan', price: 6200, duration: '14 Days', image: './images/tokyo.jpg' },
        { id: 6, name: 'Bali, Indonesia', price: 3200, duration: '10 Days', image: './images/bali.jpg' },
      ],
    };
  }
}

// ==========================================
// PAYMENT GATEWAY
// ==========================================
class PaymentManager {
  processPayment(paymentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;

        if (success) {
          resolve({
            success: true,
            transactionId: 'TXN' + Date.now(),
            amount: paymentData.amount,
            currency: paymentData.currency || 'USD',
          });
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 2000);
    });
  }

  showPaymentModal(booking) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
      <div class="payment-modal-content">
        <button class="payment-modal-close">&times;</button>
        <h2>Complete Payment</h2>
        
        <div class="payment-summary">
          <h3>Order Summary</h3>
          <p><span>Flight:</span> <span>$${booking.flightPrice || 0}</span></p>
          <p><span>Hotel:</span> <span>$${booking.hotelPrice || 0}</span></p>
          <p><span>Service fee:</span> <span>$50</span></p>
          <hr>
          <p><strong>Total:</strong> <strong>$${(booking.flightPrice || 0) + (booking.hotelPrice || 0) + 50}</strong></p>
        </div>

        <form class="payment-form" id="paymentForm">
          <div class="payment-method">
            <label><input type="radio" name="method" value="card" checked> Credit/Debit Card</label>
            <label><input type="radio" name="method" value="paypal"> PayPal</label>
          </div>

          <input type="text" placeholder="Card Number" maxlength="19" required id="cardNumber">
          <input type="text" placeholder="Cardholder Name" required id="cardName">
          <div style="display:flex;gap:10px;">
            <input type="text" placeholder="MM/YY" maxlength="5" required id="cardExpiry">
            <input type="text" placeholder="CVV" maxlength="3" required id="cardCVV">
          </div>

          <label style="font-size:14px;">
            <input type="checkbox"> Save card for future bookings
          </label>

          <button type="submit" class="btn-primary">
            🔒 Complete Payment
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.querySelector('.payment-modal-close').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });

    modal.querySelector('#paymentForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const cardNumber = modal.querySelector('#cardNumber').value;
      const total = (booking.flightPrice || 0) + (booking.hotelPrice || 0) + 50;

      try {
        const result = await this.processPayment({
          cardNumber,
          amount: total,
          currency: 'USD',
        });

        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);

        new AuthManager().showNotification('Payment successful! Booking confirmed.', 'success');

        this.saveBooking({ ...booking, ...result, paid: true });
      } catch (error) {
        new AuthManager().showNotification(error.message, 'error');
      }
    });

    return modal;
  }

  saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({
      ...booking,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'confirmed',
    });
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }
}

// ==========================================
// INITIALIZE ALL FEATURES
// ==========================================
class JadooApp {
  constructor() {
    this.navbarScroll = new NavbarScroll();
    this.darkMode = new DarkMode();
    this.language = new LanguageManager();
    this.auth = new AuthManager();
    this.api = new APIManager();
    this.payment = new PaymentManager();

    console.log('✈️ Jadoo Travel App initialized');
    console.log('Features: Navbar Scroll ✓, Dark Mode ✓, Multi-language ✓, Auth ✓, API ✓, Payment ✓');
  }
}

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}


// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.jadooApp = new JadooApp();
  });
} else {
  window.jadooApp = new JadooApp();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JadooApp, DarkMode, LanguageManager, AuthManager, APIManager, PaymentManager };
}

