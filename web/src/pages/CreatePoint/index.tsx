import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;//sigla
}

interface IBGECityResponse {
    nome: string;//cidade
}

const CreatePoint = () => {
    //sempre que criamos um estado para um array ou objeto
    //é necessário informar o tipo da var q vai ser armazenada 'interface'
    //agora items já tem a informação contida na função do useEffect
    const [items, setItems] = useState<Item[]>([]);

    //informar q recebe um array de strings do IGBE
    //quando vc faz string[], vc precisa retornar um array de strings, por exemplo:['SP']
    //quando vc faz IBEGE[], vc precisa retornar um array do tipo:[{sigla: 'SP'}]
    const [ufs, setUfs] = useState<string[]>([]);

    //inicia em 0 pq option inicia em 0 (uf selecionada)
    //anota/armazena a uf clicado pelo usuário
    const [selectedUf, setSelectedUf] = useState('0');

    //informar q recebe um array de strings do IGBE
    const [cities, setCities] = useState<string[]>([]);

    //inicia em 0 pq option inicia em 0 (uf selecionada)
    //anota/armazena a cidade clicado pelo usuário
    const [selectedCity, setSelectedCity] = useState('0');

    //armazena posição inicial do usuário (mapa)
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    //estado para armazenar o click do user no mapa [posição long e lat]
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    //armazena objeto com os dados do meu formulário
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    //armazena os itens selecionados.
    const [selectedItems, setSelectedItems] = useState<number[]>([]);


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
    }, []);

    //Carregar UF toda vez q for clicado
    useEffect(() => {
        //chamada da api externa e retorna array de formato IBGEUFResponse
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map((uf => uf.sigla));
                setUfs(ufInitials);
            })
    }, []);

    //selecionar cidades sempre q a UF mudar 
    useEffect(() => {
        //chamada da api externa e retorna array de formato IBGEUFResponse
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map((city => city.nome));
                setCities(cityNames);
            })

    }, [selectedUf]);

    useEffect(() => {
        //api do navegador global-retorna posição atual do user assim q abrir a app
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    }, []);

    //função ativada sempre q alterar o UF
    //evento de alteração de um elemento HTMLSelectElement
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        //pego valor clicado pelo user em UF 'rs, sc'
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    //função ativada sempre q alterar a cidade
    //evento de alteração de um elemento HTMLSelectElement
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        //pego valor clicado pelo user em UF 'rs, sc'
        const city = event.target.value;
        setSelectedCity(city);
    }

    //função ativa sempre que eu clico no mapa pega long e lat. e salva no state
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        //pego o nome do componente+valor
        const { name, value } = event.target;

        //pego os dados q eu já tenho 'inputs' e salvo o novo objeto no array-modo inteligente
        setFormData({ ...formData, [name]: value });
    }

    //quando clicar vou pegar o número do id
    function handleSelectItem(id: number) {
        //verifica se o user clico num item q já selecionou antes
        //findIndex se estiver dentro do array oq to procurando retorna 0/> ou se não -1
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            //para remover item clicado
            //filtro itens selecionados e pego apenas q o item for != q o id q cliquei
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);

        } else {
            //lógica para clicar em mais items, pego tudo q tenho + 1 novo
            setSelectedItems([...selectedItems, id]);
        }
    }
}

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
                    <input type="text" name="name" id="name" onChange={handleInputChange} />
                </div>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={handleInputChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                    </div>
                </div>
            </fieldset>


            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>Selecione o endereço no mapa</span>
                </legend>
                <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition} />
                </Map>


                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                            <option value="0">Selecione uma cidade</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
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
                        //console.log(item.title)
                        return (
                            /* passar parâmetro para função ()=>handleSelectItem(item.id)
                            Se colocar handleSelectItem(item.id) ele só vai executar a função direto*/
                            <li key={item.id} onClick={() => handleSelectItem(item.id)}
                                /* verifica item.id ta dentro do array de itens já selecionados
                                se inseriu=selected se não ''*/
                                className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        )
                    })}
                </ul>
            </fieldset>
            <button type="submit">Cadastrar ponto de coleta</button>
        </form>
    </div>
);
                };
export default CreatePoint;