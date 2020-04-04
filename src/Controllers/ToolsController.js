const conn = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async indexAll(req, res) {
        const tool = await conn('ferramenta')
            .select('*')
            .from('ferramenta');
        
        return res.json(tool);
    },
    
    async indexOne(req, res) {
        const { id } = req.params;

        const tool = await conn('ferramenta')
            .where('id_ferramenta', id)
            .select('*')
            .first();
        
        return res.json(tool);
    },

    async indexAllFromUser(req, res) {
        const { id } = req.params;

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
        const id_dono = req.headers.authorization;
        const id = crypto.randomBytes(4).toString('HEX');
        
        await conn('ferramenta').insert({
            id_ferramenta: id,
            nome: nome,
            valor_dia: valor_dia,
            vezes_alugada: 0,
            id_dono: id_dono
        });

        return res.status(204).send();
    },

    async delete(req, res) {
        const { id } = req.params;

        await conn('ferramenta')
            .where('id_ferramenta', id)
            .delete();

        return res.status(204).send();
    }
}