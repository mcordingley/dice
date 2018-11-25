import Parser from './Parser.js';
import Tokenizer from './Tokenizer.js';

const input = document.getElementById('input'),
    output = document.getElementById('output'),
    miscOutput = document.getElementById('output-misc');

document.getElementById('dice').addEventListener('submit', function (event) {
    event.preventDefault();

    try {
        const parsed = (new Parser(new Tokenizer(input.value))).parse();

        let evaluated = parsed.evaluate(),
            parts = ('' + evaluated).split('.');

        if (parts.length === 2 && parts[1].length > 4) {
            evaluated = evaluated.toFixed(4);
        }

        output.innerText = evaluated;
        miscOutput.innerText = parsed.toString();
    } catch (exception) {
        output.innerText = 'Error';
        miscOutput.innerText = exception.message;
    }
});

function getButtonValue(button) {
    return typeof button.dataset.calculatorValue !== 'undefined' ?
        button.dataset.calculatorValue :
        button.value;
}

document.querySelectorAll('.js-calculator-button').forEach(function (button) {
    button.addEventListener('click', function (event) {
        input.value += getButtonValue(event.target);
    })
});

document.getElementById('delete').addEventListener('click', function () {
    input.value = input.value.substr(0, input.value.length - 1);
});

document.getElementById('clear').addEventListener('click', function () {
    input.value = '';
});