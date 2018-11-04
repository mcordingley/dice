import Parser from './Parser.js';
import Tokenizer from './Tokenizer.js';

window.Tokenizer = Tokenizer;

function readIntFromInput(element) {
    const value = element.value ? parseInt(element.value, 10) : 0;

    return isNaN(value) ? 0 : value;
}

function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const output = document.getElementById('output');

document.getElementById('dice').addEventListener('submit', function (event) {
    event.preventDefault();

    let total = 0;

    ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].forEach(function (id) {
        const max = parseInt(id.substr(1), 10),
            len = readIntFromInput(document.getElementById(id));

        for (let i = 0; i < len; i++) {
            total += roll(1, max);
        }
    });

    total += readIntFromInput(document.getElementById('constant'));

    if (document.getElementById('expression').value) {
        total += (new Parser(new Tokenizer(document.getElementById('expression').value))).parse().evaluate();
    }

    const node = document.createElement('p');

    node.innerText = total;

    output.insertBefore(node, output.childNodes[0] || null);
});