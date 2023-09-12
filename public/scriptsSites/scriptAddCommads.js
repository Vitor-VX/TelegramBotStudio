
const btn_addCommands = document.querySelector('#btn_addCommands');
const btn_removeCommads = document.querySelector('#btn_removeCommads');

const loadInitialCommands = () => {
    axios.post('http://localhost:8000/api/v1/GetInfoCommads', {
        v: tokenAccess
    })
        .then(res => {
            if (res.data.Commads === undefined) {
                return;
            } else {
                const checkboxContainer = document.querySelector('.checkbox-container');
                checkboxContainer.innerHTML = '';

                res.data.Commads.forEach((comando, index) => {
                    const divOpcoesDelete = document.createElement('div');
                    divOpcoesDelete.classList.add('opcoesDelete');

                    const label = document.createElement('label');
                    label.classList.add('textInfo');
                    label.textContent = comando.Comando;

                    divOpcoesDelete.setAttribute('data-command-id', index);

                    divOpcoesDelete.appendChild(label);
                    checkboxContainer.appendChild(divOpcoesDelete)
                    checkboxContainer.style.marginTop = '30px';

                    divOpcoesDelete.addEventListener('click', () => {
                        divOpcoesDelete.classList.toggle('click');
                    });
                });
            }
        });
}

const removeCommands = (selectedCommands) => {
    document.querySelector('#msgServer').style.display = 'block'

    axios.post('http://localhost:8000/api/v1/removeCommands', {
        v: tokenAccess,
        commandRemove: selectedCommands
    })
        .then(res => {
            if (res.data.success === true) {
                selectedCommands.forEach(command => {
                    const commandId = command.parentElement.getAttribute('data-command-id');
                    const divToRemove = document.querySelector(`[data-command-id="${commandId}"]`);

                    if (divToRemove) {
                        divToRemove.remove();
                    }
                });

                document.querySelector('#msgServer').textContent = res.data.message;
            } else {
                document.querySelector('#msgServer').textContent = res.data.message;
            }
        })
        .catch(err => {
            console.log(err);
        });
}

btn_removeCommads.addEventListener('click', evt => {
    evt.preventDefault();

    const config = {
        title: 'Remova os comandos:',
        label1: null,
        label2: null,
        buttomAdicional: 'buttomRemoveCommands'
    }

    createPopUp(config, (comando, conteudo) => { }, true);
    document.querySelector('#btn_enviar_commands').style.display = 'none'
    document.querySelector('#msgServer').style.display = 'block'

    let buttomRemove = document.querySelector('#buttomRemoveCommands');
    buttomRemove.style.display = 'block';

    buttomRemove.addEventListener('click', evt => {
        evt.preventDefault();

        const selectedCommands = [...document.querySelectorAll('.opcoesDelete.click .textInfo')];
        const commandTexts = selectedCommands.map(command => command.textContent);

        axios
            .post('http://localhost:8000/api/v1/removeCommands', {
                v: tokenAccess,
                commandRemove: commandTexts
            })
            .then(res => {
                if (res.data.success) {
                    selectedCommands.forEach(command => {
                        const commandId = command.parentElement.getAttribute('data-command-id');
                        const divToRemove = document.querySelector(`[data-command-id="${commandId}"]`);

                        if (divToRemove) {
                            divToRemove.remove();
                        }
                    });

                    document.querySelector('#msgServer').textContent = res.data.message;
                } else {
                    document.querySelector('#msgServer').textContent = res.data.message;
                }
            })
            .catch(err => {
                return err
            });

        loadInitialCommands();
    });
    loadInitialCommands();
});


btn_addCommands.addEventListener('click', evt => {
    evt.preventDefault();

    const config = {
        title: 'Adicionar Comandos',
        label1: 'Digite o comando:',
        label2: 'Digite o conteúdo:',
        indentifyInput1: 'comandoAdd',
        indentifyInput2: 'conteudoAdd'
    };

    createPopUp(config, (comando, conteudo) => {

        axios.post('http://localhost:8000/api/v1/addCommands', {
            v: tokenAccess,
            comandoAdd: comando,
            conteudoAdd: conteudo
        })
            .then(res => {
                if (res.data.success === true) {
                    const msgServer = document.querySelector('#msgServer')
                    msgServer.style.display = 'block'
                    msgServer.textContent = res.data.message
                }
            })
            .catch(err => {
                console.log(err);
            });
    });

});