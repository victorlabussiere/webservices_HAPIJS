const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                const { skip, limit, nome } = request.query // request = url string

                return isNaN(skip) || isNaN(limit) || !nome
                    ? new Error('ERRO DURANTE A LISTAGEM')
                    : this._db.read({ nome }, +skip, +limit)
                        .then(res => res.filter(item => item.name === nome))
                        .catch(erroRead => console.error('ERRO GET ===>', erroRead))
            }
        }
    }
}

module.exports = HeroRoutes