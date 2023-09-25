"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//importa a dependencia express
const express_1 = __importDefault(require("express"));
//importa o documento onde estão os serviços que acessam á base de dados 
const database = __importStar(require("./database"));
//adiciona o express na app
const app = (0, express_1.default)();
//importa o cors na app
var cors = require('cors');
//adiciona o cors na app
app.use(cors());
//faz com que o express receba o body dos requests como json por default
app.use(express_1.default.json());
//aqui adicionamos algumas configurações ao header dos requests que o app vai receber
app.use(function (inRequest, inResponse, inNext) {
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
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        yield userDB.addUser(req.body);
        res.status(201).send("ok");
    }
    catch (_a) {
        res.status(400).send("Invalid inputs");
    }
}));
/*
Endpoint para dar login a um utilizador, recebe nos headers o token de auth enviada
no request e guarda-o, chama a função loginUser e envia de volta uma resposta 200 "Ok"
com o userId no body
*/
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        const userId = yield userDB.loginUser(req.body, token);
        res.status(200).json(userId);
    }
    catch (_b) {
        res.status(400).send("Information is Wrong");
    }
}));
/*
Endpoint para listar todos os utilizadores, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função listUsers que vai retornar uma lista
de todos os users que não são o proprio user nem amigos do proprio user, retorna esta informação como resposta ao sender
*/
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        const users = yield userDB.listUsers(req.body, allowedId);
        res.status(200).json(users);
    }
    catch (_c) {
        res.status(400).send("Invalid authorization");
    }
}));
/*
Endpoint para adicionar um amigo, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função addFriend para adicionar o
amigo á lista de amigos do utilizador que fez o request, envia de volta como resposta código 200 "OK"
*/
app.post('/api/addFriend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        yield userDB.addFriend(req.body, allowedId);
        res.status(200).send("Friend added");
    }
    catch (_d) {
        res.status(400).send("Auth Error");
    }
}));
/*
Endpoint para remover um amigo, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função removeFriend para remover o
amigo á lista de amigos do utilizador que fez o request, envia de volta como resposta código 200 "OK"
*/
app.delete('/api/removeFriend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        yield userDB.removeFriend(req.body, allowedId);
        res.status(200).send("Friend removed");
    }
    catch (_e) {
        res.status(400).send("No such User");
    }
}));
/*
Endpoint para listart todos os amigos de um user, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função listFriends para obter a lista de todos
os amigos do user que fez o request
*/
app.get('/api/friends', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        const friends = yield userDB.listFriends(allowedId);
        res.status(200).json(friends);
    }
    catch (_f) {
        res.status(400).send("Auth Failed");
    }
}));
/*
Endpoint para enviar uma mensagem, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função addMessage que adiciona a mensagem enviada á
lista de mensagens entre os dois users
*/
app.post('/api/sendMessage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        yield userDB.addMessage(req.body, allowedId);
        res.status(200).send("Message Sent");
    }
    catch (_g) {
        res.status(400).send("Message Failed");
    }
}));
/*
Endpoint para listar todas as mensagens entre dois utilizadores, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função listMessages para obter a lista de todas as mensagens
entre o utilizador e o amigo
*/
app.post('/api/listMessage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        const messages = yield userDB.listMessages(req.body, allowedId);
        res.status(200).json(messages);
    }
    catch (_h) {
        res.status(400).send("Sum message");
    }
}));
/*
Endpoint para editar uma mensagem enviada pelo utilizador a um amigo, corre primeiro a função auth para descobrir qual é o utilizador que
esta a fazer o request e se este tem uma sessão ativa, de seguida chama a função update Message que altera a mensagem se esta tiver
sido enviada pelo utilizador que fez o request
*/
app.put('/api/editMessage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDB = new database.User();
        const token = req.headers.authorization;
        let allowedId = yield userDB.authUser(token);
        yield userDB.updateMessage(req.body, allowedId);
        res.status(200).send("Message updated");
    }
    catch (_j) {
        res.status(400).send("Auth Failed");
    }
}));
//selecionar a port na qual o programa vai ser exposto
const port = process.env.PORT || 3000;
//expor a app na porta 3000
app.listen(port);
console.log(`port is: 3000`);
