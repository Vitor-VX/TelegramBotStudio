const urlParamsVerific = new URLSearchParams(window.location.search);
const v = urlParams.get('authorization');

axios.post(`http://localhost:8000/api/v1/getCliente`, {
    v
})
    .then(res => {
        document.querySelector('#none-user').innerHTML = res.data.cliente
    }).catch(err => {
        return console.log(err);
    })

const botao = document.querySelector('.botao');
const conteiner = document.querySelector('.conteiner');
const conteiner_painel = document.querySelector('.conteiner-painel');

conteiner.style.width = '250px';
conteiner_painel.style.display = 'none';
botao.style.display = 'none'

setTimeout(() => {
    conteiner.style.width = 'auto';
    conteiner_painel.style.display = 'block';
    botao.style.display = 'block'
}, 600);

botao.addEventListener('click', (evt) => {
    evt.preventDefault();

    const isOpen = botao.getAttribute('data-open') === 'true';

    if (isOpen) {
        conteiner.style.width = '0';
        conteiner_painel.style.display = 'none';
        botao.style.left = '0';
        botao.style.background = 'rgba(0, 0, 0, 0.308)'
        botao.setAttribute('data-open', 'false');
    } else {
        conteiner.style.width = 'auto';
        conteiner_painel.style.display = 'block';
        botao.style.left = '188px';
        botao.style.background = 'rgba(0, 0, 0, 0.800)'
        botao.style.color = 'white';
        botao.setAttribute('data-open', 'true');
    }
});