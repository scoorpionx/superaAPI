const express = require('express');
const UserController = require('./Controllers/UserController');
const ToolsController = require('./Controllers/ToolsController');
const RentController = require('./Controllers/RentController');
const SessionController = require('./Controllers/SessionController');
const authMiddleware = require('./middlewares/auth');

const routes = express();

routes.post('/usuarios', UserController.create);
routes.post('/session', SessionController.create);

routes.use(authMiddleware);

routes.get('/usuarios/tudo', UserController.indexEverythingFromUser);
routes.patch('/usuarios/nome', UserController.updateName);
routes.patch('/usuarios/senha', UserController.updatePassword);
routes.delete('/usuarios/', UserController.delete);

routes.get('/ferramentas/usuario', ToolsController.indexAllFromUser);
routes.get('/ferramentas/vezes_alugada/:id', ToolsController.indexTimesRented);
routes.post('/ferramentas', ToolsController.create);
routes.patch('/ferramentas/id/:id', ToolsController.updateName);
routes.delete('/ferramentas/id/:id', ToolsController.delete);

routes.get('/alugueis', RentController.indexAll);
routes.get('/alugueis/id-ferramenta/:id', RentController.indexAllFromTool);
routes.post('/alugueis', RentController.create);
routes.patch('/alugueis/:id', RentController.updateName);
routes.delete('/alugueis/id/:id', RentController.delete);

module.exports = routes;