/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de filme idioma no Banco de Dados MySQL.
 * Data: 12/12/2025
 * Autor: Carlos Eduardo
 * Versão: 1.0
 **************************************************************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')
// const { PrismaClient } = require('@prisma/client')

//Cria um objeto do prisma client para manipular os scripts SQL 
const prisma = new PrismaClient()

// Retornar todos os idiomas de filmes 
const getSelectAllFilmsLanguages = async function () {
    try {
        let sql = 'select * from tbl_filme_idioma order by id desc'

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

const getSelectFilmLanguageById = async function (id) {
    try {
        let sql = `select * from tbl_filme_idioma where id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setInsertFilmsLanguages = async function (filmeidioma) {
    try {
        let sql = `INSERT INTO tbl_filme_idioma (id_filme, id_idioma)
                    VALUES('${filmeidioma.id_filme}', '${filmeidioma.id_idioma}')`

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

const setUpdateFilmsLanguages = async function (filmeidioma) {
    try {
        let sql = `UPDATE tbl_idioma set id_filme = '${filmeidioma.id_filme}',
                    id_idioma = '${filmeidioma.id_idioma}',
                    WHERE id = ${filmeidioma.id}`

        let result = await prisma.$executeRawUnsafe(sql)
            
        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteFilmsLanguages = async function (id) {
    try {
        let sql =   `DELETE FROM tbl_filme_idioma WHERE id = ${id}`

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
        let sql = 'select id from tbl_filme_idioma order by id desc limit 1'

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

//Retorna os idiomas filtrando pelo id do filme
const getSelectLanguageByIdFilm = async function (id_filme) {
    try {
        let sql = `select tbl_idioma.id, tbl_idioma.nome from tbl_filme
                    inner join tbl_filme_idioma
                        on tbl_filme.id = tbl_filme_idioma.id_filme
                    inner join tbl_idioma
                        on tbl_idioma.id = tbl_filme_idioma.id_idioma
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

//Retorna os idiomas filtrando pelo id do idioma
const getSelectFilmByIdLanguage = async function (id_idioma) {
    try {
        let sql = `select tbl_filme.id, tbl_filme.nome from tbl_filme
                    inner join tbl_filme_idioma
                        on tbl_filme.id = tbl_filme_idioma.id_filme
                    inner join tbl_idioma
                        on tbl_idioma.id = tbl_flme_idioma.ididioma
                    where tbl_idioma.id =${id_idioma}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteLanguagesByIdFilm = async function (id_filme) {
    try {
        let sql =   `DELETE FROM tbl_filme_idioma WHERE id_filme = ${id_filme}`

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
    getSelectAllFilmsLanguages,
    getSelectFilmByIdLanguage,
    getSelectFilmLanguageById,
    getSelectLanguageByIdFilm,
    getSelectLastId,
    setInsertFilmsLanguages,
    setUpdateFilmsLanguages,
    setDeleteFilmsLanguages,
    setDeleteLanguagesByIdFilm
}