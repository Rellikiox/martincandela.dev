
function setup() {
    createCanvas(windowWidth, windowHeight);
}

let elapsedTime = 0;

function draw() {
    elapsedTime += deltaTime;
    let timeFactor = elapsedTime / 50;

    background('#121B21');
    fill('#3098E8');

    let separation = 50;
    let rectLength = 30;
    let rectWidth = 5;
    let halfRectWidth = rectWidth / 2;
    let width = Math.ceil(windowWidth / separation) + 1;
    let height = Math.ceil(windowHeight / separation) + 1;

    for (let i = -1; i <= width; i++) {
        for (let j = -1; j <= height; j++) {
            push();

            let x = (i * separation + timeFactor) % (width * separation) - separation;
            let y = (j * separation + timeFactor) % (height * separation) - separation;

            translate(x + halfRectWidth, y + halfRectWidth);

            let angle = Math.atan2(mouseY - y, mouseX - x);
            rotate(angle);

            translate(-halfRectWidth);

            rect(0, 0, rectLength, rectWidth, 3);

            pop();
        }
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}