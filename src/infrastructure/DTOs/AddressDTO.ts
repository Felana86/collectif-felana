
export class AddressDTO {
    address: string = '';
    zipcode: string = '';
    city: string = '';
    lat: number = 0;
    lng: number = 0;
    constructor() {
        this.address = '';
        this.zipcode = '';
        this.city = '';
        this.lat = 0;
        this.lng = 0;
    }
}