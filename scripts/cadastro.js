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



function adicionarUsuarios() {
    if(validEmail && validPass && validUsuario) {
        let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')
        listaUser.push (
            {
                usuarioCad: usuario.value,
                emailCad: email.value,
                passCad: pass.value
            }
        )
        localStorage.setItem('listaUser', JSON.stringify(listaUser))

        msg.setAttribute('style', 'color: green')
        msg.innerHTML = '<strong>Cadastrado com Sucesso!...</strong>'
        
        setTimeout(() => {
            window.location.href = 'form.html'
        }, 3000)
       
    } else {
        msg.setAttribute('style', 'color: red')
        msg.innerHTML = '<strong>Preencha todos os campos corretamente <br> antes de cadastrar...</strong>'
    }
}