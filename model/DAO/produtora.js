/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de{produtora no Banco de Dados MySQL.
 * Data: 04/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const {PrismaClient} = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllProducers = async function () {
try {
    let sql = 'select * from tbl_produtora order by id_produtora desc'

    let result = await prisma.$queryRawUnsafe(sql)

    if(Array.isArray(result))
        return result
    else
        return false
    
} catch (error) {
    console.log(error)
    return false     
}
}

const getSelectByIdProducers = async function(id) {
    try {

        //Script sql
        let sql = `select * from tbl_produtora where id_produtora=${id}`
    
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

const setInsertProducers = async function(produtora) {
    try {
        if (produtora.data_fechamento == null) {
            let sql = `INSERT INTO tbl_produtora(nome, biografia, data_fundacao, data_fechamento, is_ativo, logo)
                    VALUES('${produtora.nome}',
                     '${produtora.biografia}',
                     '${produtora.data_fundacao}',
                      ${produtora.data_fechamento}, 
                      ${produtora.is_ativo},  
                     '${produtora.logo}')`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
        } else {
            let sql = `INSERT INTO tbl_produtora(nome, biografia, data_fundacao, data_fechamento, is_ativo, logo)
                    VALUES('${produtora.nome}',
                     '${produtora.biografia}',
                     '${produtora.data_fundacao}',
                     '${produtora.data_fechamento}', 
                      ${produtora.is_ativo}, 
                     '${produtora.logo}')`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false   
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const setUpdateProducers = async function(produtora) {
    try {
        if (produtora.data_fechamento == null) {
            let sql = `UPDATE tbl_produtora
                        SET
                            nome = '${produtora.nome}',
                            biografia = '${produtora.biografia}',
                            data_fundacao = '${produtora.data_fundacao}',
                            data_fechamento = ${produtora.data_fechamento}, 
                            is_ativo = ${produtora.is_ativo}, 
                            logo = '${produtora.logo}'
                        WHERE 
                            id_produtora = ${produtora.id};`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
        } else {
            let sql = `UPDATE tbl_produtora
                        SET
                            nome = '${produtora.nome}',
                            biografia = '${produtora.biografia}',
                            data_fundacao = '${produtora.data_fundacao}',
                            data_fechamento = '${produtora.data_fechamento}', 
                            is_ativo = ${produtora.is_ativo}, 
                            logo = '${produtora.logo}'
                        WHERE 
                            id_produtora = ${produtora.id};`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false   
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const setDeleteProducers = async function(id) {
    try {
        let sql =   `DELETE FROM tbl_produtora WHERE id_produtora = ${id}`

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

const getSelectLastIdProducer = async function () {
    try {
        let sql = 'select id_produtora from tbl_produtora order by id_produtora desc limit 1'
    
        //Executa no Banco de Dados o script sql
        let result = await prisma.$queryRawUnsafe(sql)
    
        //Validação para identificar para saber se o retorno do BD é um ARRAY (vazio ou com dados) 
        if(Array.isArray(result))
            return Number(result[0].id_produtora)
        else
            return false
        
    } catch (error) {
        console.log(error)
        return false     
    }
}

module.exports = {
    getSelectAllProducers,
    getSelectByIdProducers,
    getSelectLastIdProducer,
    setDeleteProducers,
    setInsertProducers,
    setUpdateProducers
}