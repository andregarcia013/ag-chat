import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { ImClock2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setChatState } from "../../store/slices/chatSlice";
import { IChatDTO } from "../../data/DTO/IChatDTO";
import { IUserDTO } from "../../data/DTO/IUserDTO";
import { useContext } from "react";
import { SocketContext } from "../../contexts/socket-context";

export function ChatCard(props: ChatCardProps) {
  const socketContext = useContext(SocketContext);

  const getVerifiedIcon = () => {
    switch (props.chat.lastMessageStatus) {
      case 0:
        return <ImClock2></ImClock2>;
      case 1:
        return <Icon as={BsCheck2}></Icon>;
      case 2:
        return <Icon as={BsCheck2All}></Icon>;
      case 3:
        return <Icon color={"rgb(152 227 245)"} as={BsCheck2All}></Icon>;
      default:
        return "";
    }
  };

  const dispatch = useDispatch();
  return (
    <Box
      _hover={{ backgroundColor: useColorModeValue("gray.200", "gray.600") }}
      cursor={"pointer"}
      borderRadius={10}
      h={76}
      w={"95%"}
      onClick={() => {
        dispatch(setChatState({ chatState: false }));
        setTimeout(() => {
          socketContext.wsConn!.socket.emit("user-read-chat", {
            chatId: props.chat.id,
          });
          dispatch(setChatState({ chatState: true, chat: props.chat }));
        }, 200);
      }}
    >
      <Flex>
        <Center h={76} w="100px">
          <Avatar
            size={"md"}
            w={"40px"}
            h={"40px"}
            name={
              props.chat.type === "group"
                ? props.chat.name
                : props.chat.participants[0].username
            }
            src={props.chat.image}
          >
            {props.chat.type !== "group" &&
              props.chat.participants[0].isOnline && (
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              )}
          </Avatar>
        </Center>
        <Stack flexGrow={1}>
          <Box mt={3}>
            <Flex>
              <Text
                width={"auto"}
                maxW={"80%"}
                fontWeight={"bold"}
                color={useColorModeValue("gray.900", "gray.100")}
              >
                {props.chat.type === "group"
                  ? props.chat.name
                  : props.chat.participants[0].username}
              </Text>
              <Box mr={5} ml={"auto"}>
                {props.chat.messages[0] !== undefined &&
                props.chat.messages[0][`isFromMe`]
                  ? getVerifiedIcon()
                  : ""}
              </Box>
            </Flex>
          </Box>
          <Box>
            <Text color={useColorModeValue("gray.900", "gray.100")}>
              {props.chat.lastMessage}
            </Text>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
}

type ChatCardProps = {
  chat: IChatDTO;
};
