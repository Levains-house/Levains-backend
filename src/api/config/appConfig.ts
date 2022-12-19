import {UsersRepository} from "../repositories/UsersRepository";
import {UsersService} from "../services/UsersService";
import {ItemsRepository} from "../repositories/ItemsRepository";
import {ItemsService} from "../services/ItemsService";
import {AddressRepository} from "../repositories/AddressRepository";
import {AddressService} from "../services/AddressService";

export const appConfig = {
    UsersRepository: UsersRepository.getInstance(),
    AddressRepository: AddressRepository.getInstance(),
    ItemsRepository: ItemsRepository.getInstance(),
    UsersService: UsersService.getInstance(UsersRepository.getInstance()),
    AddressService: AddressService.getInstance(AddressRepository.getInstance()),
    ItemsService: ItemsService.getInstance(ItemsRepository.getInstance(), UsersRepository.getInstance())
}