
document.addEventListener('DOMContentLoaded', () => {
    const btn_registrar = document.querySelector('#btn_registrar_bot');

    btn_registrar.addEventListener('click', evt => {
        evt.preventDefault();

        const config = {
            title: 'Registrar bot',
            label1: 'Forneça o token do bot que deseja configurar:',
            label2: null,
            indentifyInput1: 'tokenBot',
            indentifyInput2: null
        };

        createPopUp(config, (botToken, valor2) => {

            axios.post(`http://localhost:8000/api/v1/tokenBot`, { v: tokenAccess, bot: botToken })
                .then(response => {
                    const msgServer = document.querySelector('#msgServer')
                    if (response.data.success) {
                        msgServer.style.display = 'block'
                        msgServer.style.color = 'green'
                        msgServer.textContent = `Token registrado com sucesso.`
                    }
                })
                .catch(err => {
                    msgServer.style.display = 'block'
                    msgServer.textContent = `Erro ao tentar registrar o token`
                });

        });
    });
});