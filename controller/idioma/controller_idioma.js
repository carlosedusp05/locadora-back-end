/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 04/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const filmeDAO = require('../../model/DAO/idioma.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarIdiomas = async function(){

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Chama a função para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllLanguages()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status         = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code    = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.Languages = result 

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

const buscarIdiomaPeloId = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.getSelectByIdLanguages(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.Language = result

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

const inserirIdioma = async function(idioma, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosIdioma(idioma)

                if(!validarDados){

                //Chama a função do DAO para inserir um novo idioma!
                let result = await filmeDAO.setInsertLanguages(idioma)
    
                if(result){

                    //Chama a função para receber o ID gerado no BD
                    let lastIdIdioma = await filmeDAO.getSelectLastIdLanguage()

                    if(lastIdIdioma){
                        //Adiciona no JSON de idioma Id que foi gerado pelo BD
                        idioma.id                     = lastIdIdioma
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = idioma

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

const atualizarIdioma = async function(idioma, id, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosIdioma(idioma)

                if(!validarDados){
                
                //Chama a função para validar a consisência do ID 
                let validarId = await buscarIdiomaPeloId(id)

                if(validarId.status_code == 200){

                    //Adicionando o ID no JSON com os dados dos filme
                    idioma.id = parseInt(id)

                    //Chama a função do DAO para inserir um novo filme!
                    let result = await filmeDAO.setUpdateLanguages(idioma)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = idioma

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

const excluirIdioma = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let validarId = await buscarIdiomaPeloId(id)

                if(validarId.status_code == 200){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.setDeleteLanguages(parseInt(id))

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

const validarDadosIdioma = async function (idioma) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(idioma.nome == '' || idioma.nome == null || idioma.nome == undefined || idioma.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo nome inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}



module.exports = {
    listarIdiomas,
    buscarIdiomaPeloId,
    inserirIdioma,
    atualizarIdioma,
    excluirIdioma
}