import React, { useEffect, useState } from "react";
import { GameProvider, useGame } from "./Context/GameContext";

export function Ze() {
  return (
    <GameProvider>
      <ZeLayout />
    </GameProvider>
  );
}

function ZeLayout() {
  const { gameId, socket } = useGame(); // ¡Aquí ya no necesitas props!

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

export function Chat() {
  const { socket, gameId } = useGame();

  const [messages, setMessages] = useState<
    { from: string; message: string; timeStamp: string }[]
  >([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket?.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    socket?.emit("sendMessage", { gameId, message: input });
    setInput("");
  };

  return (
    <div className="bg-stone-900/50  max-w-100 flex-row align-center align-middle items-center justify-center rounded-2xl">
      <h1 className="flex text-white text-2xl justify-center align-center border-b-2 border-amber-300">
        Chat
      </h1>

      <div className="text-white">
        {messages.map((m, i) => (
          <p key={i} className="flex gap-2">
            <b className="text-blue-500 pl-2">{m.from}:</b> {m.message}
            <div className="flex w-full justify-end">
              <p className="text-white/30">{m.timeStamp}</p>
            </div>
          </p>
        ))}
      </div>
      <div className=" flex align-middle items-center gap-2 border-t-2 border-amber-300">
        <input
          className="flex h-max text-white pl-2"
          placeholder="Write your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-emerald-800 text-xl  hover:bg-emerald-700 transition rounded align-middle p-2 text-white "
        >
          Send
        </button>
      </div>
    </div>
  );
}
