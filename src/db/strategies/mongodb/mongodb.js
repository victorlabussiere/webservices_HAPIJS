const ICrud = require('../interfaces/InterfaceCrud')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectado'
}

class MongooseStrategy extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    static connect() {
        Mongoose.connect('mongodb://admin:vasco@localhost:27017')
            .catch(eConnect => console.error('ERRO DE CONEXÃO ===>', eConnect.message))
        const connection = Mongoose.connection
        connection.once('open', () => console.log('CONEXÃO ESTABELECIDA'))
        return connection
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        state === 'Conectado'
            ? state
            : await new Promise(res => setTimeout(res, 500))
        return STATUS[this._connection.readyState]
    }

    async create(item) {
        let count = 0
        await this._schema.find()
            .then(res => res.map(hero => hero.poder === item.poder && hero.nome === item.nome
                ? count++
                : count))
            .catch(eValidation => console.error('Erro de VALIDAÇÃO', eValidation))
        return count === 0
            ? await this._schema.create(item)
            : false
    }

    async read(query, skip, limit = 10) {
        const result = await this._schema.findOne(query)
            .skip(skip)
            .limit(limit)
            .catch(err => console.error('ERRO READ MONGODB', err.message))

        return result
    }

    async update(query, item) {
        try {
            const result = await this._schema.findOneAndUpdate(query, { $set: item })
            return {
                result,
                message: 'Herói atualizado com sucesso'
            }
        } catch (erroUpdateMongo) {
            return console.error('ERRO NO MONGO', erroUpdateMongo)
        }
    }

    async delete(query) {
        query
            ? { query }
            : {}
        return await this._schema.findOneAndDelete(query)
            .then(res => res = true)
            .catch(err => console.error(err.message))
    }
}
module.exports = MongooseStrategy