const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const axios = require('axios')
const User = require('./models/User');
const Produtos = require('./models/Produtos');
const multer = require('multer');
const { where } = require('sequelize');
const ejs = require('ejs');

// Configurar o mecanismo de template EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const cookieParser = require('cookie-parser');
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

app.get("/cep", (req, res) => {
  res.sendFile(__dirname + "/cep.html"); // Verifique o caminho do arquivo
});

// Adicione uma rota GET para servir a página de cadastro
app.get("/cadastrar", (req, res) => {
    const filePath = path.join(__dirname, 'html', 'cadastro.html');
    res.sendFile(filePath);
});

app.post("/cadastrar", async (req, res) => {

    try {
        const { userCad, emailCad, passCad } = req.body;

        const newUser = await User.create({
            userCad: userCad,
            emailCad: emailCad,
            passCad: passCad
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
  
      // Verifique se a senha está correta
      if (passCad !== user.passCad) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      res.cookie('userCad', user.userCad);
  
      // Gere um token de autenticação (exemplo simples)
      const token = Math.random().toString(16).substring(2);
  
      res.json({ message: "Login bem-sucedido", token: token });
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
    res.redirect("/login");
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

app.get('/cartazes', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'cartazes.html');
  res.sendFile(filePath);
});

app.get('/papelaria', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'papelaria.html');
  res.sendFile(filePath);
});
app.listen(8080, () => {
    console.log(`Servidor rodando na porta ${PORT}  http://localhost:8080`);
    /*console.log('Servido de Cadastro rodando na Porta 8080 http://localhost:8080/html/cadastro.html')
    console.log('Servido de Login rodando na Porta 8080 http://localhost:8080/html/form.html')
    console.log('Servidor de buscar rodando na Porta 8080 http://localhost:8080/cep.html')
    console.log('Serivdor de Cadastro de Produtos rodando na Porta 8080 http://localhost:8080/html/cad-prods.html')*/
});
