export interface Plan {
  ids: string[];
  name: string;
  price: number;
  mailCredit: number;
  scanCredit: number;
  type: 'monthly' | 'annual';
}
