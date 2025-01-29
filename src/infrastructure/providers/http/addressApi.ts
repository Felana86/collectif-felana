///src/infrastructure/providers/http/authApi.ts
import { Address, AddressDTO } from "../../../domain/entities/Address";
import { ApiServiceI, ApiService } from "./UseApi";


export class AddressApi {

    private readonly dataType: string = 'addresses';
    private readonly api: ApiServiceI;
    constructor() { this.api = new ApiService(); }


    async getAddresses(): Promise<Address[]> {
        return this.api.get(this.dataType)
    }

    async getAddressById(id: number): Promise<Address> {
        return this.api.get(`${this.dataType}/${id}`)
    }

    async postAddress(address: AddressDTO): Promise<Address> {
        return this.api.post(this.dataType, address)
    }

}


