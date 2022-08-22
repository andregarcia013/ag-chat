import React, { ReactNode, useState } from "react";
import {
  Box,
  Flex,
  Stack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { HiLogout } from "react-icons/hi";
import {
  AddIcon,
  HamburgerIcon,
  MoonIcon,
  Search2Icon,
  SunIcon,
} from "@chakra-ui/icons";
import { ChatCard } from "../chat-card/chat-card";
import { selectChatState } from "../../store/slices/chatSlice";
import { useSelector } from "react-redux";
import Router from "next/router";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Trending", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

export default function SimpleSidebar() {
  const [isOpenMenu, setIsMenuOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const chatState = useSelector(selectChatState);

  const onInputFocus = (e) => {
    setIsMenuOpen(true);
  };

  const onInputFocusOut = (e) => {};

  const onMenuInputChange = (e) => {
    console.log(isOpenMenu);
    setIsMenuOpen(!isOpenMenu);
  };

  const getContacts = (): ReactNode[] => {
    const chats = [...chatState.chats];

    chats.sort(function (a, b) {
      return (
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime()
      );
    });

    const components = chats.map((chat) => {
      return <ChatCard key={chat.idRef} chat={chat}></ChatCard>;
    });

    return components;
  };

  return (
    <HStack>
      <Box
        position={"relative"}
        boxShadow="xs"
        w={["100vw", "100vw", "100vw", "38vw"]}
      >
        <Stack>
          <HStack ml={5} mt={5}>
            (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Menu"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem
                  onClick={toggleColorMode}
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                >
                  {colorMode === "light" ? "Dark" : "Light"}
                </MenuItem>

                <MenuList>
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("AGAUTHTOKEN@@@");
                      Router.reload();
                    }}
                    icon={<Icon as={HiLogout} />}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </MenuList>
            </Menu>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputLeftElement>
              <Input
                onFocus={onInputFocus}
                onBlur={onInputFocusOut}
                borderRadius={20}
                placeholder="Search"
                w={["80vw", "80vw", "80vw", "278"]}
              />
            </InputGroup>
          </HStack>
          <Flex
            w={["100vw", "100vw", "100vw", 400]}
            direction="column"
            justifyContent={"center"}
          >
            {getContacts()}
          </Flex>
        </Stack>
      </Box>
    </HStack>
  );
}
