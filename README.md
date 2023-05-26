# microservice
projet

Application de gestion des employes et des departements 
Cette application vous permet de gérer les données des employes et des departements en utilisant une combinaison 
de REST, gRPC et GraphQL. Vous pouvez insérer des données dans les tables "employe" et "departement" en utilisant différentes méthodes d'API.

#Fonctionnalités:
Insertion,récupération et recherche de données dans la table "departement" via l'API REST, gRPC et GraphQL.
Insertion rcupération et recherche de données dans la table "employe via l'API REST, gRPC et GraphQL.
#Technologies utilisées:
Node.js
Express.js
REST
gRPC
GraphQL
Base de données (MySQL)

#Configuration:
Clonez ce référentiel sur votre machine locale.
Installez les dépendances en exécutant la commande suivante :
  npm install
.Configurez la connexion à votre base de données dans le fichier de configuration approprié.
.Assurez-vous que les ports appropriés sont ouverts pour les différentes API (REST, gRPC, GraphQL).
  
#Utilisation:
1-Démarrez le serveur en exécutant la commande suivante :
node server.js
2-Accédez aux différentes API pour insérer des données dans les tables "departement" et "employe :
#REST API :
POST /departement - Insérer un nouveau departement.
POST /employe - Insérer un nouveau employe.
GET /departements/:id : Récupère un departement spécifique en utilisant son identifiant.
GET /employes/:id : Récupère un employe spécifique en utilisant son identifiant.

#Exemple de requête POST pour insérer un departement via l'API REST :
POST /departement
Content-Type: application/json

{
  "title": "gestion des employes et des departements ",
  "description": "Description du employe 1"
}

Auteur: Donia bchir 




