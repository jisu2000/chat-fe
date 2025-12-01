import { MessageDTO } from "./MessageDTO";

export interface ChatApiResponse {
  data: MessageDTO[]; // This is the array of messages we want to extract
  status: number;
  success: boolean;
  time_stamp: string;
  error: any;
}