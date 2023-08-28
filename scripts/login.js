function entrar() {
    let usuario = document.getElementById('usuario')
    let email = document.getElementById('email');
    let pass = document.getElementById('pass');
    let msg = document.getElementById('msg');
    let listaUser = [];
    let userValid = {
        email: '',
        pass: ''
    };

    listaUser = JSON.parse(localStorage.getItem('listaUser'));

    listaUser.forEach((item) => {
        if (usuario.value === item.usuarioCad &&email.value === item.emailCad && pass.value === item.passCad) {
            userValid = {
                usuario: item.usuarioCad,
                email: item.emailCad,
                pass: item.passCad
            };
        }
    });

    if(usuario.value == userValid.usuario && email.value == userValid.email && pass.value == userValid.pass) {
        setTimeout(() => {
            window.location.href = '../index.html'
        }, 3000)

        let token = Math.random().toString(16).substring(2)
        localStorage.setItem('token', token)
        localStorage.setItem('userLogado', JSON.stringify(userValid))
    } else {
        usuario.setAttribute('style', 'color:red')
        email.setAttribute('style', 'color:red')
        pass.setAttribute('style', 'color:red')
        msg.setAttribute('style', 'color: red')
        msg.innerHTML = '<strong>Usuário, email ou senha incorretos</strong>'
        usuario.focus()
    }
}
