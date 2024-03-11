import { eq } from "drizzle-orm";
import { db } from "../../connect_db"
import { users } from "../schema/user";


type newUser = {
    username: string;
    email: string;
    password: string;
    salt: string;
}

export const createUser = async (userData: newUser) => {
    await db.insert(users)
        .values(userData)
        .onConflictDoNothing()
}


type User = {
    id: number;
    username?: string;
    email?: string;
    password?: string;
    salt?: string;
}

export const updateUser = async (userData: User) => {
    await db.update(users)
        .set(userData)
        .where(eq(users.id, userData.id ))
}

export const deleteUser = async (userData: User) => {
    await db.delete(users)
        .where(eq(users.id, userData.id ))
}