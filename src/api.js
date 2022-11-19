const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/herosSchema')
const HeroRoute = require('./routes/heroRoutes')
// declarando helpers:
const app = new Hapi.Server({ port: 5000 }) // criação do servidor com hapi
const mapRoutes = (instance, methods) => methods.map(method => instance[method]())

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ])

    await app.start() // server start.
        .then(console.log('Servidor rodando na porta ===>', app.info.port))
        .catch(hapiServerError => console.error('Erro de conexão com servidor hapi ===>', hapiServerError))

    return app
}

module.exports = main()