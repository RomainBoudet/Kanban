const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const spdy = require('spdy');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = require('./app/router');


// Je require le middleware pour dire a express 
// d'être pls permissif sur l'origine des requetes !
const cors = require('cors');

const port = process.env.PORT || 3010;
const app = express();

// devrais nous permettre d'envoyer nos fichier static (qui servent au front) dans le dossier public au navigateur !
app.use(express.static('./public'));  


app.use(cors());


app.use(upload.array());
app.use((req, res, next) => {
  console.log('Server received : ', req.body);
  next();
}); 

app.use(express.json());

app.use(router);


const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CERT_FILE),
};



/* app.listen(PORT, () => {
  console.log(`API Kanban Yosemite  Listening on ${PORT} ...`);
}); */

spdy.createServer(options, app).listen(port, () => {
  console.log(`API Kanban Yosemite  Listening on ${port} ...`);
});