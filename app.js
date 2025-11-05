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
const controllerAtor = require('./controller/ator/controller_ator.js')
const controllerDiretor = require('./controller/diretor/controller_diretor.js')
const controllerProdutora = require('./controller/proutora/controller_produtora.js')
const controllerIdioma = require('./controller/idioma/controller_idioma.js')
const controllerPais = require('./controller/pais/controller_pais.js')
    
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

/**********************************END-POINTS ATORES*********************************************/
app.get('/v1/locadora/atores', cors(), async function(request, response) {
    let ator = await controllerAtor.listarAtores()

    response.status(ator.status_code)
    response.json(ator)
})

app.get('/v1/locadora/ator/:id', cors(), async function (request, response) {
    let idAtor = request.params.id
    
    let ator = await controllerAtor.buscarAtorPeloId(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})

app.post('/v1/locadora/ator', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

app.put('/v1/locadora/ator/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let idAtor = request.params.id

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

app.delete('/v1/locadora/ator/:id', cors(), async function (request, response) {
    let idAtor = request.params.id

    let ator = await controllerAtor.excluirAtor(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})

/**********************************END-POINTS ATORES*********************************************/

app.get('/v1/locadora/diretores', cors(), async function(request, response) {
    let diretor = await controllerDiretor.listarDiretores()

    response.status(diretor.status_code)
    response.json(diretor)
})

app.get('/v1/locadora/diretor/:id', cors(), async function (request, response) {
    let IdDiretor = request.params.id
    
    let diretor = await controllerDiretor.buscarDiretorPeloId(IdDiretor)

    response.status(diretor.status_code)
    response.json(diretor)
})

app.post('/v1/locadora/diretor', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let diretor = await controllerDiretor.inserirDiretor(dadosBody, contentType)

    response.status(diretor.status_code)
    response.json(diretor)
})

app.put('/v1/locadora/diretor/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let IdDiretor = request.params.id

    let contentType = request.headers['content-type']

    let diretor = await controllerDiretor.atualizarDiretor(dadosBody, IdDiretor, contentType)

    response.status(diretor.status_code)
    response.json(diretor)
})

app.delete('/v1/locadora/diretor/:id', cors(), async function (request, response) {
    let idDiretor = request.params.id

    let diretor = await controllerDiretor.excluirDiretor(idDiretor)

    response.status(diretor.status_code)
    response.json(diretor)
})

/**********************************END-POINTS PRODUTORA*********************************************/

app.get('/v1/locadora/produtoras', cors(), async function(request, response) {
    let produtora = await controllerProdutora.listarProdutoras()

    response.status(produtora.status_code)
    response.json(produtora)
})

app.get('/v1/locadora/produtora/:id', cors(), async function (request, response) {
    let IdProdutora = request.params.id
    
    let produtora = await controllerProdutora.buscarProdutoraPeloId(IdProdutora)

    response.status(produtora.status_code)
    response.json(produtora)
})

app.post('/v1/locadora/produtora', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let produtora = await controllerProdutora.inserirProdutora(dadosBody, contentType)

    response.status(produtora.status_code)
    response.json(produtora)
})

app.put('/v1/locadora/produtora/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let IdProdutora = request.params.id

    let contentType = request.headers['content-type']

    let produtora = await controllerProdutora.atualizarProdutora(dadosBody, IdProdutora, contentType)

    response.status(produtora.status_code)
    response.json(produtora)
})

app.delete('/v1/locadora/produtora/:id', cors(), async function (request, response) {
    let IdProdutora = request.params.id

    let produtora = await controllerProdutora.excluirProdutora(IdProdutora)

    response.status(produtora.status_code)
    response.json(produtora)
})

/**********************************END-POINTS IDIOMAS*********************************************/

app.get('/v1/locadora/idiomas', cors(), async function(request, response) {
    let idioma = await controllerIdioma.listarIdiomas()

    response.status(idioma.status_code)
    response.json(idioma)
})

app.get('/v1/locadora/idioma/:id', cors(), async function (request, response) {
    let IdIdioma = request.params.id
    
    let idioma = await controllerIdioma.buscarIdiomaPeloId(IdIdioma)

    response.status(idioma.status_code)
    response.json(idioma)
})

app.post('/v1/locadora/idioma', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let idioma = await controllerIdioma.inserirIdioma(dadosBody, contentType)

    response.status(idioma.status_code)
    response.json(idioma)
})

app.put('/v1/locadora/idioma/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let IdIdioma = request.params.id

    let contentType = request.headers['content-type']

    let idioma = await controllerIdioma.atualizarIdioma(dadosBody, IdIdioma, contentType)

    response.status(idioma.status_code)
    response.json(idioma)
})

app.delete('/v1/locadora/idioma/:id', cors(), async function (request, response) {
    let IdIdioma = request.params.id

    let idioma = await controllerProdutora.excluirProdutora(IdIdioma)

    response.status(idioma.status_code)
    response.json(idioma)
})


/**********************************END-POINTS PAISES*********************************************/

app.get('/v1/locadora/paises', cors(), async function(request, response) {
    let pais = await controllerPais.listarPaises()

    response.status(pais.status_code)
    response.json(pais)
})

app.get('/v1/locadora/pais/:id', cors(), async function (request, response) {
    let IdPais = request.params.id
    
    let pais = await controllerPais.buscarPaisPeloId(IdPais)

    response.status(pais.status_code)
    response.json(pais)
})

app.post('/v1/locadora/pais', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let pais = await controllerPais.inserirPais(dadosBody, contentType)

    response.status(pais.status_code)
    response.json(pais)
})

app.put('/v1/locadora/pais/:id', cors(), bodyParserJSON, async function (request, response) {
    let dadosBody = request.body

    let IdPais = request.params.id

    let contentType = request.headers['content-type']

    let pais = await controllerPais.atualizarPais(dadosBody, IdPais, contentType)

    response.status(pais.status_code)
    response.json(pais)
})

app.delete('/v1/locadora/pais/:id', cors(), async function (request, response) {
    let IdPais = request.params.id

    let pais = await controllerPais.excluirPais(IdPais)

    response.status(pais.status_code)
    response.json(pais)
})


app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})

