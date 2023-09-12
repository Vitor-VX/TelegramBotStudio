const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const botInstances = {};
const chatListeners = new Map();

const checkForNewTokens = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8000/api/v1/getTokensBot"
        );
        const configs = response.data.configs;

        for (const config of configs) {
            let token = config.token;

            verificStatusBot(config.email, token);
        }
    } catch (error) {
        console.error("Erro ao verificar novos tokens:", error);
    }
};

const verificStatusBot = async (clientId, Token) => {
    try {
        const result = await axios.post(`http://localhost:9000/api/v1/verificBotAtivo`, {
            email: clientId
        });

        const status = result.data.status;

        if (status === 'Bot ativo') {
            if (!botInstances[Token]) {
                createBotInstance(Token);
            }
        } else {
            if (botInstances[Token]) {
                stopListening(Token);
            }
        }
    } catch (error) {
        console.error('Erro ao verificar o status do bot:', error);
    }
}

const CommandsResponse = async (Token) => {
    const getClient = await axios.get(
        `http://localhost:9000/api/v1/getTokensBot`
    );
    const emails = getClient.data.configs;
    const clientToken = emails.find((el) => el.token === Token);

    return await axios.get(
        `http://localhost:9000/api/v1/getCommadsBot/${clientToken.email}`
    );
};

const createBotInstance = async (token) => {
    if (!botInstances[token]) {
        let bot = new TelegramBot(token, { polling: true });
        botInstances[token] = bot;

        bot.on("message", async (msg) => {
            const chatId = msg.chat.id;
            const response = await CommandsResponse(token);
            const comandos = response.data.Commads;
            const matchingCommand = comandos.find((el) => el.Comando === msg.text);

            if (matchingCommand) {
                bot.sendMessage(chatId, matchingCommand.Resposta);
            }
        });

        bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            let textFAQ = "";

            const responseDate = async () => {
                const data = await axios.post(
                    `http://localhost:8000/api/v1/GetInfoFaQBot`,
                    {
                        token: token,
                    }
                );
                return data.data;
            };

            const respostas = async () => {
                const response = await responseDate();
                const mapRespostas = new Map();

                response.Faqs.forEach((el, index) => {
                    const numQuestion = index + 1;
                    textFAQ += `${numQuestion}: ${el.Question}\n`;
                    mapRespostas.set(numQuestion, el.Response);
                });

                return mapRespostas;
            };

            respostas().then((mapRespostas) => {
                const faqText = `🤖 Bem-vindo ao nosso Bot de Suporte! Aqui estão algumas perguntas frequentes:\n${textFAQ}`;
                bot.sendMessage(chatId, faqText);

                chatListeners.set(chatId, (msg) => {
                    const opt = parseInt(msg.text);
                    
                    if (mapRespostas.get(opt)) {
                        bot.sendMessage(chatId, `${mapRespostas.get(opt)}`);
                    }
                });
            });
        });

        console.log(`Instância do bot com token ${token} criada.`);
    }
};

const stopListening = (token) => {
    const bot = botInstances[token];
    if (bot) {
        bot.stopPolling();
        delete botInstances[token];
    }
};

setInterval(() => {
    checkForNewTokens();
}, 2000);
