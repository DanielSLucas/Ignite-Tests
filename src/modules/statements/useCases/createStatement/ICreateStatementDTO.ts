import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'sender_id' |
  'description' |
  'amount' |
  'type'
>

// export interface ICreateStatementDTO {
//   user_id: string;
//   sender_id?: string;
//   description: string;
//   amount: number;
//   type: string;
// }
