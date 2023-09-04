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

const logado = document.getElementById('logado')
const conviteCad = document.getElementById('conviteCad')
const sairBtn = document.getElementById('sairBtn')

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
      }
  }
  return null;
}

// Ler o valor do cookie 'userCad'
const userCad = getCookie('userCad');

// Exibir o valor do 'userCad' na página
const userCadDisplay = document.getElementById("userCadDisplay");
if (userCad) {
  logado.innerHTML = `Olá ${userCad}`;
  conviteCad.setAttribute('style', 'display:none')
  sairBtn.setAttribute('style', 'display:block')
} else {
  
}
//CAIXA DE PESQUISA 