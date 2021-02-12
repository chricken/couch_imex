'use strict';

import dom from './dom.js';

// VARIABLEN
let showDB = dom.$('#showDB');
let inputUser = dom.$('#inputUser');
let inputPasswort = dom.$('#inputPasswort');
let btnConnect = dom.$('#btnConnect');
let login = dom.$('#login');
let upload = dom.$('#upload');
let importers = dom.$('#importers');

// FUNKTIONEN
const exportThis = name => {
    fetch(`/getDB?name=${name}`).then(
        res => res.text()
    ).then(
        res => {
            let element = dom.create({
                typ: 'a',
                inhalt: name,
                attr: {
                    href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(res),
                    download: `${name}.json`,
                },
                style: {
                    display: 'none'
                },
                eltern: document.body,
            });
            element.click();
            element.remove();
        }
    )
}

const createImporter = (file, data) => {

    let importer = dom.create({
        eltern: importers,
        klassen: ['importer'],
    })

    dom.create({
        typ: 'h3',
        inhalt: file.name.split('.')[0],
        eltern: importer
    })

    dom.create({
        eltern: importer,
        klassen: ['textausschnitt'],
        inhalt: JSON.stringify(data)
    })

    dom.create({
        typ: 'button',
        inhalt: 'Import',
        eltern: importer,
        listeners: {
            click() {
                fetch('/uploadDB', {
                    method: 'post',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        name: file.name.split('.')[0],
                        data
                    })
                }).then(
                    antwort => antwort.json()
                ).then(
                    antwort => {
                        console.log(antwort); 
                        importer.remove();                       
                    }
                ).catch(
                    console.log
                )
            }
        }
    })

}

const loadFiles = evt => {
    //console.log(this);
    let files = [...evt.target.files];

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                // Falls kein JSON, nicht ausführen
                let data = JSON.parse(reader.result);
                createImporter(file, data);
            }
            catch (err) {
                console.log(file.name + ' ist kein JSON');
            }
        };
        reader.readAsText(file);
    })

}

const connect = () => {
    fetch(
        '/connect', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                username: inputUser.value,
                pw: inputPasswort.value,
            })
        }
    ).then(
        res => res.json()
    ).then(
        res => {
            showDB.innerHTML = '';
            login.classList.add('hidden');

            res.forEach(db => {
                dom.templates.exportThis({
                    name: db,
                    eltern: showDB,
                    listeners: {
                        click: () => exportThis(db)
                    }
                })
            })
        }
    )
}

const init = () => {

}

// EVENTLISTENER
btnConnect.addEventListener('click', connect);
upload.addEventListener('change', loadFiles);

// INIT
init();