const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = require('./app/router');

const helmet = require('helmet');
const crypto = require("crypto");


// Je require le middleware pour dire a express 
// d'être pls permissif sur l'origine des requetes !
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();

// devrais nous permettre d'envoyer nos fichier static (qui servent au front) dans le dossier public au navigateur !
app.use(express.static('public'));  

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