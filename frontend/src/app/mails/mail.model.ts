export enum MailStatus {
  CREATED = 'CREATED',
  SCANNING = 'SCANNING',
  SCANNED = 'SCANNED_ARCHIVED',
  SCAN_REJECTED = 'UNSCANNED_ARCHIVED',
  COLLECTED = 'COLLECTED',
  TRASHED = 'TRASHED'
}

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
  status: MailStatus;
  updatedAt: Date;
  createdAt: Date;
}
