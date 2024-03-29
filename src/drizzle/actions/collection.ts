import { eq } from "drizzle-orm";
import { db } from "../../connect_db"
import { collections } from "../schema/collection";
import { Collection } from "../schema/collection";


type NewCollection = {
    userId: number;
    title: string;
    color?: string;
    isEncrypted?: boolean;
    cryptHash?: string;
}

export const createCollection = async (collection: NewCollection) => {
    return await db.insert(collections)
        .values(collection)
        .onConflictDoNothing()
}

export const updateCollection = async (collection: Collection) => {
    return await db.update(collections)
        .set(collection)
        .where(eq(collections.id, collection.id ))
}

export const deleteCollection = async (collectionId: number) => {
    return await db.delete(collections)
        .where(eq(collections.id, collectionId ))
}

export const getCollectionsTilesByUID = async (uid: number) => {
    return await db .query.collections.findMany({
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

export const getAllCollectionsForExport = async (uid: number) => {
    return await db .query.collections.findMany({
        with: {
            notes: true
        }
    })
}