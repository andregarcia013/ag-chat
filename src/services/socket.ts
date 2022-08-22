import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export class WSConn {
  public socket: Socket;
  private static instance: WSConn;
  private constructor(authToken: string = "") {
    this.socket = io("http://localhost:3000/", {
      extraHeaders: { Authorization: "Bearer " + authToken },
    });
  }

  public static getInstance(authToken: string = ""): WSConn {
    if (!WSConn.instance) {
      WSConn.instance = new WSConn(authToken);
    }
    return WSConn.instance;
  }
}
