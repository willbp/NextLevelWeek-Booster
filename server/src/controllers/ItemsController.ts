import { Request, Response } from 'express';
//conexão com bd
import knex from '../database/connection';

class ItemsController {
    //listar
    async index(request: Request, response: Response) {
        //select * from items
        const items = await knex('items').select('*');

        //modelar/transformo infos do BD anexando a URL no retorno
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        });
        //retorna o modelo remodelado
        return response.json(serializedItems);
    }
}
export default ItemsController;