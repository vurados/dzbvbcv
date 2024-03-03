const {Layout, User, Note} = require('../models')

const checkOwner = (Model) => async (req, res, next) => {
    try {
        let record
        if(Model === Note){
            record = await Model.findByPk(req.params.id, {
                include:[
                    {
                        model:Layout,
                        as: 'Layout',
                        include: {
                            model: User,
                            as: 'User',
                        },
                    }
                ]
            })
        }
        if (Model === Layout){
            record = await Model.findByPk(req.params.id, {
                include:[
                    {
                        model: User,
                        as: 'User',
                    },
                    
                ]
            })
            
        }

        if(!record){
            return res.status(401).send('resource not found')
        }

        let user = record.User
        if(Model === Note){
            const layout = record.Layout
            user = layout.User
        }

        if(user.id !== req.user.id){
            return res.status(403).send('Access denied, you dont own a record')
        }

        req.record = record
        
        next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Server busy handling your problems, so you dont have to')
    }
}

module.exports = {checkOwner}