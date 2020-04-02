const express = require('express');
const UserController = require('./Controllers/UserController');
const ToolsController = require('./Controllers/ToolsController');

const routes = express();

/* User Routes */
routes.get('/usuarios', UserController.indexAll);
routes.get('/usuarios/id/:id', UserController.indexOne);
routes.post('/usuarios', UserController.create);
routes.delete('/usuarios/id/:id', UserController.delete);
routes.post('/usuarios/authenticate', UserController.authenticate);

/* Tools Routes */
routes.get('/ferramentas', ToolsController.indexAll);
routes.get('/ferramentas/id/:id', ToolsController.indexOne);
routes.get('/ferramentas/id-usuario/:id', ToolsController.indexAllFromUser);
routes.post('/ferramentas', ToolsController.create);
routes.delete('/ferramentas/id/:id', ToolsController.delete);

/* Rent Routes */

routes.get('/alugueis', (req, res) => {
    return res.json({ message: 'Aqui estão os alugueis'});
});

module.exports = routes;