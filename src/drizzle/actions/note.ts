import { eq } from "drizzle-orm";
import { db } from "../../connect_db"
import { notes } from "../schema/note";
import { Note } from "../schema/note";


type NewNote = {
    id: number;
    title: string;
    content: string;
    order: number;
    width: number;
    heght: number;
}

export const createNote = async (note: NewNote) => {
    await db.insert(notes)
        .values(note)
        .onConflictDoNothing()
}

export const updateNote = async (note: Note) => {
    await db.update(notes)
        .set(note)
        .where(eq(notes.id, note.id ))
}

export const deleteNote = async (note: Note) => {
    await db.delete(notes)
        .where(eq(notes.id, note.id ))
}