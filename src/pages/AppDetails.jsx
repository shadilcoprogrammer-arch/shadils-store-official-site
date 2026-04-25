import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesData } from '../data/games';
import './AppDetails.css';

const getOS = () => {
  // Priority: Use responsiveness/screen width to determine "Effective OS"
  if (window.innerWidth <= 768) return 'android';
  
  const platform = window.navigator.platform;
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  if (windowsPlatforms.indexOf(platform) !== -1) return 'windows';
  
  return 'windows'; // Default to PC/Windows for larger screens
};

const AppDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [localVersion, setLocalVersion] = useState(null);

  useEffect(() => {
    const foundGame = gamesData.find(g => g.id === id);
    if (foundGame) {
      setGame(foundGame);
      setIsInstalled(localStorage.getItem(`installed_${foundGame.id}`) === 'true');
      setIsPending(localStorage.getItem(`pending_${foundGame.id}`) === 'true');
      setLocalVersion(localStorage.getItem(`version_${foundGame.id}`));
    } else {
      navigate('/'); // Go back if game not found
    }
  }, [id, navigate]);

  const handleInstall = (e) => {
    // If on mobile/Capacitor, try to force the system browser
    if (window.Capacitor) {
      e.preventDefault();
      window.open(game.downloadUrl, '_system');
    }
    localStorage.setItem(`pending_${game.id}`, 'true');
    setIsPending(true);
  };

  const handleConfirm = () => {
    localStorage.setItem(`installed_${game.id}`, 'true');
    localStorage.setItem(`version_${game.id}`, game.version);
    localStorage.removeItem(`pending_${game.id}`);
    setIsInstalled(true);
    setIsPending(false);
    setLocalVersion(game.version);
  };

  const handleUninstall = () => {
    const confirm = window.confirm("Are you sure you want to uninstall this application from the store? This will reset your installation status.");
    if (confirm) {
      localStorage.removeItem(`installed_${game.id}`);
      localStorage.removeItem(`pending_${game.id}`);
      localStorage.removeItem(`version_${game.id}`);
      setIsInstalled(false);
      setIsPending(false);
      setLocalVersion(null);
    }
  };

  const renderActions = () => {
    if (game.comingSoon) {
      return (
        <button className="details-install-btn coming-soon-btn">
          Coming Soon
        </button>
      );
    }
    if (isInstalled) {
      const needsUpdate = localVersion && game.version && localVersion !== game.version;
      
      if (needsUpdate) {
        return (
          <div className="installed-btn-group">
            <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer" className="details-install-btn update-btn" onClick={handleInstall}>
              Update Available
              <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
            <button className="uninstall-btn" onClick={handleUninstall} title="Uninstall from Store">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        );
      }

      return (
        <div className="installed-btn-group">
          <button className="details-install-btn open-btn" style={{ cursor: 'default' }}>
            Installed
            <svg className="install-check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button className="uninstall-btn" onClick={handleUninstall} title="Uninstall from Store">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      );
    }
    if (isPending) {
      return (
        <button className="details-install-btn pending-btn" onClick={handleConfirm}>
          Confirm Downloaded
          <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </button>
      );
    }
    const isAndroidOnly = game.platforms && game.platforms.length === 1 && game.platforms[0] === 'android';
    const isWindowsOnly = game.platforms && game.platforms.length === 1 && game.platforms[0] === 'windows';
    const currentOS = getOS();

    // Block logic: if user is on Windows but app is Android-only
    if (isAndroidOnly && currentOS === 'windows') {
      return (
        <button className="details-install-btn unavailable-btn" style={{ cursor: 'default' }}>
          Available on <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.523 15.3414C17.523 15.8614 17.103 16.2814 16.583 16.2814C16.063 16.2814 15.643 15.3414 15.643 15.3414C16.063 14.8214 16.583 14.4014 16.583 14.4014C17.103 14.4014 17.523 14.8214 17.523 15.3414ZM8.357 15.3414C8.357 15.8614 7.937 16.2814 7.417 16.2814C6.897 16.2814 6.477 15.8614 6.477 15.3414C6.477 14.8214 6.897 14.4014 7.417 14.4014C7.937 14.4014 8.357 14.8214 8.357 15.3414ZM17.92 10.7414L19.46 8.07142C19.55 7.91142 19.49 7.71142 19.33 7.62142C19.17 7.53142 18.97 7.59142 18.88 7.75142L17.32 10.4514C15.8 9.77142 14.02 9.40142 12 9.40142C9.98 9.40142 8.2 9.77142 6.68 10.4514L5.12 7.75142C5.03 7.59142 4.83 7.53142 4.67 7.62142C4.51 7.71142 4.45 7.91142 4.54 8.07142L6.08 10.7414C2.92 12.5014 0.81 15.6814 0.52 19.3814H23.48C23.19 15.6814 21.08 12.5014 17.92 10.7414Z" fill="currentColor"/></svg>
        </button>
      );
    }

    // Block logic: if user is on Android but app is Windows-only
    if (isWindowsOnly && currentOS === 'android') {
      return (
        <button className="details-install-btn unavailable-btn" style={{ cursor: 'default' }}>
          Available on <svg style={{ marginLeft: '8px' }} width="20" height="20" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 12.402L35.687 7.46V41.565H0V12.402ZM35.687 46.122V80.54L0 75.598V46.122H35.687ZM87.19 0L40.73 6.643V41.565H87.19V0ZM40.73 46.122V81.357L87.19 88V46.122H40.73Z" fill="currentColor"/></svg>
        </button>
      );
    }
    
    if (game.underMaintenance) {
      return (
        <button className="details-install-btn unavailable-btn" style={{ cursor: 'default' }}>
          Update Underway
        </button>
      );
    }

    return (
      <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer" className="details-install-btn" download onClick={(e) => handleInstall(e)}>
        Get
        <svg viewBox="0 0 40 40" width="22" height="22" className="bucket-animate" style={{ marginLeft: '0px' }}>
          <defs>
            <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#888888" />
            </linearGradient>
          </defs>
          <path d="M6,14 L34,14 L31,34 C31,35.5 30,36.5 28.5,36.5 L11.5,36.5 C10,36.5 9,35.5 9,34 L6,14 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M12,14 C12,14 12,5 20,5 C28,5 28,14 28,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M22,21 L18,21 C18,21 17,21 17,22 C17,23 17,24 22,24 C27,24 23,29 18,29 L22,29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    );
  };

  if (!game) return null;

  return (
    <div className="app-details-container">
      {/* Background Hero Banner */}
      <div className="details-hero-bg">
        <img src={game.bannerPath} alt={game.title} className="details-hero-img" />
        <div className="details-hero-gradient"></div>
        
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
          </svg>
        </button>
      </div>

      <div className="details-content">
        {/* Header Section: Icon + Info */}
        <div className="details-header">
          <div className="details-icon-wrapper">
            <img src={game.iconPath} alt={game.title} className="details-icon" />
          </div>
          <div className="details-info">
            <h1 className="details-title">{game.title}</h1>
            <p className="details-publisher">{game.publisher}</p>
            <div className="details-meta-row">
              <span className="details-rating">{game.rating} ★</span>
              <span className="details-tag">{game.tags[0]}</span>
              <span className="details-size">{game.size}</span>
              {game.platforms && (
                <div className="details-platforms" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {game.platforms.includes('windows') && (
                    <svg title="Windows" width="18" height="18" viewBox="0 0 88 88" fill="rgba(255,255,255,0.6)"><path d="M0 12.402L35.687 7.46V41.565H0V12.402ZM35.687 46.122V80.54L0 75.598V46.122H35.687ZM87.19 0L40.73 6.643V41.565H87.19V0ZM40.73 46.122V81.357L87.19 88V46.122H40.73Z" fill="currentColor"/></svg>
                  )}
                  {game.platforms.includes('android') && (
                    <svg title="Android" width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M17.523 15.3414C17.523 15.8614 17.103 16.2814 16.583 16.2814C16.063 16.2814 15.643 15.8614 15.643 15.3414C15.643 14.8214 16.063 14.4014 16.583 14.4014C17.103 14.4014 17.523 14.8214 17.523 15.3414ZM8.357 15.3414C8.357 15.8614 7.937 16.2814 7.417 16.2814C6.897 16.2814 6.477 15.8614 6.477 15.3414C6.477 14.8214 6.897 14.4014 7.417 14.4014C7.937 14.4014 8.357 14.8214 8.357 15.3414ZM17.92 10.7414L19.46 8.07142C19.55 7.91142 19.49 7.71142 19.33 7.62142C19.17 7.53142 18.97 7.59142 18.88 7.75142L17.32 10.4514C15.8 9.77142 14.02 9.40142 12 9.40142C9.98 9.40142 8.2 9.77142 6.68 10.4514L5.12 7.75142C5.03 7.59142 4.83 7.53142 4.67 7.62142C4.51 7.71142 4.45 7.91142 4.54 8.07142L6.08 10.7414C2.92 12.5014 0.81 15.6814 0.52 19.3814H23.48C23.19 15.6814 21.08 12.5014 17.92 10.7414Z" fill="currentColor"/></svg>
                  )}
                </div>
              )}
            </div>
            <div className="details-desktop-actions">
              {renderActions()}
            </div>
          </div>
          </div>

          {/* Screenshots Gallery */}
          <div className="details-gallery-section">
            <div className="details-gallery">
              {game.screenshots.map((src, index) => (
                <div key={index} className="gallery-item" onClick={() => setSelectedImage(src)} style={{ cursor: 'pointer' }}>
                  <img src={src} alt={`${game.title} screenshot ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="details-about-section">
            <h2 className="about-title">About this game</h2>
            <p className="about-desc">{game.description}</p>
            <div className="tags-list">
              {game.platforms && game.platforms.map(platform => (
                <span key={platform} className="meta-tag platform-tag" style={{ textTransform: 'capitalize', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {platform}
                </span>
              ))}
              {game.tags.map(tag => (
                <span key={tag} className="meta-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Footer for Mobile */}
        <div className="details-sticky-footer">
          {renderActions()}
        </div>
      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Fullscreen preview" className="lightbox-img" />
        </div>
      )}
    </div>
  );
};

export default AppDetails;
