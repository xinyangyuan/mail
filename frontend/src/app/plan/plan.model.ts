export interface Plan {
  id: string;
  ids: string[];
  name: string;
  price: number;
  mailCredit: number;
  scanCredit: number;
  type: 'monthly' | 'annual';
}
