//Importar sqlite
const sqlite3 = require('sqlite3')

//Criar uma nova base de dados se esta não existir, no path introduzido como argumento
let db = new sqlite3.Database('./src/db/messaging.db')

/* 
Interface usada para receber o body do request em formato
json e serializar para um objeto IUSers
*/
export interface IUsers {
    id?: number, name: string, email: string, password: string
}

/* 
Interface usada para receber o body do request em formato
json e serializar para um objeto IUserFriends
*/
export interface IUserFriends {
    name: string, token: string, uId: number, fId: number, fName: string
}

/* 
Interface usada para receber o body do request em formato
json e serializar para um objeto IMessages
*/
export interface IMessages {
    mId: number, toId: number, fromId: number, mText: string
}

export class User {

    /* 
    Função utilizada para autenticar um utilizador, recebe um token, dado por um utilizador
    e envia de volta o id deste utilizador
    */
    public authUser(token: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM users Where token = "${token}";`
            db.get(sql, function (err: any, row: any) {
                if (err || row == undefined) {
                    reject()
                }
                resolve(row.id)
            })
        })
    }

    /* 
    Função utilizada para registar um novo utilizador, recebe o nome, o email
    e a password encriptada de um utilizador e guarda-os na tabela Users
    */
    public addUser(inUser: IUsers): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Users (name, email, password) VALUES ("${inUser.name}","${inUser.email}","${inUser.password}");`
            db.run(sql, function (err: any) {
                if (err) {
                    reject()
                } else resolve()
            })
        })
    }

    /* 
    Função utilizada para fazer login de um utilizador, inicialmente recebe um email
    e uma password encriptada do utilizador e verifica a sua existência na base de dados, se esta existir
    recebe o novo token enviado pelo utilizador e guarda-o na tabela Users, iniciando assim a sessão deste
    utilizador
    */
    public loginUser(inUser: IUsers, token: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, name FROM Users WHERE email = "${inUser.email}" AND Password = "${inUser.password}" LIMIT 0, 1;`
            db.get(sql, function (err: any, row: any) {
                if (err || row == undefined) {
                    reject()
                }
                const sql = `UPDATE Users SET token = "${token}" WHERE email = "${inUser.email}" AND Password = "${inUser.password}";`
                db.run(sql, function (err: any) {
                    if (err) {
                        reject()
                    }
                    resolve(row)
                })
            })
        })
    }

    /* 
    Função utilizada para listar os utilizadores, recebe uma string que corresponde ao nome
    completo ou incompleto dos utilizadores e o id do utilizador que fez o request, de seguida
    faz uma query á base de dados para obter todos os utilizadores que comecem com a string 
    enviada, remove desta lista todos os amigos deste utilizador da tabela Friends e remove
    tambem o próprio utilizador, retorna a lista de utilizadores de volta.
    */
    public listUsers(inUser: IUsers, allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `-- SQLite
            SELECT id, name From Users WHERE name LIKE '${inUser.name}%' EXCEPT SELECT fId, name From Friends WHERE uId = ${allowedId} EXCEPT SELECT id, name From Users WHERE id = ${allowedId} Limit 20;`
            db.all(sql, function (err: any, rows: any) {
                if (err) {
                    reject()
                }
                resolve(rows)
            })
        })
    }

    /* 
    Função utilizada para adicionar um utilizador á lista de amigos associada ao user que envia o request,
    recebe o id e o nome do amigo e recebe o id do utilizador, insere na tabela Friends uma entrada com a informação enviada
    */
    public addFriend(inUserFriend: IUserFriends, allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Friends (fId, uId, name) VALUES (${inUserFriend.fId}, ${allowedId}, "${inUserFriend.fName}");`
            db.run(sql, function (err: any) {
                if (err) {
                    console.log(err)
                    reject()
                }
                resolve()
            })
        })
    }

    /* 
    Função utilizada para remover um utilizador da lista de amigos do utilizador que envia o request, recebe o
    id do amigo a ser removido e o id do user que fez o request
    */
    public removeFriend(inUserFriend: IUserFriends, allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM Friends WHERE fId = ${inUserFriend.fId} AND uId = ${allowedId};`
            db.run(sql, function (err: any) {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }

    /* 
    Função utilizada para listar todos os amigos de um determinado utilizador, recebe o id 
    do utilizador que faz o request e envia de volta uma lista de ids e nomes de todos os
    amigos deste utilizador
    */
    public listFriends(allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT fId, name From Friends WHERE uId = ${allowedId};`
            db.all(sql, function (err: any, rows: any) {
                if (err || rows == undefined) {
                    reject()
                }
                resolve(rows)
            })
        })
    }

    /* 
    Função utilizada para enviar uma mensagem para um utilizador, recebe o id do amigo
    para qual a mensagem vai e o texto da mensagem, recebe o id do utilizador que fez o request,
    insere a informação na tabela Messages, completando-a com a data no momento em que a mensagem
    foi adicionada a base de dados
    */
    public addMessage(inMessage: IMessages, allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Messages (toId, fromId, mText, date) VALUES (${inMessage.toId}, ${allowedId}, "${inMessage.mText}", CURRENT_TIMESTAMP);`
            db.run(sql, function (err: any) {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }

    /* 
    Função utilizada listar todas as mensagens entre o utilizador que fez o request e um amigo, 
    recebe o id do amigo e o id do utilizador que fez o request, devolve uma lista de todas as mensagens 
    entre os dois utilizadores
    */
    public listMessages(inMessage: IMessages, allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT DISTINCT mId, toId, fromId, mText, date FROM Messages WHERE (toId = ${inMessage.toId} AND fromId = ${allowedId}) OR (toId = ${allowedId} AND fromId = ${inMessage.toId}) ORDER BY mId DESC;`
            db.all(sql, function (err: any, rows: any) {
                if (err || rows == undefined) {
                    reject()
                }
                resolve(rows)
            })
        })
    }

    /* 
    Função utilizada para alterar o texto de uma mensagem enviada pelo utilizador a um dos seus amigos,
    recebe o id da mensagem, o novo texto a inserir e o id do utilizador que fez o request
    */
    public updateMessage(inMessage: IMessages, allowedId: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE Messages SET mText = "${inMessage.mText}" WHERE mID = ${inMessage.mId} AND fromId = ${allowedId};`
            db.all(sql, function (err: any) {
                if (err) {
                    reject()
                }
                resolve()
            })
        })
    }
} 