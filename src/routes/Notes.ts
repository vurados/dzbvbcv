import express from 'express'
import passport from 'passport'
import { createNote, deleteNote, getNoteById, getNotesByCId, updateNote } from '../drizzle/actions/note';
import { User } from '../drizzle/schema/user';
import { Note } from '../drizzle/schema/note';

const router = express.Router();

router.post('/getNotesByCollectionId/:cid', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId: number = (req.user as User).id  // userId from passport middleware
    
    const notes = await getNotesByCId(+req.params.cid) as Note[]
    if(notes[0].userId === userId){
        res.status(200).json(notes)
    }else{
        res.status(403).send('Access denied, notes not owned by you')
    }
});

router.post('/getNote/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId: number = (req.user as User).id
    const note = await getNoteById(+req.params.id) as Note

    if(note.userId === userId){
        res.status(200).json(note)
    }else{
        res.status(403).send('Access denied, note not owned by you')
    }
})

router.post('/createNote/:cid', passport.authenticate('jwt', {session: false}), async(req, res) => {
    // FIXME: fix
    const userId: number = (req.user as User).id
    const note = {"userId": userId, "collectionId": req.params.cid, ...req.body}
    console.log("I am hereeeeeeeeeeeeeeeeeee");
    
    // console.log("🚀 ~ file: Notes.js:33 ~ router.post ~ note:", note)
    await createNote(note)
        .then((note) => res.status(200).json(note))
        .catch((err) => res.status(403).send(err.message))
});

router.put('/changeNote/:nid', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId: number = (req.user as User).id
    const nid = +req.params.nid

    const noteUserId = (await getNoteById(nid) as Note).userId
    if(userId === noteUserId){
        const newNote = {...req.body, id: nid}
        // console.log("🚀 ~ file: Notes.js:49 ~ router.put ~ newNote:", newNote)
        await updateNote(newNote)
        res.status(200).json(newNote)
    }else{
        res.status(403).send('Access denied, note not owned by you')
    }
});

router.delete('/deleteNote', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId: number = (req.user as User).id
    const noteId = +(req.query.nid || 0)

    const noteUserId = (await getNoteById(noteId) as Note).userId
    // console.log("🚀 ~ file: Notes.js:45 ~ router.delete ~ record:", record)
    if(userId === noteUserId){
        await deleteNote(+noteId)
            .then((msg) => res.status(200).send(msg))
            .catch((err) => res.status(403).send(err.message))
    }else{
        res.status(403).send('Access denied, note not owned by you')
    }
})

export default router;