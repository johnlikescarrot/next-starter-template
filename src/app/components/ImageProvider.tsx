"use client";

import React, { createContext, useContext } from "react";
import useImage from "use-image";

interface ImageContextType {
  grass: HTMLImageElement | undefined;
  water: (HTMLImageElement | undefined)[];
  player: HTMLImageElement | undefined;
  playerWalk: (HTMLImageElement | undefined)[];
  enemy: HTMLImageElement | undefined;
  spell: HTMLImageElement | undefined;
}

const ImageContext = createContext<ImageContextType | null>(null);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grass] = useImage("/game_assets/tile_grass.png");
  const water = [
    useImage("/game_assets/tile_water_1.png")[0],
    useImage("/game_assets/tile_water_2.png")[0],
    useImage("/game_assets/tile_water_3.png")[0],
    useImage("/game_assets/tile_water_4.png")[0],
    useImage("/game_assets/tile_water_5.png")[0],
  ];
  const [player] = useImage("/game_assets/character_metodej_south.png");
  const playerWalk = [
    useImage("/game_assets/character_metodej_south_running_1.png")[0],
    useImage("/game_assets/character_metodej_south_running_2.png")[0],
  ];
  const [enemy] = useImage("/game_assets/character_ghost_south.png");
  const [spell] = useImage("/game_assets/spell_1_metodej_1.png");

  const value = { grass, water, player, playerWalk, enemy, spell };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};