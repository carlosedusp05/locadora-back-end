/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 29/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const filmeDAO = require('../../model/DAO/ator.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarAtores = async function(){

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Chama a função para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllActors()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status         = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code    = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.actors = result 

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

//Retorna um ator filtrando pelo id
const buscarAtorPeloId = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.getSelectByIdActors(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actor = result

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

const inserirAtor = async function(ator, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosAtor(ator)

                if(!validarDados){
                //Chama a função do DAO para inserir um novo ator!
                let result = await filmeDAO.setInsertActors(ator)
                
                if(result){

                    //Chama a função para receber o ID gerado no BD
                    let lastIdAtor = await filmeDAO.getSelectLastIdActor()

                    if(lastIdAtor){
                        //Adiciona no JSON de ator Id que foi gerado pelo BD
                        ator.id                     = lastIdAtor
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = ator

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
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const atualizarAtor = async function(ator, id, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosAtor(ator)

                if(!validarDados){
                
                //Chama a função para validar a consisência do ID 
                let validarId = await buscarAtorPeloId(id)

                if(validarId.status_code == 200){

                    //Adicionando o ID no JSON com os dados dos filme
                    ator.id = parseInt(id)

                    //Chama a função do DAO para inserir um novo filme!
                    let result = await filmeDAO.setUpdateActors(ator)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = ator

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

const excluirAtor = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let validarId = await buscarAtorPeloId(id)

                if(validarId.status_code == 200){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.setDeleteActors(parseInt(id))

            if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER //200
                
                }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }else{
                return validarId //Retorno da função de buscarFilmeID (400 ou 404 ou 500)
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }       
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500   
    }
}

const validarDadosAtor = async function (ator) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(ator.biografia == '' || ator.biografia == null || ator.biografia == undefined || ator.biografia.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo biografia inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.biografia == '' || ator.biografia == null || ator.biografia == undefined || ator.biografia.length > 2000){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo biografia inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_nascimento == null || ator.data_nascimento == undefined || ator.data_nascimento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo data nascimento inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_falecimento == undefined && ator.data_falecimento !== null && ator.data_falecimento.length >10 ){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo data falecimento inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.is_ativo != true && ator.is_ativo != false || ator.is_ativo == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo is ativo inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.idade == undefined || ator.idade == null || ator.idade.length > 3 || isNaN(ator.idade)){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo idade inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.foto == '' || ator.foto == null || ator.foto == undefined || ator.foto.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo foto inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}

module.exports = {
    listarAtores,
    buscarAtorPeloId,
    inserirAtor,
    atualizarAtor,
    excluirAtor
}