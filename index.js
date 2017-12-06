const fs = require('fs');
const flatten = require('lodash/flatten');
const dictionary = require('./lib');
const files = process.argv.slice(2);

function checkReservedWord(arg) {
    try {
        eval(`let ${arg} = 123`);
        return true;
    } catch (err) {
        return false;
    }
}

function replaceMurlocWords(field) {
    if (checkReservedWord(field)) {
        Object.keys(dictionary).forEach(key => {
            const reg = new RegExp(key, 'g');
            field = field.replace(reg, dictionary[key], /g/i);
        });
    }
    return field;
}

function compile(file) {
    fs.readFile(file, 'utf8', (err, data) => {
        let newData = flatten(data.split('\n').map(item =>
            flatten(item.split(' ').map(someitem =>
                flatten(someitem.split('(').map(anyitem => anyitem.split(')')))))
        ));
        console.log(newData);
        newData = newData.map(replaceMurlocWords);

        const stream = fs.createWriteStream(file.replace(/mrls/, 'js'));
        stream.once('open', () => {
            stream.write(newData.join(' '));
            stream.end();
        });
    });
}

files.forEach(compile);
