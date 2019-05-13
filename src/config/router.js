const express = require('express');
const routes = express.Router();
const project = express.Router();
const authMiddleware = require('../auth/middlewares/auth');

const UserController = require('./controllers/authController');



routes.get('/', UserController.index);
routes.post('/register', UserController.store);
routes.post('/authenticate', UserController.auth);
routes.post('/forgot', UserController.forgotPassword);

project.use(authMiddleware);

project.get('/', (req, res) => {
    res.send('Hello there')
})

module.exports = {
    routes,
    project
}