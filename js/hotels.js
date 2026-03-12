// ==========================================
// HOTELS.JS - Hotels page logic
// ==========================================

'use strict';

class HotelsPage {
  constructor() {
    this.hotels = [];
    this.filteredHotels = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.init();
  }

  async init() {
    await this.loadHotels();
    this.setupEventListeners();
    this.renderHotels();
  }

  async loadHotels() {
    // Mock hotel data
    this.hotels = [
      {
        id: 1,
        name: 'Grand Hotel Rome',
        location: 'City Center, Rome',
        distance: '0.5 km',
        stars: 5,
        rating: 4.8,
        reviews: 234,
        price: 250,
        amenities: ['wifi', 'pool', 'parking', 'spa'],
        image: './images/Rectangle 14.png',
        rooms: [
          { type: 'Standard Room', price: 250, guests: 2 },
          { type: 'Deluxe Suite', price: 450, guests: 4 }
        ]
      },
      {
        id: 2,
        name: 'Hotel Plaza',
        location: 'Historic Center, Rome',
        distance: '1.2 km',
        stars: 4,
        rating: 4.6,
        reviews: 189,
        price: 180,
        amenities: ['wifi', 'restaurant'],
        image: './images/Rectangle 14.jpg',
        rooms: [
          { type: 'Standard Room', price: 180, guests: 2 },
          { type: 'Family Room', price: 320, guests: 4 }
        ]
      },
      {
        id: 3,
        name: 'Luxury Suites',
        location: 'Downtown, Rome',
        distance: '2.0 km',
        stars: 5,
        rating: 4.9,
        reviews: 456,
        price: 380,
        amenities: ['wifi', 'pool', 'spa', 'restaurant', 'parking'],
        image: './images/Rectangle 14 (1).png',
        rooms: [
          { type: 'Junior Suite', price: 380, guests: 2 },
          { type: 'Presidential Suite', price: 850, guests: 6 }
        ]
      }
    ];

    this.filteredHotels = [...this.hotels];
  }

