import Parser from './Parser.js';
import Tokenizer from './Tokenizer.js';

const input = document.getElementById('input'),
    output = document.getElementById('output'),
    miscOutput = document.getElementById('output-misc'),
    history = document.getElementById('history');

function makeHistoryButton(expression) {
    const button = document.createElement('input');

    button.classList.add('btn', 'js-expression-button', 'bg-blanched-almond', 'bg-active-tan', 'bg-hover-tan', 'mb1', 'mr1');
    button.setAttribute('type', 'button');
    button.value = expression;

    return button;
}

(function () {
    const fragment = document.createDocumentFragment();

    ['d20', '2d6', 'd100'].map(makeHistoryButton).forEach(button => fragment.appendChild(button));

    history.appendChild(fragment);
})();

history.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn')) {
        input.value = event.target.value;
    }
});

document.getElementById('dice').addEventListener('submit', function (event) {
    event.preventDefault();

    if (input.value === '') {
        output.innerText = 'Error';
        miscOutput.innerText = 'No input provided.';

        return;
    }

    try {
        const parsed = (new Parser(new Tokenizer(input.value))).parse();

        let evaluated = parsed.evaluate(),
            parts = ('' + evaluated).split('.');

        if (parts.length === 2 && parts[1].length > 4) {
            evaluated = evaluated.toFixed(4);
        }

        output.innerText = evaluated;
        miscOutput.innerText = parsed.toString();

        if (!history.querySelector('input[value="' + input.value + '"]')) {
            history.prepend(makeHistoryButton(input.value));
        }
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