import {UsersRepository} from "../repositories/UsersRepository";
import {UsersService} from "../services/UsersService";
import {ItemsRepository} from "../repositories/ItemsRepository";
import {ItemsService} from "../services/ItemsService";

export const appConfig = {
    UsersRepository: UsersRepository.getInstance(),
    ItemsRepository: ItemsRepository.getInstance(),
    UsersService: UsersService.getInstance(UsersRepository.getInstance()),
    ItemsService: ItemsService.getInstance(ItemsRepository.getInstance())
}