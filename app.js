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
const Enderecos = require('./models/Enderecos');
const ItensPedido = require('./models/ItensPedido');
const VariacoesProduto = require('./models/VariacoesProduto');
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
const XLSX = require('xlsx');
const Sequelize = require('sequelize');
const msGraph = require('@microsoft/microsoft-graph-client');
const cors = require('cors')
app.use(cors());


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
const ItensPedidos = require('./models/ItensPedido');


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

app.get("/local-entrega", (req, res) => {
  res.sendFile(__dirname + "html", "local-entrega.html"); // Verifique o caminho do arquivo
});

app.get("/detalhes-pedidos", (req, res) => {
  res.sendFile(__dirname + "html", "detalhes-pedidos.html"); // Verifique o caminho do arquivo
});

app.get("/pedAceitosGraf", (req,res) => {
  res.sendFile(__dirname + "html", "pedAceitosGraf.html")
})

app.get("/pedFinalizadosGraf", (req,res) => {
  res.sendFile(__dirname+ "html","pedFinalizadosGraf.html")
})

app.get('/pedidos-aceitos-grafica', async (req, res) => {
  try {
    const graficaId = req.cookies.userId; // Assuming the graphics company's ID is stored in a cookie

    if (!graficaId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    // Query the database for orders with status "Pedido Aceito Pela Gráfica" and associated data
    const pedidosAceitos = await Pedidos.findAll({
      where: {
        statusPed: 'Pedido Aceito Pela Gráfica',
        graficaAtend: graficaId, // Filter by the ID of the graphics company
      },
      include: [
        {
          model: Enderecos,
          attributes: ['rua', 'cep', 'estado', 'numero', 'complemento', 'bairro', 'cidade'],
        },
        {
          model: ItensPedido,
          attributes: ['idPed', 'idProduto', 'nomeProd', 'quantidade', 'valorProd', 'acabamento', 'cor', 'enobrecimento', 'formato', 'material', 'arquivo', 'raio', 'statusPed'],
        },
      ],
    });

    // Return the filtered orders with associated data as JSON
    return res.json({ success: true, pedidos: pedidosAceitos });
  } catch (error) {
    console.error('Erro ao obter pedidos aceitos:', error);
    return res.json({ success: false, message: 'Erro ao obter pedidos aceitos.' });
  }
});

app.get('/pedidos-finalizados-grafica', async (req,res) => {
  try {
    const graficaId = req.cookies.userId; // Assuming the graphics company's ID is stored in a cookie

    if (!graficaId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }
    // Query the database for orders with status "Pedido Aceito Pela Gráfica" and associated data
    const pedidosAceitos = await Pedidos.findAll({
      where: {
        statusPed: 'Finalizado',
        graficaAtend: graficaId, // Filter by the ID of the graphics company
      },
      include: [
        {
          model: Enderecos,
          attributes: ['rua', 'cep', 'estado', 'numero', 'complemento', 'bairro', 'cidade'],
        },
        {
          model: ItensPedido,
          attributes: ['idPed', 'idProduto', 'nomeProd', 'quantidade', 'valorProd', 'acabamento', 'cor', 'enobrecimento', 'formato', 'material', 'arquivo', 'raio', 'statusPed'],
        },
      ],
    });

    // Return the filtered orders with associated data as JSON
    return res.json({ success: true, pedidos: pedidosAceitos });
  } catch (error) {
    console.error('Erro ao obter pedidos aceitos:', error);
    return res.json({ success: false, message: 'Erro ao obter pedidos aceitos.' });
  }
})

app.post('/upload-to-dropbox', async (req, res) => {
  const { file, accessToken } = req.body;

  try {
    const uploadResponse = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: '/' + file.name,
          mode: 'add',
          autorename: true,
          mute: false,
        }),
      },
      body: file,
    });

    const uploadData = await uploadResponse.json();
    res.json(uploadData);
  } catch (error) {
    console.error('Erro no upload para o Dropbox:', error);
    res.status(500).json({ error: 'Erro no upload para o Dropbox' });
  }
});
app.post('/atualizar-endereco-entrega', async (req, res) => {
  const idPedido = req.body.pedidoId;
  const idGrafica = req.cookies.userId;

  try {
    // Verificar se o pedido existe
    const pedido = await Pedidos.findByPk(idPedido);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Verificar se o pedido pertence à gráfica que está realizando a requisição
    if (pedido.idGrafica !== idGrafica) {
      return res.status(403).json({ error: 'Acesso não autorizado para este pedido' });
    }

    // Verificar se o endereço do pedido indica "Entrega a Retirar na Loja"
    if (pedido.endereco.tipoEntrega === 'Entrega a Retirar na Loja') {
      // Buscar a gráfica no banco de dados usando o idGrafica
      const grafica = await Graficas.findByPk(idGrafica);

      if (!grafica) {
        return res.status(404).json({ error: 'Gráfica não encontrada' });
      }

      // Atualizar o endereço do pedido com os dados da gráfica
      pedido.endereco = {
        rua: grafica.enderecoCad,
        cidade: grafica.cidadeCad,
        estado: grafica.estadoCad,
        cep: grafica.cepCad,
        tipoEntrega: 'Entrega a Retirar na Loja',
      };

      // Salvar as alterações no banco de dados
      await pedido.save();

      // Retornar uma resposta de sucesso
      res.json({ success: true, message: 'Endereço de entrega atualizado com sucesso' });
    } else {
      // Se o endereço não for "Entrega a Retirar na Loja", retornar uma mensagem indicando que não é necessário atualizar
      res.json({ success: false, message: 'Endereço de entrega já está atualizado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o endereço de entrega:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
    res.cookie('userId', grafica.id)

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
    const graficaId = req.cookies.userId;

    if (!graficaId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const grafica = await Graficas.findByPk(graficaId);

    if (!grafica) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const graficaInfo = {
      cepCad: grafica.cepCad,
      cidadeCad: grafica.cidadeCad,
      estadoCad: grafica.estadoCad,
      enderecoCad: grafica.endereçoCad,
    };

    console.log('Informações da Gráfica:', graficaInfo);

    const apiKey = 'Ao6IBGy_Nf0u4t9E88BYDytyK5mK3kObchF4R0NV5h--iZ6YgwXPMJEckhAEaKlH';

    const coordinates = await getCoordinatesFromAddress(graficaInfo, apiKey);

    console.log('Latitude da gráfica:', coordinates.latitude);
    console.log('Longitude da gráfica:', coordinates.longitude);

    const pedidosCadastrados = await ItensPedido.findAll({
      where: {
        statusPed: 'Aguardando',
      },
    });
    const enderecosPedCadastrados = await Enderecos.findAll();

    // Mapeamento de endereços por idPed para otimizar a busca
    const enderecoMap = new Map();
    enderecosPedCadastrados.forEach(endereco => {
      enderecoMap.set(endereco.idPed, endereco);
    });

    let found = false;
    let pedidosNoRaio = [];

    for (let pedido of pedidosCadastrados) {
      const enderecoPedido = enderecoMap.get(pedido.idPed);

      if (!enderecoPedido) {
        console.log(`Endereço não encontrado para o pedido com Id: ${pedido.idPed}`);
        continue;
      }

      const raio = pedido.raio; // Agora acessamos diretamente o raio do pedido

      const enderecoEntregaInfo = {
        rua: enderecoPedido.rua,
        cep: enderecoPedido.cep,
        cidade: enderecoPedido.cidade,
        estado: enderecoPedido.estado,
      };

      console.log(`Verificando pedido com o Id: ${pedido.idPed}`);
      console.log(`Endereço de Entrega do pedido com o Id: ${pedido.idPed}`, enderecoEntregaInfo);

      const coordinatesEnd = await getCoordinatesFromAddressEnd(enderecoEntregaInfo, apiKey);

      if (coordinatesEnd.latitude !== null && coordinatesEnd.longitude !== null) {
        console.log(`Latitude do Endereço de Entrega (raio ${raio} km):`, coordinatesEnd.latitude);
        console.log(`Longitude do Endereço de Entrega (raio ${raio} km):`, coordinatesEnd.longitude);

        const distance = haversineDistance(coordinates.latitude, coordinates.longitude, coordinatesEnd.latitude, coordinatesEnd.longitude);

        if (distance <= raio) {
          console.log(`Distância entre a gráfica e o endereço de entrega (raio ${raio} km):`, distance, 'km');
          pedidosNoRaio.push(pedido);
          found = true; // Marcamos como encontrado pelo menos um pedido dentro do raio
        }
      } else {
        console.log(`Coordenadas nulas para o Endereço de Entrega (raio ${raio} km).`);
      }
    }

    if (found) {
      console.log('Pedidos dentro do raio:', pedidosNoRaio);
      res.json({ pedidos: pedidosNoRaio });
    } else {
      console.log('Nenhum pedido encontrado dentro dos raios permitidos.');
      res.json({ message: 'Nenhum pedido encontrado dentro dos raios permitidos.' });
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos cadastrados:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos cadastrados', message: error.message });
  }
});

// Função para calcular a distância haversine entre duas coordenadas geográficas
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em quilômetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Função para obter coordenadas geográficas (latitude e longitude) a partir do endereço usando a API de Geocodificação do Bing Maps
async function getCoordinatesFromAddress(graficaInfo, apiKey) {
  const { enderecoCad, cepCad, cidadeCad, estadoCad } = graficaInfo;
  const formattedAddress = `${enderecoCad}, ${cepCad}, ${cidadeCad}, ${estadoCad}`;
  const geocodingUrl = `https://dev.virtualearth.net/REST/v1/Locations/${encodeURIComponent(formattedAddress)}?o=json&key=${apiKey}`;

  try {
    const response = await fetch(geocodingUrl);

    if (!response.ok) {
      throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.resourceSets.length > 0 && data.resourceSets[0].resources.length > 0) {
      const coordinates = data.resourceSets[0].resources[0].point.coordinates;
      return { latitude: coordinates[0], longitude: coordinates[1] };
    } else {
      console.error('Nenhum resultado de geocodificação encontrado para o endereço:', formattedAddress);
      return { latitude: null, longitude: null };
    }
  } catch (error) {
    console.error('Erro ao obter coordenadas de geocodificação:', error.message);
    return { latitude: null, longitude: null, errorMessage: error.message };
  }
}

async function getCoordinatesFromAddressEnd(enderecoEntregaInfo, apiKey) {
  const {rua, cep, estado, cidade} = enderecoEntregaInfo;
  const formattedAddressEnd = `${rua}, ${cep}, ${cidade}, ${estado}`;
  const geocodingUrlEnd = `https://dev.virtualearth.net/REST/v1/Locations/${encodeURIComponent(formattedAddressEnd)}?o=json&key=${apiKey}`

  try {
    const response = await fetch(geocodingUrlEnd);

    if (!response.ok) {
      throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.resourceSets.length > 0 && data.resourceSets[0].resources.length > 0) {
      const coordinates = data.resourceSets[0].resources[0].point.coordinates;
      return { latitude: coordinates[0], longitude: coordinates[1] };
    } else {
      console.error('Nenhum resultado de geocodificação encontrado para o endereço:', formattedAddressEnd);
      return { latitude: null, longitude: null };
    }
  }catch (error) {
    console.error('Erro ao obter coordenadas de geocodificação:', error.message);
    return { latitude: null, longitude: null, errorMessage: error.message };
  }
}

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
        const { userCad, cpfCad, endereçoCad, numCad, compCad, bairroCad, cepCad, cidadeCad, estadoCad, inscricaoEstadualCad, telefoneCad, emailCad, passCad } = req.body;
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
            numCad: numCad,
            compCad: compCad,
            bairroCad: bairroCad,
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
    res.clearCookie("userId");

    // Redirecionar para a página de login ou para onde desejar
    res.redirect("html/form.html");
});


app.get('/cadastrar-produto', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'cad-prods.html');
  res.sendFile(filePath);
});

// Rota para processar o envio do formulário
/*app.post('/cadastrar-produto', upload.single('imgProd'), async (req, res) => {
  try {
    const { nomeProd, descProd, valorProd, categoriaProd, raioProd } = req.body;
    const imgProd = req.file; // O arquivo de imagem é acessado aqui

    // Insira os dados na tabela Produtos
    const novoProduto = await Produtos.create({
      nomeProd: nomeProd,
      descProd: descProd,
      valorProd: valorProd,
      categProd: categoriaProd,
      raioProd: raioProd,
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
});*/
app.post('/cadastrar-produto', upload.single('imgProd'), async (req, res) => {
  try {
    const {
      nomeProd,
      descProd,
      valorProd,
      categoriaProd,
      raioProd,
      material,
      formato,
      enobrecimento,
      cor,
      acabamento
    } = req.body;
    const imgProd = req.file;

    // Insira os dados na tabela Produtos
    const novoProduto = await Produtos.create({
      nomeProd: nomeProd,
      descProd: descProd,
      valorProd: valorProd,
      categProd: categoriaProd,
      raioProd: raioProd,
      imgProd: imgProd ? imgProd.buffer : null,
    });

    // Converte arrays para strings JSON
    const materialJSON = JSON.stringify(material.split(','));
    const formatoJSON = JSON.stringify(formato.split(','));
    const enobrecimentoJSON = JSON.stringify(enobrecimento.split(','));
    const corJSON = JSON.stringify(cor.split(','));
    const acabamentoJSON = JSON.stringify(acabamento.split(','));

    // Insira os dados na tabela de VariaçõesProduto
    const variacoesProduto = await VariacoesProduto.create({
      idProduto: novoProduto.id,
      material: materialJSON,
      formato: formatoJSON,
      enobrecimento: enobrecimentoJSON,
      cor: corJSON,
      acabamento: acabamentoJSON,
    });

    const categoria = categoriaProd.toLowerCase().replace(/ /g, '-');
    res.json({
      message: 'Produto cadastrado com sucesso',
      produto: novoProduto,
      variacoes: variacoesProduto,
      categoria: categoria,
    });
  } catch (error) {
    console.error('Erro ao cadastrar o produto:', error);
    res.status(500).json({
      error: 'Erro ao cadastrar o produto',
      message: error.message,
    });
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
        raioProd: produto.raioProd,
        // Adicione outras propriedades do produto conforme necessário
      });
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do produto:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
}); 

