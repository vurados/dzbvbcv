import { eq } from "drizzle-orm";
import { db } from "../../connect_db"
import { collections } from "../schema/collection";
import { Collection } from "../schema/collection";


type NewCollection = {
    id: number;
    userId: number;
    title: string;
    color?: string;
    isEncrypted?: boolean;
    cryptHash?: string;
}

export const createCollection = async (collection: NewCollection) => {
    await db.insert(collections)
        .values(collection)
        .onConflictDoNothing()
}

export const updateCollection = async (collection: Collection) => {
    await db.update(collections)
        .set(collection)
        .where(eq(collections.id, collection.id ))
}

export const deleteCollection = async (collectionId: number) => {
    await db.delete(collections)
        .where(eq(collections.id, collectionId ))
}

export const getCollectionsByUID = async (uid: number) => {
    await db .query.collections.findMany({
        with: {
            notes: {
                limit: 5,
                columns: {
                    title: true
                }
            }
        }
    })
}