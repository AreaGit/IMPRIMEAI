const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const axios = require('axios')
const User = require('./models/User');
const Produtos = require('./models/Produtos');
const Cartoes = require('./models/Cartoes');
const Graficas = require('./models/Graficas');
const Pedidos = require('./models/Pedidos');
const multer = require('multer');
const { where } = require('sequelize');
const ejs = require('ejs');
const { Op } = require('sequelize');
const geolib = require('geolib');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt')
const session = require('express-session');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');



app.use(session({
  secret: 'seuSegredoDeSessao', // Substitua com um segredo seguro
  resave: false,
  saveUninitialized: true
}));


// Configurar o mecanismo de template EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const cookieParser = require('cookie-parser');
const { text } = require('body-parser');
const { error } = require('console');


const PORT = 8080;

app.use(express.static('public'));
app.use(express.json());
app.use(express.static(__dirname));
app.use(cookieParser());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const geocodeBaseUrl = 'https://nominatim.openstreetmap.org/search';

app.get("/", (req, res) => {
    try {
        const indexHtmlContent = fs.readFileSync("index.html", "utf8");
        res.send(indexHtmlContent);
      } catch (err) {
        console.error("Erro ao ler o arquivo index.html:", err);
        res.status(500).send("Erro interno do servidor");
      }
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/test.html"); // Verifique o caminho do arquivo
});

app.get("/pagamento", (req, res) => {
  res.sendFile(__dirname + "html", "/pagamento.html"); // Verifique o caminho do arquivo
});

app.get("/cartao", (req, res) => {
  res.sendFile(__dirname + "html" , "/cadastro-cartao.html"); // Verifique o caminho do arquivo
});

app.get("/cadastro-graficas", (req, res) => {
  res.sendFile(__dirname + "html" , "/cadastro-graficas.html"); // Verifique o caminho do arquivo
});

app.get("/login-graficas", (req, res) => {
  res.sendFile(__dirname + "html" , "/login-graficas.html"); // Verifique o caminho do arquivo
});

app.get("/cadastrar", (req, res) => {
  res.sendFile(__dirname + "html", "cadastro.html"); // Verifique o caminho do arquivo
});



app.post("/cadastro-graficas", async (req, res) => {
 
  try {
      const { userCad, cnpjCad, endereçoCad, cepCad, cidadeCad, estadoCad, inscricaoEstadualCad, telefoneCad, bancoCad, agenciaCad, contaCorrenteCad, emailCad, passCad } = req.body;
      const hashedPassword = await bcrypt.hash(passCad, 10);

      const existingGrafica = await Graficas.findOne({
        where: {
          [Op.or]: [
            { emailCad: emailCad },
          ],
        },
      });
  
      if (existingGrafica) {
        return res.status(400).json({
          message: "Já existe uma Gráfica com este e-mail cadastrado",
        });
      }

      const newGrafica = await Graficas.create({
          userCad: userCad,
          cnpjCad: cnpjCad,
          endereçoCad: endereçoCad,
          cepCad: cepCad,
          cidadeCad: cidadeCad,
          estadoCad: estadoCad,
          inscricaoEstadualCad: inscricaoEstadualCad,
          telefoneCad: telefoneCad,
          bancoCad: bancoCad,
          agenciaCad: agenciaCad,
          contaCorrenteCad: contaCorrenteCad,
          emailCad: emailCad,
          passCad: hashedPassword
      });

      res.json({ message: 'Gráfica cadastrada com sucesso!', Graficas: newGrafica });
      
  } catch (error) {
      console.error('Erro ao cadastrar grafica:', error);
      res.status(500).json({ message: 'Erro ao cadastrar grafica' });
  }
});


