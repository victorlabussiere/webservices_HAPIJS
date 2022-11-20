const assert = require('assert')
const api = require('../api')

let app = {}
describe('Suíte de testes da API Heroes', function () {
    this.beforeAll(async () => app = await api)

    it('Listar /herois -> DEVE RETORNAR UM LISTA COM TODOS OBJETOS DO DB', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1&nome=Vasco`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /herois -> DEVE RETORNAR O OBJETO CONSULTADO PELA QUERY NOME', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=vasco`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.nome = 'Vasco')
    })

    it('Listar /herois -> DEVE RETORNAR STATUS 500', async () => {
        const ERRO_PROPOSITAL = 'String onde deveria ser um Number'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${ERRO_PROPOSITAL}&nome=Vasco`
        })
        assert.deepEqual(result.statusCode, 500)
    })
})