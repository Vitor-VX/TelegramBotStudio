const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors({ origin: 'http://localhost:8000' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const {
} = require('../utils/utilsFunctions.js');
const { ClientModel, createCommandsClient, Bot_Ative } = require('../connectDataBase/UserModel.js');
const PORT = 5000;

app.get('/api/v1/getTokensBot', async (req, res) => {
    try {
        const findTokensBotClient = (await ClientModel.find()).map(el => {
            return { token: el.Token_Bot, email: el.email_Client }
        })
        res.status(200).json({ success: true, configs: findTokensBotClient })
    } catch (err) {
        res.status(500).json({ success: false, message: `Erro ao enviar os tokens.` })
    }
})

app.post('/api/v1/verificBotAtivo', async (req, res) => {
    const { email } = req.body

    try {
        const findActivateEmail = await Bot_Ative.findOne({ client_Id: email })
        if (!findActivateEmail) throw new Error

        res.status(200).json({ cliente: findActivateEmail.client_Id, status: findActivateEmail.Bot_Activate })
    } catch (error) {
        res.status(401).json({ success: false, message: `ClientId não encontrado.` })
    }
})

app.get('/api/v1/getCommadsBot/:client_Id', async (req, res) => {
    try {
        const client_Id = req.params.client_Id;
        console.log(client_Id);
        const Commads = (await createCommandsClient(client_Id).find()).map(el => {
            return { Comando: el.comando, Resposta: el.resposta }
        })
        res.status(200).json({ success: true, Commads })
    } catch (error) {
        res.status(500).json({ success: false, messge: `Erro ao tentar receber os comandos para o bot.` })
    }
});

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));