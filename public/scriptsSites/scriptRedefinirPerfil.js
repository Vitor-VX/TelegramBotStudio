const urlParams = new URLSearchParams(window.location.search);
const tokenAccess = urlParams.get('authorization');

axios.post(`http://localhost:8000/api/v1/getCliente`, {
    v: tokenAccess
}).then(res => {
    document.querySelector('#campo_info_user').value = res.data.cliente
    document.querySelector('#campo_info_senha').value = res.data.senhaCliente
}).catch(err => {
    console.log(err.response);
})

axios.post(`http://localhost:8000/api/v1/verificTokenSucess`, { token: tokenAccess })
    .then(() => {
        axios.post(`http://localhost:8000/api/v1/deleteTokenSuccess`, { token: tokenAccess })
    })
    .catch((err) => {
        console.log(err);
        window.location.href = '/login.html';
    });

axios.get(`http://localhost:8000/api/v1/seguration`)
    .then(res => {
        window.location.href = res.data.message
    });

const imgSenha = document.querySelector('.imgSenha');
const senhaInput = document.getElementById('campo_info_senha');

imgSenha.addEventListener('click', () => {
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        imgSenha.src = '../img/imgSenhaTrue.png';
    } else {
        senhaInput.type = 'password';
        imgSenha.src = '../img/imgSenhaFalse.png';
    }
});

const botaoRedefinirInfos = document.querySelector('#botaoRedefinirInfos')
const campo_usuario = document.querySelector('#campo_info_user')
const campo_Senha = document.querySelector('#campo_info_senha')
const msg_input = document.querySelector('#msg_input')

botaoRedefinirInfos.addEventListener('click', (evt) => {
    evt.preventDefault()
    document.querySelector('#textNone').innerHTML = 'Insira seu novo email:'
    document.querySelector('#textSenha').innerHTML = 'Insira sua nova senha:'

    axios.post(`http://localhost:8000/api/v1/getCliente`, {
        v: tokenAccess
    }).then(res => {
        if (campo_usuario.value === res.data.cliente && campo_Senha.value === res.data.senhaCliente) {
            campo_usuario.value = ''
            campo_Senha.value = ''
        } else if (campo_usuario.value !== '' && campo_Senha.value !== '') {
            axios.post(`http://localhost:8000/api/v1/updateInfoUser`, {
                v: tokenAccess,
                newUserEmail: campo_usuario.value,
                newUserSenha: campo_Senha.value
            })
                .then(res => {
                    msg_input.style.color = 'rgb(52, 221, 0)'
                    msg_input.innerHTML = res.data.message
                    setTimeout(() => {
                        msg_input.innerHTML = ''
                        document.querySelector('#textNone').innerHTML = 'Nome:'
                        document.querySelector('#textSenha').innerHTML = 'Senha:'
                    }, 2000)
                })
                .catch(err => {
                    console.log(err.response);
                })
        } else {
            botaoRedefinirInfos.textContent = 'Campo iválido'
            setTimeout(() => { botaoRedefinirInfos.textContent = 'Redefinir informações' }, 1500)
        }
    })
})