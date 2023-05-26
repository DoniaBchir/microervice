const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2');

const employeProtoPath = 'employe.proto';

const employeProtoDefinition = protoLoader.loadSync(employeProtoPath, {
    keepCase: true,
    longs: String,  
    enums: String,
    defaults: true,
    oneofs: true,
});


const employeProto = grpc.loadPackageDefinition(employeProtoDefinition).employe;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_projet',
});

const employeService = {
    getEmploye: (call, callback) => {
        const { employe_id } = call.request;
        const query = 'SELECT * FROM employe WHERE id = ?';
        const values = [employe_id];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const employe = results[0];
                callback(null, { employe });
            }
        });
    },
    searchEmploye: (call, callback) => {
        const { query } = call.request;
        const searchQuery = 'SELECT * FROM employe WHERE title LIKE ?';
        const values = [`%${query}%`];

        pool.query(searchQuery, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const employes = results;
                callback(null, { employes });
            }
        });
    },
    createEmploye: (call, callback) => {
        const { title, description } = call.request;
        const query = 'INSERT INTO employe (title, description) VALUES (?, ?)';
        const values = [title, description];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const insertedId = results.insertId;
                const employe = { id: insertedId, title, description };
                callback(null, { employe });
            }
        });
    },
};

const server = new grpc.Server();
server.addService(employeProto.EmployeService.service, employeService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind the server:', err);
        return;
    }
    console.log(`The server is running on port ${port}`);
    server.start();
});

console.log(`employe microservice is running on port ${port}`);

