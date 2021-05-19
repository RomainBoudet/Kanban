require('dotenv').config();

const express = require('express');

const app = express();

// je parle le JSON
app.use(express.json());

// après ce MW, les données entrantes seront dans req.body

app.get('/test', (req, res) => {
    res.json({status: 'bien reçu'});
});

// ma route test en POST, s'attend à recevoir des données en JSON
// et renverra ces données en JSON aussi
app.post('/test', (req, res) => {
    const {body} = req;

    // j'utiliserais Sequelize, je lui filerais les données présentes dans body

    res.json({status: "ok"});
});

app.patch('/test', (req, res) => {
    res.json('coucou les Nemo');
});

app.delete('/test', (req, res) => {
    res.json('coucou en DELETE');
});

app.listen(process.env.PORT, () => console.log('go'));