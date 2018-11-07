class Tokenizer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.character = this.input.charAt(this.position);
    }

    next() {
        while (this.position < this.input.length && Tokenizer.isWhitespace(this.character)) {
            this.consume();
        }

        if (this.position >= this.input.length) {
            return null;
        }

        if (Tokenizer.operators[this.character]) {
            return this.operator();
        }

        if ((new RegExp('^.{' + this.position + '}\\d+d\\d+[a-z]*', 'i')).test(this.input)) {
            return this.dice();
        }

        if (Tokenizer.isDigit(this.character)) {
            return this.number();
        }

        throw Error('Parse failure!');
    }

    consume() {
        this.position++;
        this.character = this.input.charAt(this.position);
    }

    operator() {
        const token = {
            type: Tokenizer.operators[this.character],
            value: this.character,
        };

        this.consume();

        return token;
    }

    dice() {
        let value = '';

        while (Tokenizer.isDigit(this.character) || Tokenizer.isLetter(this.character)) {
            value += this.character;

            this.consume();
        }

        return {
            type: 'DICE',
            value,
        };
    }

    number() {
        let value = '';

        while (Tokenizer.isDigit(this.character) || this.character === '.') {
            value += this.character;

            this.consume();
        }

        return {
            type: 'NUMBER',
            value,
        };
    }

    static isDigit(character) {
        return character >= '0' && character <= '9';
    }

    static isLetter(character) {
        return character >= 'a' && character <= 'z'
            || character >= 'A' && character <= 'Z';
    }

    static isWhitespace(character) {
        return character === ' ' || character === '\t' || character === '\n' || character === '\r';
    }
}

Tokenizer.operators = {
    "(": "L_PAREN",
    ")": "R_PAREN",
    "+": "PLUS",
    "-": "MINUS",
    "*": "MULTIPLY",
    "/": "DIVIDE",
};

export default Tokenizer;