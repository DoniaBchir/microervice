const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2');

const departementProtoPath = 'departement.proto';
const departementProtoDefinition = protoLoader.loadSync(departementProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const departementProto = grpc.loadPackageDefinition(departementProtoDefinition).departement;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_projet',
});

const departementService = {
    getDepartement: (call, callback) => {
        const { departement_id } = call.request;
        const query = 'SELECT * FROM departement WHERE id = ?';
        const values = [departement_id];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const departement = results[0];
                callback(null, { departement });
            }
        });
    },
    searchDepartement: (call, callback) => {
        const { query } = call.request;
        const searchQuery = 'SELECT * FROM departement WHERE title LIKE ?';
        const values = [`%${query}%`];

        pool.query(searchQuery, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const departements = results;
                callback(null, { departements });
            }
        });
    },
    createDepartement: (call, callback) => {
        const { title, description } = call.request;
        const query = 'INSERT INTO departement (title, description) VALUES (?, ?)';
        const values = [title, description];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const insertedId = results.insertId;
                const departement = { id: insertedId, title, description };
                callback(null, { departement});
            }
        });
    },
};

const server = new grpc.Server();
server.addService(departementProto.DepartementService.service, departementService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind the server:', err);
        return;
    }
    console.log(`The server is running on port ${port}`);
    server.start();
});

console.log(`Departement microservice is running on port ${port}`);
