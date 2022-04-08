# Kanban

<<<<<<< HEAD
# Kanban

=======
>>>>>>> prod
A small app for making a kanban !  
You can add lists, add cards, add tags to cards, choose the color of your lists,  
and drag and drop your lists to another card if you wish !

## Stack :

**Front** : 
- vanilla JS
- vanta.js for the background

**Back**:
- ORM sequelize
- Node.js with Express framework

## Install :

=> After having cloned the repo, create the database = ```createdatabse kanban```. ("kanban" name or what you want)

=> Insert tables in your new database. Go to Back/doc and run ```psql <the_name_of_your_database> -f create_tables```

=> After installing the dependencies (```npm install```), you will have to create an .env file, based on the .env.example file which contains your postgres login credentials and you port.

=> Go to BACK/public/app and line 10 or 11, replace the base_url with the chosen port  : ```base_url: "http://localhost:<your_port>",```

<<<<<<< HEAD
=> Run ```npm run build```

=> Run ```npm start```

This app is also online : [kanban](https://apikanban.romainboudet.fr) !
=======
=> Run ```npm run build``` (```npm i browserify``` if you have => ```sh: 1: browserify: not found```)

=> Run ```npm start```

This app is also online : [kanban](https://apikanban.romainboudet.fr) !
>>>>>>> prod
