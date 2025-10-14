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



app.listen(PORT, function(){
    console.log('API aguardando requisições...')
})