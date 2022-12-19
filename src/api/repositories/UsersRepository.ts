import {db} from "../config/dbConfig";
import {Users} from "../models/Users";
import {UserRole} from "../types/UserRole";

export class UsersRepository {

    private static instance: UsersRepository;

    public static getInstance(){
        if(this.instance !== undefined){
            return this.instance;
        }
        return new UsersRepository();
    }

    private constructor(){}

    public async save(user: Users): Promise<void> {
        await db
            .insert(user)
            .into("Users")
            .catch((error) => {
                throw error;
            });
    }

    public async findByUsername(username: string): Promise<Array<Users>>{
        return await db
            .select('*')
            .from('Users AS U')
            .where('U.username', username)
            .then((findUsers) => { return findUsers; })
            .catch((error) => { throw error; });
    }

    public async findUserAndAddressByUserId(userId: bigint): Promise<any[]>{
        return await db
            .select('*')
            .from('Users AS U')
            .innerJoin('Address as A', 'U.user_id', '=', 'A.user_id')
            .where('U.user_id', String(userId))
            .then((findUsers) => {
                return findUsers;
            })
            .catch((error) => {
                throw error;
            })
    }

    public async findUserAndAddressByRole(role: UserRole): Promise<any[]>{
        return await db
            .select("*")
            .from("Users as U")
            .innerJoin('Address as A', 'U.user_id', '=', 'A.user_id')
            .where("U.role", role.toString())
            .then((findUsers) => {
                return findUsers;
            })
            .catch((error) => {
                throw error;
            });
    }

}