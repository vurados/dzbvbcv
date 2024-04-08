import { getCollectionsTilesByUID } from "../drizzle/actions/collection";
import { getNotesByCId } from "../drizzle/actions/note";
import { Collection } from "../drizzle/schema/collection";
import { Note } from "../drizzle/schema/note"

type Model = "Note" | "Collection"

export const checkOwner = (model: Model) => async (req: any, res: any, next: any) => {
    try {
        let record
        switch (model) {
            case "Note":
                record = await getNotesByCId(req.params.cid) as Note[]
                break
            case "Collection":
                record = await getCollectionsTilesByUID(req.params.id) as Collection[]
                break
            default:
                return new Error('Invalid model type')
        }

        if (record){
            const recordOwner = record[0].userId
            if(recordOwner !== req.user.id){
                res.status(403).send('Access denied, you dont own a record')
            }
        }else{
            res.status(401).send('resource not found')
        }

        // get record if parameter is passed(delete(Note/Collection)/{id}, change(Note/Collection)/{id})
        if(req.params.id){
            record.forEach(element => {
                if(element.id == req.params.id){
                    req.record = element
                }
            })
        }else{
            req.record = record
        }   
        
        next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Server busy handling your problems, so you dont have to')
    }
}
