/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de ator no Banco de Dados MySQL.
 * Data: 29/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/

const {PrismaClient} = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllDirectors = async function () {
try {
    let sql = 'select * from tbl_diretor order by id desc'

    let result = await prisma.$queryRawUnsafe(sql)

    if(Array.isArray(result))
        return result
    else
        return false
    
} catch (error) {
    return false     
}
}

module.exports = {
    getSelectAllDirectors
}