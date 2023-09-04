const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const User = require('./models/User'); // Certifique-se de que o caminho para o arquivo User.js está correto
const PORT = 5500;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    try {
        const indexHtmlContent = fs.readFileSync("index.html", "utf8");
        res.send(indexHtmlContent);
      } catch (err) {
        console.error("Erro ao ler o arquivo index.html:", err);
        res.status(500).send("Erro interno do servidor");
      }
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

app.listen(8080, () => {
    console.log(`Servidor rodando na porta ${PORT}  http://localhost:8080`);
    console.log('Servido de Cadastro rodando na Porta 8080 http://localhost:8080/html/cadastro.html')
    console.log('Servido de Login rodando na Porta 8080 http://localhost:8080/html/form.html')
});
