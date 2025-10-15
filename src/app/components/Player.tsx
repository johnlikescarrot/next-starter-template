"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import { useImages } from "./ImageProvider";
import { Position } from "./Game";
import { tilemap } from "./Tilemap";

const TILE_SIZE = 32;
const MAP_WIDTH = 25;
const MAP_HEIGHT = 20;

interface PlayerProps {
  onMove: (position: Position) => void;
  onAttack: (position: Position) => void;
}

const Player: React.FC<PlayerProps> = ({ onMove, onAttack }) => {
  const { player, playerWalk } = useImages();
  const [walkCycle, setWalkCycle] = useState(0);
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [isMoving, setIsMoving] = useState(false);

  const animationRef = useRef<NodeJS.Timeout>();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        onAttack({ x: position.x + 1, y: position.y });
        return;
      }

      setIsMoving(true);
      setPosition((prevPosition) => {
        let { x, y } = prevPosition;
        switch (e.key) {
          case "ArrowUp":
            y = Math.max(0, y - 1);
            break;
          case "ArrowDown":
            y = Math.min(MAP_HEIGHT - 1, y + 1);
            break;
          case "ArrowLeft":
            x = Math.max(0, x - 1);
            break;
          case "ArrowRight":
            x = Math.min(MAP_WIDTH - 1, x + 1);
            break;
          default:
            break;
        }
        if (tilemap[y][x] === "water") {
          return prevPosition;
        }
        const newPosition = { x, y };
        onMove(newPosition);
        return newPosition;
      });
    },
    [onMove, onAttack, position]
  );

  const handleKeyUp = useCallback(() => {
    setIsMoving(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (isMoving) {
      animationRef.current = setInterval(() => {
        setWalkCycle((prev) => (prev + 1) % 2);
      }, 200);
    } else {
      clearInterval(animationRef.current);
      setWalkCycle(0);
    }
    return () => clearInterval(animationRef.current);
  }, [isMoving]);

  return (
    <KonvaImage
      x={position.x * TILE_SIZE}
      y={position.y * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      image={isMoving ? playerWalk[walkCycle] : player}
    />
  );
};

export default Player;