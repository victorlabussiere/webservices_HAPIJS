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

                if (!nome) return this._db.read({}, +skip, +limit) // retorna todos os elementos do banco em caso de não houver a query nome

                return isNaN(skip) || isNaN(limit)                  // valida o tipo do limit e skip
                    ? new Error()
                    : this._db.read({ nome }, +skip, +limit)
                        .then(res => res.filter(item => item.name === nome))
                        .then(dt => dt[0])                          // retorna apenas o objeto desejado pela query nome
                        .catch(erroRead => console.error('ERRO GET ===>', erroRead))
            }
        }
    }
}

module.exports = HeroRoutes