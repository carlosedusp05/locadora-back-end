/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 22/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const filmeDAO = require('../../model/DAO/genero.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarTodosGeneros = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeDAO.getSelectAllGenres()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status           = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code      = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.genres  = result 

                return MESSAGE.HEADER //200 retorna a mensagem bonitinha
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404 veio o JSON result, mas vazio   
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500 nao veio o json result da model erro na própia if(result)
         }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 ele nao vai passr do try catch, logo erro neste arquivo
    }
    
}

const buscarGeneroPeloId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let result = await filmeDAO.getSelectGenreById(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.genre = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const inserirGenero = async function (genero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosGenero(genero)

            if(!validarDados){

                let result = await filmeDAO.setInsertGenres(genero)

                if(result){
                     let lastIdGenero = await filmeDAO.getSelectLastIdGenero()

                     if(lastIdGenero){
                        genero.id                   = lastIdGenero
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = genero

                        return MESSAGE.HEADER //201
                     }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                     }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarDados
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415 esse erro se dá, devido ao formato de dados que foi enviado só acitamos JSON
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const atualizarGenero = async function (genero, id, contentType) {
   let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosGenero(genero)

            if(!validarDados){
                let validarId = await buscarGeneroPeloId(id)

                if(validarId.status_code == 200){
                    genero.id = parseInt(id)

                    let result = filmeDAO.setUpdateGenres(genero)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = genero

                        return MESSAGE.HEADER //201
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarId
                }
            }else{
                return validarDados
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirGenero = async function (id) {
     let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

     try {
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            let validarId = await buscarGeneroPeloId(id)
            
            if(validarId.status_code == 200){
                let result = await filmeDAO.setDeleteGenero(parseInt(id))
                if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarId
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
     } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
     }
}

const validarDadosGenero = async function (genero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo nome inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}

module.exports = {
    listarTodosGeneros,
    buscarGeneroPeloId,
    inserirGenero,
    atualizarGenero,
    excluirGenero
}