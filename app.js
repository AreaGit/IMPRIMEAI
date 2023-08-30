const express = require('express')
const app = express()
const User = require('./models/User.js')
app.use(express.json())

app.get("/", async (req,res) => {
    res.send("Página Inicial")
})

app.post("/cadastrar", async (req,res) => {
    console.log(req.body)
    res.send("Página Cadastrar")
})

app.listen(8080 , () => {
    console.log(`Servidor rodando na porta 8080 http://localhost:8080`)
})