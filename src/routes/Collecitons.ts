import express from 'express';
import passport from 'passport'
import  {checkOwner}  from '../Authentification/checkOwner'
import { createCollection, deleteCollection, getAllCollectionsForExport, getCollectionsTilesByUID, updateCollection } from '../drizzle/actions/collection';


const router = express.Router();

router.get('/exportAll', passport.authenticate('jwt', {session: false}), async(req, res) => {
    const userId = req.user.id
    await getAllCollectionsForExport(userId)
        .then((collectionsWithNotes) => {res.json(collectionsWithNotes)})
        .catch((err) => {res.status(402).json(err)})
    
})

router.get('/getLayouts', passport.authenticate('jwt', {session: false}),async (req, res) => {
    // res.json(userId)
    // console.log('we are in getLayouts');
    // const user = await User.findByPk(userId)
    const userId = req.user.id
    if(userId){
        await getCollectionsTilesByUID(userId)
            .then((listOfCollections) => {res.json(listOfCollections)})
            .catch((err) => {res.status(400).json(err)})
    }
})

router.post('/createCollection', passport.authenticate('jwt', {session: false}),async (req, res) => {
    // const userId = req.user.id
    // TODO : i need to change LayoutModal request add color and bg_image
    const userId = req.user.id
    const collection = {userId: userId, title: req.body.title, width: req.body.width}
    
    await createCollection(collection)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(418).send(err))
    
})

router.put('/changeCollection/:id', passport.authenticate('jwt', {session: false}), checkOwner('Collection'), async (req, res) => {
    // const collection = req.record
    const newCollection = {...req.body, id: req.record.id}
    await updateCollection(newCollection)
        .then((data) => {res.status(200).json(data)})
        .catch((err) => res.status(418).send(err))
})

router.delete('/deleteCollection/:id', passport.authenticate('jwt', {session: false}),checkOwner('Collection'), async (req, res) => {
    // const collectionId = req.params.id
    // const userId = req.user.id
    // const user = await User.findOne({where: {id: userId}})
    // const layout = await Layout.findOne({where: {id: collectionId}})
    // if(user.id === layout.UID){
    //     await layout.destroy().then(() => {
    //         res.status(200).send(`Layout ${LayoutId} has been deleted`)})
    //     .catch((err) => {
    //         res.status(402).send('Error ocurred trying to delete Layout')
    //     })
    // }

    await deleteCollection(+req.params.id)
        .then(() => {res.status(200).send(`Collection ${req.params.id} has been deleted`)})
        .catch((err) => {res.status(402).send('Error ocurred trying to delete Layout')})
    

})


export default router;