//importa a dependencia express
import express, { Express, NextFunction, Request, Response } from "express";
//importa o documento onde estão os serviços que acessam á base de dados 
import * as database from "./database";

//adiciona o express na app
const app = express()
//importa o cors na app
var cors = require('cors');

//adiciona o cors na app
app.use(cors());

//faz com que o express receba o body dos requests como json por default
app.use(express.json())

//aqui adicionamos algumas configurações ao header dos requests que o app vai receber
app.use(function (
    inRequest: Request,
    inResponse: Response,
    inNext: NextFunction
) {
    inResponse.header("Access-Control-Allow-Origin", "*"); //Permitir pedidos de qualquer origem
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS"); //Permitir apenas os métodos especificados
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept"); // permitir apenas os Headers especificados
    inNext();
});

/* 
Endpoint para registar um novo utilizador, inicializa a class que contem os serviços da nossa base de dados e
chama a função addUser, se esta correr sem problemas o utilizador foi registado e o express envia de volta uma 
resposta com código 201 ("Created"), caso haja algum erro, o express envia de volta uma resposta com código 400
*/
app.post('/api/register', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        await userDB.addUser(req.body)
        res.status(201).send("ok");
    }
    catch {
        res.status(400).send("Invalid inputs");
    }
})

/* 
Endpoint para dar login a um utilizador, recebe nos headers o token de auth enviada
no request e guarda-o, chama a função loginUser e envia de volta uma resposta 200 "Ok" 
com o userId no body
*/
app.post('/api/login', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        const userId = await userDB.loginUser(req.body, token)
        res.status(200).json(userId);
    }
    catch {
        res.status(400).send("Information is Wrong");
    }
})

/* 
Endpoint para listar todos os utilizadores, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função listUsers que vai retornar uma lista
de todos os users que não são o proprio user nem amigos do proprio user, retorna esta informação como resposta ao sender
*/
app.post('/api/users', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        const users = await userDB.listUsers(req.body, allowedId)
        res.status(200).json(users);
    }
    catch {
        res.status(400).send("Invalid authorization")
    }
})

/* 
Endpoint para adicionar um amigo, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função addFriend para adicionar o 
amigo á lista de amigos do utilizador que fez o request, envia de volta como resposta código 200 "OK"
*/
app.post('/api/addFriend', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        await userDB.addFriend(req.body, allowedId)
        res.status(200).send("Friend added")

    }
    catch {
        res.status(400).send("Auth Error")
    }
})

/* 
Endpoint para remover um amigo, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função removeFriend para remover o 
amigo á lista de amigos do utilizador que fez o request, envia de volta como resposta código 200 "OK"
*/
app.delete('/api/removeFriend', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        await userDB.removeFriend(req.body, allowedId)
        res.status(200).send("Friend removed")
    }
    catch {
        res.status(400).send("No such User")
    }
})

/* 
Endpoint para listart todos os amigos de um user, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função listFriends para obter a lista de todos
os amigos do user que fez o request
*/
app.get('/api/friends', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        const friends = await userDB.listFriends(allowedId)
        res.status(200).json(friends);
    }
    catch {
        res.status(400).send("Auth Failed")
    }
})

/* 
Endpoint para enviar uma mensagem, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função addMessage que adiciona a mensagem enviada á
lista de mensagens entre os dois users
*/
app.post('/api/sendMessage', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        await userDB.addMessage(req.body, allowedId)
        res.status(200).send("Message Sent");
    }
    catch {
        res.status(400).send("Message Failed")
    }
})

/* 
Endpoint para listar todas as mensagens entre dois utilizadores, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função listMessages para obter a lista de todas as mensagens
entre o utilizador e o amigo
*/
app.post('/api/listMessage', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        const messages = await userDB.listMessages(req.body, allowedId)
        res.status(200).json(messages);
    }
    catch {
        res.status(400).send("Sum message")
    }
})

/* 
Endpoint para editar uma mensagem enviada pelo utilizador a um amigo, corre primeiro a função auth para descobrir qual é o utilizador que 
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função update Message que altera a mensagem se esta tiver
sido enviada pelo utilizador que fez o request
*/
app.put('/api/editMessage', async (req, res) => {
    try {
        const userDB: database.User = new database.User()
        const token = req.headers.authorization;
        let allowedId = await userDB.authUser(token)
        await userDB.updateMessage(req.body, allowedId)
        res.status(200).send("Message updated");
    }
    catch {
        res.status(400).send("Auth Failed")
    }
})

//selecionar a port na qual o programa vai ser exposto
const port = process.env.PORT || 3000

//expor a app na porta 3000
app.listen(port)
console.log(`port is: 3000`) 
