const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this._db = db
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            handler: async req => {
                try {
                    const { name, poder } = req.payload
                    const result = await this._db.create({ name, poder })
                    return {
                        message: "Heroi cadastrado com sucesso",
                        result
                    }
                } catch (erroPost) {
                    console.error('ERRO POST', erroPost)
                }
            }
        }
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: async (request) => {
                const { skip, limit, nome } = request.query
                let query = {}
                nome
                    ? query.name = nome
                    : query.name = {}
                return isNaN(limit) || isNaN(skip)
                    ? Error()
                    : this._db.read({ query }, + skip, +limit)
                    .then(res => [res])
                        .catch(erroList => { console.error('Erro list', erroList) })
            }
        }
    }

    update() {
        return {
            path: '/herois/{_id}',
            method: 'PATCH',
            handler: async req => {
                try {
                    const id = req.params
                    const { payload } = req
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    const result = await this._db.update(id, dados)

                    return {
                        result,
                        message: 'Heroi atualizado com sucesso'
                    }

                } catch (e) {
                    return console.error('ERRO PATCH', e.message)
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{_id}',
            method: 'DELETE',
            handler: async req => {
                try {
                    const id = req.params
                    const { payload } = req
                    const result = await this._db.delete(id)

                    return {
                        result,
                        message: 'Heroi deletado com sucesso'
                    }

                } catch (e) {
                    return console.error('ERRO PATCH', e.message)
                }
            }
        }
    }
}

module.exports = HeroRoutes