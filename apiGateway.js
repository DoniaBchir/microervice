const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les departements et les employes
const employeProtoPath = 'employe.proto';
const departementProtoPath = 'departement.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();
const employeProtoDefinition = protoLoader.loadSync(employeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const departementProtoDefinition = protoLoader.loadSync(departementProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const employeProto = grpc.loadPackageDefinition(employeProtoDefinition).employe;
const departementProto = grpc.loadPackageDefinition(departementProtoDefinition).departement;
const clientEmployes = new employeProto.EmployeService('localhost:50051', grpc.credentials.createInsecure());
const clientDepartements = new departementProto.DepartementService('localhost:50052', grpc.credentials.createInsecure());

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.start().then(() => {
    app.use(
        cors(),
        expressMiddleware(server),
    );
});

app.get('/employes', (req, res) => {
    const client = new employeProto.EmployeService('localhost:50051',
        grpc.credentials.createInsecure());
    const { q } = req.query;
    client.searchEmploye({ query: q }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.employes);
        }
    });
});

app.post('/employe', (req, res) => {
    const { title, description } = req.body;
    clientEmployes.createEmploye({ title: title, description: description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.employe);
        }
    });
});

app.get('/employes/:id', (req, res) => {
    const client = new employeProto.EmployeService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getEmploye({ employe_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.employe);
        }
    });
});

app.get('/departements', (req, res) => {
    const client = new departementProto.DepartementService('localhost:50052',
        grpc.credentials.createInsecure());
    const { q } = req.query;
    client.searchDepartement({ query: q }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.departements);
        }
    });
});

app.post('/departement', (req, res) => {
    const { title, description } = req.body;
    clientDepartements.createDepartement({ title: title, description: description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.departement);
        }
    });
});

app.get('/departements/:id', (req, res) => {
    const client = new departementProto.DepartementService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getDepartement({ departement_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.departement);
        }
    });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});