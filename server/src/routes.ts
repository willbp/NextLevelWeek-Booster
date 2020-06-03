import express from 'express';
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'


const routes = express.Router();
const pointsController=new PointsController();
const itemsController=new ItemsController();


//busca/lista os items
routes.get('/items', itemsController.index);

//criar pontos de coleta
routes.post('/points', pointsController.create);

//Listar pontos de coletas
routes.get('/points', pointsController.index);

//Listar um Ponto de Coleta Específico
routes.get('/points/:id', pointsController.show);

export default routes;