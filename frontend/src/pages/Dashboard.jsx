import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  MapPin, 
  Navigation, 
  Clock, 
  Wallet, 
  User as UserIcon, 
  History, 
  Compass,
  Car,
  Bike,
  Zap,
  ChevronRight
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // --- State Management ---
  const [isParked, setIsParked] = useState(true);
  const [startTime] = useState(new Date(Date.now() - 45 * 60 * 1000 - 12 * 1000)); // 45m 12s ago
  const [timer, setTimer] = useState('00:00:00');
  const [currentBill, setCurrentBill] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Mock Data ---
  const parkingLots = [
    { id: 1, name: 'New Road P1', distance: '200m', price: 25, occupancy: '45/50', status: 'available', lat: 27.7042, lon: 85.3101 },
    { id: 2, name: 'Dharahara Complex', distance: '450m', price: 40, occupancy: '50/50', status: 'full', lat: 27.7005, lon: 85.3121 },
    { id: 3, name: 'Basantapur Square', distance: '800m', price: 30, occupancy: '12/40', status: 'available', lat: 27.7040, lon: 85.3065 },
  ];

  // --- Logic A: Live Parking Timer & Fee ---
  useEffect(() => {
    if (!isParked) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffInMs = now - new Date(startTime);
      
      // Calculate Timer String
      const hours = Math.floor(diffInMs / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000).toString().padStart(2, '0');
      setTimer(`${hours}:${minutes}:${seconds}`);

      // Calculate Fee (Rate: NPR 25/hr)
      const diffInHours = diffInMs / (1000 * 60 * 60);
      setCurrentBill(Math.ceil(diffInHours * 25));
    }, 1000);

    return () => clearInterval(interval);
  }, [isParked, startTime]);

  // --- Logic B: Haversine Distance (Utility) ---
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="profile-pic">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
        <div className="search-bar-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Where are you going?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="notification-btn">
          <Bell size={22} />
          <span className="notification-badge"></span>
        </button>
      </header>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button className="tab active"><Car size={16} /> Car</button>
        <button className="tab"><Bike size={16} /> Bike</button>
        <button className="tab"><Zap size={16} /> EV Only</button>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="map-placeholder">
          {/* Mock Markers */}
          <div className="map-marker available" style={{ top: '40%', left: '30%' }}>
            <div className="marker-label">NPR 25</div>
            <MapPin size={32} fill="#10b981" color="white" />
          </div>
          <div className="map-marker full" style={{ top: '60%', left: '70%' }}>
            <div className="marker-label">FULL</div>
            <MapPin size={32} fill="#ef4444" color="white" />
          </div>
          <button className="recenter-btn">
            <Navigation size={20} />
          </button>
        </div>
      </div>

      {/* Active Session Card (isParked = true) */}
      {isParked && (
        <div className="active-session-card">
          <div className="session-info">
            <div className="session-header">
              <span className="live-dot"></span>
              <h3>Active Parking</h3>
            </div>
            <div className="session-details">
              <div className="detail-item">
                <Clock size={16} />
                <span>{timer}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <span>New Road P1</span>
              </div>
              <div className="detail-item bill">
                <Wallet size={16} />
                <span>NPR {currentBill}</span>
              </div>
            </div>
          </div>
          <button className="checkout-btn" onClick={() => setIsParked(false)}>
            Check Out
          </button>
        </div>
      )}

      {/* Discovery Section */}
      <section className="discovery-section">
        <div className="section-header">
          <h3>Nearby Parking</h3>
          <button className="view-all">View All</button>
        </div>
        <div className="horizontal-scroll">
          {parkingLots.map(lot => (
            <div key={lot.id} className="parking-lot-card">
              <div className="lot-image">
                <img src={`https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=200`} alt={lot.name} />
                <span className={`status-badge ${lot.status}`}>{lot.status.toUpperCase()}</span>
              </div>
              <div className="lot-content">
                <h4>{lot.name}</h4>
                <div className="lot-meta">
                  <span><Navigation size={12} /> {lot.distance}</span>
                  <span>• NPR {lot.price}/hr</span>
                </div>
                <div className="occupancy-container">
                  <div className="occupancy-bar">
                    <div 
                      className="occupancy-fill" 
                      style={{ width: `${(parseInt(lot.occupancy.split('/')[0]) / parseInt(lot.occupancy.split('/')[1])) * 100}%` }}
                    ></div>
                  </div>
                  <span className="occupancy-text">{lot.occupancy} slots</span>
                </div>
                <button className={`book-btn ${lot.status}`} disabled={lot.status === 'full'}>
                  {lot.status === 'full' ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <Compass size={24} />
          <span>Explore</span>
        </button>
        <button className="nav-item">
          <History size={24} />
          <span>History</span>
        </button>
        <button className="nav-item">
          <Wallet size={24} />
          <span>Payments</span>
        </button>
        <button className="nav-item">
          <UserIcon size={24} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
