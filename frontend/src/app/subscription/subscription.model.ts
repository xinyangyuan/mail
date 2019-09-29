export interface Subscription {
  _id: string;
  userId: string;
  addressId: string;
  status: 'INCOMPLETE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  startDate: Date;
  anchorDay: number;
  periodStartDate: Date;
  periodEndDate: Date;
  isAutoRenew: boolean;
  isAllowOverage: boolean;
}
