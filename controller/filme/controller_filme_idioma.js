/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 12/12/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const filmeDAO = require('../../model/DAO/filme_idioma.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarFilmesIdiomas = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeDAO.getSelectAllFilmsLanguages()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status           = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code      = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filmsLanguages  = result 

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

const buscarFilmeIdiomaPeloId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let result = await filmeDAO.getSelectFilmLanguagesById(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsLanguages = result

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

const inserirFilmeIdioma = async function (filmeIdioma, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosFilmeIdioma(filmeIdioma)

            if(!validarDados){

                let result = await filmeDAO.setInsertFilmsLanguages(filmeIdioma)

                if(result){
                     let lastIdIdioma = await filmeDAO.getSelectLastId()

                     if(lastIdIdioma){
                        filmeIdioma.id              = lastIdIdioma
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeIdioma

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

const atualizarFilmeIdioma = async function (filmeIdioma, id, contentType) {
   let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosFilmeIdioma(filmeIdioma)

            if(!validarDados){
                let validarId = await buscarFilmeIdiomaPeloId(parseInt(id))

                if(validarId.status_code == 200){
                    filmeIdioma.id = parseInt(id)

                    let result = filmeDAO.setUpdateFilmsLanguages(filmeIdioma)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeIdioma

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

const excluirFilmeIdioma = async function (id) {
     let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

     try {
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            let validarId = await buscarFilmeIdiomaPeloId(id)
            
            if(validarId.status_code == 200){
                let result = await filmeDAO.setDeleteFilmsLanguages(parseInt(id))
                if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message

                    delete MESSAGE.HEADER.response

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarId //404
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
     } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
     }
}

const validarDadosFilmeIdioma = async function (filmeIdioma) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeIdioma.id_filme == '' || filmeIdioma.id_filme == null || filmeIdioma.id_filme == undefined || filmeIdioma.id_filme.length <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id filme inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filmeIdioma.id_idioma == '' || filmeIdioma.id_idioma == null || filmeIdioma.id_idioma == undefined || filmeIdioma.id_idioma.length <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id Idioma inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}

//Retorna os Idiomas pelo id do filme 
const listarIdiomasIdFilme = async function (idFilme) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            let result = await filmeDAO.getSelectLanguageByIdFilm(parseInt(idFilme))
            

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsLanguage = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id_filme inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os filmes pelo id do Idioma 
const listarFilmesIdIdioma = async function (idIdioma) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( idIdioma != '' && idIdioma != null && idIdioma != undefined && !isNaN(idIdioma) && idIdioma > 0){

            let result = await filmeDAO.getSelectFilmByIdLanguages(parseInt(idIdioma))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsLanguages = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id Idioma inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirIdiomasPeloFilme = async function (id_filme) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
       if(id_filme != '' && id_filme != null && id_filme != undefined && !isNaN(id_filme) && id_filme > 0){
           let validarId = await buscarFilmeIdiomaPeloId(id_filme)
           
           if(validarId.status_code == 200){
               let result = await filmeDAO.setDeleteLanguagesByIdFilm(parseInt(id_filme))
               if(result){
                   MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                   MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                   MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message

                   delete MESSAGE.HEADER.response

                   return MESSAGE.HEADER //200
               }else{
                   return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
               }
           }else{
               return validarId //404
           }
       }else{
           MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
           return MESSAGE.ERROR_REQUIRED_FIELDS //400
       }
    } catch (error) {
       return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}



module.exports = {
    inserirFilmeIdioma,
    listarFilmesIdiomas,
    listarFilmesIdIdioma,
    listarIdiomasIdFilme,
    atualizarFilmeIdioma,
    excluirFilmeIdioma,
    buscarFilmeIdiomaPeloId,
    excluirIdiomasPeloFilme
}