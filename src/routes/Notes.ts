const express = require('express');
const router = express.Router();
const {Note, User, Layout} = require("../models")
const passport = require('passport');
const {checkOwner} = require('../Authentification/checkOwner')



router.post('/getNotesByLayoutId/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId = req.user.id
    // console.log("🚀 ~ file: Notes.js:8 ~ router.get ~ userId:", userId)
    const lid = req.params.id
    // console.log("🚀 ~ file: Notes.js:10 ~ router.post ~ lid:", lid)
    
    // const user = await User.findAll({where:{id:userId}, include:{model:Layout, as: 'Layout', where:{id:lid}, include:{model:Note, as: 'Note'}}})
    // console.log("🚀 ~ file: Notes.js:12 ~ router.post ~ user:", JSON.stringify(user[0].Layout[0].Note))
    // const noteees = user[0].Layout[0].Note
    
    const layout = await Layout.findByPk(lid)
    if(layout.dataValues.UID === userId){
        await layout.getNote().then((notes) => res.json(notes)).catch((err) => res.status(402).json(err))
        // console.log("🚀 ~ file: Notes.js:17 ~ router.post ~ notes:", notes.dataValues)
    }
});

router.post('/getNote/:id', passport.authenticate('jwt', {session: false}), checkOwner(Note), async(req, res) => {
    // req.record contains note(:id) and gotten from checkOwner middleware
    res.json(req.record)
})

router.post('/createNote/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    // FIXME: fix
    const note = {...req.body, "x": 3, "y": 1, "width": 1, "height": 1}
    const userId = req.user.id
    const lid = req.params.id
    const layout = await Layout.findByPk(lid)
    if(layout.UID === userId){
        console.log("🚀 ~ file: Notes.js:33 ~ router.post ~ note:", note)
        await layout.createNote(note).then((newNote) => res.json(newNote)).catch((err) => res.status(401).json('Error ocurred creating Note'))
    }else{
        res.status(401).send('You cant create Note in layout you dont own')
    }
});

router.put('/changeNote/:id', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const nid = req.params.id
    const newNote = req.body
    // console.log("🚀 ~ file: Notes.js:49 ~ router.put ~ newNote:", newNote)
    const note = await Note.findByPk(nid)
    await note.update(newNote).
        then((data) => {res.status(200).json(data)}).
            catch((err) => res.status(418).send(err))
});

router.delete('/deleteNote/:id', passport.authenticate('jwt', {session: false}), checkOwner(Note), async(req, res) => {
    const NoteId = req.params.id
    const note = req.record
    // console.log("🚀 ~ file: Notes.js:45 ~ router.delete ~ record:", record)
    await note.destroy().then(() => res.send(`Note ${NoteId} was deleted successfully`)).catch((err) => res.status(418).send(`Error: ${err}`))
})

module.exports = router;