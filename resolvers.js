const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les departements et les employes 
const employeProtoPath = 'employe.proto';
const departementProtoPath = 'departement.proto';

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

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        employe: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de employe
            const client = new employeProto.EmployeService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getEmploye({ employe_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.employe);
                    }
                });
            });
        },
        employes: () => {
            // Effectuer un appel gRPC au microservice de employe
            const client = new employeProto.EmployeService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchEmployes({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.employe);
                    }
                });
            });
        },

        departement: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de departement
            const client = new departementProto.DepartementService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getDepartement({ departement_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.departement);
                    }
                });
            });
        },

        departements: () => {
            // Effectuer un appel gRPC au microservice de departements
            const client = new departementeProto.DepartementService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchDepartement({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.departements);
                    }
                });
            });
        },
    },
    Mutation: {
        createEmploye: (_, { id, title, description }) => {
            return new Promise((resolve, reject) => {
                clientEmployes.createEmploye({ employe_id: id, title: title, description: description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.employe);
                    }
                });
            });
        },
        createEmploye: (_, { id, title, description }) => {
            return new Promise((resolve, reject) => {
                clientDepartements.createDepartement({ plat_id: id, title: title, description: description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.departement);
                    }
                });
            });
        },
    }
};

module.exports = resolvers;