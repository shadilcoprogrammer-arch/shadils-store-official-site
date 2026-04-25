import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gamesData } from '../data/games';
import { useStore } from '../context/StoreContext';
import './Header.css';

const Header = () => {
  const { activeFilter, setActiveFilter } = useStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const filterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // scrolling down
          setIsVisible(false);
          setIsFilterOpen(false); // also close filters if hidden
          setIsOpen(false); // close search
        } else { // scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const lowerQ = query.toLowerCase();
    const filtered = gamesData.filter(g => 
      g.title.toLowerCase().includes(lowerQ) || 
      g.description.toLowerCase().includes(lowerQ)
    );
    setResults(filtered);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/game/${id}`);
  };

  const filters = [
    { id: 'all', label: 'All Games' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'size', label: 'Below 200MB' },
    { id: 'rating', label: 'Most Rated' },
    { id: 'windows', label: 'Windows', type: 'platform', icon: (
      <svg width="20" height="20" viewBox="0 0 88 88" fill="currentColor"><path d="M0 12.402L35.687 7.46V41.565H0V12.402ZM35.687 46.122V80.54L0 75.598V46.122H35.687ZM87.19 0L40.73 6.643V41.565H87.19V0ZM40.73 46.122V81.357L87.19 88V46.122H40.73Z"/></svg>
    )},
    { id: 'android', label: 'Android', type: 'platform', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414C17.523 15.8614 17.103 16.2814 16.583 16.2814C16.063 16.2814 15.643 15.8614 15.643 15.3414C15.643 14.8214 16.063 14.4014 16.583 14.4014C17.103 14.4014 17.523 14.8214 17.523 15.3414ZM8.357 15.3414C8.357 15.8614 7.937 16.2814 7.417 16.2814C6.897 16.2814 6.477 15.8614 6.477 15.3414C6.477 14.8214 6.897 14.4014 7.417 14.4014C7.937 14.4014 8.357 14.4014 8.357 15.3414ZM17.92 10.7414L19.46 8.07142C19.55 7.91142 19.49 7.71142 19.33 7.62142C19.17 7.53142 18.97 7.59142 18.88 7.75142L17.32 10.4514C15.8 9.77142 14.02 9.40142 12 9.40142C9.98 9.40142 8.2 9.77142 6.68 10.4514L5.12 7.75142C5.03 7.59142 4.83 7.53142 4.67 7.62142C4.51 7.71142 4.45 7.91142 4.54 8.07142L6.08 10.7414C2.92 12.5014 0.81 15.6814 0.52 19.3814H23.48C23.19 15.6814 21.08 12.5014 17.92 10.7414Z"/></svg>
    )}
  ];

  return (
    <header className={`header ${!isVisible ? 'header-hidden' : ''}`}>
      <div className="header-left">
        <Link to="/" className="logo">
          <svg viewBox="0 0 40 40" width="40" height="40" className="play-icon">
            <defs>
              <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#08f07e" />
                <stop offset="100%" stopColor="#03a055" />
              </linearGradient>
              <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Particles */}
            <circle cx="5" cy="12" r="1" fill="#08f07e" filter="url(#ultraGlow)">
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="36" cy="18" r="0.8" fill="#08f07e" filter="url(#ultraGlow)">
              <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="10" cy="36" r="1.2" fill="#fff" filter="url(#ultraGlow)">
              <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
            </circle>
            
            {/* The Bucket Frame (Widened) */}
            <path d="M6,14 L34,14 L31,34 C31,35.5 30,36.5 28.5,36.5 L11.5,36.5 C10,36.5 9,35.5 9,34 L6,14 Z" fill="rgba(8,240,126,0.05)" stroke="url(#sGrad)" strokeWidth="2" strokeLinejoin="round" filter="url(#ultraGlow)"/>
            
            {/* The Handle (Widened) */}
            <path d="M12,14 C12,14 12,5 20,5 C28,5 28,14 28,14" fill="none" stroke="url(#sGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#ultraGlow)"/>
            <path d="M15,9 C15,9 17,7 20,7 C23,7 25,9 25,9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
            
            {/* Modern Geometric "S" */}
            <path d="M22,21 L18,21 C18,21 17,21 17,22 C17,23 17,24 22,24 C27,24 23,29 18,29 L22,29" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#ultraGlow)"/>
          </svg>
          <span className="logo-text">Shadil's Store</span>
        </Link>
      </div>
      <div className="header-right">
        <div className="filter-container" ref={filterRef}>
          <button 
            className={`filter-btn ${activeFilter !== 'all' ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>{filters.find(f => f.id === activeFilter)?.label}</span>
          </button>
          
          {isFilterOpen && (
            <div className="filter-dropdown">
              <div className="filter-group">
                {filters.filter(f => f.type !== 'platform').map(f => (
                  <div 
                    key={f.id} 
                    className={`filter-item ${activeFilter === f.id ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveFilter(f.id);
                      setIsFilterOpen(false);
                      navigate('/');
                    }}
                  >
                    {f.label}
                  </div>
                ))}
              </div>
              <div className="filter-platform-list">
                {filters.filter(f => f.type === 'platform').map(f => (
                  <div 
                    key={f.id} 
                    className={`platform-row-item ${activeFilter === f.id ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveFilter(f.id);
                      setIsFilterOpen(false);
                      navigate('/');
                    }}
                  >
                    <span className="platform-icon-wrapper">{f.icon}</span>
                    <span className="platform-row-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="search-container" ref={searchRef}>
          <div className={`search-bar ${isOpen ? 'active' : ''}`}>
            <svg className="search-icon" focusable="false" width="24" height="24" viewBox="0 0 24 24" onClick={() => setIsOpen(true)}>
              <path fill="#a1a1aa" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search games..." 
              value={query}
              onChange={(e) => {setQuery(e.target.value); setIsOpen(true);}}
              onFocus={() => setIsOpen(true)}
            />
            {query && (
              <button className="clear-btn" onClick={() => setQuery('')}>✕</button>
            )}
          </div>
          {isOpen && results.length > 0 && (
            <div className="search-dropdown">
              {results.map(game => (
                <div key={game.id} className="search-result-item" onClick={() => handleSelect(game.id)}>
                  <img src={game.iconPath} alt={game.title} className="search-result-icon" />
                  <div className="search-result-info">
                    <div className="search-result-title">{game.title}</div>
                    <div className="search-result-publisher">{game.publisher}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isOpen && query && results.length === 0 && (
            <div className="search-dropdown empty-dropdown">
              <div className="search-result-info" style={{padding: '16px'}}>No games found for "{query}"</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
