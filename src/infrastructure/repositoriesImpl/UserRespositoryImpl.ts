//src/infrastructure/repositoriesImpl/UserRespositoryImpl.tsx
import { User } from "../../domain/entities/User";
import { UserRepositoryBase } from "../../domain/repositoriesBase/UserRepositoryBase";
import { UserDTO } from "../DTOs/UserDTO";
import { ApiServiceI } from "../providers/http/apiService";

export interface IUserData extends UserRepositoryBase {
    api: ApiServiceI;
    dataType: string;
}

export class UserRepositoryImpl implements UserRepositoryBase {
    private userData: IUserData;
    constructor({ userData }: { userData: IUserData }) { this.userData = userData }

    public async getUserMe(): Promise<User> {
        return this.userData.getUserMe();
    }

    public async getUsersModos(): Promise<User[]> {
        return this.userData.getUsersModos();
    }

    public async getUserCount(): Promise<number> {
        return this.userData.getUserCount();
    }


    public async updateUser(data: UserDTO): Promise<User> {
        return this.userData.updateUser(data);
    }

    public async deleteUser(id: number): Promise<void> {
        return this.userData.deleteUser(id);
    }
}
