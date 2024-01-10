function entrar() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const msg = document.getElementById('msg');
    const pdp = document.getElementById('pdp');
  
    // Dados do usuário para enviar ao servidor
    const userData = {
      emailCad: email,
      passCad: pass
    };
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro de rede - ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.message === 'Login bem-sucedido') {
        pdp.style.display = 'none';
        msg.innerHTML = '<strong>Seja Bem-Vindo!</strong>'
        msg.setAttribute('style', 'color:green;')
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 3000);
      } else {
        // Exibir mensagem de erro
        pdp.style.display = 'none';
        msg.setAttribute('style', 'color: red');
        msg.innerHTML = '<strong>' + data.message + '</strong>';
      }
    })
    .catch(error => {
      pdp.style.display = 'none';
      console.error('Erro ao fazer login:', error);
      msg.setAttribute('style', 'color: red');
      msg.innerHTML = '<strong>Erro ao fazer login</strong>';
    });
  }
  