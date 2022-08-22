import "../styles/globals.scss";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { wrapper } from "../store/store";
import { Socket, SocketContext } from "../contexts/socket-context";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Home.module.scss";
import {
  addNewChat,
  newMessage,
  selectChatState,
} from "../store/slices/chatSlice";
import { useContext, useEffect, useState } from "react";
import { selectAuthState, setAuthState } from "../store/slices/authSlice";
import { useApi } from "../services/api";
import { WSConn } from "../services/socket";
import { IChatDTO } from "../data/DTO/IChatDTO";
import Router from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [wsConn, setWsConn] = useState<WSConn | null>(null);
  const value: Socket = { wsConn, setWsConn };

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <ChakraProvider>
        <SocketContext.Provider value={value}>
          <Component {...pageProps} />
        </SocketContext.Provider>
      </ChakraProvider>
    );
  }
}

export default wrapper.withRedux(MyApp);
