export interface Mail {
  _id: string;
  title: string;
  description: string;
  content: string;
  senderId: string;
  receiverId: string;
  flags: {
    read: boolean;
    star: boolean;
    issue: boolean;
  };
  updatedAt: Date;
  createdAt: Date;
}
