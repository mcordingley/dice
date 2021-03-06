export class Dice {
    constructor(number, sides) {
        this.number = number;
        this.sides = sides;

        this.dropHighest = false;
        this.dropLowest = false;
        this.explodeHighest = false;
        this.explodeLowest = false;
        this.rerollHighest = false;
        this.rerollLowest = false;

        this.rolls = [];
    }

    evaluate() {
        this.rolls = [];

        let roll;

        for (let i = 0, count = this.number; i < count; i++) {
            roll = Dice.roll(1, this.sides);

            if (
                this.rerollHighest && roll >= this.rerollHighest ||
                this.rerollLowest && roll <= this.rerollLowest
            ) {
                roll = Dice.roll(1, this.sides);
            }

            if (
                this.explodeHighest && roll >= this.explodeHighest ||
                this.explodeLowest && roll <= this.explodeLowest
            ) {
                count++;
            }

            this.rolls.push(roll);
        }

        this.rolls.sort();

        if (this.dropHighest) {
            this.rolls.splice(-this.dropHighest, this.dropHighest);
        }

        if (this.dropLowest) {
            this.rolls.splice(0, this.dropLowest);
        }

        return this.rolls.reduce((total, roll) => total + roll, 0);
    }

    toString() {
        return '[' + this.rolls.join(', ') + ']';
    }

    static roll(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export class Binomial {
    constructor(trials, probability, successes) {
        this.trials = trials;
        this.probability = probability;
        this.successes = successes;
    }

    evaluate() {
        return Binomial.cdf(Math.round(this.trials.evaluate()), this.probability.evaluate(), Math.round(this.successes.evaluate()));
    }

    static cdf(trials, probability, successes) {
        let cumulative = 0.0;

        for (let i = 0; i <= successes; i++) {
            cumulative += Binomial.pmf(trials, probability, i);
        }

        return cumulative;
    }

    static pmf(trials, probability, successes) {
        return Binomial.combinations(trials, successes)
            * Math.pow(probability, successes)
            * Math.pow(1 - probability, trials - successes);
    }

    static combinations(populationSize, subsetSize) {
        if (subsetSize === 0 || populationSize === subsetSize) {
            return 1;
        }

        return (populationSize / subsetSize) * Binomial.combinations(populationSize - 1, subsetSize - 1);
    }

    toString() {
        return 'bin(' + this.trials.toString() + ', ' + this.probability.toString() + ', ' + this.successes.toString() + ')';
    }
}

export class Float {
    constructor(value) {
        this.value = value;
    }

    evaluate() {
        return parseFloat(this.value);
    }

    toString() {
        return '' + this.value;
    }
}

class BinaryOperator {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}

export class Add extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() + this.right.evaluate();
    }

    toString() {
        return '(' + this.left.toString() + ' + ' + this.right.toString() + ')';
    }
}

export class Subtract extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() - this.right.evaluate();
    }

    toString() {
        return '(' + this.left.toString() + ' - ' + this.right.toString() + ')';
    }
}

export class Multiply extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() * this.right.evaluate();
    }

    toString() {
        return this.left.toString() + ' * ' + this.right.toString();
    }
}

export class Divide extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() / this.right.evaluate();
    }

    toString() {
        return this.left.toString() + ' / ' + this.right.toString();
    }
}

export class Negate {
    constructor(value) {
        this.value = value;
    }

    evaluate() {
        return -this.value.evaluate();
    }

    toString() {
        return '-' + this.right.toString();
    }
}