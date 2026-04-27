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
      <h1 className="text-white text-2xl">Zezinho Chat</h1>

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
  const [messages, setMessages] = useState<{ from: string; message: string }[]>(
    [],
  );
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
    <div className="chat-container">
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.from}:</b> {m.message}
          </p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );

  //   return (
  //     <div className="flex flex-col items-center justify-center w-full mt-10">
  //       <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-700">
  //         <h2 className="text-white text-xl mb-4 font-bold text-center">
  //           Game Chat
  //         </h2>

  //         <div className="h-64 overflow-y-auto bg-black p-4 rounded mb-4 border border-gray-900">
  //           {messages.map((m, i) => (
  //             <p key={i} className="text-gray-200 mb-1">
  //               <span className="text-blue-400 font-bold">{m.from}:</span>{" "}
  //               {m.message}
  //             </p>
  //           ))}
  //         </div>

  //         <div className="flex gap-2">
  //           <input
  //             className="flex-1 bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             value={input}
  //             onChange={(e) => setInput(e.target.value)}
  //             placeholder="Type a message..."
  //           />
  //           <button
  //             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
  //             onClick={sendMessage}
  //           >
  //             Send
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
}
