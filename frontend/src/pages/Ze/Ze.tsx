import React, { useEffect, useState } from "react";
import { isCookie } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const createSocketConnection = () => {
  return io("/", {
    withCredentials: true,
    path: "/socket.io",
  });
};

const joinQueue = (socket: Socket) => {
  console.log("Joining Queue");
  socket.emit("joinQueue", { userId: "UserId" });
};

export function Ze() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null); // Nuevo estado

  useEffect(() => {
    const socketInstance = createSocketConnection();

    socketInstance.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      joinQueue(socketInstance);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socketInstance.on("matchFound", (data) => {
      console.log("Match Found!", data);
      setGameId(data.gameId); // Guardamos el ID de la sala
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="p-8">
      {gameId && socket ? (
        <Chat socket={socket} gameId={gameId} />
      ) : (
        <StatusDisplay isConnected={isConnected} />
      )}
    </div>
  );
}

function StatusDisplay({ isConnected }: { isConnected: boolean }) {
  return (
    <p className={isConnected ? "text-green-500" : "text-red-500"}>
      {isConnected ? "Status: Seaching for match..." : "Status Disconnected"}
    </p>
  );
}

export function Chat({ socket, gameId }: { socket: Socket; gameId: string }) {
  const [messages, setMessages] = useState<
    { from: string; message: string; timeStamp: string }[]
  >([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    socket.emit("sendMessage", { gameId, message: input });
    setInput("");
  };

  return (
    <div className="flex   min-h-screen items-center justify-end pr-2">
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
    </div>
  );
}
