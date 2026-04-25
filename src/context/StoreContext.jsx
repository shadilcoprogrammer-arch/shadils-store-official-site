import React, { createContext, useContext, useState, useMemo } from 'react';
import { gamesData } from '../data/games';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGames = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return gamesData.filter(game => game.comingSoon);
      case 'size':
        return gamesData.filter(game => {
          const sizeMB = parseFloat(game.size);
          return !isNaN(sizeMB) && sizeMB < 200;
        });
      case 'rating':
        return gamesData.filter(game => {
          const ratingNum = parseFloat(game.rating);
          return !isNaN(ratingNum) && ratingNum >= 4.7;
        }).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'windows':
        return gamesData.filter(game => game.platforms?.includes('windows'));
      case 'android':
        return gamesData.filter(game => game.platforms?.includes('android'));
      case 'apple':
      case 'mac':
        return gamesData.filter(game => game.platforms?.includes('mac'));
      case 'ios':
        return gamesData.filter(game => game.platforms?.includes('ios'));
      case 'linux':
        return gamesData.filter(game => game.platforms?.includes('linux'));
      default:
        return gamesData;
    }
  }, [activeFilter]);

  return (
    <StoreContext.Provider value={{ activeFilter, setActiveFilter, filteredGames }}>
      {children}
    </StoreContext.Provider>
  );
};
