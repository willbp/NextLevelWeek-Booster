import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes'

const app = express();

//Define quais endereços externos terão acessos para nossa aplicação
//permite que todas URL's acessem
app.use(cors());

//adiciona função para entender json
app.use(express.json());

app.use(routes);

//cadastro arquivos estáticos de uma pasta específica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);