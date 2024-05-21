# Academix
 
## Description du Projet
 
Venez découvrir Academix, une plateforme novatrice créée avec passion par une équipe de quatre développeurs passionnés, spécialement conçue pour satisfaire les besoins spécifiques des étudiants. La fonctionnalité de notre application web de réseau social va bien au-delà d'une simple interface de connexion. Il s'agit d'un environnement interactif où les étudiants ont la possibilité de se connecter entre eux, de partager leurs idées, de travailler ensemble sur des projets et de s'entraider mutuellement dans leur parcours éducatif. Chez Academix, notre but principal est de concevoir un environnement sécurisé, stimulant et collaboratif pour les étudiants, où ils peuvent ressentir de l'inspiration et du soutien tout au long de leur processus d'apprentissage. On trouve sur notre plateforme toutes les caractéristiques indispensables d'un réseau social contemporain, comme un système d'authentification solide, un espace de publications dynamique pour les messages et les images, des communautés thématiques pour encourager les échanges et un système d'ajout d'amis pour simplifier les interactions sociales. Cependant, ce qui caractérise réellement Academix, ce sont ses caractéristiques spécialement élaborées pour répondre aux besoins des étudiants. Au-delà des attentes d'un simple réseau social, Academix offre une minuterie intégrée pour les assister dans la gestion de leur temps, un planning pour planifier leurs cours, leurs examens et leurs projets, ainsi qu'un assistant équipé d'intelligence artificielle pour répondre à leurs questions et leur offrir un soutien personnalisé. Rejoignez-nous dès aujourd'hui et découvrez une nouvelle façon d’apprendre et de réussir ensemble dans votre parcours académique.
 
## Technologies Utilisées
 
Nous avons utilisé dans notre code Node.js pour le développement côté serveur. Pour l'interface utilisateur, nous avons choisi React.js, un framework JavaScript réactif et dynamique qui permet une création rapide et intuitive d'interfaces utilisateur. Pour gérer l'authentification sécurisée des utilisateurs, nous avons intégré Clerk, offrant ainsi une solution fiable et flexible pour gérer les identités des utilisateurs. En ce qui concerne le stockage des données, nous avons opté pour MongoDB, une base de données NoSQL polyvalente et évolutive, idéale pour stocker les informations des utilisateurs et les données de l'application de manière efficace. De plus, pour le serveur des fonctionnalités telles que Assistant et conversations, nous avons utilisé Flask, un framework Web léger dont le langage de programmation est le python. En effet, ce second serveur est déployé et ne sert uniquement qu’à gérer les requêtes envoyées par les composantes react du projet. Les fichiers python se trouvent dans un autre github dont le lien est ci-dessous. Dans ce fichier, on retrouve deux fichiers qui sont des applications donc main.py et chat.py, mais on trouve aussi les modèles nécessaires pour la conversation. Le chat.py est logiquement le fichier pour la route conversation où l’on retrouve les différentes fonctions que l’on appelle à partir des composantes jsx principalement pour stocker et retrouver des données avec mongodb. En ce qui concerne le robot, c’est assez identique, on retrouve les fonctions pour traiter les messages avec l’assistant et lorsqu’on envoie un fichier, il est stocké dans un répertoire aws s3 qui est vidé à chaque fois que la route de conversation est lancée. 
 
## Installation et Configuration
 
1. Clonez le dépôt sur votre machine locale.
2. Installez les dépendances du projet en exécutant `npm install`:
3. Configurez votre base de données MongoDB et notez les informations de connexion.
4. Configurez Clerk pour l'authentification des utilisateurs.
5. Créez un fichier `.env` à la racine du projet et ajoutez vos informations de configuration(Clerk, mongo) 
6. Clonez le github du backend flask
7.Installer les dépendances du projet (dans requirements.txt) pip install 
8. Configurer OpenAI assistant et aws s3  et créer un fichier .env avec les clés de mongo, OpenAI ainsi que aws s3
9. Assurez vous de bien remplacer le APIURL avec le correcte url vers votre flask dans les composantes conversationmenu.jsx, AIassistant.jsx et uploadfile.jsx
10.Exécutez l'application réact en utilisant `npm run dev` dans le premier backend et “python wsgi.py” dans le backend flask
 
 
 
## Auteurs
 
- Younes Benziane
- Adam El-Fatihi
- Gaetan Aymar Lohier
- Kais Mansour
