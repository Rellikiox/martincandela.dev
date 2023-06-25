
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

    entities.push(createDebugPlane(createVector(20, 400), 0, createVector(100, 0)));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    drawingContext.setLineDash([10, 50]);
}

function draw() {
    elapsedTime += deltaTime / 1000;

    background('#E8E5CB');


    stroke('#262623');
    strokeWeight(3);
    noFill();
    lines.forEach(drawLine);

    planes.forEach(updatePlane);
    noStroke();
    planes.forEach(drawPlane);

    entities.forEach((entity) => entity.update(entity));
    entities.forEach((entity) => entity.draw(entity));
}

function mousePressed() {
    planes[0].velocity.add(createVector(0, -100));

    currentLine = [];
    lines.push(currentLine);
}

function mouseReleased() {
    // console.log(lines[lines.length - 1].length);
}

function mouseDragged() {
    currentLine.push(createVector(mouseX, mouseY));
}


function updatePlane(plane) {
    if (plane.grounded) {
        return;
    }
    let deltaSeconds = deltaTime / 1000;

    // Substract gravity
    plane.velocity.y += gravity * deltaSeconds;

    // Update position based on final velocty
    plane.position.add(p5.Vector.mult(plane.velocity, deltaSeconds));

    // If we're on the ground reset Y
    if (plane.position.y > plane.startY) {
        plane.velocity.y = 0;
        // Apply ground drag
        plane.velocity.x -= groundDrag * deltaSeconds;
        if (plane.velocity.x <= 0) {
            plane.grounded = true;
        }
    }

    if (!plane.grounded) {
        plane.lastHeading = plane.velocity.heading();
    }

    plane.trail.push(plane.position.copy());
}


function drawPlane(plane) {
    if (plane.grounded) {
        fill('#AA0000');
    } else {
        fill('#000000');
    }
    push();
    translate(plane.position.x, plane.position.y);
    rotate(plane.lastHeading);
    triangle(0, -10, 35, 0, 0, 10);
    pop();
}

function newPlane() {
    plane = {
        position: createVector(50, 500),
        velocity: createVector(10, -150),
        startY: 700,
        trail: [],
        grounded: false,
        lastHeading: null
    };
    lines.push(plane.trail);
    return plane;
}

function drawLine(points) {
    push();
    drawingContext.setLineDash([10, 50]);
    stroke('#262623');
    strokeWeight(3);
    noFill();

    beginShape();

    points.forEach((point) => {
        vertex(point.x, point.y);
    });

    endShape();
    pop();
}

function createDebugPlane(position, rotation, velocity) {
    let plane = {
        position: position,
        rotation: rotation,
        velocity: velocity,
        dragForce: createVector(0, 0),
        liftForce: createVector(0, 0),
        gravityForce: createVector(0, 0),
        trail: [],
        draw: (plane) => {
            fill('#AA0000');
            push();
            translate(plane.position.x, plane.position.y);
            rotate(plane.rotation);
            triangle(0, -10, 35, 0, 0, 10);

            pop();
            translate(plane.position.x, plane.position.y);

            // drawingContext.setLineDash([]);
            // stroke(0);
            // line(0, 0, plane.liftForce.x, plane.liftForce.y);
            // stroke(50);
            // line(0, 0, plane.gravityForce.x, plane.gravityForce.y);
            // stroke(200);
            // line(0, 0, plane.gravityForce.x + plane.liftForce.x, plane.gravityForce.y + plane.liftForce.y);
            // stroke(200, 200, 0);
            // line(0, 0, plane.dragForce.x, plane.dragForce.y);
        },
        update: (plane) => {
            // let angleToMouse = Math.atan2(mouseY - plane.position.y, mouseX - plane.position.y);

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
                plane.trail.push(plane.position.copy());
            }

            while (plane.position.x < 0) {
                plane.position.x += windowWidth;
                plane.trail = [];
                lines.push(plane.trail);
            }
            if (plane.position.x >= windowWidth) {
                plane.position.x = plane.position.x % windowWidth;
                plane.trail = [];
                lines.push(plane.trail);
            }
            while (plane.position.y < 0) {
                plane.position.y += windowHeight;
                plane.trail = [];
                lines.push(plane.trail);
            }
            if (plane.position.y >= windowHeight) {
                plane.position.y = plane.position.y % windowHeight;
                plane.trail = [];
                lines.push(plane.trail);
            }
        }
    }
    lines.push(plane.trail);
    return plane;
}