export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
