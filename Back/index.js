const dotenv = require('dotenv');
dotenv.config();
//const fs = require('fs');
//const spdy = require('spdy');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = require('./app/router');


// Je require le middleware pour dire a express 
// d'être pls permissif sur l'origine des requetes !
const cors = require('cors');

const port = process.env.PORT || 5010;
const app = express();

// devrais nous permettre d'envoyer nos fichier static (qui servent au front) dans le dossier public au navigateur !
app.use(express.static('public'));  

app.use(cors({
  optionsSuccessStatus: 200,
  credentials: true, // pour envoyer des cookies et des en-têtes d'autorisations faut rajouter une autorisation avec l'option credential
  origin: "*",//! a pas oublier pour la prod ! => remplacer par le bon nom de domaine
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS", // ok via un array aussi
  allowedHeaders: ['Content-Type'],
}));



app.use(upload.array());
app.use((req, res, next) => {

  console.log('Server received req.params : ', req.params);
  next();
}); 


app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

app.use(router);

// Nginx s'occuperas du HTTP2 ...
/* const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CERT_FILE),
}; */


 app.listen(port, () => {
  console.log(`API Kanban Yosemite  Listening on ${port} ...`);
}); 

/* spdy.createServer(options, app).listen(port, () => {
  console.log(`API Kanban Yosemite  Listening on ${port} ...`);
}); */