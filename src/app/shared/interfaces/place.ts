export interface Place {
  id: string;
  name: string;
  profileImageUrl: string;
  placeType: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  location: {
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };

}
