//SLIDER

let slideIndex = 1;
showSlide(slideIndex);

function prevSlide() {
  showSlide(slideIndex -= 1);
  
}

function nextSlide() {
  showSlide(slideIndex += 1);
}

function showSlide(n) {
  let slides = document.getElementsByClassName("slide");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";


}

setInterval(function() {
    showSlide(slideIndex += 1);
  }, 5000);

//VOLTAR AO TOPO

let voltar_ao_topo = document.getElementById('voltar_ao_topo');

voltar_ao_topo.addEventListener('click', function () {
  window.scrollTo(0,0);
  console.log('Voltou ao topo');
});



//CARRINHO

const cart = [];

function addToCart(price) {
  cart.push(price);
  updateCartUI();
}

function updateCartUI() {
  const totalItensSpan = document.getElementById('totalItens');
  totalItensSpan.textContent = cart.length;
}

//MOSTRA O NOME  DO USUÁRIO LOGADO A PARTIR DOS COOKIES

const logado = document.getElementById('logado')
const conviteCad = document.getElementById('conviteCad')
const sairBtn = document.getElementById('sairBtn')

//BOTÃO DE LOGOUT

sairBtn.addEventListener("click", function () {
  // Redirecionar para a rota de logout no servidor
  window.location.href = "/logout";
});

//CAIXA DE PESQUISA 

