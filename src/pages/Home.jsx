import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import GameGrid from '../components/GameGrid';
import { gamesData } from '../data/games';
import { useStore } from '../context/StoreContext';

const Home = () => {
  const { filteredGames, activeFilter } = useStore();

  const getTitle = () => {
    switch (activeFilter) {
      case 'upcoming': return "Upcoming Releases";
      case 'size': return "Lightweight Games (Under 200MB)";
      case 'rating': return "Top Rated Apps & Games";
      default: return "Recommended for you";
    }
  };

  return (
    <>
      <HeroCarousel games={filteredGames} />
      <GameGrid games={filteredGames} title={getTitle()} />
    </>
  );
};

export default Home;
