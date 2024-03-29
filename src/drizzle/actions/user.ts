import { eq } from "drizzle-orm";
import { db } from "../../connect_db"
import { users } from "../schema/user";
import { User } from "../schema/user";

export type NewUser = {
    username: string;
    email: string;
    password: string;
    salt: string;
}


export const createUser = async (userData: NewUser) => {
    return new Promise((resolve, reject) => {
        if(userData.username && userData.email && userData.password && userData.salt){
            resolve(db.insert(users)
                .values(userData)
                .onConflictDoNothing())
        }else{
            reject(new Error("ERROR: createUser: db.insert"))
        }
    })
}

export const updateUser = async  (userData: User) => {
    await db.update(users)
        .set(userData)
        .where(eq(users.id, userData.id ))
}


export const deleteUser = async (userId: number) => {
    await db.delete(users)
        .where(eq(users.id, userId ))
}

export const getUserByUsername = async (username: string): Promise<User> => {
    const user = await db.query.users.findFirst({where: eq(users.username, username )})
    return new Promise((resolve, reject) => {
        if(user){
            resolve(user)
        }else{
            reject(new Error("ERROR: DB_QUERRY: No matches fonded. Wrong Username!"))
        }
    })
}

export const getUserById = async (userId: number): Promise<User> => {
    const user = await db.query.users.findFirst({where: eq(users.id, userId )})
    return new Promise((resolve, reject) => {
        if(user){
            resolve(user)
        }else{
            reject(new Error("User id is not valid"))
        }
    })
}