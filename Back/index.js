const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = require('./app/router');


// Je require le middleware pour dire a express 
// d'être pls permissif sur l'origine des requetes !
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

// devrais nous permettre d'envoyer nos fichier static (qui servent au front) dans le dossier public au navigateur !
app.use(express.static('public'));  


app.use(cors());


app.use(upload.array());
app.use((req, res, next) => {
  console.log('Server received : ', req.body);
  next();
}); 

app.use(express.json());

app.use(router);


app.listen(PORT, () => {
  console.log(`API Kanban Yosemite  Listening on ${PORT} ...`);
});