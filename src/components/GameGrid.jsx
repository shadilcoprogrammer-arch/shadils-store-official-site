import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './GameGrid.css';

const GameGrid = ({ games, title = "Recommended for you" }) => {
  const navigate = useNavigate();
  const { activeFilter } = useStore();

  if (games.length === 0) {
    return (
      <div className="game-grid-container">
        <h2 className="section-title">{title}</h2>
        <div className="empty-state">
          <div className="sad-bunny-wrapper">
            <svg className="sad-bunny" viewBox="0 0 100 100" width="120" height="120">
              {/* Bunny Head */}
              <circle cx="50" cy="65" r="20" fill="rgba(8, 240, 126, 0.1)" stroke="var(--mint-install)" strokeWidth="2" />
              {/* Ears */}
              <path d="M40,50 Q30,10 35,45 Z" fill="rgba(8, 240, 126, 0.05)" stroke="var(--mint-install)" strokeWidth="2" />
              <path d="M60,50 Q70,10 65,45 Z" fill="rgba(8, 240, 126, 0.05)" stroke="var(--mint-install)" strokeWidth="2" />
              {/* Sad Eyes */}
              <circle cx="43" cy="60" r="2" fill="var(--text-secondary)" />
              <circle cx="57" cy="60" r="2" fill="var(--text-secondary)" />
              <path d="M48,70 Q50,68 52,70" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" />
            </svg>
            <div className="bunny-shadow"></div>
          </div>
          <p className="empty-text">Not released anything yet for this platform</p>
        </div>
      </div>
    );
  }

  const isMobile = window.innerWidth <= 768;

  // Chunk games into groups of 5 for mobile list view
  const chunkedGames = [];
  for (let i = 0; i < games.length; i += 5) {
    chunkedGames.push(games.slice(i, i + 5));
  }

  return (
    <div className="game-grid-container">
      <h2 className="section-title">{title}</h2>
      
      {isMobile ? (
        <div className="game-horizontal-scroll">
          {chunkedGames.map((chunk, columnIndex) => (
            <div key={columnIndex} className="game-column">
              {chunk.map((game) => (
                <div key={game.id} className="game-list-item" onClick={() => navigate(`/game/${game.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="list-icon-wrapper">
                    <img src={game.iconPath} alt={game.title} className="list-icon" />
                  </div>
                  <div className="list-meta">
                    <h3 className="list-title">{game.title.split(',')[0]}</h3>
                    <div className="list-subtitle">
                      <span className="list-rating">
                        {game.rating} <span className="star-icon">★</span>
                      </span>
                      <span className="list-category">{game.tags[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="game-grid">
          {games.map((game) => (
            <div key={game.id} className="game-grid-item" onClick={() => navigate(`/game/${game.id}`)} style={{ cursor: 'pointer' }}>
              <div className="grid-icon-wrapper">
                <img src={game.iconPath} alt={game.title} className="grid-icon" />
              </div>
              <div className="grid-meta">
                <h3 className="grid-title">{game.title.split(',')[0]}</h3>
                <div className="grid-rating">
                  {game.rating} <span className="star-icon">★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameGrid;
