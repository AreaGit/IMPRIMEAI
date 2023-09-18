const Sequelize = require('sequelize');
const db = require('./db'); // Certifique-se de que o caminho para o arquivo de configuração do banco de dados esteja correto.

const Produtos = db.define('produtos', {
  nomeProd: {
    type: Sequelize.STRING(255),
    allowNull: false, // Não permitir valores nulos
  },
  descProd: {
    type: Sequelize.TEXT, // Use TEXT para descrições mais longas
    allowNull: false,
  },
  valorProd: {
    type: Sequelize.FLOAT, // Use FLOAT para valores decimais
    allowNull: false,
  },
  categProd: {
    type: Sequelize.STRING, // Use STRING para categorias
    allowNull: false,
  },
  imgProd: {
    type: Sequelize.BLOB('long'), // Use BLOB para armazenar imagens
    allowNull: true, // Alterado para não permitir valores nulos, se as imagens forem obrigatórias.
  },
});

Produtos.sync() // Use isso para criar ou atualizar a tabela
// Produtos.sync({ force: true }) // Use isso para recriar a tabela (cuidado, dados existentes serão apagados)

module.exports = Produtos;