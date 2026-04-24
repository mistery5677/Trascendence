import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function Ze() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io("/", {
      withCredentials: true,
      path: "/socket.io",
    });

    socketInstance.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-white text-2xl">Zezinho Chat</h1>

      <p className={isConnected ? "text-green-500" : "text-red-500"}>
        {isConnected
          ? "Status: Connected (Guard validated)"
          : "Status: Disconnected"}
      </p>
    </div>
  );
}
