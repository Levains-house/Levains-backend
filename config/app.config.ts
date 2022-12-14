import {UsersModel} from "../domain/users/users.model";
import {UsersService} from "../domain/users/users.service";

export const appConfig = {
    UserModel: UsersModel.getInstance(),
    UserService: UsersService.getInstance(UsersModel.getInstance())
}