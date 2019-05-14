const path = require('path');
const nodeMailer = require('nodemailer');
// ^Package para envio de e-mails do Node

const hbs = require('nodemailer-express-handlebars');
// ^Package para preencher variáveis em arquivos html

const transport = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ae6f849c2aec44",
        pass: "3c796964acff00"
    }
});
//^ informando os dados smtp para enviar os emails



transport.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./src/resource/mail/auth')
      },
    viewPath: path.resolve('./src/resource/mail'),
    extName: '.html',
}))
// Utilizando um compile para ler templates HTML

module.exports = transport;