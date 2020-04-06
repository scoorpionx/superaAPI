const conn = require('../database/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

module.exports = {
    
    async create(req, res) { 
        const { id_usuario, senha } = req.body;

        await conn('usuario')
            .where('id_usuario', id_usuario)
            .select('senha', 'nome')
            .first()
            .then(user => {
                if(user != undefined) {
                    const correct = bcrypt.compareSync(senha, user.senha);
                    if(correct) {
                        const nome = user.nome;
                        return res.status(202).json({
                            user: {
                                id_usuario,
                                nome
                            },
                            token: jwt.sign({ id_usuario }, authConfig.secret, {
                                expiresIn: authConfig.expiresIn
                            })
                        });
                    } else {
                        return res.status(403).send();
                    }
                } else {
                    return res.status(404).send();
                }
            })
            .catch(err => {
                return res.json(err);
            });
    },
}