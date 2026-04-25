import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroCarousel.css';

const getOS = () => {
  // Priority: Use responsiveness/screen width to determine "Effective OS"
  if (window.innerWidth <= 768) return 'android';
  
  const platform = window.navigator.platform;
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  if (windowsPlatforms.indexOf(platform) !== -1) return 'windows';
  
  return 'windows'; // Default to PC/Windows for larger screens
};

const HeroCarousel = ({ games }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [installedGames, setInstalledGames] = useState({});
  const [pendingGames, setPendingGames] = useState({});
  const [localVersions, setLocalVersions] = useState({});
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Identify already installed and pending games from local browser cache
    const installedState = {};
    const pendingState = {};
    const versionState = {};
    games.forEach(g => {
      if (localStorage.getItem(`installed_${g.id}`) === 'true') {
        installedState[g.id] = true;
      }
      if (localStorage.getItem(`pending_${g.id}`) === 'true') {
        pendingState[g.id] = true;
      }
      versionState[g.id] = localStorage.getItem(`version_${g.id}`);
    });
    setInstalledGames(installedState);
    setPendingGames(pendingState);
    setLocalVersions(versionState);
  }, [games]);

  const handleInstall = (e, game) => {
    e.stopPropagation();
    // If on mobile/Capacitor, try to force the system browser
    if (window.Capacitor) {
      e.preventDefault();
      window.open(game.downloadUrl, '_system');
    }
    localStorage.setItem(`pending_${game.id}`, 'true');
    setPendingGames(prev => ({ ...prev, [game.id]: true }));
  };

  const handleConfirm = (e, game) => {
    e.stopPropagation();
    localStorage.setItem(`installed_${game.id}`, 'true');
    localStorage.setItem(`version_${game.id}`, game.version);
    localStorage.removeItem(`pending_${game.id}`);
    setInstalledGames(prev => ({ ...prev, [game.id]: true }));
    setPendingGames(prev => ({ ...prev, [game.id]: false }));
    setLocalVersions(prev => ({ ...prev, [game.id]: game.version }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // If we've reached the end, snap back to beginning smoothly
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Dynamically calculate one card width + gap
          const card = carouselRef.current.querySelector('.hero-card');
          if (card) {
            const cardWidth = card.offsetWidth;
            const gap = parseInt(window.getComputedStyle(carouselRef.current).gap) || 0;
            carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
          } else {
            // Fallback to original desktop width if card not found
            carouselRef.current.scrollBy({ left: 712, behavior: 'smooth' });
          }
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="hero-carousel-wrapper">
      <div 
        className="hero-carousel" 
        ref={carouselRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
      >
        {games.map((game) => (
          <div key={game.id} className="hero-card" onClick={() => navigate(`/game/${game.id}`)} style={{ cursor: 'pointer' }}>
            <div className="hero-card-bg">
              <img src={game.bannerPath} alt={game.title} className="hero-banner-img" />
              <div className="hero-gradient"></div>
            </div>
            
            <div className="hero-card-content">
              <div className="hero-text-content">
                <h2 className="hero-title">{game.title}</h2>
                <p className="hero-desc">{game.description}</p>
              </div>
              <div className="hero-action-row">
                <div className="hero-icon-info">
                  <div className="hero-icon-wrapper">
                    <img src={game.iconPath} alt={game.title} className="hero-icon" />
                  </div>
                  <div className="hero-meta">
                    <div className="hero-meta-title">{game.title.split(',')[0]}</div>
                    <div className="hero-meta-subtitle">
                      {game.publisher} • <span className="hero-rating">{game.rating} ★</span> • {game.size}
                      {game.platforms && (
                        <span className="hero-platforms" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginLeft: '8px' }}>
                           • 
                          {game.platforms.includes('windows') && (
                            <svg title="Windows" width="14" height="14" viewBox="0 0 88 88" fill="rgba(255,255,255,0.6)" style={{ verticalAlign: 'middle' }}><path d="M0 12.402L35.687 7.46V41.565H0V12.402ZM35.687 46.122V80.54L0 75.598V46.122H35.687ZM87.19 0L40.73 6.643V41.565H87.19V0ZM40.73 46.122V81.357L87.19 88V46.122H40.73Z" fill="currentColor"/></svg>
                          )}
                          {game.platforms.includes('android') && (
                            <svg title="Android" width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)" style={{ verticalAlign: 'middle' }}><path d="M17.523 15.3414C17.523 15.8614 17.103 16.2814 16.583 16.2814C16.063 16.2814 15.643 15.8614 15.643 15.3414C15.643 14.8214 16.063 14.4014 16.583 14.4014C17.103 14.4014 17.523 14.8214 17.523 15.3414ZM8.357 15.3414C8.357 15.8614 7.937 16.2814 7.417 16.2814C6.897 16.2814 6.477 15.8614 6.477 15.3414C6.477 14.8214 6.897 14.4014 7.417 14.4014C7.937 14.4014 8.357 14.8214 8.357 15.3414ZM17.92 10.7414L19.46 8.07142C19.55 7.91142 19.49 7.71142 19.33 7.62142C19.17 7.53142 18.97 7.59142 18.88 7.75142L17.32 10.4514C15.8 9.77142 14.02 9.40142 12 9.40142C9.98 9.40142 8.2 9.77142 6.68 10.4514L5.12 7.75142C5.03 7.59142 4.83 7.53142 4.67 7.62142C4.51 7.71142 4.45 7.91142 4.54 8.07142L6.08 10.7414C2.92 12.5014 0.81 15.6814 0.52 19.3814H23.48C23.19 15.6814 21.08 12.5014 17.92 10.7414Z" fill="currentColor"/></svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="hero-install-wrapper">
                  {game.comingSoon ? (
                    <button className="install-btn coming-soon-btn" onClick={(e) => e.stopPropagation()}>
                      Coming Soon
                    </button>
                  ) : installedGames[game.id] ? (
                    (() => {
                      const needsUpdate = localVersions[game.id] && game.version && localVersions[game.id] !== game.version;
                      if (needsUpdate) {
                        return (
                          <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer" className="install-btn update-btn" download onClick={(e) => handleInstall(e, game)}>
                            Update
                            <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          </a>
                        );
                      }
                      return (
                        <button className="install-btn open-btn" onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
                          Installed
                          <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                      );
                    })()
                  ) : pendingGames[game.id] ? (
                    <button className="install-btn pending-btn" onClick={(e) => handleConfirm(e, game)}>
                      Confirm Downloaded
                    </button>
                  ) : (
                    (() => {
                      const isAndroidOnly = game.platforms && game.platforms.length === 1 && game.platforms[0] === 'android';
                      const isWindowsOnly = game.platforms && game.platforms.length === 1 && game.platforms[0] === 'windows';
                      const currentOS = getOS();

                      if (isAndroidOnly && currentOS === 'windows') {
                        return (
                          <button className="install-btn unavailable-btn" style={{ cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                            Available on <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.523 15.3414C17.523 15.8614 17.103 16.2814 16.583 16.2814C16.063 16.2814 15.643 15.8614 15.643 15.3414C15.643 14.8214 16.063 14.4014 16.583 14.4014C17.103 14.4014 17.523 14.8214 17.523 15.3414ZM8.357 15.3414C8.357 15.8614 7.937 16.2814 7.417 16.2814C6.897 16.2814 6.477 15.8614 6.477 15.3414C6.477 14.8214 6.897 14.4014 7.417 14.4014C7.937 14.4014 8.357 14.8214 8.357 15.3414ZM17.92 10.7414L19.46 8.07142C19.55 7.91142 19.49 7.71142 19.33 7.62142C19.17 7.53142 18.97 7.59142 18.88 7.75142L17.32 10.4514C15.8 9.77142 14.02 9.40142 12 9.40142C9.98 9.40142 8.2 9.77142 6.68 10.4514L5.12 7.75142C5.03 7.59142 4.83 7.53142 4.67 7.62142C4.51 7.71142 4.45 7.91142 4.54 8.07142L6.08 10.7414C2.92 12.5014 0.81 15.6814 0.52 19.3814H23.48C23.19 15.6814 21.08 12.5014 17.92 10.7414Z" fill="currentColor"/></svg>
                          </button>
                        );
                      }

                      if (isWindowsOnly && currentOS === 'android') {
                        return (
                          <button className="install-btn unavailable-btn" style={{ cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                            Unavailable
                          </button>
                        );
                      }

                      if (game.underMaintenance) {
                        return (
                          <button className="install-btn unavailable-btn" style={{ cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                            Update Underway
                          </button>
                        );
                      }

                      return (
                        <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer" className="install-btn" download onClick={(e) => handleInstall(e, game)}>
                          Get
                          <svg viewBox="0 0 40 40" width="20" height="20" className="bucket-animate" style={{ marginLeft: '3px' }}>
                            <path d="M6,14 L34,14 L31,34 C31,35.5 30,36.5 28.5,36.5 L11.5,36.5 C10,36.5 9,35.5 9,34 L6,14 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                            <path d="M12,14 C12,14 12,5 20,5 C28,5 28,14 28,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M22,21 L18,21 C18,21 17,21 17,22 C17,23 17,24 22,24 C27,24 23,29 18,29 L22,29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      );
                    })()
                  )}
                  <span className="install-desc">Contains in-app purchases</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
