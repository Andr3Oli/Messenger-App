/**
 * import axios para fazer requests http (ligacao com back end)
 */
import axios from "axios";

/**
 * Importa um algoritmo de encriptacao que será usado para gerar tokens seguros
 */
var md5 = require("md5");

/**
 * Esta interface representa a estrutura de um user
 */
export interface IUsers {
  id: number,
  name: string,
}

/**
 * Esta interface representa a estrutura de um friend 
 */
export interface IFriends {
  fId: number,
  name: string,
}

/**
 * Esta interface representa a estrutura de um mensagem
 */
export interface IMessage {
  toId: number,
  fromId: number,
  mText: string,
}

/**
 * Regex function usada para testar formato de email
 */
const Regex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

/**
 * Funcao que atulizada informacoes de um state isto é reprenseta o state
 * @param inParentComponent objeto que guarda state
 * @returns obejto state
 */
export function createState(inParentComponent: unknown) {

  return {
    /**
     * variaveis com informacoes do state
     */
    currentView: "login",
    name: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    errName: null,
    errEmail: null,
    errPass: null,
    errPassConfirmation: null,
    listUsers: [],
    uId: null,
    fName: "Chat",
    chat: false,
    fId: null,
    token: null,
    listMessages: [],
    listFriend: [],
    message: null,
    editMsg: false,
    mId: null,
    searchTerm: "",

    /**
     * serve para atualizar a componente neste caso irá para o "RegisterView" e dára update aos dados que esta necessita  
     */
    showRegisterView: function (): void {
      this.setState({ currentView: "register", name: "", email: "", password: "", passwordConfirmation: "", errEmail: "", errPass: "", errName: "", errPassConfirmation: "" });

    }.bind(inParentComponent),

    /**
    * serve para atualizar a componente neste caso irá para o "LoginView" e dára update aos dados que esta necessita  
    */
    showLoginView: function (): void {
      this.setState({ currentView: "login", email: "", password: "", token: "", errEmail: "", errPass: "" });

    }.bind(inParentComponent),

    /**
     * serve para atualizar a componente neste caso irá para o "HomeView"
     */
    showHomeView: function (): void {
      this.setState({ currentView: "home" });

    }.bind(inParentComponent),

    /**
     * funcao recebe um evento criado pelo input que contem a passowrd e testa-a, dando update à variavel "errPass" do state
     */
    testPass: function (inEvent: any): void {
      this.setState({ password: inEvent.target.value });
      if (inEvent.target.value.length > 8)
        this.setState({ errPass: 'Password too long!' });
      else
        this.setState({ errPass: '' });
    }.bind(inParentComponent),

    /**
     * funcao recebe um evento criado pelo input que contem o email e testa-o, dando update à variavel "errEmail" do state
     */
    testEmail: function (inEvent: any): void {
      this.setState({ email: inEvent.target.value });
      // console.log(inEvent.target.value)
      if (!Regex.test(inEvent.target.value))
        this.setState({ errEmail: 'Email is not valid!' });
      else
        this.setState({ errEmail: '' });
    }.bind(inParentComponent),

    /**
     * funcao recebe um evento criado pelo input que contem o name e testa-o, dando update à variavel "errName" do state
     */
    testName: function (inEvent: any): void {
      this.setState({ name: inEvent.target.value });
      // console.log(inEvent.target.value)
      if (!(inEvent.target.value.length > 1))
        this.setState({ errName: 'Name too short!' });
      else
        this.setState({ errName: '' });
    }.bind(inParentComponent),

    /**
     * funcao recebe um evento criado pelo input que contem a passowrd de confirmacao e testa-a, dando update à variavel "errPassConfirmation" do state
     */
    testPassConfirmation: function (inEvent: any): void {
      this.setState({ passwordConfirmation: inEvent.target.value });
      // console.log(this.state)
      if (this.state.password === inEvent.target.value)
        this.setState({ errPassConfirmation: '' });
      else
        this.setState({ errPassConfirmation: 'Password are not equal' });
    }.bind(inParentComponent),

    /**
     * funcao "submit" (login e register) recebe um evento, verifica variaveis "err" 
     * envia para axios dados necessarios para funcoes de back end e espera uma resposta depois atualizara variaveis do state
     */
    handleSubmit: function (event: any): void {
      event.preventDefault();
      // console.log(event)
      let validity = false;
      if (this.state.currentView === "login")
        if (this.state.errEmail === "" && this.state.errPass === "")
          validity = true;
      if (this.state.currentView === "register")
        if (this.state.errEmail === "" && this.state.errPass === "" && this.state.errName === "" && this.state.errPassConfirmation === "")
          validity = true;

      if (this.state.currentView === "login") {
        if (validity === true) {
          let t = md5(this.state.password + Date.now())
          const options = {
            url: 'http://localhost:3000/api/login',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': t
            },
            data: {
              email: this.state.email,
              password: md5(this.state.password),
            }
          };
          axios(options).then(async response => {
            if (response.status === 200) {
              this.setState({ currentView: "home", uId: response.data.id, name: response.data.name, token: t, fName: "Chat", listMessages: [], chat: false });
              await this.state.listFriends()
            }
          });
        }
      }

      if (this.state.currentView === "register") {
        if (validity === true) {
          const options = {
            url: 'http://localhost:3000/api/register',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
              name: this.state.name,
              email: this.state.email,
              password: md5(this.state.password),
            }
          };
          axios(options).then(response => {
            if (response.status === 201)
              this.setState({ currentView: "login" });
            if (response.status === 400) //errado
              this.setState({ errEmail: "Email exist" });
          });
        }
      }
    }.bind(inParentComponent),

    /**
     * Envia um pedido para o backEnd que vai adicionar um amigo da lista de amigos de um utilizador,
     * envia o token do user, o id do amigo a ser adicionar e o nome do amigo a ser adicionado,
     * de seguida atualiza o chat, atualiza a lista de amigos e a lista de utilizadores
     */
    addFriends: async function (inEvent: any): Promise<void> {
      var user: IUsers = JSON.parse(inEvent.target.value)
      const options = {
        url: 'http://localhost:3000/api/addFriend',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        },
        data: {
          fId: user.id,
          fName: user.name,
        }
      };
      await axios(options);
      await this.state.listFriends()
      await this.state.searchUsers()
    }.bind(inParentComponent),

    /**
     * Envia um pedido para o backEnd que vai remover um amigo da lista de amigos de um utilizador,
     * envia o token do user, o id do amigo a ser removido e o nome do amigo a ser removido,
     * de seguida atualiza o chat, atualiza a lista de amigos e a lista de utilizadores
     */
    removeFriends: async function (inEvent: any): Promise<void> {
      var friend: IFriends = JSON.parse(inEvent.target.value)
      const options = {
        url: 'http://localhost:3000/api/removeFriend',
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        },
        data: {

          fId: friend.fId,
          fName: friend.name
        }
      };
      await axios(options);
      await this.setState({ listMessages: [], fName: "Chat", fId: null, chat: false })
      await this.state.listFriends()
      await this.state.searchUsers()
    }.bind(inParentComponent),

    /**
     * funcao que atuliza variavel "searchTerm" e lista de users (espera termino de cada processo, um de cada vez por ordem)
     */
    updateSearchTerm: async function (inEvent: any): Promise<void> {
      await this.setState({ searchTerm: inEvent.target.value })
      await this.state.searchUsers()
    }.bind(inParentComponent),

    /**
     * Envia um pedido ao back end com o token do utilizador e uma string que representa a procura de users, retorna
     * todos os users cujos nomes comecem pelo string enviado
     */
    searchUsers: async function (): Promise<void> {
      const options = {
        url: 'http://localhost:3000/api/users',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        },
        data: {
          name: this.state.searchTerm
        }
      };
      axios<IUsers[]>(options).then(response => {
        let users = [...response.data]
        this.setState({ listUsers: users })
      });

    }.bind(inParentComponent),

    /**
     * Cria um request que envia o token do utilizador e recebe de volta uma lista de todos os amigos de um user
     */
    listFriends: async function () {
      const options = {
        url: 'http://localhost:3000/api/friends',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        }
      };
      axios<IFriends[]>(options).then(response => {
        let users = [...response.data]
        this.setState({ listFriend: users })
      });
    }.bind(inParentComponent),

    /**
     * Cria um quest que envia o token do utilizador, o id do amigo que vai receber a mensagem e o texto da mensagem, de seguida
     * atualiza as mensagens entre os dois utilizadores
     */
    createMessage: async function (inEvent: any): Promise<void> {
      // var msg: IMessage = JSON.parse(inEvent.target.value)
      const options = {
        url: 'http://localhost:3000/api/sendMessage',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        },
        data: {
          toId: this.state.fId,
          mText: this.state.message
        }
      };
      await axios(options);
      await this.state.getMessages(this.state.uId, this.state.fId)
      this.setState({ message: "" })
    }.bind(inParentComponent),

    /**
     * funcao que atualiza variavel "message" do state
     */
    setMessage: async function (inEvent: any): Promise<void> {
      // var msg: IMessage = JSON.parse(inEvent.target.value)
      // console.log(this.state.fId, this.state.uId, inEvent.target.value)
      this.setState({ message: inEvent.target.value })
    }.bind(inParentComponent),

    /**
     * funcao que atualiza variaveis de um amigo e lista de mensagens com esse amigo, abre chat com esse amigo (espera termino de cada processo, um de cada vez por ordem)
     */
    openChat: async function (fName: string, fId: number): Promise<void> {
      await this.setState({ fName: fName, fId: fId, message: "", chat: true })
      await this.state.getMessages()
    }.bind(inParentComponent),

    /**
     * Cria um request que envia o token do user e o id do amigo, recebe de volta uma lista de todas
     * as mensagens entre o utilizador e o amigo,
     * insere esta lista na variavel listMessages para que possam ser atualizados
     */
    getMessages: async function (): Promise<void> {
      const options = {
        url: 'http://localhost:3000/api/listMessage',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        },
        data: {
          toId: this.state.fId
        }
      }

      axios<IMessage[]>(options).then(response => {
        let messages = [...response.data]
        this.setState({ listMessages: messages })
      });

    }.bind(inParentComponent),

    /**
     * funcao atuliza dados de uma mensagem para esta poder ser editada, modo edicao
     */
    editMessage: async function (mId: number, message: string): Promise<void> {
      await this.setState({ editMsg: true, mId: mId, message: message })
      // console.log(this.state.mId, this.state.editMsg, this.state.message)
    }.bind(inParentComponent),

    /**
     * Cria o request para dar update de uma mensagem, envia o token do user, a mensagem e o id da mensagem,
     * de seguida atualiza as mensagens para que a nova mensagem apareça e atualiza os campos que guardam informaçao
     * sobre a mensagem a ser enviada para que uma nova mensagem possa ser escrita
     */
    updateMessage: async function (): Promise<void> {
      const options = {
        url: 'http://localhost:3000/api/editMessage',
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': this.state.token
        },
        data: {
          mText: this.state.message,
          mId: this.state.mId,
        }
      };
      await axios(options);
      await this.state.getMessages()
      await this.setState({ editMsg: false, mId: "", message: "" })
    }.bind(inParentComponent),

  };
};
