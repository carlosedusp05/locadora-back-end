/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de{idioma no Banco de Dados MySQL.
 * Data: 04/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const {PrismaClient} = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllLanguages = async function () {
try {
    let sql = 'select * from tbl_idioma order by id desc'

    let result = await prisma.$queryRawUnsafe(sql)

    if(Array.isArray(result))
        return result
    else
        return false
    
} catch (error) {
    return false     
}
}

const getSelectByIdLanguages = async function(id) {
    try {

        //Script sql
        let sql = `select * from tbl_idioma where id=${id}`
    
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

const setInsertLanguages = async function(idioma) {
    try {
            let sql = `INSERT INTO tbl_idioma(nome)
                    VALUES('${idioma.nome}')`

       
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setUpdateLanguages = async function(idioma) {
    try {
        let sql = `INSERT INTO tbl_idioma(nome)
                VALUES('${idioma.nome}')`

   
    let result = await prisma.$executeRawUnsafe(sql)

    if(result)
        return true
    else
        return false

} catch (error) {
    return false
}
}

const setDeleteLanguages = async function(id) {
    try {
        let sql =   `DELETE FROM tbl_idioma WHERE id = ${id}`

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

const getSelectLastIdLanguage = async function () {
    try {
        let sql = 'select id from tbl_idioma order by id desc limit 1'
    
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
    getSelectAllLanguages,
    getSelectByIdLanguages,
    getSelectLastIdLanguage,
    setDeleteLanguages,
    setInsertLanguages,
    setUpdateLanguages
}