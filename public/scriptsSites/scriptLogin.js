const login_button = document.querySelector('#login-button')
const error_message = document.querySelector('#error-message')

login_button.addEventListener('click', (evt) => {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    if (username === '' || password === '') {
        error_message.innerHTML = 'Campos inválidos.'
        evt.stopPropagation()
        setInterval(() => error_message.innerHTML = '', 4000)
    } else {
        axios.post('/login.html', {
            username,
            password
        })
            .then((response) => {
                const acessPositive = response.data.urlAcess
                window.location.href = acessPositive
            })
            .catch(err => {
                error_message.innerHTML = err.response.data.errorMsg
                setInterval(() => error_message.innerHTML = '', 4000)
            })
    }
})