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
    const InsertedData = await db.insert(collections)
        .values(collection)
        .onConflictDoNothing()
        .returning({id: collections.id, title: collections.title, color: collections.color, isEncrypted: collections.isEncrypted, cryptHash: collections.cryptHash})
        
    return new Promise((resolve, reject) =>  {
        if (InsertedData[0]){
            resolve(InsertedData)
        }else{
            reject(new Error("ERROR: createCollection: on insert data to db"))
        }
    })
}

export const updateCollection = async (collection: Collection, cid: number) => {
    return new Promise(async (resolve, reject) =>  {
        const updatedCollection = await db.update(collections)
            .set({...collection})
            .where(eq(collections.id, cid ))
            .returning({id: collections.id, title: collections.title, color: collections.color, isEncrypted: collections.isEncrypted, cryptHash: collections.cryptHash})
            .catch(err => reject(err))

        if (updatedCollection){
            resolve(updatedCollection)
        }else{
            reject(new Error("ERROR: updated Collection"))
        }
    })
}

export const deleteCollection = async (collectionId: number) => {
    const onDeleteInfo = await db.delete(collections)
        .where(eq(collections.id, collectionId ))
    
    return new Promise((resolve, reject) =>  {
        if (onDeleteInfo.rowsAffected != 0){
            resolve(`Collection ${collectionId} deleted succesfully`)
        }else{
            reject(new Error("ERROR: deleting Collection"))
        }
    })
}

export const getCollectionsTilesByUID = async (uid: number) => {
    const collectionTiles = await db .query.collections.findMany({
        with: {
            notes: {
                limit: 5,
                columns: {
                    title: true
                }
            }
        }
    })
    
    return new Promise((resolve, reject) =>  {
        if (collectionTiles.length > 0){
            resolve(collectionTiles)
        }else{
            reject(new Error("ERROR: getting Collections: on finding data from db"))
        }
    })
}

export const getAllCollectionsForExport = async (uid: number) => {
    return await db.query.collections.findMany({
        with: {
            notes: true
        }
    }).catch()
}

export const getCollectionById = async (collectionId: number) => {
    return new Promise(async (resolve, reject) =>  {
        const collection = await db.query.collections.findFirst({where: eq(collections.id, collectionId)}).catch(() => {reject('DB ERROR: can not find collection')})
            
        if (collection){
            resolve(collection)
        }else{
            reject(new Error("ERROR: getting Collection: on finding data from db"))
        }
    })
}