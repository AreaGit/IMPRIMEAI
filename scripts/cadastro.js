const email = document.getElementById('email')
let validEmail = false
const pass = document.getElementById('pass')
let validPass = false
const msg = document.getElementById('msg')

//VALIDANDO CAMPOS
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
    if(validEmail && validPass) {
        let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')
        listaUser.push (
            {
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