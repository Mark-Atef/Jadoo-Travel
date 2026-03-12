// ==========================================
// BOOKINGS.JS - Bookings dashboard logic
// ==========================================

'use strict';

class BookingsPage {
  constructor() {
    this.bookings = [];
    this.favorites = [];
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.renderStats();
    this.renderBookings();
    this.updateUserName();
  }

  loadData() {
    // Load from localStorage
    this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    // Add mock data if empty
    if (this.bookings.length === 0) {
      this.bookings = [
        {
          id: 1,
          destination: 'Rome, Italy',
          image: './images/Rectangle 14.png',
          dates: { start: '2026-03-15', end: '2026-03-22' },
          hotel: 'Grand Hotel Rome',
          flight: 'Emirates EK402',
          status: 'confirmed',
          progress: 40,
          price: 2220
        },
        {
          id: 2,
          destination: 'Paris, France',
          image: './images/Rectangle 14.jpg',
          dates: { start: '2026-04-10', end: '2026-04-17' },
          hotel: 'Hotel Plaza',
          flight: 'Air France AF234',
          status: 'pending',
          progress: 80,
          price: 1950
        }
      ];
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
    }

    if (this.favorites.length === 0) {
      this.favorites = [
        { id: 1, name: 'Bali, Indonesia', price: 3200, image: './images/Rectangle 14 (1).png' },
        { id: 2, name: 'Tokyo, Japan', price: 6200, image: './images/Rectangle 14.png' },
        { id: 3, name: 'New York, USA', price: 5900, image: './images/Rectangle 14.jpg' }
      ];
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Profile form
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateProfile();
    });
  }

  switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Render content based on tab
    if (tabName === 'upcoming') {
      this.renderBookings();
    } else if (tabName === 'past') {
      this.renderPastTrips();
    } else if (tabName === 'favorites') {
      this.renderFavorites();
    }
  }

  updateUserName() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('userName').textContent = user.name;
    }
  }

  renderStats() {
    const upcoming = this.bookings.filter(b => new Date(b.dates.start) > new Date());
    const totalSpent = this.bookings.reduce((sum, b) => sum + b.price, 0);

    document.getElementById('upcomingCount').textContent = upcoming.length;
    document.getElementById('totalTrips').textContent = this.bookings.length;
    document.getElementById('totalSpent').textContent = '$' + totalSpent.toLocaleString();
  }

  renderBookings() {
    const grid = document.getElementById('upcomingTrips');
    grid.innerHTML = '';

    const upcoming = this.bookings.filter(b => new Date(b.dates.start) >= new Date());

    if (upcoming.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--color-text-gray);padding:var(--spacing-xl);">No upcoming trips. Start planning your next adventure!</p>';
      return;
    }

    upcoming.forEach(booking => {
      const card = this.createTripCard(booking);
      grid.appendChild(card);
    });
  }

  createTripCard(booking) {
    const card = document.createElement('div');
    card.className = 'trip-card';

    const startDate = new Date(booking.dates.start);
    const endDate = new Date(booking.dates.end);
    const daysUntil = Math.ceil((startDate - new Date()) / (1000 * 60 * 60 * 24));

    card.innerHTML = `
      <img src="${booking.image}" class="trip-card-img" alt="${booking.destination}">
      <div class="trip-card-body">
        <div class="trip-card-header">
          <h3 class="trip-destination">${booking.destination}</h3>
          <span class="trip-status ${booking.status}">${booking.status}</span>
        </div>
        <p class="trip-dates">${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} • ⏱️ ${daysUntil} days to go</p>
        <div class="trip-details">
          <span>✈️ ${booking.flight}</span>
          <span>🏨 ${booking.hotel}</span>
        </div>
        <div class="trip-progress">
          <p class="progress-label">${booking.progress}% complete</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${booking.progress}%"></div>
          </div>
        </div>
        <div class="trip-actions">
          <button class="btn-view" data-id="${booking.id}">View Details</button>
          <button class="btn-modify" data-id="${booking.id}">Modify</button>
          <button class="btn-cancel" data-id="${booking.id}">Cancel</button>
        </div>
      </div>
    `;

    // Event listeners
    card.querySelector('.btn-view').addEventListener('click', () => this.showTripDetails(booking));
    card.querySelector('.btn-modify').addEventListener('click', () => this.modifyTrip(booking));
    card.querySelector('.btn-cancel').addEventListener('click', () => this.cancelTrip(booking));

    return card;
  }

  renderPastTrips() {
    const grid = document.getElementById('pastTrips');
    grid.innerHTML = '';

    const past = this.bookings.filter(b => new Date(b.dates.end) < new Date());

    if (past.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--color-text-gray);padding:var(--spacing-xl);">No past trips yet.</p>';
      return;
    }

    past.forEach(booking => {
      const card = this.createTripCard({...booking, status: 'completed'});
      grid.appendChild(card);
    });
  }

  renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    grid.innerHTML = '';

    this.favorites.forEach(fav => {
      const card = document.createElement('div');
      card.className = 'favorite-card';
      card.innerHTML = `
        <img src="${fav.image}" class="favorite-card-img" alt="${fav.name}">
        <div class="favorite-card-body">
          <h3 class="favorite-name">${fav.name}</h3>
          <p class="favorite-price">From $${fav.price.toLocaleString()}</p>
          <button class="btn-primary" style="width:100%;">Book Now</button>
        </div>
      `;

      card.addEventListener('click', () => {
        localStorage.setItem('selectedDestination', JSON.stringify(fav));
        window.location.href = 'destinations.html';
      });

      grid.appendChild(card);
    });
  }

  showTripDetails(booking) {
    const modal = document.getElementById('tripModal');
    const modalBody = modal.querySelector('.trip-modal-body');

    const startDate = new Date(booking.dates.start).toLocaleDateString();
    const endDate = new Date(booking.dates.end).toLocaleDateString();

    modalBody.innerHTML = `
      <img src="${booking.image}" style="width:100%;height:250px;object-fit:cover;">
      <div style="padding:var(--spacing-lg);">
        <h2>${booking.destination}</h2>
        <p style="color:var(--color-text-gray);margin-bottom:var(--spacing-lg);">${startDate} - ${endDate}</p>
        
        <h3>Itinerary</h3>
        <div style="margin:var(--spacing-md) 0;">
          <p><strong>✈️ Outbound Flight:</strong> ${booking.flight}</p>
          <p><strong>🏨 Hotel:</strong> ${booking.hotel}</p>
          <p><strong>💰 Total Cost:</strong> $${booking.price.toLocaleString()}</p>
        </div>

        <h3>Booking Details</h3>
        <div style="background:var(--color-light);padding:var(--spacing-md);border-radius:var(--radius-medium);margin:var(--spacing-md) 0;">
          <p>✅ Flight confirmed</p>
          <p>✅ Hotel confirmed</p>
          <p>Status: <strong style="color:var(--color-gold);">${booking.status.toUpperCase()}</strong></p>
        </div>

        <div style="display:flex;gap:var(--spacing-sm);margin-top:var(--spacing-lg);">
          <button class="btn-primary" style="flex:1;">📄 Download Tickets</button>
          <button class="btn-primary" style="flex:1;">📅 Add to Calendar</button>
        </div>
      </div>
    `;

    modal.classList.add('show');

    modal.querySelector('.trip-modal-close').onclick = () => {
      modal.classList.remove('show');
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    };
  }

  modifyTrip(booking) {
    window.jadooApp.auth.showNotification('Modify trip feature coming soon!', 'info');
  }

  cancelTrip(booking) {
    if (confirm('Are you sure you want to cancel this trip?')) {
      this.bookings = this.bookings.filter(b => b.id !== booking.id);
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.renderStats();
      this.renderBookings();
      window.jadooApp.auth.showNotification('Trip cancelled successfully', 'success');
    }
  }

  updateProfile() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    
    const user = {
      name,
      email,
      phone: document.getElementById('profilePhone').value,
      passport: document.getElementById('profilePassport').value
    };

    localStorage.setItem('user', JSON.stringify(user));
    window.jadooApp.auth.showNotification('Profile updated successfully!', 'success');
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BookingsPage();
  });
} else {
  new BookingsPage();
}