app.get('/variacoes-produto/:id', async (req, res) => {
  try {
    const produtoId = parseInt(req.params.id);

    // Buscar as variações do produto com base no ID do produto
    const variacoes = await VariacoesProduto.findAll({
      where: { idProduto: produtoId }
    });

    res.json(variacoes);
  } catch (error) {
    console.error('Erro ao buscar variações do produto:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

app.get('/detalhes-pedido/:idPedido/:idProduto', async (req, res) => {
  try {
    const { idPedido, idProduto } = req.params;

    // Buscar detalhes do pedido
    const pedido = await Pedidos.findByPk(idPedido, {
      include: [
        {
          model: ItensPedido,
          where: { idPed: idPedido, idProduto: idProduto },
          include: [
            {
              model: Produtos,
              attributes: ['id', 'nomeProd', 'descProd', 'valorProd', 'categProd', 'raioProd', 'imgProd'],
            },
          ],
        },
        {
          model: Enderecos,
          where: { idPed: idPedido, idProduto: idProduto },
          include: [
            {
              model: Produtos,
              attributes: ['id'], // Adicione outros atributos do Produto conforme necessário
            },
          ],
          distinct: true, // Garante endereços distintos
        },
        // ... outras associações necessárias
      ],
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Agora que temos o pedido, buscamos o usuário correspondente
    const { idUserPed } = pedido;
    const usuario = await User.findByPk(idUserPed);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Respondendo com os detalhes do pedido e informações do usuário
    res.json({ pedido, usuario });

  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do pedido' });
  }
});



app.get('/imagem-produto/:id', async (req, res) => {
  try {
    const idProduto = req.params.id;
    
    // Busca o produto no banco de dados pelo ID
    const produto = await Produtos.findByPk(idProduto);

    if (!produto || !produto.imgProd) {
      // Se o produto ou a imagem não existir, envie uma imagem padrão ou retorne um erro
      return res.status(404).sendFile('caminho/para/imagem_padrao.jpg', { root: __dirname });
    }

    // Converte o BLOB para uma URL de imagem e envia como resposta
    const imagemBuffer = Buffer.from(produto.imgProd, 'binary');
    res.set('Content-Type', 'image/jpeg'); // Altere conforme o tipo de imagem que você está armazenando
    res.send(imagemBuffer);
  } catch (error) {
    console.error('Erro ao buscar imagem do produto:', error);
    res.status(500).send('Erro ao buscar imagem do produto');
  }
});

app.get('/perfil', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'perfil.html');
  res.sendFile(filePath);
});


app.post('/adicionar-ao-carrinho/:produtoId', async (req, res) => {
  try {
    const produtoId = req.params.produtoId;
    const { quantidade, ...variacoesSelecionadas } = req.body; // A quantidade do produto a ser adicionada

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
        raioProd: produto.raioProd,
        acabamento: variacoesSelecionadas.acabamento,
        cor: variacoesSelecionadas.cor,
        enobrecimento: variacoesSelecionadas.enobrecimento,
        formato: variacoesSelecionadas.formato,
        material: variacoesSelecionadas.material,
      });
    }

    // Responda com uma mensagem de sucesso e o carrinho atualizado
    res.json({ message: 'Produto adicionado ao carrinho com sucesso', carrinho: req.session.carrinho });
    console.log(req.session.carrinho)
  } catch (error) {
    console.error('Erro ao adicionar o produto ao carrinho:', error);
    res.status(500).json({ message: 'Erro ao adicionar o produto ao carrinho' });
  }
});
app.use(cors());
app.post('/api/salvarArquivo', upload.single('arquivo'), async (req, res) => {
  try {
    const produtoId = parseInt(req.body.produtoId, 10);
    const { linkDownload } = req.body;

    //console.log('Link de Download recebido no servidor:', linkDownload);

    // Lógica para atualizar o produto no carrinho com o arquivo e o link de download recebidos
    const produtoNoCarrinho = req.session.carrinho.find((item) => item.produtoId === produtoId);

    if (produtoNoCarrinho) {
      // Atualize o produto com as informações do arquivo e link de download
      //produtoNoCarrinho.arquivo = req.file.originalname;
      produtoNoCarrinho.arquivo = linkDownload;

      console.log(`Arquivo  e link de download salvos para o produto com o id ${produtoId}`);

      // Imprima o carrinho no console após a atualização
      console.log('Carrinho após salvar o arquivo e link de download:', req.session.carrinho);

      res.status(200).json({ nomeArquivo: linkDownload });
    } else {
      console.error(`Produto com o id ${produtoId} não encontrado no carrinho.`);
      res.status(404).send('Produto não encontrado no carrinho.');
    }
  } catch (error) {
    console.error('Erro ao salvar arquivo e link de download:', error);
    res.status(500).send('Erro interno ao salvar o arquivo e link de download.');
  }
});
app.get('/carrinho', (req, res) => {
  try {
    // Se a sessão tiver o carrinho, envie os detalhes
    if (req.session.carrinho) {
      res.json({ carrinho: req.session.carrinho });
    } else {
      // Caso contrário, envie dados de exemplo (ou um objeto vazio)
      res.json(carrinhoData);
    }
  } catch (error) {
    console.error('Erro ao obter detalhes do carrinho:', error);
    res.status(500).send('Erro ao obter detalhes do carrinho.');
  }
});

app.post('/salvar-endereco-no-carrinho', (req, res) => {
  const {
    enderecoData: {
      endereçoCad,
      numCad,
      compCad,
      bairroCad,
      cepCad,
      cidadeCad,
      telefoneCad,
      estadoCad
    }
  } = req.body;

  const endereco = {
    enderecoCad: endereçoCad,
    numCad: numCad,
    compCad: compCad,
    bairroCad: bairroCad,
    cepCad: cepCad,
    cidadeCad: cidadeCad,
    telefoneCad: telefoneCad,
    estadoCad: estadoCad,
    tipoEntrega: 'Único Endereço'
  };

  // Salve o endereço na sessão
  req.session.endereco = endereco;
   // Salve o endereço também no carrinho (você pode adaptar isso de acordo com a lógica do seu aplicativo)
   req.session.carrinho = req.session.carrinho || [];
   req.session.carrinho.forEach(produto => {
     produto.endereco = endereco;
   });

  console.log('Endereço Salvo na Sessão:', endereco);

  console.log('Conteúdo da Sessão:', req.session);

  res.json({ success: true });
});

app.post('/salvar-novo-endereco-no-carrinho', (req, res) => {
  const {
    rua,
    numero,
    complemento,
    bairro,
    cep,
    cidade,
    estado,
    telefone
  } = req.body;

  // Crie um objeto com os detalhes do endereço
  const endereco = {
    enderecoCad: rua,
    numCad: numero,
    compCad: complemento,
    bairroCad: bairro,
    cepCad: cep,
    cidadeCad: cidade,
    telefoneCad: telefone,
    estadoCad: estado,
    tipoEntrega: 'Único Endereço'
  };

  // Salve o endereço na sessão
  req.session.endereco = endereco;

    // Salve o endereço também no carrinho (você pode adaptar isso de acordo com a lógica do seu aplicativo)
    req.session.carrinho = req.session.carrinho || [];
    req.session.carrinho.forEach(produto => {
      produto.endereco = endereco;
    });

  console.log('Endereço Salvo na Sessão:', endereco);

  res.json({ success: true });
});

app.post('/salvar-endereco-retirada-no-carrinho', (req, res) => {
  const {
    enderecoData: {
      endereçoCad,
      numCad,
      compCad,
      bairroCad,
      cepCad,
      cidadeCad,
      telefoneCad,
      estadoCad
    }
  } = req.body;

  const endereco = {
    enderecoCad: endereçoCad,
    numCad: numCad,
    compCad: compCad,
    bairroCad: bairroCad,
    cepCad: cepCad,
    cidadeCad: cidadeCad,
    telefoneCad:telefoneCad,
    estadoCad: estadoCad,
    tipoEntrega: 'Entrega a Retirar na Loja'
  };

  // Salve o endereço na sessão
  req.session.endereco = endereco;
   // Salve o endereço também no carrinho (você pode adaptar isso de acordo com a lógica do seu aplicativo)
   req.session.carrinho = req.session.carrinho || [];
   req.session.carrinho.forEach(produto => {
     produto.endereco = endereco;
   });

  console.log('Endereço Salvo na Sessão:', endereco);

  console.log('Conteúdo da Sessão:', req.session);

  res.json({ success: true });
});

app.post('/upload', upload.single('filePlanilha'), async (req, res) => {
  if (req.file) {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    try {
      const carrinho = req.session.carrinho || [];
      const enderecosSalvos = [];

      // Defina o índice da linha a partir da qual você deseja começar a iterar
      const startRowIndex = 30;

      // Iterar a partir da linha especificada
      for (let i = startRowIndex; i < sheet.length; i++) {
        const row = sheet[i];

        // Certifique-se de que a linha possui pelo menos 10 colunas (ajuste conforme necessário)
        if (row.length >= 10) {
          const endereco = {
            cepCad: row[1],
            enderecoCad: row[2],
            numCad: row[3],
            compCad: row[4],
            bairroCad: row[5],
            cidadeCad: row[6],
            estadoCad: row[7],
            cuidadosCad: row[8],
            telefoneCad: row[9],
            quantidade: row[0],
          };

          // Adicione o endereço à lista de endereços com base na quantidade especificada
          for (let j = 0; j < row[0]; j++) {
            enderecosSalvos.push(endereco);
          }
        }
      }

      // Certifique-se de que o carrinho tenha produtos
      if (carrinho.length === 0) {
        return res.status(400).send('O carrinho está vazio. Adicione produtos antes de usar a planilha.');
      }

      // Quebrar produtos com base nos endereços salvos
      const carrinhoQuebrado = [];
let enderecoIndex = 0; // Índice para rastrear os endereços

carrinho.forEach((produto, produtoIndex) => {
  const produtoId = produto.produtoId;
  const quantidade = produto.quantidade;

  for (let i = 0; i < quantidade; i++) {
    const endereco = enderecosSalvos[enderecoIndex];
    enderecoIndex = (enderecoIndex + 1) % enderecosSalvos.length; // Avança para o próximo endereço

    carrinhoQuebrado.push({
      // Adicionando sufixo único ao ID do produto
      produtoId: `${produtoId}_${produtoIndex}_${i}`,
      nomeProd: produto.nomeProd,
      quantidade: 1,
      valorUnitario: produto.valorUnitario,
      subtotal: produto.subtotal,
      raioProd: produto.raioProd,
      endereco: endereco,
    });
  }
});

      // Atualizar a sessão com o carrinho quebrado
      req.session.carrinho = carrinhoQuebrado;

      console.log('Carrinho Quebrado:', carrinhoQuebrado);

      res.send('Planilha enviada e dados salvos no carrinho com sucesso.');
    } catch (error) {
      console.error('Erro ao processar a planilha:', error);
      res.status(500).send('Erro ao processar a planilha.');
    }
  } else {
    res.status(400).send('Nenhum arquivo enviado.');
  }
});
// Adicione esta rota no seu código existente

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
      console.log('1')
      const carrinhoQuebrado = req.session.carrinho || [];
      const enderecoDaSessao = req.session.endereco;
        if (carrinhoQuebrado.length > 1) {
          const totalAPagar = await Promise.all(carrinhoQuebrado.map(async (produtoQuebrado) => {
            const produto = await Produtos.findByPk(produtoQuebrado.produtoId);
            return produto.valorProd * produtoQuebrado.quantidade;
          })).then((valores) => valores.reduce((total, valor) => total + valor, 0));
          
          // Criar o pedido na tabela de Pedidos
          const pedido = await Pedidos.create({
            idUserPed: req.cookies.userId,
            nomePed: 'Pedido Geral',
            quantPed: carrinhoQuebrado.length,
            valorPed: totalAPagar,
            statusPed: 'Aguardando',
            // ... outros campos relevantes ...
          });
          
          // Criar os itens de pedido na tabela de ItensPedidos
          const itensPedidoPromises = carrinhoQuebrado.map(async (produtoQuebrado) => {
            const produto = await Produtos.findByPk(produtoQuebrado.produtoId);
            return ItensPedido.create({
              idPed: pedido.id,
              idProduto: produtoQuebrado.produtoId,
              nomeProd: produto.nomeProd,
              quantidade: produtoQuebrado.quantidade,
              valorProd: produto.valorProd,
              raio: produto.raioProd,
              acabamento: produtoQuebrado.acabamento,
              cor: produtoQuebrado.cor,
              enobrecimento: produtoQuebrado.enobrecimento,
              formato: produtoQuebrado.formato,
              material: produtoQuebrado.material,
              arquivo: produtoQuebrado.arquivo,
              statusPed: 'Aguardando',
              // ... outros campos relevantes ...
            });
          });
          
          const itensPedido = await Promise.all(itensPedidoPromises);
          
          // Criar os endereços na tabela de Enderecos
          const enderecosPromises = carrinhoQuebrado.map(async (produtoQuebrado) => {
            return Enderecos.create({
              idPed: pedido.id,
              rua: produtoQuebrado.endereco.enderecoCad,
              cep: produtoQuebrado.endereco.cepCad,
              cidade: produtoQuebrado.endereco.cidadeCad,
              numero: produtoQuebrado.endereco.numCad,
              complemento: produtoQuebrado.endereco.compCad,
              bairro: produtoQuebrado.endereco.bairroCad,
              quantidade: produtoQuebrado.quantidade,
              celular: produtoQuebrado.endereco.telefoneCad,
              estado: produtoQuebrado.endereco.estadoCad,
              cuidados: produtoQuebrado.endereco.cuidadosCad,
              raio: produtoQuebrado.raioProd,
              produtos: produtoQuebrado.produtoId,
              idProduto: produtoQuebrado.produtoId,
              tipoEntrega: produtoQuebrado.endereco.tipoEntrega,
              // ... outros campos relevantes ...
            });
          });
          
          const enderecos = await Promise.all(enderecosPromises);
          
          req.session.carrinho = [];
          req.session.endereco = {};
  
          res.json({ message: 'Mini Pedido criado com sucesso', pedido /*,endereco, itensPedido */});
        } else {
          console.log('2')
          const totalAPagar = await Promise.all(carrinhoQuebrado.map(async (produtoNoCarrinho) => {
            const produto = await Produtos.findByPk(produtoNoCarrinho.produtoId);
            return produto.valorProd * produtoNoCarrinho.quantidade;
          })).then((valores) => valores.reduce((total, valor) => total + valor, 0));
          //const produto = await Produtos.findByPk(produtoNoCarrinho.produtoId);
          const pedido = await Pedidos.create({
            idUserPed: req.cookies.userId,
            nomePed: 'Pedido Geral',
            quantPed: 1,
            valorPed: totalAPagar,
            statusPed: 'Aguardando',
            //raio: produto.raioProd,
          });
    
          const itensPedidoPromises = carrinhoQuebrado.map(async (produtoNoCarrinho) => {
            const produto = await Produtos.findByPk(produtoNoCarrinho.produtoId);
            return ItensPedido.create({
              idPed: pedido.id,
              idProduto: produtoNoCarrinho.produtoId,
              nomeProd: produto.nomeProd,
              quantidade: produtoNoCarrinho.quantidade,
              valorProd: produto.valorProd,
              raio: produto.raioProd,
              acabamento: produtoNoCarrinho.acabamento,
              cor: produtoNoCarrinho.cor,
              enobrecimento: produtoNoCarrinho.enobrecimento,
              formato: produtoNoCarrinho.formato,
              material: produtoNoCarrinho.material,
              arquivo: produtoNoCarrinho.arquivo,
              statusPed: 'Aguardando',
            });
          });
    
          const itensPedido = await Promise.all(itensPedidoPromises);
    
          const endereco = await Enderecos.create({
            idPed: pedido.id,
            rua: enderecoDaSessao.enderecoCad,
            cep: enderecoDaSessao.cepCad,
            cidade: enderecoDaSessao.cidadeCad,
            numero: enderecoDaSessao.numCad,
            complemento: enderecoDaSessao.compCad,
            bairro: enderecoDaSessao.bairroCad,
            quantidade: carrinhoQuebrado.reduce((total, produtoNoCarrinho) => total + produtoNoCarrinho.quantidade, 0),
            celular: enderecoDaSessao.telefoneCad,
            estado: enderecoDaSessao.estadoCad,
            cuidados: enderecoDaSessao.cuidadosCad,
            raio: carrinhoQuebrado.length > 0 ? carrinhoQuebrado[0].raioProd : 0,
            idProduto: carrinhoQuebrado[0].produtoId,
            tipoEntrega: enderecoDaSessao.tipoEntrega,
          });
    
          req.session.carrinho = [];
          req.session.endereco = {};
    
          res.json({ message: 'Pedido criado com sucesso', pedido/*, endereco, itensPedido*/});
        }
      } catch (error) {
        console.error('Erro ao criar pedidos:', error);
        res.status(500).json({ error: 'Erro ao criar pedidos' });
      }
    });
  
