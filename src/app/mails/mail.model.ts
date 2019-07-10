export interface Mail {
  _id: string;
  title: string;
  description: string;
  content: string;
  senderId: string;
  receiverId: string;
  read_flag: boolean;
  star_flag: boolean;
}
