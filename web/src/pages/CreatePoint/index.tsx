import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

const CreatePoint = () => {
    //sempre que criamos um estado para um array ou objeto
    //é necessário informar o tipo da var q vai ser armazenada 'interface'
    //agora items já tem a informação contida na função do useEffect
    const [items, setItems] = useState<Item[]>([]);
    
    //useEffect executa 1x e não sempre q o CreatePoint for alterado
    //1-qual função quero exec, 2- quando []=exec 1 única x
    useEffect(() => {
        //busco itens da api, e qdo tiver resposta
        //o dado é disponível somente dentro dessa func.
        //então usamos um useState para armazenar info dentro
        //do componente
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, [])

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" />
                        </div>
                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={[-29.6850079, -53.8126038]} zoom={16}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[-29.6850079, -53.8126038]} />
                    </Map>


                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                            </select>
                        </div>
                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {/* para cada item retorno uma coisa 'li' e precisamos de 1 key
                        valor unico de cada item 'key' sempre no map*/}
                        {items.map(item => {
                            console.log(item)
                            return(
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                                
                                
                            </li>
                            
                        )})}

                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}
export default CreatePoint;