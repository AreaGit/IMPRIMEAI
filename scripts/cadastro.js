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
const numero = document.getElementById('numero')
let validNumero = false
const complemento = document.getElementById('complemento')
let validComplemento = false
const bairro = document.getElementById('bairro')
let validBairro = false


usuario.addEventListener('keyup', () => {
    if(usuario.value.length <= 4) {
        usuario.style.color = 'red';
        usuario.style.borderColor = 'red';
        validUsuario = false;
    } else {
        usuario.style.color = 'black';
        usuario.style.borderColor = 'green';
        validUsuario = true;
    }
})
endereço.addEventListener('keyup', () => {
    if(endereço.value.length <= 5) {
        endereço.setAttribute('style', 'color: red; border-color: red;')
        validEndereco = false
    } else {
        endereço.setAttribute('style', 'color: black; border-color: green;')
        validEndereco = true
    }
})
numero.addEventListener('keyup', () => {
    if(!/^\d+$/.test(numero.value)){
        numero.setAttribute('style', 'color: red; border-color: red;')
        validNumero = false
    }else{
        numero.setAttribute('style', 'color: black; border-color: green;')
        validNumero = true
    }
})
complemento.addEventListener('keyup', () => {
    if(complemento.value.length > 10){
        complemento.setAttribute('style', 'color: red; border-color: red;')
        validComplemento = false
        }else{
        complemento.setAttribute('style', 'color: black; border-color: green;')
        validComplemento = true
    }
})
bairro.addEventListener('keyup', () => {
    if(bairro.value.length < 3){
        bairro.setAttribute('style', 'color: red; border-color: red;')
        validBairro = false
        }else{
        bairro.setAttribute('style', 'color: black; border-color: green;')
        validBairro = true
    }
})
cep.addEventListener('input', () => {
    const cepValue = cep.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cepValue.length === 8) {
        cep.value = cepValue.replace(/(\d{5})(\d{3})/, '$1-$2'); // Formata o CEP (12345678 -> 12345-678)
        cep.style.color = 'black';
        cep.style.borderColor = 'green';
        validCep = true;
    } else {
        cep.style.color = 'red';
        cep.style.borderColor = 'red';
        validCep = false;
    }
});
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
cpf.addEventListener('input', () => {
    let cpfValue = cpf.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cpfValue.length > 11) {
        cpfValue = cpfValue.slice(0, 11); // Limite o comprimento a 11 caracteres
    }

    // Formata o CPF com pontos e traço
    cpfValue = cpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    cpf.value = cpfValue; // Define o valor formatado de volta no campo
});
cpf.addEventListener('keyup', () => {
    const cpfValue = cpf.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cpfValue.length !== 11) {
        cpf.style.color = 'red';
        cpf.style.borderColor = 'red';
        validCPF = false;
    } else {
        cpf.style.color = 'black';
        cpf.style.borderColor = 'green';
        validCPF = true;
    }
})
telefone.addEventListener('input', () => {
    let telefoneValue = telefone.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (telefoneValue.length > 11) {
        telefoneValue = telefoneValue.slice(0, 11); // Limite o comprimento a 11 caracteres
    }

    // Formata o telefone com parênteses e traço (por exemplo, (99) 99999-9999)
    telefoneValue = telefoneValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

    telefone.value = telefoneValue; // Define o valor formatado de volta no campo
});
telefone.addEventListener('keyup', () => {
    const telefoneValue = telefone.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if(telefone.value.length <= 11) {
        telefone.setAttribute('style', 'color: red; border-color: red;')
        validTelefone = false
    } else {
        telefone.setAttribute('style', 'color: black; border-color: green;')
        validTelefone = true
    }
})
email.addEventListener('keyup', () => {
    const emailValue = email.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(emailValue)) {
        email.setAttribute('style', 'color: red; border-color: red;');
        validEmail = false;
    } else {
        email.setAttribute('style', 'color: black; border-color: green;');
        validEmail = true;
    }
});

