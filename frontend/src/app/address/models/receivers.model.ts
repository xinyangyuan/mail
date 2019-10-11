export class Receivers {
  _id: string;
  name: { first: string; last: string };
  get fullname() {
    return this.name.first + this.name.last;
  }
}
