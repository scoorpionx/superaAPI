const conn = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
    async indexAll(req, res) {
        const usuario = await conn('usuario')
            .select('id_usuario', 'nome')
            .from('usuario');
        
        return res.json(usuario);
    },
    
    async indexOne(req, res) {
        const { id } = req.params;

        const usuario = await conn('usuario')
            .where('id_usuario', id)
            .select('id_usuario', 'nome')
            .first();
        
        return res.json(usuario);
    },
    
    async create(req, res) { 
        const { name, senha } = req.body;
        const id = crypto.randomBytes(4).toString('HEX');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(senha, salt);


        await conn('usuario').insert({
            id_usuario: id,
            nome: name,
            senha: hash,
        });

        return res.status(204).send();
    },

    async delete(req, res) {
        const { id } = req.params;

        await conn('usuario')
            .where('id_usuario', id)
            .delete();

        return res.status(204).send();
    },

    async authenticate(req, res) {
        const { id_usuario, senha } = req.body;

        await conn('usuario')
            .where('id_usuario', id_usuario)
            .select('senha')
            .first()
            .then(user => {
            if(user != undefined) {
                const correct = bcrypt.compareSync(senha, user.senha);
                if(correct) {
                    return res.status(202).send();
                } else {
                    return res.status(403).send();
                }
            } else {
                return res.status(401).send();
            }
        })
    },

    async logout(req, res) {

    }
}