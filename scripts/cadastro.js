const usuario = document.getElementById('usuario')
let validUsuario = false
const email = document.getElementById('email')
let validEmail = false
const pass = document.getElementById('pass')
let validPass = false
const msg = document.getElementById('msg')
const endereço = document.getElementById('endereço')
let validEndereco = false
const cep = document.getElementById('cep')
let validCep = false
const cidade = document.getElementById('cidade')
let validCidade = false
const estado = document.getElementById('estado')
let validEstado = false
const telefone = document.getElementById('telefone')
let validTelefone = false
const cpf = document.getElementById('cpf')
let validCPF = false
const inscricaoEstadual = document.getElementById('inscricaoEstadual')


//VALIDANDO CAMPOS
/*usuario.addEventListener('keyup', () => {
    if(usuario.value.length <= 5) {
        usuario.setAttribute('style', 'color: red; border-color: red;')
        validUsuario=false
    } else {
        usuario.setAttribute('style', 'color: black; border-color: green;')
        validUsuario = true
    }
})*/
usuario.addEventListener('keyup', () => {
    const usuarioValue = usuario.value.trim(); // Remove espaços em branco do início e do fim
    if (usuarioValue.length <= 5 || usuarioValue.includes(' ')) {
        usuario.style.color = 'red';
        usuario.style.borderColor = 'red';
        validUsuario = false;
    } else {
        usuario.style.color = 'black';
        usuario.style.borderColor = 'green';
        validUsuario = true;
    }
});
endereço.addEventListener('keyup', () => {
    if(endereço.value.length <= 5) {
        endereço.setAttribute('style', 'color: red; border-color: red;')
        validEndereco = false
    } else {
        endereço.setAttribute('style', 'color: black; border-color: green;')
        validEndereco = true
    }
})
cep.addEventListener('keyup', () => {
    if(cep.value.length <= 8) {
        cep.setAttribute('style', 'color: red; border-color: red;')
        validCep = false
    } else {
        cep.setAttribute('style', 'color: black; border-color: green;')
        validCep = true
    }
})
cidade.addEventListener('keyup', () => {
    if(cidade.value.length <= 3) {
        cidade.setAttribute('style', 'color: red; border-color: red;')
        validCidade = false
    } else {
        cidade.setAttribute('style', 'color: black; border-color: green;')
        validCidade = true
    }
})
estado.addEventListener('keyup', () => {
    if(estado.value.length <= 3) {
        estado.setAttribute('style', 'color: red; border-color: red;')
        validEstado = false
    } else {
        estado.setAttribute('style', 'color: black; border-color: green;')
        validEstado = true
    }
})
cpf.addEventListener('keyup', () => {
    if(cpf.value.length <= 11) {
        cpf.setAttribute('style', 'color: red; border-color: red;')
        validCPF = false
    } else {
        cpf.setAttribute('style', 'color: black; border-color: green;')
        validCPF = true
    }
})
telefone.addEventListener('keyup', () => {
    if(telefone.value.length <= 8) {
        telefone.setAttribute('style', 'color: red; border-color: red;')
        validTelefone = false
    } else {
        telefone.setAttribute('style', 'color: black; border-color: green;')
        validTelefone = true
    }
})
email.addEventListener('keyup', () => {
    if(email.value.length <= 3) {
        email.setAttribute('style', 'color: red; border-color: red;')
        validEmail = false
    } else {
        email.setAttribute('style', 'color: black; border-color: green;')
        validEmail = true
    }
})
pass.addEventListener('keyup', () => {
    if(pass.value.length <= 8) {
        pass.setAttribute('style', 'color: red; border-color: red;')
        validPass = false
    } else {
        pass.setAttribute('style', 'color: black; border-color: green;')
        validPass = true
    }
})


document.addEventListener('DOMContentLoaded', function () {
    const btnCad = document.getElementById('btnCad');
    const cadastroForm = document.getElementById('cadastroForm');

    btnCad.addEventListener('click', function () {
        const usuario = document.getElementById('usuario').value;
        const cpf = document.getElementById('cpf').value;
        const endereço = document.getElementById('endereço').value;
        const cep = document.getElementById('cep').value;
        const cidade = document.getElementById('cidade').value;
        const estado = document.getElementById('estado').value;
        const telefone = document.getElementById('telefone').value;
        const inscricaoEstadual = document.getElementById('inscricaoEstadual').value;
        const email = document.getElementById('email').value;
        const pass = document.getElementById('pass').value;

        // Montar os dados do formulário em um objeto
        // Dados para enviar no corpo da solicitação
    const userData = {
    userCad: usuario,
    endereçoCad: endereço,
    cepCad: cep,
    cidadeCad: cidade,
    estadoCad: estado,
    cpfCad: cpf,
    telefoneCad: telefone,
    inscricaoEstadualCad: inscricaoEstadual,
    emailCad: email,
    passCad: pass
};

    fetch('/cadastrar', {
    method: 'POST', // Usar o método POST
    headers: {
        'Content-Type': 'application/json' // Definir o cabeçalho para JSON
    },
    body: JSON.stringify(userData) // Converter os dados para JSON
})
    .then(response => response.json())
    .then(data => {
        if(validUsuario && validEmail && validPass) {
            console.log(data.message); 
    msg.innerHTML = '<strong>Usuário Cadastrado com Sucesso</strong>'
    msg.setAttribute('style', 'color: green;')
    setTimeout(() => {
        window.location.href = 'http://localhost:8080/html/form.html'
    },3000)
        } else {
            msg.innerHTML = '<strong>Não foi possível Cadastrar o Usuário <br> Verifique os Campos</strong>'
            msg.setAttribute('style', 'color:red;')
            console.error('Erro ao cadastrar usuário:', error);
        }
    
})
    .catch(error => {
        msg.innerHTML = '<strong>Não foi possível Cadastrar o Usuário <br> Verifique os Campos</strong>'
        msg.setAttribute('style', 'color:red;')
        console.error('Erro ao cadastrar usuário:', error);
});

    });
});