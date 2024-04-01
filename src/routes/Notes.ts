import express from 'express'
import passport from 'passport'
import {checkOwner} from '../Authentification/checkOwner'
import { createNote, deleteNote, getNotesByCId, updateNote } from '../drizzle/actions/note';


const router = express.Router();

router.post('/getNotesByLayoutId/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId: number = req.user.id  // userId from passport middleware
    // console.log("🚀 ~ file: Notes.js:8 ~ router.get ~ userId:", userId)
    const cid = +req.params.id
    // console.log("🚀 ~ file: Notes.js:10 ~ router.post ~ lid:", lid)
    
    // const user = await User.findAll({where:{id:userId}, include:{model:Layout, as: 'Layout', where:{id:lid}, include:{model:Note, as: 'Note'}}})
    // console.log("🚀 ~ file: Notes.js:12 ~ router.post ~ user:", JSON.stringify(user[0].Layout[0].Note))
    // const noteees = user[0].Layout[0].Note
    
    const notes = await getNotesByCId(cid)
    if(notes[0].userId === userId){
        res.json(notes)
        // console.log("🚀 ~ file: Notes.js:17 ~ router.post ~ notes:", notes.dataValues)
    }
});

router.post('/getNote/:id', passport.authenticate('jwt', {session: false}), checkOwner('Note'), async(req, res) => {
    // req.record contains note(:id) and gotten from checkOwner middleware
    res.json(req.record)
})

router.post('/createNote/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    // FIXME: fix
    const note = {...req.body,"userId": req.user.id, "collectionId": req.params.id,  "x": 3, "y": 1, "width": 1, "height": 1, }
    console.log("🚀 ~ file: Notes.js:33 ~ router.post ~ note:", note)
    await createNote(note)
    res.status(200).json(note)
    
});

router.put('/changeNote/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const nid = req.params.id
    const newNote = req.body
    // console.log("🚀 ~ file: Notes.js:49 ~ router.put ~ newNote:", newNote)
    await updateNote(newNote)
    res.status(200).json(newNote)
});

router.delete('/deleteNote/:id', passport.authenticate('jwt', {session: false}), checkOwner('Note'), async(req, res) => {
    const noteId = +req.params.id
    // console.log("🚀 ~ file: Notes.js:45 ~ router.delete ~ record:", record)
    await deleteNote(noteId)
    res.send(`Note ${noteId} was deleted successfully`)
})

export default router;