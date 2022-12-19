import {AddressRepository} from "../repositories/AddressRepository";
import {AddressRegisterRequest} from "../controllers/requests/AddressRegisterRequest";


export class AddressService {

    private addressRepository: AddressRepository;

    private static instance: AddressService;

    public static getInstance(addressRepository: AddressRepository){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new AddressService(addressRepository);
    }

    private constructor(addressRepository: AddressRepository){
        this.addressRepository = addressRepository;
    }

    public async register(addressCreateRequest: AddressRegisterRequest): Promise<void> {
        await this.addressRepository.save(addressCreateRequest.toAddresses());
    }
}