pass.addEventListener('keyup', () => {
    const passValue = pass.value;
    const minLength = 8;

    if(passValue.length < minLength) {
     pass.setAttribute('style', 'color:red; border-color: red;');
     validPass = false;
    } else {
     pass.setAttribute('style', 'color:black; border-color: green; ');
     validPass = true;
    }

})

document.getElementById('cadastroForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita o envio padrão do formulário
        // Chame a função de envio do formulário aqui
        // Por exemplo, você pode chamar a função que você já tem para validação e envio
        // Certifique-se de ajustar isso para se adequar ao seu código existente.
        submitForm(); // Substitua "submitForm" pelo nome da sua função de envio.
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const btnCad = document.getElementById('btnCad');
    const cadastroForm = document.getElementById('cadastroForm');
    const msg = document.getElementById('msg');
  
    btnCad.addEventListener('click', function () {
      const usuario = document.getElementById('usuario').value;
      const cpf = document.getElementById('cpf').value;
      const endereço = document.getElementById('endereço').value;
      const numero = document.getElementById('numero').value;
      const complemento = document.getElementById('complemento').value;
      const bairro = document.getElementById('bairro').value;
      const cep = document.getElementById('cep').value;
      const cidade = document.getElementById('cidade').value;
      const estado = document.getElementById('estado').value;
      const telefone = document.getElementById('telefone').value;
      const inscricaoEstadual = document.getElementById('inscricaoEstadual').value;
      const email = document.getElementById('email').value;
      const pass = document.getElementById('pass').value;
  
      // Verifique cada campo individualmente e exiba mensagens de erro, se necessário.
      if (usuario.length <= 4) {
        msg.innerHTML = '<strong>O campo "Usuário" deve conter mais de 5 caracteres e não pode conter espaços.</strong>';
        msg.setAttribute('style', 'color: red;');
      } else if (email.length <= 3 || !validEmail) {
        msg.innerHTML = '<strong>Verifique o campo "E-mail" se ele foi digitado Corretamente.</strong>';
        msg.setAttribute('style', 'color: red;');
      } else if (pass.length <= 8 || !validPass) {
        msg.innerHTML = '<strong>Verifique o campo "Senha" se ele atinge o mínimo de Caracteres.</strong>';
        msg.setAttribute('style', 'color: red;');
      } else if (!validCPF || !validCep || !validTelefone || !validNumero || !validBairro) {
        msg.innerHTML = '<strong>Verifique os Outros Campos e verifique se estão corretos!.</strong>';
        msg.setAttribute('style', 'color: red;');
      } else {
        // Montar os dados do formulário em um objeto
        const userData = {
          userCad: usuario,
          endereçoCad: endereço,
          numCad: numero,
          compCad: complemento,
          bairroCad: bairro,
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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Usuário cadastrado com sucesso!') {
            msg.innerHTML = '<strong>Usuário Cadastrado com Sucesso</strong>';
            msg.setAttribute('style', 'color: green;');
            setTimeout(() => {
              window.location.href = 'form.html';
            }, 3000);
         }else if (data.message === 'Já existe um usuário com este e-mail cadastrado'){
            msg.innerHTML = `<strong>${data.message}</strong>`;
            msg.setAttribute('style', 'color: red;');
          } else {
            msg.innerHTML = `<strong>${data.message}</strong>`;
            msg.setAttribute('style', 'color: red;');
            setTimeout(() => {
                window.location.reload()
            }, 3000)
          }
        })
        .catch(error => {
          msg.innerHTML = '<strong>Não foi possível Cadastrar o Usuário <br> Verifique os Campos</strong>';
          msg.setAttribute('style', 'color:red;');
          console.error('Erro ao cadastrar usuário:', error);
          setTimeout(() => {
            window.location.reload()
          }, 3000)
          
        });
      }
    });
  });
