/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de diretor no Banco de Dados MySQL.
 * Data: 12/11/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')
// const { PrismaClient } = require('@prisma/client')

//Cria um objeto do prisma client para manipular os scripts SQL 
const prisma = new PrismaClient()

// Retornar todos os diretors de filmes 
const getSelectAllFilmsDirectors = async function () {
    try {
        let sql = 'select * from tbl_filme_diretor order by id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const getSelectFilmDirectorById = async function (id) {
    try {
        let sql = `select * from tbl_filme_diretor where id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setInsertFilmsDirectors = async function (filmediretor) {
    try {
        let sql = `INSERT INTO tbl_filme_diretor (id_filme, id_diretor)
                    VALUES('${filmediretor.id_filme}', '${filmediretor.id_diretor}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const setUpdateFilmsDirectors = async function (filmediretor) {
    try {
        let sql = `UPDATE tbl_diretor set id_filme = '${filmediretor.id_filme}',
                    id_diretor = '${filmediretor.id_diretor}',
                    WHERE id = ${filmediretor.id}`

        let result = await prisma.$executeRawUnsafe(sql)
            
        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteFilmsDirectors = async function (id) {
    try {
        let sql =   `DELETE FROM tbl_filme_diretor WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastId = async function () {
    try {
        let sql = 'select id from tbl_filme_diretor order by id desc limit 1'

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

//Retorna os diretors filtrando pelo id do filme
const getSelectDirectorByIdFilm = async function (id_filme) {
    try {
        let sql = `select tbl_diretor.id, tbl_diretor.nome from tbl_filme
                    inner join tbl_filme_diretor
                        on tbl_filme.id = tbl_filme_diretor.id_filme
                    inner join tbl_diretor
                        on tbl_diretor.id = tbl_filme_diretor.id_diretor
                    where tbl_filme.id =${id_filme}`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retorna os diretors filtrando pelo id do diretor
const getSelectFilmByIdDirector = async function (id_diretor) {
    try {
        let sql = `select tbl_filme.id, tbl_filme.nome from tbl_filme
                    inner join tbl_filme_diretor
                        on tbl_filme.id = tbl_filme_diretor.id_filme
                    inner join tbl_diretor
                        on tbl_diretor.id = tbl_flme_diretor.iddiretor
                    where tbl_diretor.id =${id_diretor}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteDirectorsByIdFilm = async function (id_filme) {
    try {
        let sql =   `DELETE FROM tbl_filme_diretor WHERE id_filme = ${id_filme}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}



module.exports = {
    getSelectAllFilmsDirectors,
    getSelectFilmByIdDirector,
    getSelectFilmDirectorById,
    getSelectDirectorByIdFilm,
    getSelectLastId,
    setInsertFilmsDirectors,
    setUpdateFilmsDirectors,
    setDeleteFilmsDirectors,
    setDeleteDirectorsByIdFilm
}