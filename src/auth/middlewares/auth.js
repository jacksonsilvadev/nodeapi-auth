const jwt = require('jsonwebtoken');
const authConfig = require('../../auth/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({
            error: 'No token provided'
        });

    // Bearer - Hash
    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({
            error: 'Token erro'
        })

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({
            error: 'Token malformatted'
        });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({
            error: 'Token invalid'
        })

        req.userID = decoded.id;
        return next();
    })
}