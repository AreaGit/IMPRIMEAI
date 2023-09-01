/*const express = require('express');
const app = express();
const path = require('path');
const User = require('./models/User'); // Certifique-se de que o caminho para o arquivo User.js está correto
const PORT = 5500;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Página Inicial");
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

app.post("/login", (req, res) => {
    const filePath = path.join(__dirname, 'html', 'form.html');
    res.sendFile(filePath);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta 5500 http://10.0.0.122:5500/index.html`)
    console.log(`Servidor de cadastro rodando na porta 5500 http://10.0.0.122:5500/html/cadastro.html`)
    console.log(`Servidor de cadastro rodando na porta 5500 http://10.0.0.122:5500/html/form.html`)
});
*/
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser'); // Importe o body-parser para analisar os dados do corpo da solicitação POST.
const User = require('./models/User'); // Importe o modelo do usuário.


module.exports = {
    trailingSlash: false,
    async headers() {
      return [
        {
          // matching all API routes
          source: '/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
          ],
        },
      ];
    },
    async redirects() {
      return [];
    }
  };
// Use o body-parser para analisar o corpo da solicitação JSON.
app.use(bodyParser.json());

// Defina a rota para servir o formulário HTML.
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'html', 'cadastro.html');
    res.sendFile(filePath);
});

// Rota POST para processar o cadastro do usuário.
app.post("/cadastrar", async (req, res) => {
    // Extraia os dados do corpo da solicitação.
    const { userCad, emailCad, passCad } = req.body;

    try {
        // Crie um novo usuário no banco de dados.
        const newUser = await User.create({
            userCad: userCad,
            emailCad: emailCad,
            passCad: passCad
        });

        // Envie uma resposta JSON para indicar o sucesso do cadastro.
        res.json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
    } catch (error) {
        // Em caso de erro, envie uma resposta de erro com um status 500.
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});

// Inicie o servidor na porta 5500.
app.listen(5500, () => {
    console.log(`Servidor rodando na porta 5500`);
    console.log(`Servidor rodando na porta 5500 http://10.0.0.122:5500/index.html`)
    console.log(`Servidor de cadastro rodando na porta 5500 http://10.0.0.122:5500/html/cadastro.html`)
    console.log(`Servidor de cadastro rodando na porta 5500 http://10.0.0.122:5500/html/form.html`)
});
