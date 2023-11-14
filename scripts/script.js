document.addEventListener('DOMContentLoaded', () => {
  const formPesquisa = document.getElementById('formPesquisa');
  const caixaPesq = document.getElementById('caixaPesq');
  const resultadosPesquisa = document.getElementById('resultadosPesquisa');
  const limparPesq = document.getElementById('limparPesq');
  // Variável para armazenar o ID do timer de pesquisa
  let searchTimer;

  formPesquisa.addEventListener('input', async () => {
    const query = caixaPesq.value.trim();

    if (query === '') {
      resultadosPesquisa.style.display = 'none';
      resultadosPesquisa.innerHTML = '';
      return;
    }

    // Cancelar pesquisas anteriores (se houver alguma)
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    // Agendar uma nova pesquisa após um pequeno atraso (por exemplo, 300ms)
    searchTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/pesquisar-produtos?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        resultadosPesquisa.innerHTML = '';

        if (data.produtos && data.produtos.length === 0) {
          resultadosPesquisa.innerHTML = '<p>Nenhum produto encontrado.</p>';
        } else if (data.produtos) {
          data.produtos.forEach((produto) => {
            const cardProduto = document.createElement('a');
            cardProduto.setAttribute('style', 'text-decoration:none; color:black;')
            cardProduto.href = `html/detalhes-produtos.html?id=${produto.id}`;
            cardProduto.classList.add('product-card');
  
            cardProduto.innerHTML = `
              <img src="/imagens/${produto.id}" alt="${produto.nomeProd}">
              <h2>${produto.nomeProd}</h2>
              <!--<p>${produto.descProd}</p>
              <p>Valor: R$ ${parseFloat(produto.valorProd).toFixed(2)}</p>-->
            `;
  
            resultadosPesquisa.appendChild(cardProduto);
          });
          resultadosPesquisa.style.display = 'block';
        }
      } catch (error) {
        console.error('Erro na pesquisa de produtos:', error);
        resultadosPesquisa.innerHTML = '<p>Erro na pesquisa de produtos.</p>';
      }
    }, 300); // Defina o tempo de atraso desejado (em milissegundos)
  });
});

btnPesq.addEventListener('click', () => {
                const query = caixaPesq.value.trim();
                if (query !== '') {
                    pesquisarProdutos(query);
                    resultadosPesquisa.setAttribute('style', 'dislplay:block;')
                }
            });

            // Listener para a tecla Enter no campo de pesquisa
            caixaPesq.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const query = caixaPesq.value.trim();
                    if (query !== '') {
                        pesquisarProdutos(query);
                        resultadosPesquisa.setAttribute('style', 'dislplay:block;')
                    }
                }
            });

            // Listener para o botão Limpar
            limparPesq.addEventListener('click', () => {
                caixaPesq.value = ''; // Limpa o campo de pesquisa
                resultadosPesquisa.innerHTML = ''; // Limpa os resultados da pesquisa
            });