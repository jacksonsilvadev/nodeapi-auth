const express = require('express');
const routes = express.Router();
//^ Chamando a rota de express
const project = express.Router();
//^ Chamando a rota de express

const authMiddleware = require('../auth/middlewares/auth');
//^ Chamando o Middleware de Autenticação

const UserController = require('./controllers/authController');
//^ Chamando o Controller de autenticação



routes.get('/', UserController.index);
routes.post('/register', UserController.store);
routes.post('/authenticate', UserController.auth);
routes.post('/forgot', UserController.forgotPassword);

project.use(authMiddleware);
//^ Atribuindo o Middleware para tudo que for nas rotas project - Então todas as rotas que são utilizada pela project 
// tem que estar com o token de autenticação

project.get('/', (req, res) => {
    res.send('Hello there')
})

module.exports = {
    routes,
    project
}
//^ Exportando os dois grupos de rota