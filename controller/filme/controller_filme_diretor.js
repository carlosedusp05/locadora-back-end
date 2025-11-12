/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 05/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const filmeDAO = require('../../model/DAO/filme_diretor.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarFilmesDiretores = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeDAO.getSelectAllFilmsDirectors()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status           = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code      = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filmsDirectors  = result 

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

const buscarFilmeDiretorPeloId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let result = await filmeDAO.getSelectFilmDirectorById(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsDirector = result

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

const inserirFilmeDiretor = async function (filmeDiretor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosDiretor(filmeDiretor)

            if(!validarDados){

                let result = await filmeDAO.setInsertFilmsDirectors(filmeDiretor)

                if(result){
                     let lastIdDiretor = await filmeDAO.getSelectLastId()

                     if(lastIdDiretor){
                        filmeDiretor.id              = lastIdDiretor
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeDiretor

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

const atualizarFilmeDiretor = async function (filmeDiretor, id, contentType) {
   let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

            if(!validarDados){
                let validarId = await buscarFilmeDiretorPeloId(parseInt(id))

                if(validarId.status_code == 200){
                    filmeDiretor.id = parseInt(id)

                    let result = filmeDAO.setUpdateFilmsDirectors(filmeDiretor)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeDiretor

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

const excluirFilmeDiretor = async function (id) {
     let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

     try {
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            let validarId = await buscarFilmeDiretorPeloId(id)
            
            if(validarId.status_code == 200){
                let result = await filmeDAO.setDeleteFilmsDirectors(parseInt(id))
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

const validarDadosFilmeDiretor = async function (filmeDiretor) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeDiretor.id_filme == '' || filmeDiretor.id_filme == null || filmeDiretor.id_filme == undefined || filmeDiretor.id_filme.length <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id filme inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filmeDiretor.id_Diretor == '' || filmeDiretor.id_Diretor == null || filmeDiretor.id_Diretor == undefined || filmeDiretor.id_Diretor.length <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id Diretor inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}

//Retorna os Diretors pelo id do filme 
const listarDiretorsIdFilme = async function (idFilme) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            let result = await filmeDAO.getSelectDirectorByIdFilm(parseInt(idFilme))
            

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsDirector = result

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

//Retorna os filmes pelo id do Diretor 
const listarFilmesIdDiretor = async function (idDiretor) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( idDiretor != '' && idDiretor != null && idDiretor != undefined && !isNaN(idDiretor) && idDiretor > 0){

            let result = await filmeDAO.getSelectFilmByIdDirector(parseInt(idDiretor))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsDirector = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id Diretor inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirDiretorsPeloFilme = async function (id_filme) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
       if(id_filme != '' && id_filme != null && id_filme != undefined && !isNaN(id_filme) && id_filme > 0){
           let validarId = await buscarFilmeDiretorPeloId(id_filme)
           
           if(validarId.status_code == 200){
               let result = await filmeDAO.setDeleteDirectorsByIdFilm(parseInt(id_filme))
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
    inserirFilmeDiretor,
    listarFilmesDiretores,
    listarFilmesIdDiretor,
    listarDiretorsIdFilme,
    atualizarFilmeDiretor,
    excluirFilmeDiretor,
    buscarFilmeDiretorPeloId,
    excluirDiretorsPeloFilme
}