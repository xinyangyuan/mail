export interface AddressInfo {
  _id: string;
  senderId: string;
  receiverIds: [{ _id: string; name: { first: string; last: string } }];
  address: string;
  address2?: string;
  city: string;
  zipCode: string;
  country: string;
}
