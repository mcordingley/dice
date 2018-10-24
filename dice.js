function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const output = document.getElementById('output');

document.getElementById('dice').addEventListener('submit', function (event) {
    event.preventDefault();

    let total = 0;

    ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].forEach(function (id) {
        for (let i = 0, len = parseInt(document.getElementById(id).value, 10); i < len; i++) {
            total += roll(1, parseInt(id.substr(1), 10));
        }
    });

    total += parseInt(document.getElementById('constant').value);

    const node = document.createElement('p');

    node.innerText = total;

    output.insertBefore(node, output.childNodes[0] || null);
});
