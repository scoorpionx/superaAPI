const conn = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {

    async indexEverythingFromUser(req, res) {
        const id = req.userId;

        const usuario = await conn('usuario')
            .where('id_usuario', id)
            .select('id_usuario', 'nome')
            .first()
            .then(async (user) => {
                const rent = await conn('aluguel')
                    .where('dono_id', id)
                    .select('*');

                const tool = await conn('ferramenta')
                    .where('id_dono', id)
                    .select('*');

                return res.json({ user, rent, tool })
            })
            .catch(err => {
                return res.json(err)
            });
        
        return res.json({ usuario });
    },
    
    async create(req, res) { 
        const { nome, senha } = req.body;
        const id = crypto.randomBytes(4).toString('HEX');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(senha, salt);


        await conn('usuario').insert({
            id_usuario: id,
            nome: nome,
            senha: hash,
        }).catch(err => {
            return res.json(err)
        });

        return res.json({ id });
    },

    async updateName(req, res) {
        const id = req.userId;
        const { nome, senha } = req.body;

        await conn('usuario')
            .where('id_usuario', id)
            .select('nome', 'senha')
            .first()
            .then(async user => {
                if(user != undefined){
                    const correct = bcrypt.compareSync(senha, user.senha);
                    if(correct) {
                        await conn('usuario')
                            .update('nome', nome)
                            .where('id_usuario', id)
                            .then(() => {
                                return res.status(202).send();
                            })
                            .catch(err => {
                                return res.json(err)
                            });
                    }
                    return res.status(401).send();
                } else {
                    return res.status(404).send();
                }
            })
            .catch(err => {
                return res.json(err)
            });
    },

    async updatePassword(req, res) {
        const id = req.userId;
        const { senha_antiga, senha_nova } = req.body;

        await conn('usuario')
            .where('id_usuario', id)
            .select('senha')
            .first()
            .then(async user => {
                if(user != undefined){
                    const correct = bcrypt.compareSync(senha_antiga, user.senha);
                    if(correct) {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(senha_nova, salt);

                        await conn('usuario')
                            .update('senha', hash)
                            .where('id_usuario', id)
                            .then(() => {
                                return res.status(202).send();
                            })
                            .catch(err => {
                                return res.json(err)
                            });
                    }
                    return res.status(401).send();
                } else {
                    return res.status(404).send();
                }
            })
            .catch(err => {
                return res.json(err);
            });

    },

    async delete(req, res) {
        const id = req.userId;
        const { senha } = req.body;

        await conn('usuario')
            .where('id_usuario', id)
            .select('senha')
            .first()
            .then(async user => {
                if(user != undefined) {
                    const correct = bcrypt.compareSync(senha, user.senha);
                    if(correct) {
                        await conn('usuario')
                            .where('id_usuario', id)
                            .delete()
                            .catch(err => {
                                return res.json(err);
                            });

                        return res.status(202).send();
                    } else {
                        return res.status(403).send();
                    }
                } else {
                    return res.status(404).send();
                }
            })
            .catch(err => {
                return res.json(err)
            });
    },
}