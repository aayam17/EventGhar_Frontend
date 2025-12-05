import React, { useState, useEffect } from 'react';
import '/src/assets/css/Dashboard.css'; 
import EventGharLogo from '../assets/logo.png'; 

// --- NEW IMPORTS FOR LOCAL IMAGES ---
import EdgeBandHero from '../assets/25 Years of Edge Band.jpeg'; 
import NewYearsEve from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/New Years Eve.jpeg';
import ChitwanMusicFiesta from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/chitwan music fiesta.jpg'; 

import EdgeBandEvents from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/Edge Band Image.jpeg'; 
import JohnAndTheLocalsEvents from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/John and the Locals.png';
import TheShadowsNepal from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/The Shadows Nepal.jpg';
import Albatross from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/Albatross Band.jpeg';
import PurnaRai from '/Users/aayambhattarai/EventGhar/frontend/frontend/src/assets/Purna Rai and Daju Bhai.jpeg'

import FooterImage from '../assets/footer.png'; // 🚨 NEW IMPORT FOR FOOTER IMAGE

// --- Mock Data for the SLIDER (FIXED) ---
const featuredEvents = [
    {
        id: 101,
        title: '25 Years of Edge Band',
        info: 'Sat, 13 DEC, 11:30 PM Onwards | Club Nova, Thamel',
        targetDate: new Date(2025, 11, 13, 23, 30, 0), 
        imgClass: 'hero-edge-band',
        details: 'The ultimate rock celebration. Grab the best packages available!',
        imageSrc: EdgeBandHero 
    },
    {
        id: 102,
        title: 'New Years Eve',
        info: 'Fri, 27 DEC, 7:00 PM Onwards | LOD, Kathmandu',
        targetDate: new Date(2025, 11, 27, 19, 0, 0),
        imgClass: 'hero-new-years-eve',
        details: 'Experience the best of Nepali Pop music. VIP packages available!',
        imageSrc: NewYearsEve
    },
    {
        id: 103,
        title: 'Shadows Nepal Unplugged',
        info: 'Sun, 5 JAN, 6:00 PM Onwards | Beer Garden, Lalitpur',
        targetDate: new Date(2026, 0, 5, 18, 0, 0),
        imgClass: 'hero-chitwan-music-fiesta',
        details: 'Acoustic evening with the legends. Get your tickets now!',
        imageSrc: ChitwanMusicFiesta
    },
];

// --- Helper Functions (Unchanged) ---
const getCountdownTime = (targetDate) => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
}


// --- MOCK DATA for Event Cards (UPDATED to use imported image variables) ---
const mockEvents = [
    { 
        id: 1, 
        title: 'Edge Band', 
        date: '13 dec', 
        price: 1000, 
        formattedPrice: '1,000', 
        formattedDate: '13 Dec', 
        packages: 'Basic, VIP',
        imageSrc: EdgeBandEvents // <-- FIXED
    },
    { 
        id: 2, 
        title: 'John and The Locals', 
        date: '13 dec', 
        price: 1000, 
        formattedPrice: '1,000', 
        formattedDate: '13 Dec', 
        packages: 'Student, Premium',
        imageSrc: JohnAndTheLocalsEvents // <-- FIXED
    },
    { 
        id: 3, 
        title: 'Shadows', 
        date: '13 dec', 
        price: 1000, 
        formattedPrice: '1,000', 
        formattedDate: '13 Dec', 
        packages: 'Standard, Backstage',
        imageSrc: TheShadowsNepal // <-- FIXED
    },
    { 
        id: 4, 
        title: 'The Elements', 
        date: '13 dec', 
        price: 1000, 
        formattedPrice: '1,000', 
        formattedDate: '13 Dec', 
        packages: 'Basic, VIP',
        imageSrc: Albatross // Reusing for a different band since The Elements import is missing
    },
    { 
        id: 5, 
        title: 'Albatross', 
        date: '13 dec', 
        price: 1000, 
        formattedPrice: '1,000', 
        formattedDate: '13 Dec', 
        packages: 'Student, Basic',
        imageSrc: Albatross // <-- FIXED
    },
    { 
        id: 6, 
        title: 'Purna Rai', 
        date: '13 dec', 
        price: 1000, 
        formattedPrice: '1,000', 
        formattedDate: '13 Dec', 
        packages: 'VIP, Standard',
        imageSrc: PurnaRai // <-- FIXED
    },
];


