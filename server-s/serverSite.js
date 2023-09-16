const express = require('express');
const app = express();
const PORT = 8000;
const path = require('path');
const bodyParser = require('body-parser');

const {
    VerificTokenClient,
    GerarChavesApi,
    DeleteTokenValidate,
    getInfoClients,
    AddTokenAccess,
    VerificIndentifiy,
    ClientFindOne,
    verificarToken
} = require('../utils/utilsFunctions');
const { ClientModel, createFAQClients, createCommandsClient, Bot_Ative } = require('../connectDataBase/UserModel');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

app.post('/login.html', async (req, res) => {
    const { username, password } = req.body;
    const token = GerarChavesApi(username, password);

    try {
        const result = await getInfoClients(ClientModel);
        const foundClient = result.find(
            (el) => el.email_Client === username && el.senha === password
        );

        if (!foundClient) {
            return res.status(401).json({ errorMsg: `Email ou senha inválidos.` });
        }

        await AddTokenAccess(
            ClientModel,
            username,
            password,
            token,
            token
        );

        const urlWithToken = `/dashboard.html?authorization=${token}`;
        res.status(200).json({ urlAcess: urlWithToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMsg: 'Erro interno do servidor.' });
    }
});

app.get('/dashboard.html', verificarToken, (req, res) => {
    const verificUrl = req.url
    if (verificUrl === '/dashboard.html') {
        res.redirect('/login.html')
    } else {
        res.sendFile(path.join(__dirname, '../public/html/dashboard.html'));
    }
});

app.post(`/configPerfil.html`, verificarToken, async (req, res) => {
    const { v } = req.body
    const newToken = GerarChavesApi()
    try {
        await ClientFindOne(ClientModel, v)

        await ClientModel.updateOne(
            { Indentifiy: v },
            { $set: { token_Access: newToken, Indentifiy: newToken } }
        )

        res.status(200).json({ success: true, url: `/configPerfil.html?authorization=${newToken}` })
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMsg: 'Erro interno do servidor.', url: `/login.html` });
    }
})

app.get('/configPerfil.html', (req, res) => {
    const verificUrl = req.url
    if (verificUrl === '/configPerfil.html') {
        res.redirect('/login.html')
    } else {
        res.sendFile(path.join(__dirname, '../public/html/configPerfil.html'))
    }
})

app.post(`/api/v1/tokenBot`, async (req, res) => {
    try {
        const { v, bot } = req.body;
        const response = await VerificIndentifiy(ClientModel, v, bot)
        if (response.success && bot !== '' && bot !== undefined) {
            res.status(200).json({ success: true })
        } else {
            res.status(401).json({ success: false, message: `Campo vazio.` })
        }

    } catch (error) {
        res.status(500).json({ success: false })
    }
});

app.post(`/api/v1/accessToken`, async (req, res) => {
    try {
        const { v } = req.body;
        const response = await VerificIndentifiy(ClientModel, v, null, true)
        if (response.success) {
            res.status(200).json({ success: true })
        } else {
            res.status(401).json({ success: false })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false })
    }
});

