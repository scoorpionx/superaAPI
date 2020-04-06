const conn = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    
    async indexAll(req, res) {
        const id = req.userId;

        const rent = await conn('aluguel')
            .where('dono_id', id)
            .select('*')
        
        return res.json(rent);
    },

    async indexAllFromTool(req, res) {
        const { id } = req.params;

        const rent = await conn('aluguel')
            .where('ferramenta_id', id)
            .select('*')
        
        return res.json(rent);
    },
    
    async create(req, res) { 
        const { nome_beneficiado, ferramenta_id } = req.body;
        const dono_id = req.userId;
        const id_aluguel = crypto.randomBytes(4).toString('HEX');

        await conn('ferramenta')
            .where('id_ferramenta', ferramenta_id)
            .select('vezes_alugada', 'id_dono')
            .first()
            .then(async rows => {
                console.log(rows);
                if(rows.id_dono == dono_id) {
                    await conn('ferramenta')
                        .where({
                            id_ferramenta: ferramenta_id,
                            id_dono: dono_id
                        })
                        .update({
                            vezes_alugada: rows.vezes_alugada + 1
                        })
                        .catch(err => {
                            return res.json(err)
                        });
                        
                    await conn('aluguel')
                        .insert({
                            id_aluguel: id_aluguel,
                            dono_id: dono_id,
                            ferramenta_id: ferramenta_id,
                            nome_beneficiado: nome_beneficiado,
                        })
                        .catch(err => {
                            return res.json(err)
                        });

                    return res.status(200).json({
                        id_aluguel,
                        dono_id,
                        ferramenta_id,
                        nome_beneficiado
                    });
                } else if (dono_id == undefined) {
                    return res.status(404).send();
                } else {
                    return res.status(401).send();
                }
            })
            .catch(err => {
                return res.json(err)
            });

        return res.status(204).send();
    },

    async updateName(req, res) {
        const { id } = req.params;
        const id_dono = req.userId;
        const { nome } = req.body;

        await conn('aluguel')
            .select('dono_id', 'nome_beneficiado', 'id_aluguel')
            .where('id_aluguel', id)
            .first()
            .then(async user => {
                if(user != undefined) {
                    if(user.dono_id == id_dono) {
                        await conn('aluguel')
                            .update({ nome_beneficiado: nome })
                            .where('id_aluguel', id)
                            .then(() => {
                                return res.status(202).send();
                            })
                    }
                    return res.status(401).send();
                } else {
                    return res.status(404).send();
                }
            });
        
    },

    async delete(req, res) {
        const { id } = req.params;
        const id_dono = req.userId;

        await conn('aluguel')
            .where('id_aluguel', id)
            .select('dono_id', 'ferramenta_id')
            .first()
            .then(async user => {
                if (user != undefined) {
                    if(user.dono_id == id_dono) {
                        await conn('ferramenta')
                            .where('id_ferramenta', user.ferramenta_id)
                            .select('id_ferramenta', 'id_dono', 'vezes_alugada')
                            .first()
                            .then(async rows => {
                                await conn('ferramenta')
                                    .where({
                                        id_ferramenta: rows.id_ferramenta,
                                        id_dono: rows.id_dono
                                    })
                                    .update({
                                        vezes_alugada: (rows.vezes_alugada - 1)
                                    });
                            });
                    
                        await conn('aluguel')
                            .where('id_aluguel', id)
                            .delete();
                        return res.status(200).send();
                    }
                    return res.status(401).send();
                } else {
                    return res.status(404).send();
                }
            });
    }
}