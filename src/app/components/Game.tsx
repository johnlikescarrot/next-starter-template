"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Text, Rect } from "react-konva";
import Tilemap from "./Tilemap";
import Player from "./Player";
import Enemy from "./Enemy";
import Spell from "./Spell";
import UI from "./UI";
import { ImageProvider } from "./ImageProvider";

export interface Position {
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [spells, setSpells] = useState<Position[]>([]);
  const [enemies, setEnemies] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 1, y: 1 });
  const [playerHealth, setPlayerHealth] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const gameLoopRef = useRef<number>();

  const handlePlayerMove = (newPosition: Position) => {
    setPlayerPosition(newPosition);
  };

  const handlePlayerAttack = (newSpell: Position) => {
    setSpells((prevSpells) => [...prevSpells, newSpell]);
  };

  const handlePlayerCollision = useCallback(() => {
    setPlayerHealth((prevHealth) => {
      const newHealth = Math.max(0, prevHealth - 10);
      if (newHealth === 0) {
        setIsGameOver(true);
      }
      return newHealth;
    });
  }, []);

  const gameLoop = useCallback(
    (time: number) => {
      setGameTime(time);

      if (!isGameOver) {
        // Spell movement
        setSpells((prevSpells) =>
          prevSpells.map((spell) => ({ ...spell, x: spell.x + 0.1 })).filter((spell) => spell.x < 25)
        );

        // Collision detection
        const newSpells: Position[] = [];
        const newEnemies: Position[] = [];

        let spellsHit: boolean[] = new Array(spells.length).fill(false);
        let enemiesHit: boolean[] = new Array(enemies.length).fill(false);

        for (let i = 0; i < spells.length; i++) {
          for (let j = 0; j < enemies.length; j++) {
            if (
              Math.abs(spells[i].x - enemies[j].x) < 1 &&
              Math.abs(spells[i].y - enemies[j].y) < 1
            ) {
              spellsHit[i] = true;
              enemiesHit[j] = true;
            }
          }
        }

        for (let i = 0; i < spells.length; i++) {
          if (!spellsHit[i]) {
            newSpells.push(spells[i]);
          }
        }

        for (let i = 0; i < enemies.length; i++) {
          if (!enemiesHit[i]) {
            newEnemies.push(enemies[i]);
          }
        }

        setSpells(newSpells);
        setEnemies(newEnemies);

        for (const enemy of enemies) {
          if (
            Math.abs(playerPosition.x - enemy.x) < 1 &&
            Math.abs(playerPosition.y - enemy.y) < 1
          ) {
            handlePlayerCollision();
          }
        }
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [isGameOver, spells, enemies, playerPosition, handlePlayerCollision]
  );

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <ImageProvider>
      <Stage width={800} height={640}>
        <Tilemap />
        <Layer>
          {!isGameOver ? (
            <>
              <Player onMove={handlePlayerMove} onAttack={handlePlayerAttack} />
              {enemies.map((enemy, i) => (
                <Enemy key={i} x={enemy.x} y={enemy.y} />
              ))}
              {spells.map((spell, i) => (
                <Spell key={i} x={spell.x} y={spell.y} />
              ))}
              <UI health={playerHealth} />
            </>
          ) : (
            <>
              <Rect x={0} y={0} width={800} height={640} fill="rgba(0,0,0,0.5)" />
              <Text
                x={300}
                y={300}
                text="Game Over"
                fontSize={48}
                fontFamily="sans-serif"
                fill="red"
              />
            </>
          )}
        </Layer>
      </Stage>
    </ImageProvider>
  );
};

export default Game;