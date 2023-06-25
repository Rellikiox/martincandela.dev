
function setup() {
    createCanvas(windowWidth, windowHeight);
    setUpGrid();

    grid[4][4] = true;
    grid[4][5] = true;
    grid[4][6] = true;
}

let updateFrequency = 0.5;
let timeSinceUpdate = 0;
let cellSize = 25;
let grid = [];

function draw() {
    background('#121B21');
    fill('#3098E8');
    noStroke();

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j]) {
                rect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }

    strokeWeight(4);
    stroke(51);
    noFill();
    let [x, y] = mouseCell();
    rect(x * cellSize, y * cellSize, cellSize, cellSize, 5);

    if (!mouseIsDragging && animationIsPlaying) {
        timeSinceUpdate += deltaTime / 1000;
        if (timeSinceUpdate > updateFrequency) {
            timeSinceUpdate = timeSinceUpdate % updateFrequency;
            updateGrid();
        }
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setUpGrid();
}


function setUpGrid() {
    let gridWidth = Math.ceil(windowWidth / cellSize);
    let gridHeight = Math.ceil(windowHeight / cellSize);

    grid = [];
    for (let i = 0; i < gridWidth; i++) {
        let row = [];
        for (let j = 0; j < gridHeight; j++) {
            row.push(false);
        }
        grid.push(row);
    }
}


function updateGrid() {
    let newGrid = structuredClone(grid);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            let isAlive = grid[i][j];
            let adjacent = adjacentAlive(i, j);
            if (isAlive && (adjacent <= 1 || adjacent >= 4)) {
                newGrid[i][j] = false;
            } else if (!isAlive && adjacent == 3) {
                newGrid[i][j] = true;
            }
        }
    }
    grid = newGrid;
}

function adjacentAlive(x, y) {
    let count = 0;
    if (x > 0 && y > 0 && grid[x - 1][y - 1])
        count++;
    if (y > 0 && grid[x][y - 1])
        count++;
    if (x < grid.length - 1 && y > 0 && grid[x + 1][y - 1])
        count++;
    if (x > 0 && grid[x - 1][y])
        count++;
    if (x < grid.length - 1 && grid[x + 1][y])
        count++;
    if (x > 0 && y < grid[0].length - 1 && grid[x - 1][y + 1])
        count++;
    if (y < grid[0].length - 1 && grid[x][y + 1])
        count++;
    if (x < grid.length - 1 && y < grid[0].length - 1 && grid[x + 1][y + 1])
        count++;
    return count;
}


/* Mouse related stuff */

let cellsInDrag;
let mouseIsDragging = false;

function mouseCell() {
    return [Math.floor(mouseX / cellSize), Math.floor(mouseY / cellSize)];
}

// function mouseClicked() {
//     let [x, y] = mouseCell();
//     grid[x][y] = !grid[x][y];
// }

function mousePressed() {
    cellsInDrag = [];
    mouseIsDragging = true;
}

function mouseDragged() {
    let cell = mouseCell();
    if (cellsInDrag.length == 0 || cellsInDrag.indexOf(JSON.stringify(cell)) === -1) {
        let [x, y] = cell;
        cellsInDrag.push(JSON.stringify(cell));
        grid[x][y] = !grid[x][y];
    }
}

function mouseReleased() {
    cellsInDrag = null;
    mouseIsDragging = false;
}


/* Animation Controls */

let animationIsPlaying = true;

function playAnimation() {
    animationIsPlaying = true;
    document.getElementById('controls').classList.add('is-playing');
}

function pauseAnimation() {
    animationIsPlaying = false;
    document.getElementById('controls').classList.remove('is-playing');
}