// Exemplo de rota no servidor Node.js    console.log('Sessão do Carrinho:', req.session.carrinho);

app.post('/atualizar-status-pedido', async (req, res) => {
  try {
    const { pedidoId, novoStatus } = req.body;

    // Atualize o status do pedido na tabela Pedidos
    const graficaId = req.cookies.userId; // Assuming the graphics company's ID is stored in a cookie
    console.log(graficaId)
    const pedido = await Pedidos.findByPk(pedidoId);
    if (!pedido) {
      return res.json({ success: false, message: 'Pedido não encontrado.' });
    }

    pedido.statusPed = novoStatus;
    pedido.graficaAtend = graficaId; // Save the graphics company's ID
    await pedido.save();

    // Atualize o status do pedido na tabela ItensPedidos
    const itensPedidos = await ItensPedido.update(
      { statusPed: novoStatus },
      { where: { idPed: pedidoId } }
    );

    return res.json({ success: true, graficaAtend: graficaId, itensPedidos });
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
    pass: "xjoe jajs urxb lapq"
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
      return res.json({ message: 'E-mail enviado com sucesso!', emailEsq, token });
    })
    .catch((err) => {
      console.log('Não foi possível enviar o e-mail!', err);
      res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
      return res.status(400).json({
          message: "Não foi possível enviar o e-mail!",
        });
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
      numCad: user.numCad,
      compCad: user.compCad,
      bairroCad: user.bairroCad
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