app.post(`/api/v1/verificTokenSucess`, async (req, res) => {
    const { token } = req.body;

    try {
        const verificToken = await VerificTokenClient(ClientModel, token);
        if (verificToken) {
            res.status(200).json({ success: true });
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(401).json({ success: false });
    }
});

app.delete(`/api/v1/deleteTokenSuccess`, (req, res) => {
    const { token } = req.body;
    try {
        const deleteToken = async () => {
            const result = await DeleteTokenValidate(ClientModel, token);
            if (result) {
                res.status(200).json({ message: token });
            }
        };
        deleteToken();
    } catch (error) {
        res.status(501).json({ message: `error redirect` });
    }
});

app.get('/api/v1/seguration', (req, res) => {
    try {
        return setTimeout(() => {
            res.status(200).json({ message: '/login.html' });
        }, 3600000);
    } catch (error) {
        res.status(500);
    }
});

app.post('/api/v1/getCliente', verificarToken, async (req, res) => {
    try {
        const { v } = req.body
        const response = await ClientFindOne(ClientModel, v)

        res.status(200).json({ cliente: response.email_Client, senhaCliente: response.senha })
    } catch (error) {
        res.status(500).json({ error: `Erro ao fazer uma requisição ao servidor.` })
    }
})

app.patch('/api/v1/updateInfoUser', async (req, res) => {
    const { v, newUserEmail, newUserSenha } = req.body
    try {
        const verificInfosUserValidate = await ClientModel.findOne({ Indentifiy: v })

        const updateFull = async () => {
            await ClientModel.updateOne(
                { Indentifiy: verificInfosUserValidate.Indentifiy },
                { $set: { email_Client: newUserEmail, senha: newUserSenha } }
            )
            const email = verificInfosUserValidate.email_Client

            const findCommands = createCommandsClient(email).findOne({ client_Id: email })
            const findFAQ = createFAQClients(email).findOne({client_Id: email})

            console.log(findCommands);
            console.log(findFAQ);

            await createCommandsClient(email).updateOne({
                client_Id: findCommands.cliente_Id
            })

            await createFAQClients(email).updateOne({
                client_Id: findFAQ.client_Id
            })
        }

        updateFull().then(() => {
            console.log(`Infos alteradas.`)
        })

        res.status(200).json({ success: true, message: `Informações alteradas com sucesso.` })
    } catch (error) {
        res.status(500).json({ success: false, message: `Erro ao tentar alterar as informações. Tente novamente` })
    }
})

app.post('/api/v1/addCommands', async (req, res) => {
    const { v } = req.body
    try {
        const { comandoAdd, conteudoAdd } = req.body
        let comando = comandoAdd.trim(), conteudo = conteudoAdd.trim()

        if (comando && conteudo !== undefined && comando !== '' && conteudo !== '') {
            const FindClient = await ClientFindOne(ClientModel, v)
            const client = FindClient.email_Client

            const verificCommadsClient = await createCommandsClient(client).findOne({ comando: comando })
            if (verificCommadsClient) {
                return await createCommandsClient(client).updateOne(
                    { comando: verificCommadsClient.comando },
                    { $set: { comando: comando, resposta: conteudo } }
                )
                    .then(() => {
                        res.status(200).json({ success: true, message: `Comando atualizado!` })
                    })
            }

            await createCommandsClient(client).create({
                client_Id: client,
                comando: comando,
                resposta: conteudo
            })
                .then(() => {
                    res.status(200).json({ success: true, message: `Comandos enviados.` })
                })
        } else {
            res.status(200).json({ success: false, message: `Comandos inválidos.` })
        }
    } catch (error) {
        res.status(401).json({ success: false, message: `Error ao tentar enviar os comandos, possível erro no servidor.` })
    }
})

app.post('/api/v1/addFaqClients', async (req, res) => {
    try {
        const { v, perguntaAdd, respostaAdd } = req.body
        let pergunta = perguntaAdd.trim(), resposta = respostaAdd.trim()

        if (pergunta && resposta !== undefined && pergunta !== '' && resposta !== '') {
            const FindClient = await ClientFindOne(ClientModel, v)
            const client = FindClient.email_Client

            const verificFaqClient = await createFAQClients(client).findOne({ question: pergunta })
            if (verificFaqClient) {
                return await createFAQClients(client).updateOne(
                    { question: verificFaqClient.question },
                    { $set: { question: pergunta, response: resposta } }
                )
                    .then(() => {
                        res.status(200).json({ success: true, message: `Perguntas frequentes atualizadas!` })
                    })
            }

            await createFAQClients(client).create({
                client_Id: client,
                question: pergunta,
                response: resposta
            })
                .then(() => {
                    res.status(200).json({ success: true, message: `Perguntas frequentes adicionadas.` })
                })
        } else {
            res.status(200).json({ success: false, message: `FAQ inválidos.` })
        }
    } catch (error) {
        res.status(401).json({ success: false, message: `Error ao tentar enviar os comandos, possível erro no servidor.` })
    }
})

app.post('/api/v1/GetInfoFaqSite', async (req, res) => {
    const { v } = req.body

    try {
        const FindTokenBotClient = await ClientFindOne(ClientModel, v)

        const Commads = (await createCommandsClient(FindTokenBotClient.email_Client).find()).map(el => {
            return { Comando: el.comando }
        })
        res.status(200).json({ Commads })
    } catch (error) {
        return res.status(401).json({ error: error });
    }
})

app.post('/api/v1/GetInfoCommads', async (req, res) => {
    const { v } = req.body

    try {
        const FindTokenBotClient = await ClientFindOne(ClientModel, v)

        const Commads = (await createCommandsClient(FindTokenBotClient.email_Client).find()).map(el => {
            return { Comando: el.comando }
        })
        res.status(200).json({ Commads })
    } catch (error) {
        return res.status(401).json({ error: error });
    }
})

app.delete('/api/v1/removeCommands', async (req, res) => {
    const { v, commandRemove } = req.body;

    try {
        const FindIndentify = await ClientFindOne(ClientModel, v)

        let deletedCount = 0;

        if (Array.isArray(commandRemove)) {
            const result = await createCommandsClient(FindIndentify.email_Client).deleteMany({
                comando: { $in: commandRemove }
            });
            deletedCount = result.deletedCount;
        } else {
            const result = await createCommandsClient(FindIndentify.email_Client).deleteOne({
                comando: commandRemove
            });
            deletedCount = result.deletedCount;
        }

        if (deletedCount > 0) {
            res.status(200).json({ success: true, message: `Comando(s) removido(s)!` });
        } else {
            res.status(200).json({ success: false, message: `Nenhum comando removido. Comando não encontrado.` });
        }
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
});

app.delete('/api/v1/removeFaqs', async (req, res) => {
    const { v, faqRemove } = req.body;

    try {
        const FindIndentify = await ClientFindOne(ClientModel, v)

        let deletedCount = 0;

        if (Array.isArray(faqRemove)) {
            const result = await createFAQClients(FindIndentify.email_Client).deleteMany({
                question: { $in: faqRemove }
            });
            deletedCount = result.deletedCount;
        } else {
            const result = await createFAQClients(FindIndentify.email_Client).deleteOne({
                question: faqRemove
            });
            deletedCount = result.deletedCount;
        }

        if (deletedCount > 0) {
            res.status(200).json({ success: true, message: `Pergunta(s) removida(s)!` });
        } else {
            res.status(200).json({ success: false, message: `Nenhuma pergunta removida. Pergunta não encontrada.` });
        }
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
});

app.post('/api/v1/botActivate', async (req, res) => {
    const { v, bot } = req.body;

    try {
        const findClientIdentify = await ClientFindOne(ClientModel, v)

        if (!findClientIdentify) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        const clientEmail = findClientIdentify.email_Client;
        const setBotActivate = await Bot_Ative.findOne({ client_Id: clientEmail });

        if (setBotActivate) {
            if (bot === 'Bot ativo' || bot === 'Bot desativado') {
                await Bot_Ative.updateOne(
                    { client_Id: clientEmail },
                    { $set: { Bot_Activate: bot } }
                );
                return res.status(200).json({ message: `Bot ${bot}.` });
            } else {
                return res.status(400).json({ message: 'Valor inválido para o estado do bot.' });
            }
        } else {
            await Bot_Ative.create({
                client_Id: clientEmail,
                Bot_Activate: bot
            })
            res.status(200).json({ msgRegistre: `Opção sendo registrada.` })
        }
    } catch (error) {
        console.error('Erro ao ativar/desativar o bot:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

app.post('/api/v1/verificConfigActivate', async (req, res) => {
    const { v } = req.body

    try {
        const verificConfig = await ClientFindOne(ClientModel, v)

        const clientVerific = await Bot_Ative.findOne({ client_Id: verificConfig.email_Client })
        res.status(200).json({ config: clientVerific.Bot_Activate })
    } catch (error) {
        res.status(500).json({ error: `Erro ao verificar a config.` })
    }
})

app.post('/api/v1/GetInitialFAQs', async (req, res) => {
    const { v } = req.body

    try {
        const FindFaqClient = await ClientFindOne(ClientModel, v)

        const Faqs = (await createFAQClients(FindFaqClient.email_Client).find()).map(el => {
            return { question: el.question }
        })
        res.status(200).json({ Faqs })
    } catch (error) {
        return res.status(401).json({ error: error });
    }
})

app.post(`/api/v1/GetInfoFaQBot`, async (req, res) => {
    const { token } = req.body;

    try {
        const FindClient = await ClientModel.findOne({ Token_Bot: token })

        if (!FindClient) {
            throw new Error('Cliente não encontrado');
        }

        const FindFaq = await createFAQClients(FindClient.email_Client).find()

        if (!FindFaq) {
            throw new Error('FAQ não encontrada para este cliente');
        }

        const Faqs = FindFaq.map(el => ({
            Question: el.question,
            Response: el.response,
        }));

        res.status(200).json({ Faqs });
    } catch (error) {
        res.status(500).json({ error: `Error` });
    }
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '../public/html/pageNotFound.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta: ${PORT}`);
});
