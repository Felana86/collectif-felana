//src/infrastructure/api/userApi.tsx
import { User } from "../../../domain/entities/User";
import { UserDTO } from "../../DTOs/UserDTO";
import { ApiServiceI, ApiService } from "./apiService";


export class UserApi {
    private readonly dataType: string = 'users';
    private readonly api: ApiServiceI;
    constructor() { this.api = new ApiService(); }


    async getUsersModos(): Promise<User[]> {
        return this.api.get(`${this.dataType}/modos`);
    }

    async getUserCount(): Promise<number> {
        return this.api.get(`${this.dataType}/count`);
    }


    async getUserMe(): Promise<User> {
        return this.api.get(`${this.dataType}/me`);
    }

    async deleteUser(id: number): Promise<void> {
        return this.api.delete(`${this.dataType}/${id}`)
    }

    async patchUser(data: UserDTO): Promise<User> {
        return this.api.patch(`${this.dataType}`, data)
    }

    async postUser(data: UserDTO): Promise<User> {
        return this.api.post(`${this.dataType}`, data)
    }
}

