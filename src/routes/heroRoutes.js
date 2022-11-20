const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: async (request) => {
                const { skip, limit, nome } = request.query
                let query = {}
                nome
                    ? query = { $regex: `.*${nome}*.` }
                    : query
                return isNaN(limit) || isNaN(skip)
                    ? Error()
                    : this._db.read({ query }, + skip, +limit)
                        .catch(erroList => { console.error('Erro list', erroList) })
            }
        }
    }
}

module.exports = HeroRoutes