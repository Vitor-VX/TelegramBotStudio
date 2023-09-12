const createPopUp = (config, handleFunction, options = false) => {
    const divPai = document.createElement('div');
    divPai.setAttribute('class', 'conteiner-pop-up');
    divPai.style.display = 'block';

    const divTextUp = document.createElement('div');
    divTextUp.setAttribute('id', 'textPop-up');
    divTextUp.textContent = config.title;

    divPai.appendChild(divTextUp);

    if (options) {
        const commandListContainer = document.createElement('div');
        commandListContainer.classList.add('checkbox-container');
        divPai.appendChild(commandListContainer);
    }

    const createForm = document.createElement('form');

    const createInput1 = document.createElement('input');
    createInput1.setAttribute('class', 'input-pop-up');
    createInput1.setAttribute('id', config.indentifyInput1);
    createInput1.setAttribute('type', 'text');
    createInput1.setAttribute('placeholder', config.label1);

    const createInput2 = document.createElement('input');
    createInput2.setAttribute('class', 'input-pop-up');
    createInput2.setAttribute('id', config.indentifyInput2);
    createInput2.setAttribute('type', 'text');
    createInput2.setAttribute('placeholder', config.label2);

    const avisoP = document.createElement('p')
    avisoP.setAttribute('id', 'msgServer')
    avisoP.style.display = 'none'

    const campoBotoes = document.createElement('div');
    campoBotoes.setAttribute('class', 'campo-botoes');

    const buttonEnviar = document.createElement('button');
    buttonEnviar.setAttribute('class', 'showRegistrationForm');
    if (options) {
        buttonEnviar.setAttribute('id', 'btn_enviar_commands')
    }
    buttonEnviar.setAttribute('type', 'button');
    buttonEnviar.textContent = 'Enviar';

    const buttonFechar = document.createElement('button');
    buttonFechar.setAttribute('class', 'showRegistrationForm');
    buttonFechar.setAttribute('type', 'button');
    buttonFechar.textContent = 'Fechar';

    const buttomAdicional = document.createElement('button')
    buttomAdicional.classList.add('showRegistrationForm')
    buttomAdicional.setAttribute('id', config.buttomAdicional)
    buttomAdicional.style.display = 'none'
    buttomAdicional.textContent = 'Remover'

    campoBotoes.appendChild(avisoP)
    campoBotoes.appendChild(buttonEnviar);
    campoBotoes.appendChild(buttonFechar);
    campoBotoes.appendChild(buttomAdicional)

    if (config.label1 !== null) {
        createForm.appendChild(createInput1);
    }
    if (config.label2 !== null) {
        createForm.appendChild(createInput2);
    }

    createForm.appendChild(campoBotoes);

    divPai.appendChild(createForm);

    document.body.appendChild(divPai);

    const input1 = divPai.querySelector(`#${config.indentifyInput1}`);
    const input2 = divPai.querySelector(`#${config.indentifyInput2}`);

    buttonFechar.addEventListener('click', evt => {
        evt.preventDefault();
        divPai.remove();
    });

    buttonEnviar.addEventListener('click', () => {
        const value1 = input1.value;
        const value2 = input2 ? input2.value : null;

        handleFunction(value1, value2);

        setTimeout(() => {
            divPai.remove();
        }, 5000);
    });
};