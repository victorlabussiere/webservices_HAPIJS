const assert = require('assert');
const heroisSchema = require('../db/strategies/mongodb/schemas/herosSchema')
const Context = require('../db/strategies/base/contextStrategy')
const Mongo = require('../db/strategies/mongodb/mongodb');

describe('MongoDb suíte de testes', function () {

    let context = {}
    this.beforeAll(async () => {
        const connection = Mongo.connect()
        context = new Context(new Mongo(connection, heroisSchema))
        await context.create({
            name: "Vasco",
            poder: "Subir"
        })
    })

    const DEFAULT_HERO = {
        name: 'Victor',
        poder: 'Javascript'
    }

    it('Deve testar a conexão com o Banco de Dados.', async () => {
        result = await context.isConnected()
        // console.log('isConnected TEST RESULT ===>', result)
        assert.ok(result === 'Conectado');
    })

    it('CREATE HERO deve criar uma inserção de acordo com o padrão desejado.', async () => {
        const { name, poder } = await context.create(DEFAULT_HERO)
        const result = { name, poder }
        assert.deepEqual(result, DEFAULT_HERO)
    })

    it('READ HERO deve listar os resultados de uma pesquisa.', async () => {
        const {name, poder} = await context.read({ poder: DEFAULT_HERO.poder })
        const lendo = {name, poder}
        assert.ok(name === DEFAULT_HERO.name)
    })

    it('UPDATE HERO deve atualizar dados de um item', async () => {
        const result = await context.update({ name: DEFAULT_HERO.name }, { poder: 'Mongoose' })
        assert.ok(result.message === "Herói atualizado com sucesso")
    })

    it('DELETE HERO deve deletar um herói específico', async () => {
        const result = await context.delete({ poder: 'Mongoose' })
        // console.log('RESULTADO DELETE', result)
        assert.deepEqual(result, true)
    })

})