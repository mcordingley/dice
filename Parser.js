import * as Nodes from './Nodes.js';

const diceExtractor = /^(\d+)d(\d+)/,
    dropLowestExtractor = /s\d*/,
    dropHighestExtractor = /S\d*/,
    explodeLowestExtractor = /x\d*/,
    explodeHighestExtractor = /X\d*/,
    rerollLowestExtractor = /r\d*/,
    rerollHighestExtractor = /R\d*/;

function extractNumberFromModifier(modifier, fallback) {
    return parseInt(modifier.substr(1) || fallback, 10);
}

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
            const diceParts = diceExtractor.exec(token.value),
                numberOfDice = diceParts[1],
                sidesOnDice = diceParts[2],
                dropHighest = dropHighestExtractor.exec(token.value),
                explodeHighest = explodeHighestExtractor.exec(token.value),
                rerollHighest = rerollHighestExtractor.exec(token.value),
                dropLowest = dropLowestExtractor.exec(token.value),
                explodeLowest = explodeLowestExtractor.exec(token.value),
                rerollLowest = rerollLowestExtractor.exec(token.value),
                dice = new Nodes.Dice(numberOfDice, sidesOnDice);

            if (dropHighest) dice.dropHighest = extractNumberFromModifier(dropHighest[0], 1);
            if (explodeHighest) dice.explodeHighest = extractNumberFromModifier(explodeHighest[0], sidesOnDice);
            if (rerollHighest) dice.rerollHighest = extractNumberFromModifier(rerollHighest[0], sidesOnDice);
            if (dropLowest) dice.dropLowest = extractNumberFromModifier(dropLowest[0], 1);
            if (explodeLowest) dice.explodeLowest = extractNumberFromModifier(explodeLowest[0], 1);
            if (rerollLowest) dice.rerollLowest = extractNumberFromModifier(rerollLowest[0], 1);

            return dice;
        }

        if (this.accept('NUMBER')) {
            return new Nodes.Float(token.value);
        }

        throw Error('Expecting a number, received ' + token.value);
    }
}

export default Parser;