// --- 1. EventCard Component (UPDATED to use <img> tag) ---
const EventCard = ({ event }) => (
  <div className="event-card-container">
    <div className="image-wrapper">
      {/* The image is now displayed directly using the imported 'imageSrc'.
        A fallback is included in case the local path fails.
      */}
      <img 
          src={event.imageSrc} 
          alt={event.title} 
          className="event-card-image" 
          onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/400x160/2980b9/ffffff?text=Image+Not+Found"; // Placeholder fallback
          }}
      />
      {/* The overlay for the title and date is now visible on the card.
      */}
      <div className="event-image-overlay">
          <h2>{event.title}</h2>
          <p>{event.formattedDate}</p>
      </div>
    </div>
    
    <div className="card-details">
      <div className="date-price-row">
        <span className="date-text">🗓️ {event.formattedDate}</span>
        <span className="price-text">Rs {event.formattedPrice}</span>
      </div>
      <p className="package-info">Packages: {event.packages}</p> 
      <button className="buy-button">BUY</button>
    </div>
  </div>
);


// --- 2. Navbar Component (Unchanged) ---
const Navbar = () => (
    <nav className="navbar-container">
        <div className="navbar-logo-group">
            <img src={EventGharLogo} alt="Event Ghar Logo" className="navbar-logo-img" /> 
        </div>

        <div className="navbar-links">
            {['Home', 'Events', 'Contact Us', 'My Bookings'].map(link => (
                <a key={link} href={`/${link.toLowerCase().replace(/\s/g, '-')}`} className="navbar-link">{link}</a>
            ))}
        </div>

        <div className="navbar-actions">
            <div className="search-group">
                <input type="text" placeholder="Search here" className="navbar-search-box" />
                <span className="search-icon">🔍</span>
            </div>
            
            <button className="navbar-host-button">Host an Event</button>
            <span className="navbar-icon user-icon">👤</span>
        </div>
    </nav>
);

// --- 3. HeroSection Component (Unchanged) ---
const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentEvent = featuredEvents[currentIndex];
    const [timeLeft, setTimeLeft] = useState(getCountdownTime(currentEvent.targetDate));
    
    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(getCountdownTime(currentEvent.targetDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentEvent.targetDate]); 

    const TimerBox = ({ value, label }) => (
        <div className="hero-timer-box">
          <div className="hero-timer-value">{value}</div>
          <div className="hero-timer-label">{label}</div>
        </div>
    );

    return (
        <div className="hero-section-wrapper">
            <img 
                src={currentEvent.imageSrc} 
                alt={currentEvent.title} 
                className={`hero-image-overlay-img`} 
            />
            <div className={`hero-container ${currentEvent.imgClass}`}> 
                <div className="hero-content">
                    <h2 className="hero-title">{currentEvent.title}</h2>
                    <div className="hero-event-info-row">
                        <span className="hero-info-text">{currentEvent.info.split(' | ')[0]}</span>
                        <span className="hero-info-text-location">{currentEvent.info.split(' | ')[1]}</span>
                    </div>
                    
                    <p className="hero-package-detail">
                        {currentEvent.details}
                    </p>

                    <div className="hero-timer-row">
                        <TimerBox value={timeLeft.days} label="DAYS" />
                        <TimerBox value={timeLeft.hours} label="HRS" />
                        <TimerBox value={timeLeft.minutes} label="MINS" />
                        <TimerBox value={timeLeft.seconds} label="SEC" />
                    </div>

                    <div className="hero-button-row">
                        <button className="hero-view-details-button">VIEW DETAILS</button>
                        <button className="hero-buy-ticket-button">BUY TICKET</button>
                    </div>
                </div>
                <div className="slider-indicators">
                    {featuredEvents.map((_, index) => (
                        <span
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 4. TrendingEvents Component (Unchanged) ---
const TrendingEvents = () => {
  const events = mockEvents;
  const loading = false;
  const error = null;

  if (loading) {
    return <section className="trending-events-section"><p>Loading trending events...</p></section>;
  }

  if (error) {
    return <section className="trending-events-section"><p className="error-message">{error}</p></section>;
  }
  
  return (
    <section className="trending-events-section">
      <div className="trending-header">
        <h2 className="trending-title">Trending Events</h2>
        
        <div className="trending-filter-container">
            <span className="price-label">NPR 100</span>
            <input type="range" min="100" max="10000" className="trending-slider" />
            <span className="price-label">NPR 10000</span>
        </div>
      </div>
      
      <div className="events-grid"> 
        {events.length > 0 ? (
            events.map(event => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                />
            ))
        ) : (
            <p>No trending events found.</p>
        )}
      </div>
    </section>
  );
};

// --- 5. FOOTER COMPONENT (Image based) ---
const Footer = () => (
    <footer className="footer-image-container">
        <img src={FooterImage} alt="Event Ghar Custom Footer" className="footer-image" />
    </footer>
);


// --- 6. Dashboard Component (UPDATED) ---
const Dashboard = () => (
  <div className="app-container">
    <Navbar />
    <main className="main-content">
      <HeroSection />
      <TrendingEvents />
    </main>
    <Footer /> 
  </div>
);

export default Dashboard;