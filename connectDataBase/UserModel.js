require('./configDataBase').connectBaseDate
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    email_Client: {
        type: String
    },
    senha: {
        type: String
    },
    token_Access: {
        type: String
    },
    Indentifiy: {
        type: String
    },
    Token_Bot: {
        type: String
    }
})

const FaqPrivCliets = new mongoose.Schema({
    client_Id: {
        type: String
    },
    question: {
        type: String
    },
    response: {
        type: String
    }
})

const CommadsClients = new mongoose.Schema({
    client_Id: {
        type: String
    },
    comando: {
        type: String
    },
    resposta: {
        type: String
    }
})
 
const BotActivates = new mongoose.Schema({
    client_Id: {
        type: String
    },
    Bot_Activate: {
        type: String
    }
})

const ClientModel = mongoose.connection.useDb('telegramDataBase').model('Client_Info', ClientSchema)
const Bot_Ative = mongoose.connection.useDb('telegramDataBase').model('BotActivate', BotActivates)

const createFAQClients = (client) => {
    return mongoose.connection.useDb('clientes_FAQ').model(client, FaqPrivCliets)
}
const createCommandsClient = (client) => {
    return mongoose.connection.useDb('commadsClient').model(client, CommadsClients)
}

module.exports = { ClientModel, createFAQClients, createCommandsClient, Bot_Ative }