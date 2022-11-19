const assert = require('assert')
const api = require('../api')

let app = {}
describe.only('Suíte de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('Listar herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=1&nome=Vasco'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /herois -> deve retornar somente 10 registros', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=Vas`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Lista /herois - deve retornar erro de query', async () => {
        const ERRO_PROPOSITAL = 'string'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${ERRO_PROPOSITAL}&nome=Vasco`
        })

        assert.deepEqual(result.statusCode, 500)
    })
})  