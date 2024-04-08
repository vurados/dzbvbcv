import { eq } from "drizzle-orm";
import { db } from "../../connect_db"
import { notes } from "../schema/note";
import { Note } from "../schema/note";
import { PgInsertBase } from "drizzle-orm/pg-core";


type NewNote = {
    userId: number;
    collectionId: number;
    title: string;
    content: string;
    order: number;
    width: number;
    height: number;
}

export const createNote = async (note: NewNote) => {
    console.log('note--', note);
    
    const insertedData = await db.insert(notes)
        .values(note)
        .onConflictDoNothing()
        .returning({id: notes.id, title: notes.title, content: notes.content, order: notes.order, width: notes.width, height: notes.height})
    console.log('note--', insertedData);

    return new Promise((resolve, reject) =>  {
        if (insertedData){
            resolve(insertedData)
        }else{
            reject(new Error("ERROR: create note: on insert data to db"))
        }
    })
}

export const updateNote = async (note: Note) => {
    return await db.update(notes)
        .set(note)
        .where(eq(notes.id, note.id ))
}

export const deleteNote = async (noteId: number) => {
    const onDeleteInfo = await db.delete(notes)
        .where(eq(notes.id, noteId ))
    
    return new Promise((resolve, reject) =>  {
        if (onDeleteInfo.rowsAffected != 0){
            resolve(`Note ${noteId} deleted succesfully`)
        }else{
            reject(new Error("ERROR: deleting note: on deleting data from db"))
        }
    })
}

export const getNotesByCId = async (collectionId: number) => {
    const noteTiles = await db.query.notes.findMany({
        where: eq(notes.collectionId, collectionId)
    })

    return new Promise((resolve, reject) =>  {
        if (noteTiles.length > 0){
            resolve(noteTiles)
        }else{
            reject(new Error("ERROR: getting notes: on finding data from db"))
        }
    })
}

export const getNoteById = async (noteId: number) => {
    const note = await db.query.notes.findFirst({
        where: eq(notes.id, noteId)
    })

    return new Promise((resolve, reject) =>  {
        if (note){
            resolve(note)
        }else{
            reject(new Error("ERROR: createCollection: on insert data to db"))
        }
    })
}