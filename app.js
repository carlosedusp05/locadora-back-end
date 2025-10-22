/**************************************************************************************
 * Objetivo: API responsável em criar end-points referente a locadoras de filmes
 * Data: 07/10/2025
 * Autor: Carlos Eduardo 
 * Versão: 1.0
 *************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

//Import do arquivo de funções  
// let filme = await controllerFilmes

//Define a porta padrão da API, se for em um servidor de nuvem não temos acesso a porta
//em execução local podemos falar definir uma porta livre
const PORT = process.PORT || 8090

//Instancia na classe do express
const app = express()

app.use((request, response, next)=>{
    response.header('Acess-Control-Allow-Origin', '*')//IP de Origem
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')//Métodos (Vebos) do protocolo HTTP

    app.use(cors())
    next()//Proximo
})

//Import das controller da API
const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_genero.js')
    
//Endpoints para o CRUD de filmes

//Retorna a lista de filmes 
app.get('/v1/locadora/filmes', cors(), async function (request, response) {
    let filme = await controllerFilme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)
})

//Retorna um filme filtrando pelo id
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idFilme = request.params.id 

    //Chama a função da controller para retornar o filme
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//Insere um novo filme no banco de dados
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response){
    //Recebe o objeto JSON pelo body da requisição 
    let dadosBody = request.body

    //Recebe o content type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e do content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição 
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idFilme = request.params.id

     //Recebe o content type da requisição 
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.delete('/v1/locadora/filme/:id', cors(), async function (request, response) {
    //Recebe o id do filme encaminhado pela URL
    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilme(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

/**********************************END-POINTS GENERO*********************************************/

//Retorna todos os generos
app.get('/v1/locadora/generos', cors(), async function(request, response) {
    let genero = await controllerGenero.listarTodosGeneros()

    response.status(genero.status_code)
    response.json(genero)
})

//Filtra os genero pelo id requisitado
app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {
    let idGenero = request.params.id
    
    let genero = await controllerGenero.buscarGeneroPeloId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)

})

app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let idGenero = request.params.id

    let contentType = request.headers['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
}

)

app.delete('/v1/locadora/genero/:id', cors(), async function (request, response) {
    let idGenero = request.params.id

    let genero = await controllerGenero.excluirGenero(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})