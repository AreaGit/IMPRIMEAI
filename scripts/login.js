function entrar() {
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
        if (email.value === item.emailCad && pass.value === item.passCad) {
            userValid = {
                email: item.emailCad,
                pass: item.passCad
            };
        }
    });

    if(email.value == userValid.email && pass.value == userValid.pass) {
        setTimeout(() => {
            window.location.href = '../index.html'
        }, 3000)

        let token = Math.random().toString(16).substring(2)
        localStorage.setItem('token', token)
        localStorage.setItem('userLogado', JSON.stringify(userValid))
    } else {
        email.setAttribute('style', 'color:red')
        pass.setAttribute('style', 'color:red')
        msg.setAttribute('style', 'color: red')
        msg.innerHTML = '<strong>Usuário ou senha incorretos</strong>'
        email.focus()
    }
}
