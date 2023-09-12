const urlParams = new URLSearchParams(window.location.search);
const tokenAccess = urlParams.get('authorization');

axios.post(`http://localhost:8000/api/v1/verificTokenSucess`, { token: tokenAccess })
    .then(() => {
        axios.post(`http://localhost:8000/api/v1/deleteTokenSuccess`, { token: tokenAccess })
    })
    .catch(() => {
        window.location.href = '/login.html';
    });

axios.get(`http://localhost:8000/api/v1/seguration`)
    .then(res => {
        window.location.href = res.data.message
    });

setInterval(() => {
    axios.post(`http://localhost:8000/api/v1/accessToken`, { v: tokenAccess })
        .then()
        .catch(() => {
            window.location.href = '/login.html'
        })
}, 10000)

axios.post(`http://localhost:8000/api/v1/verificConfigActivate`, {
    v: tokenAccess
})
    .then(res => {
        document.querySelector('#bot_activate').textContent = res.data.config
    })

document.querySelector('#configReq').addEventListener('click', (evt) => {
    evt.preventDefault()

    axios.post('/configPerfil.html', {
        v: tokenAccess
    })
        .then(res => {
            window.location.href = res.data.url
        })
        .catch(err => {
            console.log(err.response);
        })
})

document.querySelector('#bot_activate').addEventListener('click', (evt) => {
    evt.preventDefault();

    const botActivateElement = document.querySelector('#bot_activate');
    const botStatus = botActivateElement.textContent;

    if (botStatus === 'Bot ativo') {
        axios.post(`http://localhost:8000/api/v1/botActivate`, {
            v: tokenAccess,
            bot: 'Bot desativado'
        })
            .then(() => {
                botActivateElement.textContent = 'Bot desativado';
            })
            .catch((error) => {
                console.error('Erro ao desativar o bot:', error);
            });
    } else if (botStatus === 'Bot desativado') {
        axios.post(`http://localhost:8000/api/v1/botActivate`, {
            v: tokenAccess,
            bot: 'Bot ativo'
        })
            .then(() => {
                botActivateElement.textContent = 'Bot ativo';
            })
            .catch((error) => {
                console.error('Erro ao ativar o bot:', error);
            });
    }
});
