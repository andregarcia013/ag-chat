import {
  Box,
  Button,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import SimpleSidebar from "../sidebar/sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChatState,
  setChatMessageState,
  setChats,
} from "../../store/slices/chatSlice";
import { Chat } from "../chat/chat";
import { useEffect } from "react";
import { useApi } from "../../services/api";
import { IChatDTO } from "../../data/DTO/IChatDTO";
import { SearchBox } from "../search-box/search-box";
import { WSConn } from "../../services/socket";

export const AppChat = () => {
  const chatState = useSelector(selectChatState);
  const dispatch = useDispatch();
  const api = useApi();
  useEffect(() => {
    getUserChats();
  }, []);

  const getUserChats = async () => {
    const response = await api.get("user-chats");
    if (response.status === 200) {
      const chats = response.data as IChatDTO[];
      dispatch(setChats(chats));
      chats.forEach((chat) => {
        WSConn.getInstance().socket.on(
          `chat-user-${chat.id}-update-chats-status`,
          (data) => {
            console.log("updatign  messages status ==> ", data);
            dispatch(setChatMessageState({ chat: chat, messages: data }));
          }
        );
        WSConn.getInstance().socket.on(
          `chat-user-${chat.id}-update-user-status`,
          () => {}
        );

        WSConn.getInstance().socket.emit("user-got-chat", { chatId: chat.id });
      });
    }
  };

  return (
    <Box
      overflow={"hidden"}
      minH="100vh"
      minW="100vw"
      bg={useColorModeValue("gray.100", "gray.900")}
    >
      <Flex alignContent={"normal"}>
        <Box
          position={"relative"}
          minH="100vh"
          w={["100vw", "100vw", "100vw", "38vw"]}
        >
          <SimpleSidebar />
          <Box position={"absolute"} bottom={15} right={10}>
            <SearchBox></SearchBox>
          </Box>
        </Box>
        <Divider orientation="vertical" />
        {chatState.chatOpened && <Chat></Chat>}
      </Flex>
    </Box>
  );
};
