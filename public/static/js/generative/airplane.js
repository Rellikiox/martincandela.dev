
/* A paper airplane endlessly flying on the screen

TODO:
- Fade individual line sections, not whole lines
- Render plane in front of lines
*/

const liftForce = -0.005;
const gravityForce = 98;
const dragForce = 0.0001;
const groundDrag = 200;
let lines = [];
let currentLine = {};
let elapsedTime = 0;

let planes = [];

let entities = [];

let pointFrequency = 0.05;
let timeSincePoint = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);

    createPlane(createVector(20, 400), 0, createVector(100, 0));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    drawingContext.setLineDash([10, 50]);
}

function draw() {
    elapsedTime += deltaTime / 1000;

    background('#E8E5CB');

    entities.forEach((entity) => entity.update(entity));
    entities = entities.filter(entity => !entity.isDead).sort((a, b) => a.zIndex - b.zIndex);
    entities.forEach((entity) => entity.draw(entity));
}


function createPlane(position, rotation, velocity) {
    let plane = {
        position: position,
        rotation: rotation,
        velocity: velocity,
        dragForce: createVector(0, 0),
        liftForce: createVector(0, 0),
        gravityForce: createVector(0, 0),
        trail: createLine(),
        isDead: false,
        zIndex: 10,
        draw: (plane) => {
            fill('#AA0000');
            noStroke();
            push();
            translate(plane.position.x, plane.position.y);
            rotate(plane.rotation);
            triangle(0, -10, 35, 0, 0, 10);

            pop();
        },
        update: (plane) => {
            let forward = p5.Vector.fromAngle(plane.rotation).normalize();
            let up = p5.Vector.rotate(forward, HALF_PI);
            let dot = p5.Vector.dot(forward, createVector(0, -1).normalize());
            let velocitySquared = Math.pow(plane.velocity.mag(), 2);
            let horizontalinity = (1 - Math.abs(dot));
            plane.liftForce = p5.Vector.mult(up, (liftForce * horizontalinity * velocitySquared));

            plane.gravityForce = createVector(0, gravityForce);

            plane.dragForce = p5.Vector.mult(p5.Vector.normalize(plane.velocity), - velocitySquared * dragForce);

            let combinedForces = p5.Vector.add(plane.gravityForce, p5.Vector.add(plane.liftForce, plane.dragForce));
            let frameForces = p5.Vector.mult(combinedForces, deltaTime / 1000);
            plane.velocity.add(frameForces);

            plane.position.add(p5.Vector.mult(plane.velocity, deltaTime / 1000));
            plane.rotation = plane.velocity.heading();

            timeSincePoint += deltaTime / 1000;
            if (timeSincePoint >= pointFrequency) {
                timeSincePoint = timeSincePoint % pointFrequency;
                plane.trail.points.push(plane.position.copy());
            }

            while (plane.position.x < 0) {
                plane.position.x += windowWidth;
                plane.trail = createLine();
            }
            if (plane.position.x >= windowWidth) {
                plane.position.x = plane.position.x % windowWidth;
                plane.trail = createLine();
            }
            while (plane.position.y < 0) {
                plane.position.y += windowHeight;
                plane.trail = createLine();
            }
            if (plane.position.y >= windowHeight) {
                plane.position.y = plane.position.y % windowHeight;
                plane.trail = createLine();
            }
        }
    }
    entities.push(plane);
    return plane;
}


function createLine() {
    let line = {
        timestamp: elapsedTime,
        alpha: 1,
        points: [],
        isDead: false,
        zIndex: 5,
        update: (line) => {
            let timeAlive = elapsedTime - line.timestamp;
            line.alpha = constrain(map(timeAlive, 0, 60, 255, 0), 0, 255);
            if (line.alpha <= 0) {
                line.isDead = true;
            }
        },
        draw: (line) => {
            push();
            drawingContext.setLineDash([10, 50]);
            stroke(38, 38, 35, line.alpha);
            strokeWeight(3);
            noFill();

            beginShape();

            line.points.forEach((point) => {
                vertex(point.x, point.y);
            });

            endShape();
            pop();
        }
    }
    entities.push(line);
    return line;
}