  setupEventListeners() {
    // Search button
    document.getElementById('searchHotelsBtn')?.addEventListener('click', () => {
      this.performSearch();
    });

    // Price range
    document.getElementById('priceRange')?.addEventListener('input', (e) => {
      document.getElementById('priceValue').textContent = '$' + e.target.value;
    });

    // Apply filters
    document.getElementById('applyFilters')?.addEventListener('click', () => {
      this.applyFilters();
    });

    // Reset filters
    document.getElementById('resetFilters')?.addEventListener('click', () => {
      this.resetFilters();
    });

    // Sort
    document.getElementById('sortBy')?.addEventListener('change', (e) => {
      this.sortHotels(e.target.value);
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.toggleView(e.target.dataset.view);
      });
    });

    // Load more
    document.getElementById('loadMore')?.addEventListener('click', () => {
      this.currentPage++;
      this.renderHotels(true);
    });
  }

  performSearch() {
    const location = document.getElementById('searchLocation').value.toLowerCase();
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    this.filteredHotels = this.hotels.filter(hotel => {
      return hotel.location.toLowerCase().includes(location);
    });

    this.renderHotels();
  }

  applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const selectedStars = Array.from(document.querySelectorAll('input[name="stars"]:checked')).map(el => parseInt(el.value));
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked')).map(el => el.value);

    this.filteredHotels = this.hotels.filter(hotel => {
      const priceMatch = hotel.price <= maxPrice;
      const starsMatch = selectedStars.length === 0 || selectedStars.includes(hotel.stars);
      const amenitiesMatch = selectedAmenities.every(amenity => hotel.amenities.includes(amenity));

      return priceMatch && starsMatch && amenitiesMatch;
    });

    this.renderHotels();
  }

  resetFilters() {
    document.getElementById('priceRange').value = 250;
    document.getElementById('priceValue').textContent = '$250';
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);

    this.filteredHotels = [...this.hotels];
    this.renderHotels();
  }

  sortHotels(sortBy) {
    switch(sortBy) {
      case 'price-low':
        this.filteredHotels.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredHotels.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredHotels.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended - keep original order
        break;
    }
    this.renderHotels();
  }

  toggleView(view) {
    const grid = document.getElementById('hotelsGrid');
    if (view === 'list') {
      grid.classList.add('list-view');
    } else {
      grid.classList.remove('list-view');
    }
  }

  renderHotels(append = false) {
    const grid = document.getElementById('hotelsGrid');
    const start = append ? (this.currentPage - 1) * this.itemsPerPage : 0;
    const end = this.currentPage * this.itemsPerPage;
    const toRender = this.filteredHotels.slice(start, end);

    if (!append) {
      grid.innerHTML = '';
    }

    toRender.forEach(hotel => {
      const card = this.createHotelCard(hotel);
      grid.appendChild(card);
    });

    // Update result count
    document.getElementById('resultCount').textContent = this.filteredHotels.length;

    // Hide load more if all loaded
    const loadMoreBtn = document.getElementById('loadMore');
    if (end >= this.filteredHotels.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card';

    const stars = '⭐'.repeat(hotel.stars);
    const amenityIcons = hotel.amenities.map(a => {
      const icons = { wifi: '📶', pool: '🏊', spa: '💆', parking: '🅿️', restaurant: '🍽️' };
      return icons[a] || '';
    }).join(' ');

    card.innerHTML = `
      <img src="${hotel.image}" alt="${hotel.name}" class="hotel-card-img" loading="lazy">
      <div class="hotel-card-body">
        <div class="hotel-card-header">
          <div>
            <h3 class="hotel-card-title">${hotel.name}</h3>
            <div class="hotel-stars">${stars}</div>
          </div>
        </div>
        <p class="hotel-location">📍 ${hotel.location} • ${hotel.distance}</p>
        <div class="hotel-rating">
          <span class="rating-badge">${hotel.rating}</span>
          <span class="rating-text">(${hotel.reviews} reviews)</span>
        </div>
        <div class="hotel-amenities">${amenityIcons}</div>
        <div class="hotel-footer">
          <div class="hotel-price">
            <div class="price-label">From</div>
            <div class="price-amount">$${hotel.price}<span style="font-size:14px;color:#666;">/night</span></div>
          </div>
          <button class="btn-view-rooms" data-id="${hotel.id}">View Rooms</button>
        </div>
      </div>
    `;

    // Add click handler
    card.querySelector('.btn-view-rooms').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showHotelDetails(hotel);
    });

    card.addEventListener('click', () => {
      this.showHotelDetails(hotel);
    });

    return card;
  }

  showHotelDetails(hotel) {
    const modal = document.getElementById('hotelModal');
    const modalBody = modal.querySelector('.hotel-modal-body');

    const stars = '⭐'.repeat(hotel.stars);

    modalBody.innerHTML = `
      <img src="${hotel.image}" style="width:100%;height:300px;object-fit:cover;">
      <div style="padding:var(--spacing-lg);">
        <h2>${hotel.name}</h2>
        <div>${stars}</div>
        <p>📍 ${hotel.location}</p>
        <p>⭐ ${hotel.rating} (${hotel.reviews} reviews)</p>
        <hr style="margin:var(--spacing-md) 0;">
        <h3>Rooms & Rates</h3>
        ${hotel.rooms.map(room => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--spacing-md);background:var(--color-light);border-radius:var(--radius-medium);margin:var(--spacing-sm) 0;">
            <div>
              <strong>${room.type}</strong><br>
              <small>👥 Up to ${room.guests} guests</small>
            </div>
            <div style="text-align:right;">
              <strong style="color:var(--color-light-red);">$${room.price}/night</strong><br>
              <button class="btn-primary" style="margin-top:var(--spacing-xs);">Book Now</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    modal.classList.add('show');

    // Close modal
    modal.querySelector('.hotel-modal-close').onclick = () => {
      modal.classList.remove('show');
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    };
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HotelsPage();
  });
} else {
  new HotelsPage();
}