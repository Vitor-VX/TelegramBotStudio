const jwt = require('jsonwebtoken');

const GerarChavesApi = (user, senha) => {
    const segredo = 'joaovictor@#$30';

    const payload = {
        user: user,
        senha: senha
    }
    const expireToken = 3 * 60
    const token = jwt.sign(payload, segredo, { expiresIn: expireToken });
    return token
}

const verificarToken = (req, res, next) => {
    const segredo = 'joaovictor@#$30';
    const token = req.body.v || req.query.authorization

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    jwt.verify(token, segredo, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensagem: 'Token inválido' });
        }

        req.usuario = decoded;
        next();
    });
};

async function AddTokenAccess(ClientModel, email, senha, token, Indentifiy) {
    try {
        const clientToUpdate = await ClientModel.findOne({ email_Client: email, senha: senha });

        if (clientToUpdate) {
            await ClientModel.updateOne(
                { email_Client: email, senha: senha },
                { $set: { token_Access: token, Indentifiy: Indentifiy } }
            );

            return { success: true, message: clientToUpdate };
        } else {
            return { success: false, message: "Cliente não encontrado." };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function VerificTokenClient(ClientModel, token) {
    try {
        const client = await ClientModel.findOne({ token_Access: token });
        return client !== null;
    } catch (error) {
        return false;
    }
}

async function VerificIndentifiy(ClientModel, Indentifiy, Token_Bot = null, update = false) {
    try {
        const client = await ClientModel.findOne({ Indentifiy: Indentifiy })
        if (!client) throw new Error

        if (update === false) {
            await ClientModel.updateOne(
                { Indentifiy: Indentifiy },
                { $set: { Token_Bot: Token_Bot } })
            return { success: true }
        } else {
            return { success: true }
        }
    } catch (error) {
        return { success: false }
    }
}

async function DeleteTokenValidate(ClientModel, tokenDelete) {
    try {
        await ClientModel.updateOne(
            { token_Access: tokenDelete },
            { $set: { token_Access: null } }
        );

        return true
    } catch (error) {
        return false;
    }
}

async function getInfoClients(ClientModel) {
    try {
        const infoClients = (await ClientModel.find()).map(el => {
            return el
        })

        return infoClients
    } catch (error) {
        return error
    }
}

async function ClientFindOne(ClientModel, Indentifiy) {
    try {
        const VerificClient = await ClientModel.findOne({ Indentifiy: Indentifiy })
        if (!VerificClient) throw new Error

        return VerificClient
    } catch (error) {
        return `Erro, cliente não existe`
    }
}

module.exports = {
    GerarChavesApi,
    VerificTokenClient,
    DeleteTokenValidate,
    getInfoClients,
    AddTokenAccess,
    VerificIndentifiy,
    ClientFindOne,
    verificarToken
}