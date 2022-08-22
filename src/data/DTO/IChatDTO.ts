import { IUserDTO } from "./IUserDTO";
import { IMessageDTO } from "./IMessageDTO";

export interface IChatDTO {
  id: number;
  name: string;
  participants: IUserDTO[];
  type: string;
  image: string;
  lastMessageStatus: number;
  lastMessage: string;
  lastMessageDate: string;
  totalMessages: number;
  totalUnreadMessages: number;
  idRef: string;
  messages: IMessageDTO[];
}
