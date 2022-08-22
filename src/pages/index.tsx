import type { NextPage } from "next";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Home.module.scss";
import {
  addNewChat,
  newMessage,
  selectChatState,
} from "../store/slices/chatSlice";
import { useContext, useEffect } from "react";
import { selectAuthState, setAuthState } from "../store/slices/authSlice";
import { useApi } from "../services/api";
import { WSConn } from "../services/socket";
import { IChatDTO } from "../data/DTO/IChatDTO";
import Router from "next/router";
import { SocketContext } from "../contexts/socket-context";

const Home: NextPage = () => {
  const authState = useSelector(selectAuthState);
  const chatState = useSelector(selectChatState);
  const socketContext = useContext(SocketContext);
  const dispatch = useDispatch();
  const api = useApi();
  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {
    const authToken = localStorage.getItem("AGAUTHTOKEN@@@") || "";

    if (authToken.length > 0) {
      let response = await api.get("user/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data) {
        dispatch(
          setAuthState({
            authState: true,
            authToken: authToken,
            authUser: response.data,
          })
        );
        socketContext.setWsConn(WSConn.getInstance(authToken));
        socketContext.wsConn = WSConn.getInstance(authToken);
        socketContext.wsConn.socket.on("new-message", (payload) => {
          const { message, chat } = payload;
          chat[`lastMessage`] = message.message;
          chat[`lastMessageStatus`] = message.messageStatus;
          chat[`lastMessageDate`] = message.createdAt;
          dispatch(newMessage({ message, chat, socket: socketContext.wsConn }));
          socketContext.wsConn!.socket.emit("user-got-chat", {
            chatId: chat.id,
          });
        });
        socketContext.wsConn!.socket.on("add-new-chat", (chat: IChatDTO) => {
          dispatch(addNewChat(chat));
        });

        Router.push("chat");
        return;
      }
    }
    Router.push("login");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>AG - ChatApp</title>
        <meta name="description" content="AG - ChatApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}></main>
    </div>
  );
};

export default Home;
