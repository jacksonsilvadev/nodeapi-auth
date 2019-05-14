const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    // ^Pegando o heade de authorization


    if (!authHeader)
        // ^Se não existir o header retornar erro de token invalido
        return res.status(401).send({
            error: 'No token provided'
        });

    // Bearer - Hash
    // ^Formato aceito no Header
    const parts = authHeader.split(' ');
    // ^Quebrando o header em duas partes para verificar melhor

    if (!parts.length === 2)
    // ^Se não for igual a 2 length o split retornar erro de token
        return res.status(401).send({
            error: 'Token erro'
        })

    const [scheme, token] = parts;
        // ^Pegando em partes diferentes o Bearer e o token
    if (!/^Bearer$/i.test(scheme)) {
        // ^Verificando se o scheme tem os atributos Bearer
        return res.status(401).send({
            error: 'Token malformatted'
        });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        // Se o token invalido não bater com o um novo da secret retornar erro
        if (err) return res.status(401).send({
            error: 'Token invalid'
        })

        req.userID = decoded.id;
        // ^ Se tudo ocorrer bem declara o userID global com o id do usuário logado
        return next();
        // ^Passa para os controllers liberando a autenticação e logando
    })
}