import { ArrowBackIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Show,
  Stack,
  Text,
} from "@chakra-ui/react";
import { setChatState, selectChatState } from "../../store/slices/chatSlice";
import { current } from "@reduxjs/toolkit";
import { useColorModeValue } from "@chakra-ui/react";

export function ChatHeader() {
  const dispatch = useDispatch();
  const chatState = useSelector(selectChatState);
  return (
    <Box
      boxShadow="xs"
      w={"100%"}
      h={"56px"}
      paddingY={"8px"}
      paddingRight={"24px"}
      paddingLeft={"13px"}
    >
      <Flex alignItems={"center"} direction={"row"}>
        <Show breakpoint="(max-width: 780px)">
          <Box alignItems={"center"}>
            <ArrowBackIcon
              cursor={"pointer"}
              onClick={() => {
                dispatch(setChatState(false));
              }}
              w={"30px"}
              h={"30px"}
            ></ArrowBackIcon>
          </Box>
        </Show>
        <Box>
          <Avatar
            size={"md"}
            w={"40px"}
            h={"40px"}
            name={chatState.currentChat.participants[0].username}
            src={chatState.currentChat.image}
          />
        </Box>
        <Stack ml={3} spacing={0.5}>
          <Heading
            color={useColorModeValue("gray.900", "gray.100")}
            as="h5"
            size="sm"
          >
            {chatState.currentChat.participants[0].username}
          </Heading>
          <Text fontSize={"11px"} size={"sm"}></Text>
        </Stack>
      </Flex>
    </Box>
  );
}
