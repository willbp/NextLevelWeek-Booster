import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        //une caminhos-padroniza
        //dirname retorna o caminho pro diretorio do arq q está
        //executando ele. (database pasta)
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
};