const assert = require('assert')
const { ConnectionStates } = require('mongoose')
const api = require('../api')

let app = {}
const errorResult = {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "child \"limit\" fails because [\"limit\" must be a number]",
    "validation": {
        "source": "query",
        "keys": ["limit"]
    }
}
const MOCK_CADASTRAR = {
    name: 'Flash',
    poder: 'Speed'
}

describe('Suíte de testes da API Heroes', async function () {
    let ID_MOCK = {}
    this.beforeEach(async () => {
        app = await api
    })

    it('1 -> Cadastrar /herois -> DEVE CADASTRAR UM HEROI NO BANCO DE DADOS', async () => {
        const result = await (await api).inject({
            method: 'POST',
            url: `/herois`,
            payload: MOCK_CADASTRAR
        })

        const dados = JSON.parse(result.payload)
        const id = dados.result._id
        ID_MOCK = id
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
    })

    it('2 ->Listar /herois -> DEVE RETORNAR UM LISTA COM TODOS OBJETOS DO DB', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1&nome=Vasco`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('3 -> Listar /herois -> DEVE RETORNAR O OBJETO CONSULTADO PELA QUERY NOME', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=vasco`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.nome = 'Vasco')
    })

    it('4 -> Listar /herois -> DEVE RETORNAR STATUS 500', async () => {
        const ERRO_PROPOSITAL = 'String onde deveria ser um Number'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${ERRO_PROPOSITAL}&nome=Vasco`
        })
        assert.deepEqual(result.statusCode, 500)
    })

    it('5 -> Atualizar /herois:{id} -> DEVE SELECIONAR UM HEROI E ATUALIZAR SEU PODER', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${ID_MOCK}`,
            payload: JSON.stringify({ poder: 'Super Speed' })
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.ok(statusCode === 200)
        assert.ok(dados.message === 'Heroi atualizado com sucesso')
    })

    it('6 ->Deletar /herois:{id} -> DEVE SELECIONAR UM HEROI E DELETAR DO BANCO DE DADOS', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${ID_MOCK}`,
            payload: JSON.stringify({ id: `${ID_MOCK}` })
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(dados.message === "Heroi deletado com sucesso")
        assert.deepEqual(statusCode, 200)
    })
})
