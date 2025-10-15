"use client";

import React from "react";
import { Image as KonvaImage } from "react-konva";
import { useImages } from "./ImageProvider";

const TILE_SIZE = 32;

interface SpellProps {
  x: number;
  y: number;
}

const Spell: React.FC<SpellProps> = ({ x, y }) => {
  const { spell } = useImages();

  return (
    <KonvaImage
      x={x * TILE_SIZE}
      y={y * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      image={spell}
    />
  );
};

export default Spell;