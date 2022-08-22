import {
  Box,
  Slide,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Icon,
  HStack,
  Button,
  Input,
  IconButton,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { ChatHeader } from "./chat-header";
import { useSelector } from "react-redux";
import { selectChatState } from "../../store/slices/chatSlice";
import { BsEmojiSmile } from "react-icons/bs";
import { ChatMessage } from "./chat-message";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  useRef,
  useState,
  useEffect,
  MutableRefObject,
  useContext,
} from "react";
import { IChatDTO } from "../../data/DTO/IChatDTO";
import { WSConn } from "../../services/socket";
import { selectAuthState } from "../../store/slices/authSlice";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../contexts/socket-context";
import { useColorModeValue } from "@chakra-ui/react";

export function Chat() {
  const chatState = useSelector(selectChatState);
  const authState = useSelector(selectAuthState);
  const socketContext = useContext(SocketContext);

  const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
  const [messages, setMessages] = useState<any[]>([
    ...chatState.currentChat.messages,
  ]);

  useEffect(() => {
    setMessages([...chatState.currentChat.messages]);
  }, [chatState.currentChat.messages]);

  const messageInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (e.target[0].value.length > 0) {
      const messageRefId = uuidv4();
      const { currentChat } = chatState;
      socketContext.wsConn!.socket.emit(`sendMessage`, {
        message: messageInputRef.current.value,
        sender: { id: authState.authUser.userId },
        receiver: {
          idRef: currentChat.idRef,
          participants: [
            ...currentChat.participants,
            {
              id: authState.authUser.userId,
              username: authState.authUser.username,
            },
          ],
        },
        messageType: "text",
        attach: "",
        idRef: messageRefId,
        messageStatus: 1,
      });
      messages.unshift({
        isFromMe: true,
        message: e.target[0].value,
        messageStatus: 1,
        name: "",
        date: "",
        idRef: messageRefId,
      });
      setMessages([...messages]);
      messageInputRef.current.value = "";
    }
  };
  return (
    <Box
      overflow={"hidden"}
      minH="100vh"
      bgColor={useColorModeValue("gray.100", "gray.800")}
      w={["100vw", "100vw", "100vw", "65vw"]}
      maxW={["100vw", "100vw", "100vw", "65vw"]}
      zIndex={1000}
      position={["absolute", "absolute", "absolute", "relative"]}
    >
      <Flex direction={"column"} h="100vh" w={"100%"} position={"relative"}>
        <ChatHeader></ChatHeader>
        <Box
          h={"80vh"}
          display={"flex"}
          flexDirection={"column-reverse"}
          overflow={"auto"}
          className={"chat-container"}
        >
          {messages !== undefined &&
            messages.map((message) => (
              <ChatMessage key={message.idRef} {...message} />
            ))}
        </Box>
        <Box
          justifyContent={"center"}
          bottom={0}
          minHeight={"76px"}
          w={"100%"}
          position={"absolute"}
        >
          <Box
            rounded="md"
            margin="auto"
            w={["100%", "100%", "70%"]}
            h={"56px"}
            boxShadow={"2xl"}
            bgColor={useColorModeValue("gray.100", "gray.800")}
          >
            <Flex
              w={"100%"}
              minHeight={"56px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Popover placement="top-start">
                <PopoverTrigger>
                  <Button
                    mr={2}
                    as={IconButton}
                    icon={<Icon as={BsEmojiSmile}></Icon>}
                  ></Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Picker
                    onEmojiClick={(ei, e) => {
                      messageInputRef.current.value =
                        messageInputRef.current.value + e.emoji;
                    }}
                  ></Picker>
                </PopoverContent>
              </Popover>

              <form onSubmit={onSubmitMessage}>
                <HStack>
                  <Input
                    width={["250px", "300px", "450px"]}
                    ref={messageInputRef}
                  ></Input>
                  <Button colorScheme="blue" type="submit">
                    <Icon as={RiSendPlaneFill}></Icon>
                  </Button>
                </HStack>
              </form>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

interface ChatProps {
  chat: IChatDTO;
}

interface RefObject<T> {
  readonly current: T;
}
