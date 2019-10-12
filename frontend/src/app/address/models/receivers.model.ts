export interface Receiver {
  mailboxNo: string;
  receiverId: {
    _id: string;
    name: { first: string; last: string };
  };
}
