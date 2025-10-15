"use client";

import React, { useState, useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import { useImages } from "./ImageProvider";
import { tilemap } from "./Tilemap";

const TILE_SIZE = 32;

interface EnemyProps {
  x: number;
  y: number;
}

const Enemy: React.FC<EnemyProps> = ({ x, y }) => {
  const { enemy } = useImages();
  const [position, setPosition] = useState({ x, y });
  const [direction, setDirection] = useState(1);
  const animationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    animationRef.current = setInterval(() => {
      setPosition((prevPosition) => {
        let newX = prevPosition.x + direction;
        if (newX > 15 || newX < 5 || tilemap[position.y][newX] === "water") {
          setDirection(-direction);
          newX = prevPosition.x - direction;
        }
        return { ...prevPosition, x: newX };
      });
    }, 1000);

    return () => clearInterval(animationRef.current);
  }, [direction, position.y]);

  return (
    <KonvaImage
      x={position.x * TILE_SIZE}
      y={position.y * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      image={enemy}
    />
  );
};

export default Enemy;