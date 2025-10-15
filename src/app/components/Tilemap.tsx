"use client";

import React, { useState, useEffect } from "react";
import { Layer, Image as KonvaImage } from "react-konva";
import { useImages } from "./ImageProvider";

const TILE_SIZE = 32;
const MAP_WIDTH = 25;
const MAP_HEIGHT = 20;

export const tilemap = Array.from({ length: MAP_HEIGHT }, () =>
  Array.from({ length: MAP_WIDTH }, () => (Math.random() > 0.8 ? "water" : "grass"))
);

const Tilemap: React.FC = () => {
  const { grass, water } = useImages();
  const [waterFrame, setWaterFrame] = useState(0);

  useEffect(() => {
    const animation = setInterval(() => {
      setWaterFrame((prev) => (prev + 1) % 5);
    }, 300);
    return () => clearInterval(animation);
  }, []);

  return (
    <Layer>
      {tilemap.map((row, y) =>
        row.map((tile, x) => {
          const image = tile === "water" ? water[waterFrame] : grass;
          return (
            <KonvaImage
              key={`${x}-${y}`}
              x={x * TILE_SIZE}
              y={y * TILE_SIZE}
              width={TILE_SIZE}
              height={TILE_SIZE}
              image={image}
            />
          );
        })
      )}
    </Layer>
  );
};

export default Tilemap;