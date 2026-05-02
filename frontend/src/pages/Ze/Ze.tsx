import React, { useEffect, useState } from "react";
import { GameProvider, useGame } from "../../contexts/GameContext/GameContext";
import { Chat } from "../../components/Chat/Chat";

export function Ze() {
  return (
    <GameProvider>
      <ZeLayout />
    </GameProvider>
  );
}

function ZeLayout() {
  const { gameId, socket } = useGame();

  return (
    <div className="p-8">
      {gameId && socket ? <GameLayout /> : <StatusDisplay />}
    </div>
  );
}

function GameLayout() {
  return (
    <div>
      <div className="flex min-h-screen items-center justify-end pr-2">
        <Chat />
      </div>
    </div>
  );
}

function StatusDisplay() {
  const { isConnected } = useGame();
  return (
    <p className={isConnected ? "text-green-500" : "text-red-500"}>
      {isConnected ? "Status: Seaching for match..." : "Status Disconnected"}
    </p>
  );
}
