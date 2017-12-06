const fs = require('fs');
const flatten = require('lodash/flatten');
const tail = require('lodash/tail');
const clc = require('cli-color');
const dictionary = require('./lib');
const files = process.argv.slice(2);

function replaceMurlocWords(field) {
        Object.keys(dictionary).forEach(key => {
            const reg = new RegExp(key, 'g');
            field = field.replace(reg, dictionary[key], /g/i);
        });
    return field;
}

function isMurloc(filename) {
    return tail(filename.split('.'))[0] === 'mrls';
}

function compile(file) {
    if (!isMurloc(file)) {
        return;
    }
    fs.readFile(file, 'utf8', (err, data) => {
        let newData = flatten(data.split('\n').map(item =>
            flatten(item.split(' '))));
        newData = newData.map(replaceMurlocWords);
        const newFileName = file.replace(/mrls/, 'js');
        const stream = fs.createWriteStream(newFileName);
        stream.once('open', () => {
            stream.write(newData.join(' '));
            console.log(`[GRHZR]: ${clc.blue(file)} brghed to`, clc.green(newFileName));
            stream.end();
        });
    });
}

files.forEach(compile);
