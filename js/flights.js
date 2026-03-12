// ==========================================
// FLIGHTS.JS - Flights page logic
// ==========================================

'use strict';

class FlightsPage {
  constructor() {
    this.flights = [];
    this.filteredFlights = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.init();
  }

  async init() {
    await this.loadFlights();
    this.setupEventListeners();
    this.renderFlights();
  }

  async loadFlights() {
    // Mock flight data
    this.flights = [
      {
        id: 1,
        airline: 'Emirates',
        flightNumber: 'EK402',
        logo: '✈️',
        rating: 4.8,
        from: { code: 'CAI', city: 'Cairo', time: '08:30' },
        to: { code: 'FCO', city: 'Rome', time: '12:45' },
        duration: '4h 15m',
        stops: 0,
        price: 420,
        class: 'Economy'
      },
      {
        id: 2,
        airline: 'Egyptair',
        flightNumber: 'MS770',
        logo: '🛫',
        rating: 4.5,
        from: { code: 'CAI', city: 'Cairo', time: '06:00' },
        to: { code: 'FCO', city: 'Rome', time: '14:30' },
        duration: '6h 30m',
        stops: 1,
        price: 350,
        class: 'Economy',
        stopover: 'AUH'
      },
      {
        id: 3,
        airline: 'Lufthansa',
        flightNumber: 'LH5840',
        logo: '🛩️',
        rating: 4.7,
        from: { code: 'CAI', city: 'Cairo', time: '10:15' },
        to: { code: 'FCO', city: 'Rome', time: '16:45' },
        duration: '5h 30m',
        stops: 1,
        price: 390,
        class: 'Economy',
        stopover: 'FRA'
      }
    ];

    this.filteredFlights = [...this.flights];
  }

  setupEventListeners() {
    // Search button
    document.getElementById('searchFlightsBtn')?.addEventListener('click', () => {
      this.performSearch();
    });

    // Swap button
    document.getElementById('swapBtn')?.addEventListener('click', () => {
      const from = document.getElementById('searchFrom').value;
      const to = document.getElementById('searchTo').value;
      document.getElementById('searchFrom').value = to;
      document.getElementById('searchTo').value = from;
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
      this.sortFlights(e.target.value);
    });

    // Load more
    document.getElementById('loadMore')?.addEventListener('click', () => {
      this.currentPage++;
      this.renderFlights(true);
    });
  }

  performSearch() {
    const from = document.getElementById('searchFrom').value;
    const to = document.getElementById('searchTo').value;
    const departDate = document.getElementById('departDate').value;

    this.filteredFlights = [...this.flights];
    this.renderFlights();

    window.jadooApp.auth.showNotification('Searching flights...', 'info');
  }

  applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const stops = document.querySelector('input[name="stops"]:checked')?.value;
    const selectedAirlines = Array.from(document.querySelectorAll('input[name="airline"]:checked')).map(el => el.value);

    this.filteredFlights = this.flights.filter(flight => {
      const priceMatch = flight.price <= maxPrice;
      const stopsMatch = !stops || (
        (stops === 'nonstop' && flight.stops === 0) ||
        (stops === '1stop' && flight.stops === 1) ||
        (stops === '2plus' && flight.stops >= 2)
      );
      const airlineMatch = selectedAirlines.length === 0 ||
        selectedAirlines.some(a => flight.airline.toLowerCase().includes(a));

      return priceMatch && stopsMatch && airlineMatch;
    });

    this.renderFlights();
  }

  resetFilters() {
    document.getElementById('priceRange').value = 600;
    document.getElementById('priceValue').textContent = '$600';
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);

    this.filteredFlights = [...this.flights];
    this.renderFlights();
  }



  sortFlights(sortBy) {
    switch (sortBy) {
      case 'cheapest':
        this.filteredFlights.sort((a, b) => a.price - b.price);
        break;
      case 'fastest':
        this.filteredFlights.sort((a, b) => {
          return this.durationToMinutes(a.duration) - this.durationToMinutes(b.duration);
        });
        break;
      case 'best':
        this.filteredFlights.sort((a, b) => (b.rating / b.price) - (a.rating / a.price));
        break;
    }

    this.renderFlights();
  }

  renderFlights(append = false) {
    const grid = document.getElementById('flightsGrid');
    const start = append ? (this.currentPage - 1) * this.itemsPerPage : 0;
    const end = this.currentPage * this.itemsPerPage;
    const toRender = this.filteredFlights.slice(start, end);

    if (!append) {
      grid.innerHTML = '';
    }

    toRender.forEach(flight => {
      const card = this.createFlightCard(flight);
      grid.appendChild(card);
    });

    // Update result count
    document.getElementById('resultCount').textContent = this.filteredFlights.length;

    // Hide load more if all loaded
    const loadMoreBtn = document.getElementById('loadMore');
    if (end >= this.filteredFlights.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';

    const stopsText = flight.stops === 0 ? 'Direct' :
      flight.stops === 1 ? `1 stop ${flight.stopover}` :
        `${flight.stops} stops`;

    card.innerHTML = `
      <div class="flight-card-header">
        <div class="airline-info">
          <div class="airline-logo">${flight.logo}</div>
          <div>
            <div class="airline-name">${flight.airline}</div>
            <div class="flight-number">${flight.flightNumber}</div>
          </div>
        </div>
        <div class="flight-rating">⭐ ${flight.rating}</div>
      </div>

      <div class="flight-route">
        <div>
          <div class="route-time">${flight.from.time}</div>
          <div class="route-airport">${flight.from.code} ${flight.from.city}</div>
        </div>

        <div class="route-duration">
          <div class="route-line"></div>
          <div class="duration-time">${flight.duration}</div>
          <div class="duration-type">${stopsText}</div>
        </div>

        <div>
          <div class="route-time">${flight.to.time}</div>
          <div class="route-airport">${flight.to.code} ${flight.to.city}</div>
        </div>
      </div>

      <div class="flight-footer">
        <div class="flight-price">
          <div class="price-label">${flight.class}</div>
          <div class="price-amount">$${flight.price}</div>
        </div>
        <button class="btn-select-flight" data-id="${flight.id}">Select</button>
      </div>
    `;

    // Add click handler
    card.querySelector('.btn-select-flight').addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectFlight(flight);
    });

    return card;
  }

  selectFlight(flight) {
    localStorage.setItem('selectedFlight', JSON.stringify(flight));

    if (window.jadooApp?.payment) {
      window.jadooApp.payment.showPaymentModal({ flightPrice: flight.price, hotelPrice: 0 });
    } else {
      console.error('Payment system unavailable');
      // Show fallback UI
    }
  }

}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FlightsPage();
  });
} else {
  new FlightsPage();
}