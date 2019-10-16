export class User {
  name: { first: string; last: string };
  email: string;
  status: 'UNCONFIRMED' | 'ACTIVE' | 'BLOCKED';
  role: 'USER' | 'SENDER';
  fullname() {
    return this.name.first + ' ' + this.name.last;
  }
}
