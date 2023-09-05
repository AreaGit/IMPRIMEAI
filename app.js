const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const User = require('./models/User');
const { where } = require('sequelize');
const cookieParser = require('cookie-parser');
const PORT = 5500;

app.use(express.json());
app.use(express.static(__dirname));
app.use(cookieParser());

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

app.listen(8080, () => {
    console.log(`Servidor rodando na porta ${PORT}  http://localhost:8080`);
    console.log('Servido de Cadastro rodando na Porta 8080 http://localhost:8080/html/cadastro.html')
    console.log('Servido de Login rodando na Porta 8080 http://localhost:8080/html/form.html')
});
