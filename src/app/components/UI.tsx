"use client";

import React from "react";
import { Text } from "react-konva";

interface UIProps {
  health: number;
}

const UI: React.FC<UIProps> = ({ health }) => {
  return (
    <Text
      x={10}
      y={10}
      text={`Health: ${health}`}
      fontSize={24}
      fontFamily="sans-serif"
      fill="white"
    />
  );
};

export default UI;