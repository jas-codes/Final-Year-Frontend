export class Company {
    uid: string;
    email: string;
    reviewScore: number;
    phoneNumber: number;
    postcode: string;
    latlng: google.maps.LatLngLiteral;
    companyName: string;
    tradeType: string;
    photos: string[] = [];
    description: string;
}