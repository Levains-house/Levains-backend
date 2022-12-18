import {UsersModel} from "../domain/users/users.model";
import {UsersService} from "../domain/users/users.service";
import {ItemsModel} from "../domain/items/items.model";
import {ItemsService} from "../domain/items/items.service";

export const appConfig = {
    UserModel: UsersModel.getInstance(),
    ItemModel: ItemsModel.getInstance(),
    UserService: UsersService.getInstance(UsersModel.getInstance()),
    ItemService: ItemsService.getInstance(ItemsModel.getInstance())
}