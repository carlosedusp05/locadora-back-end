/*************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de{diretor no Banco de Dados MySQL.
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

const getSelectByIdDirectors = async function(id) {
    try {

        //Script sql
        let sql = `select * from tbl_diretor where id=${id}`
    
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

const setInsertDirectors = async function(diretor) {
    try {
        if (diretor.data_falecimento == null) {
            let sql = `INSERT INTO tbl_diretor(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
                    VALUES('${diretor.nome}',
                     '${diretor.biografia}',
                     '${diretor.data_nascimento}',
                      ${diretor.data_falecimento}, 
                      ${diretor.is_ativo}, 
                     '${diretor.idade}', 
                     '${diretor.foto}')`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
        } else {
            let sql = `INSERT INTO tbl_diretor(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
                    VALUES('${diretor.nome}',
                     '${diretor.biografia}',
                     '${diretor.data_nascimento}',
                     '${diretor.data_falecimento}', 
                      ${diretor.is_ativo}, 
                     '${diretor.idade}', 
                     '${diretor.foto}')`

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

const setUpdateDirectors = async function(diretor) {
    try {
        if (diretor.data_falecimento == null) {
            let sql = `UPDATE tbl_diretor
                        SET
                            nome = '${diretor.nome}',
                            biografia = '${diretor.biografia}',
                            data_nascimento = '${diretor.data_nascimento}',
                            data_falecimento = ${diretor.data_falecimento}, 
                            is_ativo = ${diretor.is_ativo}, 
                            idade = '${diretor.idade}', 
                            foto = '${diretor.foto}' 
                        WHERE 
                            id = ${diretor.id};`

        //$executeRawUnsafe() -> permite executar apenas scripts SQL que não tem retorno de dados (INSERT. UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
        } else {
            let sql = `UPDATE tbl_diretor
                        SET
                            nome = '${diretor.nome}',
                            biografia = '${diretor.biografia}',
                            data_nascimento = '${diretor.data_nascimento}',
                            data_falecimento = '${diretor.data_falecimento}', 
                            is_ativo = ${diretor.is_ativo}, 
                            idade = '${diretor.idade}', 
                            foto = '${diretor.foto}' 
                        WHERE 
                            id = ${diretor.id};`

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

const setDeleteDirectors = async function(id) {
    try {
        let sql =   `DELETE FROM tbl_diretor WHERE id = ${id}`

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

const getSelectLastIdDirector = async function () {
    try {
        let sql = 'select id from tbl_diretor order by id desc limit 1'
    
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
    getSelectAllDirectors,
    getSelectByIdDirectors,
    getSelectLastIdDirector,
    setDeleteDirectors,
    setInsertDirectors,
    setUpdateDirectors
}