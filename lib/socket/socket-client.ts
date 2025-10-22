import { io, Socket } from "socket.io-client";

class SocketClient {
  private socket: Socket | null = null;
  private roomSocket: Socket | null = null;
  private wheelSocket: Socket | null = null;
  private chatSocket: Socket | null = null;

  connect(namespace: string = ""): Socket {
    const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:20251";
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const socket = io(`${url}${namespace}`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    return socket;
  }

  getRoomSocket(): Socket {
    if (!this.roomSocket) {
      this.roomSocket = this.connect("/room");
    }
    return this.roomSocket;
  }

  getWheelSocket(): Socket {
    if (!this.wheelSocket) {
      this.wheelSocket = this.connect("/wheel");
    }
    return this.wheelSocket;
  }

  getChatSocket(): Socket {
    if (!this.chatSocket) {
      this.chatSocket = this.connect("/chat");
    }
    return this.chatSocket;
  }

  disconnectAll() {
    this.roomSocket?.disconnect();
    this.wheelSocket?.disconnect();
    this.chatSocket?.disconnect();
    this.socket?.disconnect();

    this.roomSocket = null;
    this.wheelSocket = null;
    this.chatSocket = null;
    this.socket = null;
  }
}

export const socketClient = new SocketClient();
