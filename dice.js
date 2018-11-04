import Parser from './Parser.js';
import Tokenizer from './Tokenizer.js';

const input = document.getElementById('input'),
    output = document.getElementById('output');

document.getElementById('dice').addEventListener('submit', function (event) {
    event.preventDefault();

    let expression = input.value;

    if (expression.startsWith('d')) {
        expression = '1' + expression;
    }

    expression = expression.replace(/[^\d]d\d+/g, match => match.substr(0, 1) + '1' + match.substr(1));

    try {
        output.innerText = (new Parser(new Tokenizer(expression))).parse().evaluate();
    } catch (e) {
        output.innerText = 'Error';
    }
});

document.querySelectorAll('.js-calculator-button').forEach(function (button) {
    button.addEventListener('click', function (event) {
        input.value += event.target.value;
    })
});

document.getElementById('delete').addEventListener('click', function () {
    input.value = input.value.substr(0, input.value.length - 1);
});

document.getElementById('clear').addEventListener('click', function () {
    input.value = '';
});