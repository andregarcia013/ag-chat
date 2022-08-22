import { IAuthDTO } from "../../data/DTO/IAuthDTO";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useApi } from "../../services/api";
import { useDispatch } from "react-redux";
import { setAuthState } from "../../store/slices/authSlice";
import Router from "next/router";
import { SocketContext } from "../../contexts/socket-context";
import { WSConn } from "../../services/socket";
import { addNewChat, newMessage } from "../../store/slices/chatSlice";
import { IChatDTO } from "../../data/DTO/IChatDTO";

export const LoginForm = () => {
  const api = useApi();
  const socketContext = useContext(SocketContext);
  const [loginState, setLoginState] = useState<IAuthDTO>({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();

  const onInputChange = (e) => {
    loginState[e.target.name] = e.target.value as string;
    setLoginState(loginState);
  };

  const submitLogin = async () => {
    const response = await api.post("auth", loginState);

    if (response.status === 200) {
      localStorage.setItem("AGAUTHTOKEN@@@", response.data.authToken);
      dispatch(
        setAuthState({
          authToken: response.data.authToken,
          authState: true,
          authUser: {
            username: response.data.authUser.username,
            userId: response.data.authUser.id,
          },
        })
      );

      socketContext.setWsConn(WSConn.getInstance(response.data.authToken));
      socketContext.wsConn = WSConn.getInstance(response.data.authToken);
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

      Router.push("/chat");
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Autenticação Necessária</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            para entrar no <Link color={"blue.400"}>AG - Chat</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Nome de usuário</FormLabel>
              <Input onChange={onInputChange} name="username" type="text" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input onChange={onInputChange} name="password" type="password" />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text color={"blue.400"}>
                  Caso não tenha uma conta basta tentar entrar!
                </Text>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={submitLogin}
              >
                Entrar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
