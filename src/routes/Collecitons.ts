import express from 'express';
import passport from 'passport'
import { createCollection, deleteCollection, getAllCollectionsForExport, getCollectionById, getCollectionsTilesByUID, updateCollection } from '../drizzle/actions/collection';
import { User } from '../drizzle/schema/user';
import { Collection } from '../drizzle/schema/collection';


const router = express.Router();

router.get('/exportAll', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId = (req.user as User).id
    await getAllCollectionsForExport(userId)
        .then((collectionsWithNotes) => {res.json(collectionsWithNotes)})
        .catch((err) => {res.status(402).json(err)})
    
})

router.get('/getAllCollections', passport.authenticate('jwt', {session: false}),async (req, res) => {
    const userId = (req.user as User).id
    if(userId){
        await getCollectionsTilesByUID(userId)
            .then((listOfCollections) => {res.status(200).json(listOfCollections)})
            .catch((err) => {res.status(400).json(err)})
    }
})

router.post('/createCollection', passport.authenticate('jwt', {session: false}),async (req, res) => {
    // const userId = req.user.id
    // TODO : i need to change LayoutModal request add color and bg_image
    const userId = (req.user as User).id
    const collection = {userId: userId, ...req.body}
    
    await createCollection(collection)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(418).send(err.message))
})

router.put('/changeCollection/:cid', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // const collection = req.record
    const userId = (req.user as User).id
    const collectionUserId = (await getCollectionById(+req.params.cid) as Collection).userId
    
    if(userId === collectionUserId){
        const newCollection = {...req.body}
        await updateCollection(newCollection, +req.params.cid)
            .then((data) => {res.status(200).json(data)})
            .catch((err) => res.status(403).send(err))
    }else{
        res.status(403).send("Error: you dont own this collection")
    }
})

router.delete('/deleteCollection', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // console.log('record--', req.record);
    const userId = (req.user as User).id
    const cid = +(req.query.cid || 0)
    console.log("cid-", cid, "userId-", userId);

    const collection = await getCollectionById(cid).catch( () => res.status(403).send("DB ERROR: Collection was not found"))
    const collectionUserId = (collection as Collection).userId

    if(!res.headersSent){
        if(userId === collectionUserId ){
            await deleteCollection(cid)
                .then((msg) => {res.status(200).send(msg)})
                .catch((err) => {res.status(403).send(err.message)})
        }else{
            res.status(403).send("Error: you dont own this collection")
        }
    }
})


export default router;