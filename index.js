const fs = require('fs');
const dictionary = require('./lib');

fs.readFile('./test.mrls', 'utf8', (err, data) => {
    Object.keys(dictionary).forEach(key => {
        const reg = new RegExp(key, 'g');
        data = data.replace(reg, dictionary[key], /g/i);
    });
    const stream = fs.createWriteStream('./test.js');
    stream.once('open', () => {
        stream.write(data);
        stream.end();
    });

});