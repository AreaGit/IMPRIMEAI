const express = require('express');
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

app.get("/login", (req, res) => {
    const filePath = path.join(__dirname, 'html', 'form.html');
    res.sendFile(filePath);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta 5500 http://10.0.0.122:5500/index.html`)
    console.log(`Servidor de cadastro rodando na porta 5500 http://10.0.0.122:5500/html/cadastro.html`)
    console.log(`Servidor de cadastro rodando na porta 5500 http://10.0.0.122:5500/html/form.html`)
});
