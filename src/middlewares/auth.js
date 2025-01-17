const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send();
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        req.userId = decoded.id_usuario;

        return next();

    } catch(err) {
        return res.status(401).json(err);
    }
}