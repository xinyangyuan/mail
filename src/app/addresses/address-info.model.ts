export interface AddressInfo {
  _id: string;
  senderId: string;
  receiverIds: string[];
  address: string;
  address2?: string;
  city: string;
  zipCode: string;
  country: string;
}
