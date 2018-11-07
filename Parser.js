import * as Nodes from './Nodes.js';

class Parser {
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.currentToken = this.tokenizer.next();
    }

    expect(type) {
        if (this.accept(type)) {
            return true;
        }

        throw Error('Parse failed.');
    }

    accept(type) {
        if (this.currentToken && type === this.currentToken.type) {
            this.next();

            return true;
        }

        return false;
    }

    next() {
        this.currentToken = this.tokenizer.next();
    }

    parse() {
        return this.expression();
    }

    expression() {
        const negate = this.accept('MINUS'),
            left = this.term();

        let node = left;

        if (this.accept('PLUS')) {
            node = new Nodes.Add(left, this.expression());
        } else if (this.accept('MINUS')) {
            node = new Nodes.Subtract(left, this.expression());
        }

        if (negate) {
            node = new Nodes.Negate(node);
        }

        return node;
    }

    term() {
        const left = this.factor();

        if (this.accept('MULTIPLY')) {
            return new Nodes.Multiply(left, this.term());
        }

        if (this.accept('DIVIDE')) {
            return new Nodes.Divide(left, this.term());
        }

        return left;
    }

    factor() {
        if (this.accept('L_PAREN')) {
            const node = this.expression();
            this.expect('R_PAREN');

            return node;
        }

        const token = this.currentToken;

        if (this.accept('DICE')) {
            const [number, sides] = token.value.split('d');

            return new Nodes.Dice(number, sides);
        }

        if (this.accept('NUMBER')) {
            return new Nodes.Float(token.value);
        }

        throw Error('Expecting a number, received ' + token.value);
    }
}

export default Parser;