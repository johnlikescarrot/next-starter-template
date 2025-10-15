"use client";

import React from "react";
import Game from "./components/Game";

const Home: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Game />
    </div>
  );
};

export default Home;