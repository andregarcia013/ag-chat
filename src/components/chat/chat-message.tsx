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

export const ChatMessage = (props: ChatMessageProps) => {
  const getVerifiedIcon = () => {
    switch (props.messageStatus) {
      case 1:
        return <Icon w={"15px"} h={"15px"} as={BsCheck2}></Icon>;
      case 2:
        return <Icon w={"10p15pxx"} h={"15px"} as={BsCheck2All}></Icon>;
      case 3:
        return (
          <Icon
            w={"15px"}
            h={"15px"}
            color={"rgb(152 227 245)"}
            as={BsCheck2All}
          ></Icon>
        );
      default:
        return <Icon w={"15px"} h={"15px"} as={ImClock2}></Icon>;
    }
  };
  return props.isFromMe ? (
    <div className="msg">
      <div className="bubble alt">
        <Box right={"5px"} bottom="-2px" position={"absolute"} width={"15px"}>
          {getVerifiedIcon()}
        </Box>
        <div className="txt">
          <span style={{ display: "flex" }} className="timestamp alt">
            {props.date}
          </span>
          <p className="message alt"> {props.message}</p>
        </div>
        <div className="bubble-arrow alt"></div>
      </div>
    </div>
  ) : (
    <div className="msg">
      <div className="bubble">
        <div className="txt">
          <p className="message">{props.message}</p>
        </div>
        <div className="bubble-arrow"></div>
      </div>
    </div>
  );
};

type ChatMessageProps = {
  isFromMe: boolean;
  message: string;
  messageStatus: number;
  name: string;
  date: string;
};
