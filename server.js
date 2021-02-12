'use strict';

// VARIABLEN
let db;

// MODULE
const opn = require('better-opn');
const express = require('express');
const nano = require('nano');
let server = express();

server.use(express.static('public'));
server.use(express.json());

// FUNKTIONEN
const init = () => {
    opn('http://localhost');
    server.listen(80, err => console.log(err || 'Server läuft'));
}

// ROUTEN
server.post('/connect', (req, res) => {
    let login = `http://${req.body.username}:${req.body.pw}@localhost:5984`;

    db = nano(login).db;
    db.list({
        include_docs: true
    }).then(
        antwort => res.send(JSON.stringify(antwort))
    )
})

server.post('/uploadDB', (req, res) => {

    db.list().then(
        antwort => antwort.includes(req.body.name)
    ).then(
        antwort => {
            if (antwort) {
                res.send(JSON.stringify({
                    status: 'err',
                    msg: 'DB already exists'
                }))
                Promise.reject(new Error('Oops'));       // Falls DB existiert
            } else {
                return db.create(req.body.name);    // Neue DB anlegen
            }
        }
    ).then(
        () => db.use(req.body.name) // Auf neue DB zugreifen
    ).then(
        imported => {
            console.log('write');

            return Promise.all(req.body.data.map((el, index) => {
                delete el._rev;
                return imported.insert(el)
            }))
        } // Daten importieren
    ).then(
        () => res.send(JSON.stringify({
            status: 'ok',
            msg: 'DB imported'
        }))

    ).catch(
        console.log
    )
})

server.get('/getDB', (req, res) => {

    db.use(req.query.name).list({
        include_docs: true
    }).then(
        antwort => antwort.rows.map(row => row.doc)
    ).then(
        antwort => res.send(JSON.stringify(antwort))
    )

})

// INIT
init();