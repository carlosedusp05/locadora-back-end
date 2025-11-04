/*************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model
 *              (Validações, tratamento de dados tratamento de erros, etc).
 * Data: 04/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const filmeDAO = require('../../model/DAO/produtora.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarProdutoras = async function(){

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Chama a função para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllProducers()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status         = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code    = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.Producers = result 

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

const buscarProdutoraPeloId = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.getSelectByIdProducers(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.producer = result

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

const inserirProdutora = async function(produtora, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosProdutora(produtora)

                if(!validarDados){

                //Chama a função do DAO para inserir um novo produtora!
                let result = await filmeDAO.setInsertProducers(produtora)
    
                if(result){

                    //Chama a função para receber o ID gerado no BD
                    let lastIdProdutora = await filmeDAO.getSelectLastIdProducer()

                    if(lastIdProdutora){
                        //Adiciona no JSON de produtora Id que foi gerado pelo BD
                        produtora.id                     = lastIdProdutora
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = produtora

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

const atualizarProdutora = async function(produtora, id, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validação de dados de cadastro
                let validarDados = await validarDadosProdutora(produtora)

                if(!validarDados){
                
                //Chama a função para validar a consisência do ID 
                let validarId = await buscarProdutoraPeloId(id)

                if(validarId.status_code == 200){

                    //Adicionando o ID no JSON com os dados dos filme
                    produtora.id = parseInt(id)

                    //Chama a função do DAO para inserir um novo filme!
                    let result = await filmeDAO.setUpdateProducers(produtora)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = produtora

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

const excluirProdutora = async function(id){
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções.
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let validarId = await buscarProdutoraPeloId(id)

                if(validarId.status_code == 200){

            //Chama a função para filtrar pelo id
            let result = await filmeDAO.setDeleteProducers(parseInt(id))

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

const validarDadosProdutora = async function (produtora) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(produtora.nome == '' || produtora.nome == null || produtora.nome == undefined || produtora.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo biografia inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(produtora.biografia == '' || produtora.biografia == null || produtora.biografia == undefined || produtora.biografia.length > 2000){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo biografia inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(produtora.data_fundacao == null || produtora.data_fundacao == undefined || produtora.data_fundacao.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo data fundacaodata_fundacao inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(produtora.data_fechamento == undefined && produtora.data_fechamento !== null && produtora.data_fechamento.length >10 ){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo data fechamento inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(produtora.is_ativo != true && produtora.is_ativo != false || produtora.is_ativo == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo is ativo inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(produtora.logo == '' || produtora.logo == null || produtora.logo == undefined || produtora.logo.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo logo inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}



module.exports = {
    listarProdutoras,
    buscarProdutoraPeloId,
    inserirProdutora,
    atualizarProdutora,
    excluirProdutora
}