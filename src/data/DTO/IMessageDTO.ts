import { IUserDTO } from "./IUserDTO";

export interface IMessageDTO {
  message: string;
  sender: IUserDTO;
  messageType: string;
  attach: string;
  idRef: string;
}
