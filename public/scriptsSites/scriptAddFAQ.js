const btn_Select_Remove_FAQ = document.querySelector('#btn_Select_Remove_FAQ')
const btn_Add_Faq = document.querySelector('#btn_addFAQ')

btn_Add_Faq.addEventListener('click', (evt) => {
    evt.preventDefault()

    const config = {
        title: 'Adicione suas perguntas frequentes',
        label1: 'Digite a pergutna:',
        label2: 'Digite a resposta:',
        indentifyInput1: 'perguntaAdd',
        indentifyInput2: 'respostaAdd'
    };

    createPopUp(config, (question, response) => {
        axios.post(`http://localhost:8000/api/v1/addFaqClients`, {
            v: tokenAccess,
            perguntaAdd: question,
            respostaAdd: response
        })
            .then(res => {
                const msgServer = document.querySelector('#msgServer')

                if (res.data.success === false) {
                    msgServer.style.display = 'block'
                    msgServer.textContent = res.data.message
                    console.log(res.data.message);
                } else {
                    msgServer.style.display = 'block'
                    msgServer.textContent = res.data.message
                }

                loadInitialFAQs()
            })
            .catch(err => {
                console.log(err);
            });
    })

})

btn_Select_Remove_FAQ.addEventListener('click', evt => {
    evt.preventDefault()

    const config = {
        title: 'Remova suas perguntas frequentes clicando selecionando',
        label1: null,
        label2: null,
        buttomAdicional: 'btn_remove_Faq_opt'
    };
    createPopUp(config, (null, null), true)
    document.querySelector('#btn_enviar_commands').style.display = 'none'
    document.querySelector('#msgServer').style.display = 'block'

    let btn_remove_Faq_opt = document.querySelector('#btn_remove_Faq_opt')
    btn_remove_Faq_opt.style.display = 'block'

    btn_remove_Faq_opt.addEventListener('click', evt => {
        evt.preventDefault()

        const selectedFAQs = [...document.querySelectorAll('.opcoesDelete.click .textInfo')]
        const faqTexts = selectedFAQs.map(faq => faq.textContent);

        axios.post(`http://localhost:8000/api/v1/removeFaqs`, {
            v: tokenAccess,
            faqRemove: faqTexts
        })
            .then(res => {
                document.querySelector('#msgServer').textContent = res.data.message

                selectedFAQs.forEach(faq => {
                    const faqId = faq.parentElement.getAttribute('data-faq-id');
                    const divToRemove = document.querySelector(`[data-faq-id="${faqId}"]`);

                    if (divToRemove) {
                        divToRemove.remove();
                    }
                });
            })
            .catch(err => {
                document.querySelector('#msgServer').textContent = res.data.message
            });
    })
    loadInitialFAQs()
})

const loadInitialFAQs = () => {
    axios.post(`http://localhost:8000/api/v1/GetInitialFAQs`, {
        v: tokenAccess
    })
        .then(res => {
            if (res.data.Faqs === undefined) {
                return;
            } else {
                const checkboxContainer = document.querySelector('.checkbox-container');
                checkboxContainer.innerHTML = '';

                res.data.Faqs.forEach((faq, index) => {
                    const divOpcoesDelete = document.createElement('div');
                    divOpcoesDelete.classList.add('opcoesDelete');

                    const label = document.createElement('label');
                    label.classList.add('textInfo');
                    label.textContent = faq.question;

                    divOpcoesDelete.setAttribute('data-faq-id', index);

                    divOpcoesDelete.appendChild(label);
                    checkboxContainer.appendChild(divOpcoesDelete);

                    divOpcoesDelete.addEventListener('click', () => {
                        divOpcoesDelete.classList.toggle('click');
                    });
                });
            }
        })
        .catch(err => {
            console.log(err.response);
        })
};