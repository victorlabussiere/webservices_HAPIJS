const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/herosSchema')
const HeroRoute = require('./routes/heroRoutes')

async function main() {
    const app = new Hapi.Server({ port: 5000 }) // criação do servidor com hapi
    const mapRoutes = (instance, methods) => methods.map(method => instance[method]())

    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ])

    app.start()
        .then(console.log('Servidor rodando na porta ===>', app.info.port))
    
    return app
}

module.exports = main()