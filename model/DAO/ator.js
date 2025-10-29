/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de ator no Banco de Dados MySQL.
 * Data: 29/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do PrismaClient
const {PrismaClient} = require('../../generated/prisma')
// const { PrismaClient } = require('@prisma/client')

//Cria um objeto do prisma client para manipular os scripts SQL 
const prisma = new PrismaClient()


//Retorna todos atores do banco de dados
const getSelectAllActors = async function () {
try {
    let sql = 'select * from tbl_ator order by id desc'

    //Executa no Banco de Dados o script sql
    let result = await prisma.$queryRawUnsafe(sql)

    //Validação para identificar para saber se o retorno do BD é um ARRAY (vazio ou com dados) 
    if(Array.isArray(result))
        return result
    else
        return false
    
} catch (error) {
    return false     
}

}

const getSelectByIdActors = async function(id) {
    try {

        //Script sql
        let sql = `select * from tbl_ator where id=${id}`
    
        //Executa no Banco de Dados o script sql
        let result = await prisma.$queryRawUnsafe(sql)
    
        //Validação para identificar para saber se o retorno do BD é um ARRAY (vazio ou com dados) 
        if(Array.isArray(result))
            return result
        else
            return false
        
    } catch (error) {
        return false     
    }
}

const setInsertActors = async function(ator) {
    try {
        let sql = `INSERT INTO tbl_ator(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
                    VALUES('${ator.nome}',
                     '${ator.biografia}',
                     '${ator.data_nascimento}',
                      ${ator.data_falecimento}, 
                      ${ator.is_ativo}, 
                     '${ator.idade}', 
                     '${ator.foto}')`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setUpdateActors = async function(ator) {
    try {
        let sql =   `UPDATE tbl_ator set 
                                        nome                =           '${ator.nome}',
                                        biografia           =           '${ator.biografia}',
                                        data_nascimento     =           '${ator.data_nascimento}', 
                                        data_falecimento    =            ${ator.data_falecimento},
                                        is_ativo            =            ${ator.is_ativo},
                                        idade               =           '${ator.idade}',
                                        foto                =           '${ator.foto}'
                    WHERE id = ${ator.id}`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteActors = async function(id) {
    try {
        let sql =   `DELETE FROM tbl_ator WHERE id = ${id}`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdActor = async function () {
    try {
        let sql = 'select id from tbl_ator order by id desc limit 1'
    
        //Executa no Banco de Dados o script sql
        let result = await prisma.$queryRawUnsafe(sql)
    
        //Validação para identificar para saber se o retorno do BD é um ARRAY (vazio ou com dados) 
        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false
        
    } catch (error) {
        return false     
    }
}

module.exports = {
    getSelectAllActors,
    getSelectByIdActors,
    getSelectLastIdActor,
    setInsertActors,
    setUpdateActors,
    setDeleteActors
}