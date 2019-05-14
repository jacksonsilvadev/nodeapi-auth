const mongoose = require('mongoose');
const User = mongoose.model('User');
// ^Importando a Model
const bcrypt = require('bcryptjs');
// ^Package para fazer hash de segurança
const jwt = require('jsonwebtoken')
// ^ JsonWebToken - autenticação segurança
const crypto = require('crypto');
// ^ Token temporário
const mailer = require('../../modules/mailer');
// ^Exportando configurações para envio de email

const authConfig = require('../../auth/auth.json')
// ^ Pegando o Secret da aplicação

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 43200,
    });
}
// ^Gerar token automático para o store and update

module.exports = {
    async index(req, res) {
        res.send('Hey')
    },
    async show(req, res) {

    },
    async store(req, res) {
        const {
            email
        } = req.body;
        // ^Recebendo o email da requisição


        try {
            // Validando se ele já existe ou não
            if (await User.findOne({
                    email
                }))
                return res.status(400).send({
                    error: 'User already exist'
                });

            
            const user = await User.create(req.body);
                // ^Senão existir criar um novo com os dados

            user.password = undefined;
            // Settando a password no objeto como nulo para ela não retornar no res.send();

            return res.send({
                user,
                token: generateToken({
                    id: user.id
                })
                // Enviando o id do Usuário para o generateToken ( Lembrando que todo valor global eu devo atribuir nesse params )
            });
        } catch (err) {
            return res.status(400).send(err);
        }
    },
    async update(req, res) {

    },
    async destroy(req, res) {

    },
    async auth(req, res) {
        const {
            email,
            password
        } = req.body;
        // ^Passando o email e senha de login para variáveis separadas

        const user = await User.findOne({
            email
        }).select('+password');
        // ^Procurando o usuário na base - Neste local utilizados o select('+password') porque ele foi passado como select: false na model
        // Fazendo com que sempre que for chamado em qualquer query seja necessário o select('+password') para ele vir

        if (!user)
        // Se não existir o usuário retornar erro
            return res.status(400).send({
                error: 'User not found'
            });

        if (!await bcrypt.compare(password, user.password))
        // ^Utilizando o await devido o compare do bcrypt demorar um tempo e ser necessário a espera dele para continuar
        // ^Comparando a senha enviada com a senha de hash na base
            return res.status(400).send({
                error: 'Invalid password'
            });

        
        user.password = undefined;
            // ^Após verificação de usuário seta a password como undefined para não retornar no json

        return res.send({
            user,
            token: generateToken({
                id: user.id
                // Enviando o id do Usuário para o generateToken ( Lembrando que todo valor global eu devo atribuir nesse params )
            })
        });
    },
    async forgotPassword(req, res) {
        const {
            email
        } = req.body

        try {
            const user = await User.findOne({
                email
            });

            if (!user) {
                return res.status(400).send({
                    error: 'User not found'
                });
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });

            mailer.sendMail({
                to: email,
                from: 'jackson.rodrigues9@hotmail.com',
                template: 'auth/forgot_password',
                context: {
                    token
                }
            }, (err) => {
                if (err)
                    return res.status(400).send({
                        error: 'Cannot send forgot password email'
                    })

                return res.send();
            })

        } catch (err) {
            res.status(400).send({
                error: 'Error on forgot password, try again'
            })
        }
    }
}