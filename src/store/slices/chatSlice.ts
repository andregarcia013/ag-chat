import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../store";
import { IChatDTO } from "../../data/DTO/IChatDTO";
import { message } from "antd";

export interface ChatState {
  chatOpened: boolean;
  chatSocket: any;
  chats: IChatDTO[];
  currentChat: IChatDTO;
}

const initialState: ChatState = {
  chatOpened: false,
  currentChat: <IChatDTO>{},
  chatSocket: null,
  chats: [],
};

export const chatslice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatState(state, action) {
      state.chatOpened = action.payload.chatState;
      state.currentChat = action.payload.chat;
      return state;
    },
    setSocketChat(state, action) {
      state.chatSocket = action.payload;
      return state;
    },
    setChats(state, action) {
      state.chats = action.payload;
      console.log("setting state chats");
      return state;
    },
    setChatMessageState(state, action) {
      console.log("Set Chat Message Status => ", action.payload);
      const stateDraf = JSON.parse(JSON.stringify(state));
      const chats: IChatDTO[] = JSON.parse(JSON.stringify(state.chats));

      let [foundChat, foundChatIndex] = [
        chats.find((e) => e.idRef === action.payload.chat.idRef),
        chats.findIndex((e) => e.idRef === action.payload.chat.idRef),
      ];
      if (foundChat === undefined) {
        return stateDraf;
      }

      const messages = [...foundChat.messages];

      action.payload.messages.forEach((msg) => {
        let [foundMessage, foundMessageIndex] = [
          messages.find((message) => {
            return message.idRef === msg.idRef;
          }),
          messages.findIndex((message) => {
            return message.idRef === msg.idRef;
          }),
        ];

        chats[foundChatIndex].messages[foundMessageIndex]["messageStatus"] =
          msg.messageStatus;

        chats[foundChatIndex].lastMessageStatus = msg.messageStatus;
      });

      console.log(chats[foundChatIndex]);
      stateDraf.chats = chats;
      if (stateDraf.currentChat !== undefined) {
        if (stateDraf.currentChat.idRef === chats[foundChatIndex].idRef) {
          stateDraf.currentChat = chats[foundChatIndex];
        }
      }
      return stateDraf;
    },
    newMessage(state, action) {
      const stateDraf = JSON.parse(JSON.stringify(state));
      const chats: IChatDTO[] = JSON.parse(JSON.stringify(state.chats));
      console.log(
        "reading chat => ",
        stateDraf.currentChat !== null &&
          action.payload.chat.idRef === stateDraf.idRef
      );

      if (
        stateDraf.currentChatt !== null &&
        action.payload.chat.idRef === stateDraf.currentChat.idRef
      ) {
        action.payload.socket.socket.emit("user-read-chat", {
          chatId: action.payload.chat.id,
        });
      }
      let [foundChat, foundChatIndex] = [
        chats.find((e) => e.idRef === action.payload.chat.idRef),
        chats.findIndex((e) => e.idRef === action.payload.chat.idRef),
      ];
      if (foundChat == undefined) {
        action.payload.chat.messages = [];
        chats.unshift(action.payload.chat);
        foundChat = chats[0];
      }

      const messages = [...foundChat.messages];

      let [foundMessage, foundMessageIndex] = [
        messages.find((message) => {
          return message.idRef === action.payload.message.idRef;
        }),
        messages.findIndex((message) => {
          return message.idRef === action.payload.message.idRef;
        }),
      ];

      if (foundMessage == undefined) {
        messages.unshift({ ...action.payload.message });
      }

      chats[foundChatIndex] = action.payload.chat;
      chats[foundChatIndex].messages = messages;

      stateDraf.chats = chats;
      if (stateDraf.currentChat.idRef === chats[foundChatIndex].idRef) {
        stateDraf.currentChat = chats[foundChatIndex];
      }
      return stateDraf;
    },
    addNewChat(state, action) {
      const foundChat = state.chats.find((e) => e.name === action.payload.name);
      if (foundChat == undefined) {
        state.chats.unshift(action.payload);
      }
      state.chatOpened = true;
      state.currentChat = action.payload;
      return state;
    },
  },
});

export const {
  setChatState,
  setSocketChat,
  setChats,
  addNewChat,
  newMessage,
  setChatMessageState,
} = chatslice.actions;

export const selectChatState = (state: AppState) => state.chat;

export default chatslice.reducer;
