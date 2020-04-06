const conn = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    
    async indexAllFromUser(req, res) {
        const id = req.userId;

        const tool = await conn('ferramenta')
            .where('id_dono', id)
            .select('*')
        
        return res.json(tool);
    },

    async indexTimesRented(req, res) {
        const { id } = req.params;

        const tool = await conn('ferramenta')
            .where('id_ferramenta', id)
            .select('nome', 'vezes_alugada')
            .first();
        
        return res.json(tool);
    },
    
    async create(req, res) { 
        const { nome, valor_dia } = req.body;
        const id_dono = req.userId;
        const id = crypto.randomBytes(4).toString('HEX');
        
        await conn('ferramenta').insert({
            id_ferramenta: id,
            nome: nome,
            valor_dia: valor_dia,
            vezes_alugada: 0,
            id_dono: id_dono
        })
        .then((insert) => {
            return res.status(204).send();
        }).catch(err => {
            return res.json(err)
        });
    },

    async updateName(req, res) {
        const { id } = req.params;
        const id_dono = req.userId;
        const { nome } = req.body;

        await conn('ferramenta')
            .where('id_ferramenta', id)
            .select('nome', 'id_dono')
            .first()
            .then(async tool => {
                if(tool != undefined){
                    if(tool.id_dono == id_dono) {
                        await conn('ferramenta')
                            .update('nome', nome)
                            .where('id_ferramenta', id)
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

    async delete(req, res) {
        const { id } = req.params;

        await conn('ferramenta')
            .where('id_ferramenta', id)
            .delete();

        return res.status(204).send();
    }
}