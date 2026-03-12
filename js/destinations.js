// ==========================================
// DESTINATIONS.JS - Destinations page logic
// ==========================================

'use strict';

class DestinationsPage {
  constructor() {
    this.destinations = [];
    this.filteredDestinations = [];
    this.currentPage = 1;
    this.itemsPerPage = 9;
    this.init();
  }

  async init() {
    await this.loadDestinations();
    this.setupEventListeners();
    this.renderDestinations();
  }

  async loadDestinations() {
    try {
      const api = window.jadooApp?.api;
      if (!api) throw new Error('App not initialized');

      const result = await api.getDestinations();
      if (result.success) {
        this.destinations = result.data;
        this.filteredDestinations = [...this.destinations];
      } else {
        this.showEmptyState('Could not load destinations. Please try again.');
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
      this.showEmptyState('Something went wrong. Please refresh the page.');
    }
  }

  showEmptyState(message) {
    const grid = document.getElementById('destGrid');
    if (grid) {
      grid.innerHTML = `<p class="empty-state">${sanitize(message)}</p>`;
    }
  }

  setupEventListeners() {
    // Search button
    document.getElementById('searchBtn')?.addEventListener('click', () => {
      this.performSearch();
    });

    // Quick filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this.filterByType(e.target.dataset.filter);
      });
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
      this.sortDestinations(e.target.value);
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
      this.renderDestinations(true);
    });
  }

  performSearch() {
    const destination = document.getElementById('searchDestination').value.toLowerCase();
    const date = document.getElementById('searchDate').value;
    const travelers = document.getElementById('searchTravelers').value;

    this.filteredDestinations = this.destinations.filter(dest => {
      return dest.name.toLowerCase().includes(destination);
    });

    this.renderDestinations();
  }

  filterByType(type) {
    if (type === 'all') {
      this.filteredDestinations = [...this.destinations];
    } else {
      this.filteredDestinations = this.destinations.filter(dest => {
        return dest.type === type;
      });
    }
    this.renderDestinations();
  }

  applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const durations = Array.from(
      document.querySelectorAll('input[name="duration"]:checked')
    ).map(el => el.value);
    const activities = Array.from(
      document.querySelectorAll('input[name="activity"]:checked')
    ).map(el => el.value);
    const continent = document.getElementById('continentFilter').value;

    this.filteredDestinations = this.destinations.filter(dest => {
      const priceOk = dest.price <= maxPrice;
      const durationOk = durations.length === 0 || durations.includes(dest.duration);
      const activityOk = activities.length === 0 ||
        activities.some(a => dest.activities?.includes(a));
      const continentOk = continent === 'all' || dest.continent === continent;

      return priceOk && durationOk && activityOk && continentOk;
    });

    this.currentPage = 1; // reset pagination after filter
    this.renderDestinations();
  }

  resetFilters() {
    document.getElementById('priceRange').value = 5000;
    document.getElementById('priceValue').textContent = '$5000';
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    document.getElementById('continentFilter').value = 'all';

    this.filteredDestinations = [...this.destinations];
    this.renderDestinations();
  }

  sortDestinations(sortBy) {
    switch (sortBy) {
      case 'price-low':
        this.filteredDestinations.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredDestinations.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        this.filteredDestinations.sort((a, b) => {
          const daysA = parseInt(a.duration);
          const daysB = parseInt(b.duration);
          return daysA - daysB;
        });
        break;
      default:
        // popular - keep original order
        break;
    }
    this.renderDestinations();
  }

  toggleView(view) {
    const grid = document.getElementById('destGrid');
    if (view === 'list') {
      grid.classList.add('list-view');
    } else {
      grid.classList.remove('list-view');
    }
  }

  renderDestinations(append = false) {
    const grid = document.getElementById('destGrid');
    const start = append ? (this.currentPage - 1) * this.itemsPerPage : 0;
    const end = this.currentPage * this.itemsPerPage;
    const toRender = this.filteredDestinations.slice(start, end);

    if (!append) {
      grid.innerHTML = '';
    }

    toRender.forEach(dest => {
      const card = this.createDestinationCard(dest);
      grid.appendChild(card);
    });

    // Update result count
    document.getElementById('resultCount').textContent = this.filteredDestinations.length;

    // Hide load more if all loaded
    const loadMoreBtn = document.getElementById('loadMore');
    if (end >= this.filteredDestinations.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  createDestinationCard(dest) {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}" class="dest-card-img" loading="lazy">
      <div class="dest-card-body">
        <h3 class="dest-card-title">${dest.name}</h3>
        <div class="dest-card-meta">
          <span class="dest-card-price">$${dest.price.toLocaleString()}</span>
          <span class="dest-card-duration">${dest.duration}</span>
        </div>
        <p class="dest-card-description">
          Explore the beauty of ${dest.name} with our exclusive packages.
        </p>
        <div class="dest-card-footer">
          <div class="dest-card-rating">
            ⭐ 4.8 (120 reviews)
          </div>
          <button class="btn-book" data-id="${dest.id}">Book Now</button>
        </div>
      </div>
    `;

    // Add click handler for booking
    card.querySelector('.btn-book').addEventListener('click', (e) => {
      e.stopPropagation();
      this.bookDestination(dest);
    });

    // Card click to view details
    card.addEventListener('click', () => {
      this.showDestinationDetails(dest);
    });

    return card;
  }

  bookDestination(dest) {
    // Redirect to booking page with destination data
    localStorage.setItem('selectedDestination', JSON.stringify(dest));
    window.location.href = 'bookings.html';
  }

}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DestinationsPage();
  });
} else {
  new DestinationsPage();
}