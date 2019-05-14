const express = require('express');
const routes = express.Router();
//^ Chamando a rota de express
const project = express.Router();
//^ Chamando a rota de express

const authMiddleware = require('./auth/middlewares/auth');
//^ Chamando o Middleware de Autenticação

const UserController = require('./controllers/authController');
const projectController = require('./controllers/projectController');
//^ Chamando o Controller de autenticação



routes.get('/', UserController.index);
routes.post('/register', UserController.store);
routes.post('/authenticate', UserController.auth);
routes.post('/forgot', UserController.forgotPassword);
routes.post('/reset_password', UserController.resetPassword);

project.use(authMiddleware);
//^ Atribuindo o Middleware para tudo que for nas rotas project - Então todas as rotas que são utilizada pela project 
// tem que estar com o token de autenticação

project.get('/', projectController.index)
project.get('/:projectId', projectController.show)
project.post('/', projectController.store)
project.put('/:projectId', projectController.update)
project.delete('/:projectId', projectController.destroy)

module.exports = {
    routes,
    project
}
//^ Exportando os dois grupos de rota