/*************************************************************************
 * Objetivo: Arquivo responsável pela padronização de todas as mensagens da API projetos filmes.
 * Data: 01/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const dataAtual = new Date()

/**************************MENSAGENS DE PADRONIZAÇÃO DO PROJETO***********************************/
const HEADER = {  
                            development: 'Carlos Eduardo',
                            api_description: 'API para manipular dados da locadora de filmes',
                            version: '1.0.10.25',
                            request_date: dataAtual.toLocaleDateString(),
                            status:   Boolean,
                            status_code: Number,
                            response: {}
}

/*****************************MENSAGENS DE ERROS DO PROJETO***************************************/
const ERROR_NOT_FOUND                   = {status: false, status_code: 404, message: 'Não foi encontrado dados de retorno!'}

const ERROR_INTERNAL_SERVER_MODEL       = {status: false, status_code: 500, message: 'Não foi possível processar a requisição, devido a problemas na camada de MODELAGEM de dados!'}

const ERROR_INTERNAL_SERVER_CONTROLLER  = {status: false, status_code: 500, message: 'Não foi possível processar a requisição, devido a problemas na camada de CONTROLE de dados!'}

const ERROR_REQUIRED_FIELDS             = {status: false, status_code: 400, message: 'Não foi possível processar a requisição, devido a campos obrigatórios que não foram enviados corretamente!'}

const ERROR_CONTENT_TYPE                = {status: false, status_code: 415, message: 'Não foi possível processar a requisição, devido ao tipo de conteúdo enviado no body. Deve-se utilizar apenas JSON na API!'}
/****************************MENSAGENS DE SUCESSOS DO PROJETO*************************************/
const SUCESS_REQUEST = {status: true, status_code: 200, message: 'Requisição bem-sucedida!'}

const SUCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'Requisição bem-sucedida, item criado com sucesso!'}

const SUCESS_UPDATED_ITEM = {status: true, status_code: 200, message: 'Requisição bem-sucedida, objeto atualizado com sucesso!'}

const SUCESS_DELETED_ITEM = {status: true, status_code: 200, message: 'Requisição bem-sucedida, objeto apagado com sucesso!'}

module.exports = {
    HEADER,
    SUCESS_REQUEST,
    SUCESS_CREATED_ITEM,
    SUCESS_UPDATED_ITEM,
    SUCESS_DELETED_ITEM,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_NOT_FOUND,
    ERROR_REQUIRED_FIELDS,
    ERROR_CONTENT_TYPE
}