app.post("/login-graficas", async (req, res) => {
  try {
    const { emailCad, passCad } = req.body;

    // Verifique se o usuário existe no banco de dados
    const grafica = await Graficas.findOne({ where: { emailCad: emailCad} });

    if (!grafica) {
      return res.status(401).json({ message: "Grafica não encontrada" });
    }

    const passwordMatch = await bcrypt.compare(passCad, grafica.passCad);

    // Verifique se a senha está correta
    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    res.cookie('userCad', grafica.userCad);

    // Gere um token de autenticação (exemplo simples)
    const token = Math.random().toString(16).substring(2);

    res.json({ message: "Login bem-sucedido", token: token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao Fazer o Login <br> Preencha os Campos Corretamente" });
  }
});

app.post('/cadastro-cartao', async (req, res) => {
  const { cardNumber, cardHolderName, expirationDate, cvv } = req.body;

  try {
    // Salva o cartão de crédito no banco de dados
    const newCard = await Cartoes.create({
      cardNumber,
      cardHolderName,
      expirationDate,
      cvv,
    });
    console.log('Cartão de crédito cadastrado com sucesso.');
    res.json({ success: true, message: 'Cartão de crédito cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar cartão de crédito:', error);
  }
});

app.get('/cartoes-cadastrados', async (req, res) => {
  try {
    // Consulte o banco de dados para buscar os cartões cadastrados
    const cartoesCadastrados = await Cartoes.findAll();

    // Envie os cartões como resposta em JSON
    res.json({ cartoes: cartoesCadastrados });
  } catch (error) {
    console.error('Erro ao buscar cartões cadastrados:', error);
    res.status(500).json({ error: 'Erro ao buscar cartões cadastrados', message: error.message });
  }
});

app.get('/pedidos-cadastrados', async (req, res) => {
  try {
    // Consulte o banco de dados para buscar os cartões cadastrados
    const pedidosCadastrados = await Pedidos.findAll(); 

    // Envie os cartões como resposta em JSON
    res.json({ pedidos: pedidosCadastrados });
  } catch (error) {
    console.error('Erro ao buscar pedidos cadastrados:', error);
    //res.status(500).json({ error: 'Erro ao buscar pedidos cadastrados', message: error.message });
  }
}); 

app.get('/pedidos-usuario/:userId', async (req, res) => {
  const userId = req.cookies.userId;

  try {
    // Consulte o banco de dados para buscar os pedidos do usuário com base no userId
    const pedidosDoUsuario = await Pedidos.findAll({
      where: {
        idUserPed: userId,
      },
    });

    // Renderize a página HTML de pedidos-usuario e passe os pedidos como JSON
    res.json({ pedidos: pedidosDoUsuario });
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos do usuário', message: error.message });
  }
});


app.post("/cadastrar", async (req, res) => { 

    try {
        const { userCad, cpfCad, endereçoCad, cepCad, cidadeCad, estadoCad, inscricaoEstadualCad, telefoneCad, emailCad, passCad } = req.body;
        const hashedPassword = await bcrypt.hash(passCad, 10);

            // Verifique se já existe um usuário com o mesmo CPF, email ou senha
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { emailCad: emailCad },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Já existe um usuário com este e-mail cadastrado",
      });
    }

        const newUser = await User.create({
            userCad: userCad,
            cpfCad: cpfCad,
            endereçoCad: endereçoCad,
            cepCad: cepCad,
            cidadeCad: cidadeCad,
            estadoCad: estadoCad,
            inscricaoEstadualCad: inscricaoEstadualCad,
            telefoneCad: telefoneCad,
            emailCad: emailCad,
            passCad: hashedPassword
        });

        res.json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
        
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});

app.get("/login", (req, res) => {
    const filePath = path.join(__dirname, 'html', 'form.html');
    res.sendFile(filePath);
});

app.post("/login", async (req, res) => {
    try {
      const { emailCad, passCad } = req.body;
  
      // Verifique se o usuário existe no banco de dados
      const user = await User.findOne({ where: { emailCad: emailCad} });
  
      if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      const passwordMatch = await bcrypt.compare(passCad, user.passCad);
  
      // Verifique se a senha está correta
      if (!passwordMatch) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      res.cookie('userCad', user.userCad);
      res.cookie("userId", user.id);
  
      // Gere um token de autenticação (exemplo simples)
      const token = Math.random().toString(16).substring(2);
  
      res.json({ message: "Login bem-sucedido", token: token });
      console.log(token)
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ message: "Erro ao Fazer o Login <br> Preencha os Campos Corretamente" });
    }
  });
  

  app.get("/logout", (req, res) => {
    // Verifique se o usuário está autenticado (você pode usar middleware de autenticação aqui)
    if (!req.cookies.userCad) {
        // Se o usuário não estiver autenticado, redirecione para a página de login ou onde desejar
        return res.redirect("/login");
    }

    // Excluir o cookie "userCad"
    res.clearCookie("userCad");

    // Redirecionar para a página de login ou para onde desejar
    res.redirect("html/form.html");
});


app.get('/cadastrar-produto', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'cad-prods.html');
  res.sendFile(filePath);
});

