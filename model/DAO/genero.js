/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de genero no Banco de Dados MySQL.
 * Data: 22/10/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')
// const { PrismaClient } = require('@prisma/client')

//Cria um objeto do prisma client para manipular os scripts SQL 
const prisma = new PrismaClient()

// Retornar todos os generos de filmes 
const getSelectAllGenres = async function () {
    try {
        let sql = 'select * from tbl_genero order by id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectGenreById = async function (id) {
    try {
        let sql = `select * from tbl_genero where id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setInsertGenres = async function (genero) {
    try {
        let sql = `INSERT INTO tbl_genero(nome)
                    VALUES('${genero.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setUpdateGenres = async function (genero) {
    try {
        let sql = `UPDATE tbl_genero set nome = '${genero.nome}'
                    WHERE id = ${genero.id}`

        let result = await prisma.$executeRawUnsafe(sql)
            
        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteGenero = async function (id) {
    try {
        let sql =   `DELETE FROM tbl_genero WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdGenero = async function () {
    try {
        let sql = 'select id from tbl_genero order by id desc limit 1'

        //Executa no Banco de Dados o script sql
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar para saber se o retorno do BD é um ARRAY (vazio ou com dados) 
        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllGenres,
    getSelectGenreById,
    getSelectLastIdGenero,
    setInsertGenres,
    setUpdateGenres,
    setDeleteGenero
}