import { Request, Response } from 'express';
//conexão com bd
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        //filtro de cidade,uf,items - query params 
        const { city, uf, items } = request.query;

        //pegar os items e converter em array, trim tira espaços<>
        //e transforma o valor final em um número
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        //pega os points no bd busco pontos onde está dentro do q está sendo recebido no filtro
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()//retorna distintos
            .select('points.*');//busca apenas todos dados da tabela points e não na do join

        return response.json(points);

    }


    async show(request: Request, response: Response) {
        //pega o id do ponto de coleta - url
        const { id } = request.params;

        //busca ponto de coleta - first pq só terá 1 id 'unico'
        const point = await knex('points').where({ id }).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' })
        }

        //select*from items join point_items on items.id=point_items.item_id
        //where point_items.point_id={id}
        //quero listar da table items q tem relação com este ponto de coleta
        const items = await knex('items')
            //join tab point_item onde o items.id for igual point_items.item_id'
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)//id do param
            .select('title');

        return response.json({ point, items });

    }


    async create(request: Request, response: Response) {
        //campos para criar campo de coleta '- imagem'
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items//q ele vai selecionar para coleta
        } = request.body;

        //transaction ' se a segunda qry falha a 1 n executa
        const trx = await knex.transaction();

        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        //inserir na tabela
        //knex retorna id quando salva um dado, pegamos ele
        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        //mapeia o id dos items, retorna cada um dos id's e retorna objeto tendo..
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        })
        //inserir em outra tabela
        await trx('point_items').insert(pointItems);

        //faz os inserts na base de dados
        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        });
    }
}

export default PointsController;