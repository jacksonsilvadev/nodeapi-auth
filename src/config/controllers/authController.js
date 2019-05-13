const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer');

const authConfig = require('../../auth/auth.json')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 43200,
    });
}

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

        try {
            if (await User.findOne({
                    email
                }))
                return res.status(400).send({
                    error: 'User already exist'
                });
            const user = await User.create(req.body);

            user.password = undefined;

            return res.send({
                user,
                token: generateToken({
                    id: user.id
                })
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

        const user = await User.findOne({
            email
        }).select('+password');

        if (!user)
            return res.status(400).send({
                error: 'User not found'
            });

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({
                error: 'Invalid password'
            });

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({
                id: user.id
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