'use strict';

let dom = {
    // create-Parameter werden als Named Attributes übertragen
    create({
        inhalt = false,
        klassen = [],
        attr = {},
        listeners = {},
        eltern = false,
        typ = 'div',
        style = {},
    } = {}) {
        let neu = document.createElement(typ);
        if (inhalt) neu.innerHTML = inhalt;
        if (klassen.length) neu.className = klassen.join(' ');
        Object.entries(attr).forEach(a => neu.setAttribute(...a));
        Object.entries(listeners).forEach(listener => neu.addEventListener(...listener));
        Object.entries(style).forEach(s => neu.style[s[0]] = s[1] );
        if (eltern) eltern.append(neu);

        return neu;
    },

    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return [...document.querySelectorAll(selector)];
    },

    templates:{
        exportThis({
            name='irgendwas',
            eltern=false,
            listeners={},
        }={}){
            let neu = dom.create({
                eltern,
                klassen: ['export']
            })
            dom.create({
                eltern:neu,
                typ:'span',
                klassen:['legend'],
                inhalt: name
            })
            dom.create({
                eltern:neu,
                typ:'button',
                inhalt: 'export',
                listeners,
            })
        }
    },
}

export default dom;