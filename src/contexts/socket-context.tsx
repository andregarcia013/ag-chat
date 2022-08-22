import React from "react";
import { WSConn } from "../services/socket";

export interface Socket {
  wsConn: WSConn | null;
  setWsConn: any;
}
export const SocketContext = React.createContext<Socket>({
  wsConn: null,
  setWsConn: () => {},
});
