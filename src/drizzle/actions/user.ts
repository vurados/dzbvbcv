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


export const createUser = async (userData: NewUser): Promise<bigint> => {
    return new Promise(async (resolve, reject) => {
        if(userData.username && userData.email && userData.password && userData.salt){
            const onInsertData = await db.insert(users)
                .values(userData)
                .onConflictDoNothing()
            console.log("onInsertData", onInsertData)
            if (onInsertData.rowsAffected === 0){
                reject(new Error("ERROR: User data insertion failed, probable cause - username or email already exists"))
            }
            if(onInsertData.lastInsertRowid){
                resolve(onInsertData.lastInsertRowid)
            }
        }else{
            reject(new Error("ERROR: createUser: db.insert"))
        }
    })
}


export const updateUser = async (userData: User) => {
    await db.update(users)
        .set(userData)
        .where(eq(users.id, userData.id ))
}


export const deleteUser = async (userId: number) => {
    const onInsertData = await db.delete(users)
        .where(eq(users.id, userId ))

    return new Promise( (resolve, reject) => {
        if(onInsertData.rowsAffected != 0){
            resolve('User deleted succesfully')
        }else{
            reject(new Error('Error: User deletion failed'))
        }
    })
}

export const getUserByUsername = async (username: string): Promise<User> => {
    // console.log("user in getUserByUsername ", user)
    const user = await db.query.users.findFirst({where: eq(users.username, username )})

    return new Promise( (resolve, reject) => {
        if(typeof user != 'undefined'){
            console.log("user is not undefined");
            
            resolve(user)
        }else{
            console.log("user is undefined");
            
            reject(new Error("ERROR: DB_QUERRY: No matches founded. Wrong Username!"))
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