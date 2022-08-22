import { EditIcon } from "@chakra-ui/icons";
import { IUserDTO } from "../../data/DTO/IUserDTO";
import { useState } from "react";
import { useApi } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { addNewChat, selectChatState } from "../../store/slices/chatSlice";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { WSConn } from "../../services/socket";
import { randomUUID } from "crypto";
import { IChatDTO } from "../../data/DTO/IChatDTO";
import { v4 as uuidv4 } from "uuid";

export const SearchBox = () => {
  const { onOpen, onClose, onToggle, isOpen } = useDisclosure();
  const [searchString, setSearchString] = useState<string>("");
  const [users, setUsers] = useState<IUserDTO[]>([]);
  const dispatch = useDispatch();
  const chatState = useSelector(selectChatState);
  const api = useApi();

  const onSearchInputChange = (e) => {
    setSearchString(e.target.value);
    onSubmitSearch();
  };

  const onSubmitSearch = async () => {
    if (searchString.length > 4) {
      const response = await api.get("user/search?search=" + searchString);

      setUsers(response.data);
    }
  };

  const getUsers = () => {
    return users.map((user) => {
      return (
        <Text onClick={startNewChat(user)} key={user.username}>
          {user.username}
        </Text>
      );
    });
  };

  const startNewChat = (user: IUserDTO) => () => {
    const chat: IChatDTO = {
      id: 0,
      lastMessage: "",
      lastMessageStatus: -1,
      lastMessageDate: "",
      participants: [user],
      image: "",
      type: "unique",
      name: user.username,
      idRef: uuidv4(),
      messages: [],
      totalMessages: 0,
      totalUnreadMessages: 0,
    };

    dispatch(addNewChat(chat));
    onClose();
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="top-start"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Pesquisar por usuário"
            size="sm"
            colorScheme="blue"
            icon={<EditIcon />}
          />
        </PopoverTrigger>
        <PopoverContent zIndex={99999999} p={5}>
          <Stack minH={300} spacing={4}>
            <FormControl>
              <FormLabel>Pesquiser por usuário</FormLabel>
              <Input
                onSubmit={onSubmitSearch}
                value={searchString}
                onChange={onSearchInputChange}
              />
            </FormControl>
            <Stack h={250} overflow={"auto"}>
              {getUsers()}
            </Stack>
          </Stack>
          <PopoverArrow />
          <PopoverCloseButton
            onClick={() => {
              onClose();
              setSearchString("");
              setUsers([]);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
