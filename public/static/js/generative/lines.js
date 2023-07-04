
let two;
let elapsed = 0;
let timeSpeed = 0.05;
let lines = [];
let mouse = { x: 0, y: 0 };
let separation = 70;
let nLinesWide = 0;
let nLinesTall = 0;

function setup() {
    two = new Two({
        type: Two.Types.svg,
        fullscreen: true
    }).appendTo(document.body);

    two.renderer.domElement.style.background = '#121B21';

    two.bind('resize', resize);
    two.bind('update', update);

    resize();

    window.addEventListener('mousemove', pointermove);

    two.play();
}

function resize() {
    createLines(two.width, two.height)
}

function update(frameCount, frameDelta) {
    elapsed += frameDelta / 1000;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let [p0, p1] = line.vertices;
        let angle = Math.atan2(mouse.y - p0.y, mouse.x - p0.x);
        p0.x = (line.i * separation + elapsed * 100) % (nLinesWide * separation) - separation;
        // p0.y = (line.j * separation + elapsed * 100) % (nLinesTall * separation) - separation;
        p1.x = p0.x + Math.cos(angle) * 30;
        p1.y = p0.y + Math.sin(angle) * 30;
    }
}


function createLines(canvasWidth, canvasHeight) {
    lines.forEach(rect => rect.remove());
    lines = [];
    let rectWidth = 30;
    let rectHeight = 5;
    nLinesWide = Math.ceil(canvasWidth / separation) + 1;
    nLinesTall = Math.ceil(canvasHeight / separation) + 1;
    for (let i = -1; i <= nLinesWide; i++) {
        for (let j = -1; j <= nLinesTall; j++) {
            let x = i * separation;
            let y = j * separation;

            let line = two.makeLine(x, y, x + rectWidth, y);
            line.stroke = '#3098E8';
            line.closed = false;
            line.linewidth = rectHeight;
            line.cap = 'round';
            line.i = i;
            line.j = j;
            lines.push(line);
        }
    }
}

function pointermove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

setup();