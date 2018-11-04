import Parser from './Parser.js';
import Tokenizer from './Tokenizer.js';

const output = document.getElementById('output');

document.getElementById('dice').addEventListener('submit', function (event) {
    event.preventDefault();

    const node = document.createElement('p');

    node.innerText = (new Parser(new Tokenizer(document.getElementById('expression').value))).parse().evaluate();

    output.insertBefore(node, output.childNodes[0] || null);
});