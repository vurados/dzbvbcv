import { getCollectionsTilesByUID } from "../drizzle/actions/collection";
import { getNotesByCId } from "../drizzle/actions/note";


type Model = "Note" | "Collection"

const checkOwner = (model: Model) => async (req: any, res: any, next: any) => {
    try {
        let record
        switch (model) {
            case "Note":
                record = await getNotesByCId(req.params.id)
                break;
            case "Collection":
                record = await getCollectionsTilesByUID(req.params.id)
                break
            default:
                return new Error('Invalid model type')
        }

        if (record){
            const recordOwner = record[0].userId
            if(recordOwner !== req.user.id){
                return res.status(403).send('Access denied, you dont own a record')
            }
        }

        if(!record){
            return res.status(401).send('resource not found')
        }

        req.record = record
        
        next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Server busy handling your problems, so you dont have to')
    }
}

module.exports = {checkOwner}