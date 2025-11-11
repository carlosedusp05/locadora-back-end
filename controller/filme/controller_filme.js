/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 01/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/
//Import do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/DAO/filme.js')

//Import da controller filme genero
const controllerFilmeGenero = require('../../controller/filme/controller_filme_genero.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')


//Retorna uma lista de filmes 
const listarFilmes = async function(){

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Chama a função para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllFilms()

        if(result){
            if(result.length > 0){

                //Processamento para adicionar os generos em cada filme
                for(filme of result){
                    let resultGenerosFilme = await controllerFilmeGenero.listarGenerosIdFilme(filme.id)
                    if(resultGenerosFilme.status_code == 200)
                    filme.genero = resultGenerosFilme.response.filmsGenre
                }

                MESSAGE.HEADER.status         = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code    = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um filme filtrando pelo id
const buscarFilmeId = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))

            if(result){
                if(result.length > 0){

                    for(filme of result){
                        let resultGenerosFilme = await controllerFilmeGenero.listarGenerosIdFilme(filme.id)
                        if(resultGenerosFilme.status_code == 200)
                        filme.genero = resultGenerosFilme.response.filmsGenre
                    }
                    
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
            }

        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo filme
const inserirFilme = async function(filme, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosFilme(filme)

                if(!validarDados){
            
                //Chama a função do DAO para inserir um novo filme!
                let result = await filmeDAO.setInsertFilms(filme)

                if(result){

                    //Chama a função para receber o ID gerado no BD
                    let lastIdFilme = await filmeDAO.getSelectLastIdFilm()
                

                    if(lastIdFilme){

                        //Processamentopara inserir dados na tabela relação filme e genero

                        //Repetição para pegar cada genero e enviar para o DAO do filmeGenero
                        //filme.genero.forEach(async function(genero){
                        for(genero of filme.genero){
                            let filmeGenero = {id_filme:    lastIdFilme,
                                               id_genero:   genero.id
                            }

                            let resultFilmeGenero = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType)
                            
                            if(resultFilmeGenero.status_code != 201)
                                return MESSAGE.ERROR_RELATION_TABLE //200, porém com problemas na tabela relação
                        }

                        //Adiciona no JSON de filme Id que foi gerado pelo BD
                        filme.id                    = lastIdFilme
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        
                        //Processamento para trazer dados do genero para trazer dados na tabela relação

                        //Essa linha apaga o atributo genero que chega no POST apenas IDs
                        delete filme.genero

                        //Pesqisa no BD quais os generos e os seus dados que foram inseridos na tabela relação 
                        let resultGenerosFilme = await controllerFilmeGenero.listarGenerosIdFilme(lastIdFilme)

                        //Adiciona novamente o atributo genero com todas as informações do genero(ID, Nome)
                        filme.genero = resultGenerosFilme.response.filmsGenre
                        
                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER //201
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarDados //400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um filme filtrando um id
const atualizarFilme = async function(filme, id, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosFilme(filme)

                if(!validarDados){
                
                //Chama a função para validar a consisência do ID 
                let validarId = await buscarFilmeId(id)

                if(validarId.status_code == 200){

                    //Adicionando o ID no JSON com os dados dos filme
                    filme.id = parseInt(id)

                    //Chama a função do DAO para inserir um novo filme!
                    let result = await filmeDAO.setUpdateFilms(filme)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message     = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = filme

                        return MESSAGE.HEADER //201
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                        return validarId //Retorno da função de buscarFilmeID (400 ou 404 ou 500)
                    }
            }else{
                return validarDados //Retorno da função de validar dados filmes 400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Exclui um filme pelo id 
const excluirFilme = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let validarID = await buscarFilmeId(id)

                if(validarID.status_code == 200){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.setDeleteFilms(parseInt(id))

            if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER //200
                
                }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }else{
                return validarID //Retorno da função de buscarFilmeID (400 ou 404 ou 500)
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }       
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500   
    }
}

//Validação dos dados de cadastro do filmed
const validarDadosFilme = async function (filme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo nome inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.sinopse == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo sinopse inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo data lançamento inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo duração inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || filme.orcamento.length > 16 || typeof(filme.orcamento) != 'number'){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo orçamento inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.trailer == undefined || filme.trailer > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo trailer inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo capa inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme
}