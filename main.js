'use strict';

const rowName = 'ABCDEFGH';
const initialPosition = 'D4';

let currentPos = initialPosition;
let finalPos;
let moves = 0;
let bestGame = null;
let worstGame = null;
let playedGames = 0;

window.addEventListener('load', () => {
    renderTable();
    setupScore();
    handleButtonBorrar();
    init();
});

function renderTable() {
    let tabla = '';
    for (let i = 8; i > 0; i--) {
        tabla += `<tr><th>${i}</th>`;
        for (let j = 0; j < 8; j++) {
            tabla += `
                <td id="${rowName.charAt(j) + i}" 
                    class="${((i + j) % 2) ? 'negra' : 'blanca'}"></td>`;
        }
        tabla += '</tr><tr><th></th>';
    }
    for (let i = 0; i < 8; i++) {
        tabla += `<th>${rowName.charAt(i)}</th>`;
    }
    tabla += '</tr>';

    tablero.innerHTML = tabla;

    document.getElementById(initialPosition).innerHTML =
        '<img id="caballo" src="./images/caballo.png" width="50px" draggable="true">';
}

function calcTargets(position) {
    const column = rowName.indexOf(position.charAt(0)) + 1;
    const row = Number(position.charAt(1));
    let targets = [];
    targets.push([column + 2, row + 1]);
    targets.push([column + 2, row - 1]);
    targets.push([column - 2, row + 1]);
    targets.push([column - 2, row - 1]);
    targets.push([column + 1, row + 2]);
    targets.push([column + 1, row - 2]);
    targets.push([column - 1, row + 2]);
    targets.push([column - 1, row - 2]);
    return clearTargets(targets).map(cell =>
        rowName.charAt(cell[0] - 1) + cell[1]);
}

function clearTargets(targets) {
    return targets.filter(cell => {
        const column = cell[0];
        const row = cell[1];
        return (column >= 1 && column <= 8 && row >= 1 && row <= 8);
    });
}

function getRandomPosition() {
    const randomColumn = rowName.charAt(Math.floor(Math.random() * 8));
    const randomRow = Math.floor(Math.random() * 8) + 1;
    return randomColumn + randomRow;
}

function setupScore() {
    document.getElementById('played-text').textContent = playedGames;
    document.getElementById('best-mov-text').textContent = bestGame?.moves || 0;
    document.getElementById('best-num-text').textContent = bestGame?.times || 0;
    document.getElementById('worst-mov-text').textContent = worstGame?.moves || 0;
    document.getElementById('worst-num-text').textContent = worstGame?.times || 0;
}

function handleButtonBorrar() {
    document.querySelector('.btn-reinicio').addEventListener('click', () => {
        playedGames = 0;
        bestGame = null;
        worstGame = null;
        setupScore();
    });
}

function init() {
    clearMovimientosAntiguos();
    finalPos = getRandomPosition();
    document.getElementById(finalPos).classList.add('final');
    moves = 0;
    document.getElementById('posicion').textContent = finalPos;
    establecerMovimientos();
    setupDragDrop();
}

function establecerMovimientos() {
    const targets = calcTargets(currentPos);
    targets.forEach(target => {
        const cell = document.getElementById(target);
        if (cell) {
            cell.classList.add('dropable');
        }
    });
}

function clearMovimientosAntiguos() {
    document.querySelectorAll('.dropable').forEach(cell => {
        cell.classList.remove('dropable');
    });
    document.querySelectorAll('.final').forEach(cell => {
        cell.classList.remove('final');
    });
}

function setupDragDrop() {
    const caballo = document.getElementById('caballo');

    caballo.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', currentPos);
    });

    document.querySelectorAll('.dropable').forEach(cell => {
        cell.addEventListener('dragover', event => {
            event.preventDefault();
        });

        cell.addEventListener('drop', event => {
            event.preventDefault();
            const targetId = event.target.closest('td').id;
            moveCaballo(targetId);
        });
    });
}

function moveCaballo(targetId) {
    if (!document.getElementById(targetId).classList.contains('dropable')) return;

    document.getElementById(currentPos).innerHTML = '';
    currentPos = targetId;
    document.getElementById(currentPos).innerHTML =
        '<img id="caballo" src="./images/caballo.png" width="50px" draggable="true">';

    moves++;

    if (currentPos === finalPos) {
        finalizar();
    } else {
        clearMovimientosAntiguos();
        establecerMovimientos();
        setupDragDrop();
    }
}

function finalizar() {
    playedGames++;
    updateScores();
    alert(`¡Has llegado al objetivo en ${moves} movimientos!`);
	if(confirm('Quieres volver a jugar?')){
		init();
	}
}

function updateScores() {
    if (!bestGame || moves < bestGame.moves) {
        bestGame = { moves, times: 1 };
    } else if (moves === bestGame.moves) {
        bestGame.times++;
    }

    if (!worstGame || moves > worstGame.moves) {
        worstGame = { moves, times: 1 };
    } else if (moves === worstGame.moves) {
        worstGame.times++;
    }

    setupScore();
}