// Rota para processar o envio do formulário
app.post('/cadastrar-produto', upload.single('imgProd'), async (req, res) => {
  try {
    const { nomeProd, descProd, valorProd, categoriaProd } = req.body;
    const imgProd = req.file; // O arquivo de imagem é acessado aqui

    // Insira os dados na tabela Produtos
    const novoProduto = await Produtos.create({
      nomeProd: nomeProd,
      descProd: descProd,
      valorProd: valorProd,
      categProd: categoriaProd,
      imgProd: imgProd ? imgProd.buffer : null, // Armazena a imagem como buffer
    });

    const categoria = categoriaProd.toLowerCase().replace(/ /g, '-'); // Transforma a categoria em formato de URL
    res.json({
      message: 'Produto cadastrado com sucesso',
      produto: novoProduto,
      categoria: categoria,// Envie a categoria de volta como parte da resposta
    });
  } catch (error) {
    console.error('Erro ao cadastrar o produto:', error);
    res.status(500).json({ error: 'Erro ao cadastrar o produto', message: error.message });
  }
});

//ROTAS DAS MINHAS PÁGINAS DE PRODUTOS

app.get('/comunicação-visual', async (req, res) => {
  const filePath = path.join(__dirname, 'html', 'comunicacao-visual.html');
  res.sendFile(filePath);

  try {
    // Consulta o banco de dados para obter os produtos de Comunicação Visual
    const produtosComunicacaoVisual = await Produtos.findAll({
      where: {
        categProd: 'Comunicação Visual',
      },
    });

    // Renderiza a página HTML com os produtos em cards
    res.render('comunicacao-visual', {
      produtos: produtosComunicacaoVisual,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/api/produtos/comunicacao-visual', async (req, res) => {
  try {
    // Consulta o banco de dados para obter os produtos de Comunicação Visual
    const produtosComunicacaoVisual = await Produtos.findAll({
      where: {
        categProd: 'Comunicação Visual',
      },
    });

    // Envia os produtos como resposta JSON
    res.json({ produtos: produtosComunicacaoVisual });
  } catch (error) {
    console.error('Erro ao buscar produtos de Comunicação Visual:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

//ROTA PARA IMAGENS DOS PRODUTOS

app.get('/imagens/:id', async (req, res) => {
  try {
    const idDoProduto = req.params.id;

    // Consulta o banco de dados para obter a imagem do produto pelo ID
    const produto = await Produtos.findByPk(idDoProduto);

    if (!produto || !produto.imgProd) {
      // Se o produto não for encontrado ou não houver imagem, envie uma resposta de erro 404
      return res.status(404).send('Imagem não encontrada');
    }

    const imgBuffer = produto.imgProd;

    // Detecta a extensão da imagem com base no tipo de arquivo
    let extensao = 'jpg'; // Default para JPEG
    if (imgBuffer[0] === 0x89 && imgBuffer[1] === 0x50 && imgBuffer[2] === 0x4E && imgBuffer[3] === 0x47) {
      extensao = 'png'; // Se os primeiros bytes correspondem a PNG, use PNG
    }

    // Define o cabeçalho da resposta com base na extensão
    res.setHeader('Content-Type', `image/${extensao}`);

    // Envie a imagem como resposta
    res.end(imgBuffer);
  } catch (error) {
    console.error('Erro ao buscar imagem do produto:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


app.get('/adesivos-etiquetas', async (req, res) => {
  const filePath = path.join(__dirname, 'html', 'adesivos-etiquetas.html');
  res.sendFile(filePath);

  try {
    // Consulta o banco de dados para obter os produtos de Adesivos e Etiquetas
    const produtosAdesivosEtiquetas = await Produtos.findAll({
      where: {
        categProd: 'Adesivos e Etiquetas',
      },
    });

    // Renderiza a página HTML com os produtos em cards
    res.render('adesivos-etiquetas', {
      produtos: produtosAdesivosEtiquetas,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/api/produtos/adesivos-etiquetas', async (req, res) => {
  try {
    // Consulta o banco de dados para obter os produtos de Adesivos e Etiquetas
    const produtosAdesivosEtiquetas = await Produtos.findAll({
      where: {
        categProd: 'Adesivos e Etiquetas',
      },
    });

    // Envia os produtos como resposta JSON
    res.json({ produtos: produtosAdesivosEtiquetas });
  } catch (error) {
    console.error('Erro ao buscar produtos de Adesivos e Etiquetas:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/brindes', async(req, res) => {
  const filePath = path.join(__dirname, 'html', 'brindes.html');
  res.sendFile(filePath);

  try {
    // Consulta o banco de dados para obter os produtos de Brindes
    const produtosBrindes = await Produtos.findAll({
      where: {
        categProd: 'Brindes',
      },
    });

    // Renderiza a página HTML com os produtos em cards
    res.render('brindes', {
      produtos: produtosBrindes,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/api/produtos/brindes', async (req, res) => {
  try {
    // Consulta o banco de dados para obter os produtos de Brindes
    const produtosBrindes = await Produtos.findAll({
      where: {
        categProd: 'Brindes',
      },
    });

    // Envia os produtos como resposta JSON
    res.json({ produtos: produtosBrindes });
  } catch (error) {
    console.error('Erro ao buscar produtos de Brindes:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/cartazes', async(req, res) => {
  const filePath = path.join(__dirname, 'html', 'cartazes.html');
  res.sendFile(filePath);

  try {
    // Consulta o banco de dados para obter os produtos de Catazes
    const produtosCartazes = await Produtos.findAll({
      where: {
        categProd: 'Cartazes',
      },
    });

    // Renderiza a página HTML com os produtos em cards
    res.render('cartazes', {
      produtos: produtosCartazes,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }

});

app.get('/api/produtos/cartazes', async (req, res) => {
  try {
    // Consulta o banco de dados para obter os produtos de Cartazes
    const produtosCartazes = await Produtos.findAll({
      where: {
        categProd: 'Cartazes',
      },
    });

    // Envia os produtos como resposta JSON
    res.json({ produtos: produtosCartazes });
  } catch (error) {
    console.error('Erro ao buscar produtos de Cartazes:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/papelaria', async(req, res) => {
  const filePath = path.join(__dirname, 'html', 'papelaria.html');
  res.sendFile(filePath);

  try {
    // Consulta o banco de dados para obter os produtos de Catazes
    const produtosPapelaria = await Produtos.findAll({
      where: {
        categProd: 'Papelaria',
      },
    });

    // Renderiza a página HTML com os produtos em cards
    res.render('papelaria', {
      produtos: produtosPapelaria,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }

});

app.get('/api/produtos/papelaria', async (req, res) => {
  try {
    // Consulta o banco de dados para obter os produtos de Cartazes
    const produtosPapelaria = await Produtos.findAll({
      where: {
        categProd: 'Papelaria',
      },
    });

    // Envia os produtos como resposta JSON
    res.json({ produtos: produtosPapelaria });
  } catch (error) {
    console.error('Erro ao buscar produtos de Papelaria:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
  }
});

app.get('/pesquisar-produtos', async (req, res) => {
  try {
    const { query } = req.query;

    // Realize a pesquisa de produtos usando o operador "like" para correspondência parcial
    const produtos = await Produtos.findAll({
      where: {
        nomeProd: {
          [Op.like]: `%${query}%`
        }
      }
    });

    res.json({ produtos });
  } catch (error) {
    console.error('Erro na pesquisa de produtos:', error);
    res.status(500).json({ error: 'Erro na pesquisa de produtos', message: error.message });
  }
});

app.get('/produto/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const produto = await Produtos.findByPk(productId); // Use o método correto para buscar o produto

    if (!produto) {
      res.status(404).json({ mensagem: 'Produto não encontrado' });
    } else {
      res.json({
        id: produto.id,
        nomeProd: produto.nomeProd,
        descProd: produto.descProd,
        valorProd: produto.valorProd,
        // Adicione outras propriedades do produto conforme necessário
      });
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do produto:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
}); 

app.get('/perfil', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'perfil.html');
  res.sendFile(filePath);
});


app.post('/adicionar-ao-carrinho/:produtoId', async (req, res) => {
  try {
    const produtoId = req.params.produtoId;
    const { quantidade } = req.body; // A quantidade do produto a ser adicionada

    // Verifique se a quantidade é um número válido
    if (typeof quantidade !== 'number' || quantidade <= 0) {
      return res.status(400).json({ message: 'Quantidade inválida' });
    }

    // Consulte o banco de dados para obter as informações do produto
    const produto = await Produtos.findByPk(produtoId);

    // Verifique se o produto existe
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Inicialize o carrinho se ainda não existir na sessão
    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }

    // Verifique se o produto já está no carrinho
    const produtoNoCarrinho = req.session.carrinho.find((item) => item.produtoId === produto.id);

    if (produtoNoCarrinho) {
      // Se o produto já estiver no carrinho, atualize a quantidade
      produtoNoCarrinho.quantidade += quantidade;
      produtoNoCarrinho.subtotal = produtoNoCarrinho.quantidade * produto.valorProd;
    } else {
      // Caso contrário, adicione o produto ao carrinho
      req.session.carrinho.push({
        produtoId: produto.id,
        nomeProd: produto.nomeProd,
        quantidade: quantidade,
        valorUnitario: produto.valorProd,
        subtotal: quantidade * produto.valorProd,
      });
    }

    // Responda com uma mensagem de sucesso e o carrinho atualizado
    res.json({ message: 'Produto adicionado ao carrinho com sucesso', carrinho: req.session.carrinho });
  } catch (error) {
    console.error('Erro ao adicionar o produto ao carrinho:', error);
    res.status(500).json({ message: 'Erro ao adicionar o produto ao carrinho' });
  }
});

app.get('/carrinho', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'carrinho.html');
  res.sendFile(filePath);
});

app.get('/api/carrinho', (req, res) => {
  try {
    // Obtenha os dados do carrinho da sessão
    const carrinho = req.session.carrinho || [];

    // Envie os dados do carrinho como resposta em JSON
    res.json(carrinho);
  } catch (error) {
    console.error('Erro ao obter os dados do carrinho:', error);
    res.status(500).json({ message: 'Erro ao obter os dados do carrinho' });
  }
});

app.post('/atualizar-carrinho/:userId', async (req, res) => {
  const { userId } = req.cookies.userId;
  const { carrinho: novoCarrinho } = req.body;

  try {
    // Faça o processamento necessário para atualizar o carrinho com o novoCarrinho
    // Aqui, você pode atualizar o carrinho no banco de dados, se aplicável

    // Após atualizar o carrinho, você pode enviar uma resposta de sucesso
    res.json({ message: 'Carrinho atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o carrinho:', error);
    res.status(500).json({ error: 'Erro ao atualizar o carrinho', message: error.message });
  }
});

app.delete('/remover-do-carrinho/:produtoId', (req, res) => {
  try {
    const produtoId = req.params.produtoId;

    // Verifique se o carrinho existe na sessão
    if (!req.session.carrinho) {
      return res.status(400).json({ message: 'Carrinho vazio' });
    }

    // Encontre o índice do produto no carrinho
    const index = req.session.carrinho.findIndex(item => item.produtoId == produtoId);

    if (index === -1) {
      return res.status(404).json({ message: 'Produto não encontrado no carrinho' });
    }

    // Remova o produto do carrinho
    req.session.carrinho.splice(index, 1);

    // Responda com uma mensagem de sucesso
    res.json({ message: 'Produto removido do carrinho com sucesso' });
  } catch (error) {
    console.error('Erro ao remover o produto do carrinho:', error);
    res.status(500).json({ message: 'Erro ao remover o produto do carrinho' });
  }
});

app.get('/pagamento', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'pagamento.html');
  res.sendFile(filePath);
});

app.post('/criar-pedidos', async (req, res) => {
  try {
    // Obtenha o carrinho da sessão (supondo que você o tenha configurado na sessão)
    const carrinho = req.session.carrinho || [];

    // Calcule o valor total do carrinho
    let totalAPagar = 0;
    for (const produtoNoCarrinho of carrinho) {
      // Encontre o produto no banco de dados com base no ID do produto no carrinho
      const produto = await Produtos.findByPk(produtoNoCarrinho.produtoId);

      // Calcule o valor total do produto no carrinho e some ao total
      totalAPagar += produto.valorProd * produtoNoCarrinho.quantidade;
    }

    // Crie um pedido para cada produto no carrinho
    const pedidosCriados = await Promise.all(
      carrinho.map(async (produtoNoCarrinho) => {
        // Encontre o produto no banco de dados com base no ID do produto no carrinho
        const produto = await Produtos.findByPk(produtoNoCarrinho.produtoId);

        // Crie um pedido com as informações do produto e quantidade do carrinho
        const pedido = await Pedidos.create({
          idUserPed: req.cookies.userId,
          nomePed: produto.nomeProd,
          quantPed: produtoNoCarrinho.quantidade,
          valorPed: totalAPagar,
          statusPed: 'Aguardando'
        });

        return pedido;
      })
    );

    // Limpe o carrinho após a criação dos pedidos (se desejado)
    // Isso depende de como você gerencia o carrinho na sua aplicação

    res.json({ message: 'Pedidos criados com sucesso', pedidos: pedidosCriados });
  } catch (error) {
    console.error('Erro ao criar pedidos:', error);
    res.status(500).json({ error: 'Erro ao criar pedidos' });
  }
});

// Exemplo de rota no servidor Node.js
app.post('/atualizar-status-pedido', async (req, res) => {
  try {
      const { pedidoId, novoStatus } = req.body;

      // Atualize o status do pedido no banco de dados
      const pedido = await Pedidos.findByPk(pedidoId);
      if (!pedido) {
          return res.json({ success: false, message: 'Pedido não encontrado.' });
      }

      pedido.statusPed = novoStatus;
      await pedido.save();

      return res.json({ success: true });
  } catch (error) {
      console.error('Erro ao atualizar o status do pedido:', error);
      return res.json({ success: false, message: 'Erro ao atualizar o status do pedido.' });
  }
});

app.get('/email', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'email.html');
  res.sendFile(filePath);
});

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "gabrieldiastrin63@gmail.com",
    pass: "zigx xacx viea ikfl"
  }
})
//Enviando E-mail
app.post('/enviar-email', (req, res) => {
  const { emailEsq } = req.body;

  const mensagemEmail = {
    from: 'gabrieldiastrin63@gmail.com',
    to: emailEsq,
    subject: 'Assunto do E-mail',
    html: '<img class="logo-imprimeai" src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F9b0187d5429aadeb33d266a8f3913fff.cdn.bubble.io%2Ff1630964515068x903204082016482200%2Flogo1.2.png?w=256&h=60&auto=compress&fit=crop&dpr=1" alt="..."><br><h1>Olá, Usuário</h1> <p>Você acabou de receber um e-mail para Redefinir sua Senha</p><br> <p>Clique neste link para redefini-lá</p><br><a href="http://localhost:8080/html/redefinicaosenha.html">Redefinir Senha</a>',
    text: "Olá Usuário, Você acabou de receber um e-mail para Redefinir sua Senha"
  };

  transport.sendMail(mensagemEmail)
    .then(() => {
      const token = Math.random().toString(16).substring(2) //jwt.sign({email: emailEsq}, 'seuSegredo')
      console.log('E-mail enviado com sucesso!', emailEsq, token);
      res.json({ message: 'E-mail enviado com sucesso!', emailEsq, token });
    })
    .catch((err) => {
      console.log('Não foi possível enviar o e-mail!', err);
      res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
    });
});

app.get('/email-aprovado', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'email-aprovado.html');
  res.sendFile(filePath);
});

app.post('/redefinir-senha', async (req, res) => {
  const { email, newPass } = req.body;


  const user = await User.findOne({ where: { emailCad: email } });

  if (!user) {
      return res.status(404).json({ message: 'Usuário não existe!' });
  }

  // Criptografando a nova Senha
  const hashedPassword = bcrypt.hashSync(newPass, 10);
  user.passCad = hashedPassword; // passCad irá ser igual a hashedPassword
  await user.save();

  return res.status(200).json({ message: 'Senha redefinida Com Sucesso!' });
});

app.get("/perfil/dados", async (req, res) => {
  try {
    // Verifique se o cookie "userId" está definido
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Use o modelo User para buscar o usuário no banco de dados pelo ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Retorna os dados do usuário como JSON
    res.json({
      emailCad: user.emailCad,
      cepCad: user.cepCad,
      cidadeCad: user.cidadeCad,
      estadoCad: user.estadoCad,
      endereçoCad: user.endereçoCad,
      telefoneCad: user.telefoneCad,
    });
  } catch (error) {
    console.error("Erro ao buscar os dados do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});
app.get('/graficas-cadastradas', async (req, res) => {
  try {
    // Consulte o banco de dados para buscar os cartões cadastrados
    const graficasCadastradas = await Graficas.findAll();

    // Envie os cartões como resposta em JSON
    res.json({ graficas: graficasCadastradas });
  } catch (error) {
    console.error('Erro ao buscar graficas cadastradas:', error);
    res.status(500).json({ error: 'Erro ao buscar graficas cadastradas', message: error.message });
  }
});

app.listen(8080, () => {
    console.log(`Servidor rodando na porta ${PORT}  http://localhost:8080`);
});