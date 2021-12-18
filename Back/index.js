const dotenv = require('dotenv');
dotenv.config();
//const fs = require('fs');
//const spdy = require('spdy');
const multer = require('multer');
const upload = multer();
const express = require('express');
const crypto = require("crypto");
const helmet = require('helmet');
const router = require('./app/router');


// Je require le middleware pour dire a express 
// d'être pls permissif sur l'origine des requetes !
const cors = require('cors');

const port = process.env.PORT || 5010;
const app = express();

// Config for sub-resources integrity 
app.use((_, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("hex");
  next();
});

app.use(helmet()); 

// CSP configuration and headers security
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [`'self'`,], 
      "script-src": [(_, res) => `'nonce-${res.locals.nonce}'`],
      "img-src": [`'self'`],
      
      "style-src": [ `'self'`], //
      "base-uri": ["'none'"],
      "object-src":["'none'"],
    
      upgradeInsecureRequests: [] 
    }
  }))

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), fullscreen=(), autoplay=(), camera=(), display-capture=(), document-domain=(), fullscreen=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), screen-wake-lock=(), xr-spatial-tracking=()"
  );
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

app.set('x-powered-by', false);

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

// devrais nous permettre d'envoyer nos fichier static (qui servent au front) dans le dossier public au navigateur !
app.use(express.static('public')); 
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