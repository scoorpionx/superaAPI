const express = require('express');
const UserController = require('./Controllers/UserController');
const ToolsController = require('./Controllers/ToolsController');
const RentController = require('./Controllers/RentController');

const routes = express();

/* User Routes */
routes.get('/usuarios', UserController.indexAll);
routes.get('/usuarios/id/:id', UserController.indexOne);
routes.get('/usuarios/tudo/:id', UserController.indexEverythingFromUser);
routes.post('/usuarios', UserController.create);
routes.patch('/usuarios/nome/:id', UserController.updateName);
routes.patch('/usuarios/senha/:id', UserController.updatePassword);
routes.delete('/usuarios/id/:id', UserController.delete);
routes.post('/usuarios/authenticate', UserController.authenticate);

/* Tools Routes */
routes.get('/ferramentas', ToolsController.indexAll);
routes.get('/ferramentas/id/:id', ToolsController.indexOne);
routes.get('/ferramentas/id-usuario/:id', ToolsController.indexAllFromUser);
routes.get('/ferramentas/vezes_alugada/:id', ToolsController.indexTimesRented);
routes.post('/ferramentas', ToolsController.create);
routes.patch('/ferramentas/id/:id', ToolsController.updateName);
routes.delete('/ferramentas/id/:id', ToolsController.delete);

/* Rent Routes */
routes.get('/alugueis', RentController.indexAll);
routes.get('/alugueis/id/:id', RentController.indexOne);
routes.get('/alugueis/id-usuario/:id', RentController.indexAllFromUser);
routes.get('/alugueis/id-ferramenta/:id', RentController.indexAllFromTool);
routes.post('/alugueis', RentController.create);
routes.patch('/alugueis/:id', RentController.updateName);
routes.delete('/alugueis/id/:id', RentController.delete);

module.exports = routes;