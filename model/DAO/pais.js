/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de{pais no Banco de Dados MySQL.
 * Data: 04/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const {PrismaClient} = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllCountries = async function () {
try {
    let sql = 'select * from tbl_pais order by id desc'

    let result = await prisma.$queryRawUnsafe(sql)

    if(Array.isArray(result))
        return result
    else
        return false
    
} catch (error) {
    return false     
}
}

const getSelectByIdCountries = async function(id) {
    try {

        //Script sql
        let sql = `select * from tbl_pais where id=${id}`
    
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

const setInsertCountries = async function(pais) {
    try {
            let sql = `INSERT INTO tbl_pais(nome)
                    VALUES('${pais.nome}')`

       
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setUpdateCountries = async function(pais) {
    try {
        let sql = `UPDATE tbl_pais set nome = '${pais.nome}'
                    WHERE id = ${pais.id}`

   
    let result = await prisma.$executeRawUnsafe(sql)

    if(result)
        return true
    else
        return false

} catch (error) {
    console.log(error)
    return false
}
}

const setDeleteCountries = async function(id) {
    try {
        let sql =   `DELETE FROM tbl_pais WHERE id = ${id}`

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

const getSelectLastIdCountry = async function () {
    try {
        let sql = 'select id from tbl_pais order by id desc limit 1'
    
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
    getSelectAllCountries,
    getSelectByIdCountries,
    getSelectLastIdCountry,
    setDeleteCountries,
    setInsertCountries,
    setUpdateCountries
}