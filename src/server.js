const express = require('express');
const app = express();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
//^ Package para pegar todos arquivos e importar de um directório informado
const cors = require('cors');
//^ Package para deixar a API pública


app.use(express.json())
//^ Ativando o json do express para ele receber json nas requisições
app.use(cors());
//^ Ativando o cors

mongoose.connect('mongodb://localhost:27017/noderest', {
    useCreateIndex: true,
    useNewUrlParser: true
});
//^ Conectando com a BD
// É usado o atributo "useCreateIndex" para que funcione o unique no email
requireDir('./config/models');
//^ pegando todos arquivos da model.

const routes = require('./config/router');
//^ Importando arquivos de rota

app.use('/auth', routes.routes);
app.use('/', routes.project);
//^ Utilizando as rotas


app.listen(3000);