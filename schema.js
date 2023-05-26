const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
    type Employe {
        id: String!
        title: String!
        description: String!
    }
    type Departement{
        id: String!
        title: String!
        description: String!
    }
    type Query {
        employe(id: String!): Employe
        employes: [Employe]
        departement(id: String!): Departement
        departements: [Departement]
        getEmploye(title: String!, description: String!): Employe
        getDepartement(title: String!, description: String!): Departement

    }
    type Mutation {
        createEmploye(title: String!, description: String!): Employe
        createDepartement(title: String!, description: String!): Departement
    }
`;
module.exports = typeDefs