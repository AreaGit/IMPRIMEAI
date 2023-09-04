const usuario = document.getElementById('usuario')
let validUsuario = false
const email = document.getElementById('email')
let validEmail = false
const pass = document.getElementById('pass')
let validPass = false
const msg = document.getElementById('msg')

//VALIDANDO CAMPOS
usuario.addEventListener('keyup', () => {
    if(usuario.value.length <= 5) {
        usuario.setAttribute('style', 'color: red; border-color: red;')
        validUsuario=false
    } else {
        usuario.setAttribute('style', 'color: black; border-color: green;')
        validUsuario = true
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


//CADASTRAR NO LOCALSTORAGE
/*function adicionarUsuarios() {
    if(validEmail && validPass && validUsuario) {
        const User = require('../models/User')
        User.create({
            userCad: usuario.value,
            emailCad: email.value,
            passCad: pass.value
        })
        .then(newUser => {
            msg.setAttribute('style', 'color: green');
            msg.innerHTML = '<strong>Cadastrado com Sucesso!...</strong>';

            setTimeout(() => {
                window.location.href = 'form.html';
            }, 3000);
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            msg.setAttribute('style', 'color: red');
            msg.innerHTML = '<strong>Ocorreu um erro ao cadastrar o usuário.</strong>';
        });

        msg.setAttribute('style', 'color: green')
        msg.innerHTML = '<strong>Cadastrado com Sucesso!...</strong>'
        
        setTimeout(() => {
            window.location.href = 'form.html'
        }, 3000)
       
    } else {
        msg.setAttribute('style', 'color: red')
        msg.innerHTML = '<strong>Preencha todos os campos corretamente <br> antes de cadastrar...</strong>'
    }
}*/

/*function adicionarUsuarios() {
    if(validEmail && validPass && validUsuario) {
        const User = require("../models/User");
        const newUser = new User ({
            userCad : usuario.value,
            emailCad : email.value,
            passCad : pass.value,
            });
            console.log("usuario", newUser );
            //salvando no banco
            newUser.save().then((result)=>{
                console.log ("resultado do salvar" + result ) ;
                msg.innerHTML = '<strong>Usuário Cadastrado com Sucesso!</strong>'
                msg.setAttribute('style', 'color: green;')
                window.location.href = 'http://10.0.0.122:5500/html/form.html'
                }).catch ((err)=>console.log ( "erro ao salvar"+ err));
                }else{
                    msg.innerHTML = '<strong>Usuário Foi Cadastrado com Sucesso!</strong>'
                    msg.setAttribute('style', 'color: red;')
                    }
}
 // Certifique-se de que o caminho está correto
/*const btnCad = document.getElementById('btnCad')
btnCad.addEventListener('click', function adicionarUsuarios() {
    if (validEmail && validPass && validUsuario) {
        users.create({
            userCad: usuario.value,
            emailCad: email.value,
            passCad: pass.value
        })
        .then(newUser => {
            msg.setAttribute('style', 'color: green');
            msg.innerHTML = '<strong>Cadastrado com Sucesso!...</strong>';

            setTimeout(() => {
                window.location.href = 'form.html';
            }, 3000);
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            msg.setAttribute('style', 'color: red');
            msg.innerHTML = '<strong>Ocorreu um erro ao cadastrar o usuário.</strong>';
        });
    } else {
        msg.setAttribute('style', 'color: red');
        msg.innerHTML = '<strong>Preencha todos os campos corretamente <br> antes de cadastrar...</strong>';
    }
})*/

document.addEventListener('DOMContentLoaded', function () {
    const btnCad = document.getElementById('btnCad');
    const cadastroForm = document.getElementById('cadastroForm');

    btnCad.addEventListener('click', function () {
        const usuario = document.getElementById('usuario').value;
        const email = document.getElementById('email').value;
        const pass = document.getElementById('pass').value;

        // Montar os dados do formulário em um objeto
// Dados para enviar no corpo da solicitação
    const userData = {
    userCad: usuario,
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