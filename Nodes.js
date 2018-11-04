export class Dice {
    constructor(number, sides) {
        this.number = number;
        this.sides = sides;
    }

    evaluate() {
        let total = 0;

        for (let i = 0; i < this.number; i++) {
            total += Dice.roll(1, this.sides);
        }

        return total;
    }

    static roll(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export class Float {
    constructor(value) {
        this.value = value;
    }

    evaluate() {
        return parseFloat(this.value);
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
}

export class Subtract extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() - this.right.evaluate();
    }
}

export class Multiply extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() * this.right.evaluate();
    }
}

export class Divide extends BinaryOperator {
    evaluate() {
        return this.left.evaluate() / this.right.evaluate();
    }
}

export class Negate {
    constructor(value) {
        this.value = value;
    }

    evaluate() {
        return -this.value.evaluate();
    }
}