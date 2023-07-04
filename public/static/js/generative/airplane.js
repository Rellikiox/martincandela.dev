
/* A paper airplane endlessly flying on the screen

TODO:
- Fade individual line sections, not whole lines
- Render plane in front of lines
*/

const liftForce = -0.005;
const gravityForce = 98;
const dragForce = 0.0001;
const groundDrag = 200;
let two;
let lines = [];
let currentLine = {};
let elapsedTime = 0;

let plane;
let trail;

let background;
let foreground;

function setup() {
    two = new Two({
        type: Two.Types.svg,
        fullscreen: true
    }).appendTo(document.body);

    two.renderer.domElement.style.background = '#E8E5CB';

    background = two.makeGroup();
    foreground = two.makeGroup();

    plane = createPlane(new Two.Vector(20, 400), 0, new Two.Vector(100, 0));
    trail = createLine(plane);

    two.bind('update', update);
    two.play();
}


function update(frameCount, frameDelta) {
    elapsedTime += frameDelta / 1000;

    plane.update(plane, frameDelta);
    trail.update(trail);
}


function createPlane(position, rotation, velocity) {
    let shape = two.makePolygon(position.x, position.y, 10, 3);
    shape.fill = 'rgb(35, 32, 33)';
    shape.noStroke();
    foreground.add(shape);

    let plane = {
        position: position,
        rotation: rotation,
        velocity: velocity,
        dragForce: Two.Vector.zero,
        liftForce: Two.Vector.zero,
        gravityForce: Two.Vector.zero,
        shape: shape,
        teleported: false,
        update: (plane, frameDelta) => {
            // We were using fameDelta to have framerate independent physics, however when the tab is in the background
            // And you tab back in the frameDelta will be several seconds, so the plane will shoot up into the sky, breaking
            // much of the code.
            let fakeFrameDelta = 16

            plane.teleported = false;
            let forward = new Two.Vector(Math.cos(plane.rotation), Math.sin(plane.rotation));
            let up = forward.clone().rotate(Math.PI / 2);
            let dot = forward.dot(Two.Vector.up);
            let velocitySquared = Math.pow(plane.velocity.length(), 2);
            let horizontalinity = (1 - Math.abs(dot));
            plane.liftForce = up.clone().multiply(liftForce * horizontalinity * velocitySquared);

            plane.gravityForce = new Two.Vector(0, gravityForce);

            plane.dragForce = plane.velocity.clone().setLength(- velocitySquared * dragForce);

            let combinedForces = Two.Vector.add(plane.gravityForce, Two.Vector.add(plane.liftForce, plane.dragForce));
            let frameForces = combinedForces.multiply(fakeFrameDelta / 1000);
            plane.velocity.add(frameForces);

            plane.position.add(plane.velocity.clone().multiply(fakeFrameDelta / 1000));
            plane.rotation = Two.Vector.angleBetween(plane.velocity, Two.Vector.right);

            plane.shape.position.x = plane.position.x;
            plane.shape.position.y = plane.position.y;
            plane.shape.rotation = plane.rotation + Math.PI / 2;


            if (plane.position.x < 0 || plane.position.x >= two.width || plane.position.y < 0 || plane.position.y >= two.height) {
                plane.position.x = ((plane.position.x % two.width) + two.width) % two.width;
                plane.position.y = ((plane.position.y % two.height) + two.height) % two.height;
                plane.teleported = true;
            }
        }
    }
    return plane;
}


function createLine(parent) {

    function createShape() {
        let shape = two.makeCurve([new Two.Anchor(parent.position.x, parent.position.y), new Two.Anchor(parent.position.x, parent.position.y)], true);
        shape.vertices[0].x = shape.position.x;
        shape.vertices[0].y = shape.position.y;
        shape.vertices[1].x = shape.position.x;
        shape.vertices[1].y = shape.position.y;
        shape.position.x = 0;
        shape.position.y = 0;
        shape.stroke = 'rgb(35, 32, 33, 1)';
        shape.dashes = [10, 50];
        shape.linewidth = 3;
        shape.noFill();
        shape.cap = 'rounded';
        shape.position = Two.Vector.zero;
        background.add(shape);
        return shape;
    }

    let line = {
        timestamp: elapsedTime,
        alpha: 1,
        zIndex: 5,
        shape: createShape(),
        parent: parent,
        previousShapes: [],
        update: (line) => {
            if (line.parent.teleported) {
                line.previousShapes.unshift(line.shape);
                line.shape = createShape();
            }

            let lastPoint = line.shape.vertices[line.shape.vertices.length - 1];
            lastPoint.x = parent.position.x;
            lastPoint.y = parent.position.y;

            let prevPoint = line.shape.vertices[line.shape.vertices.length - 2];
            if (prevPoint.distanceTo(lastPoint) > 25) {
                line.shape.vertices.splice(line.shape.vertices.length - 1, 0, makePoint(parent.position));
            }

            line.previousShapes.forEach((shape, index) => {
                let opacity = (10 - index) / 10;
                shape.stroke = `rgba(35, 32, 33, ${opacity})`;
            });

            if (line.previousShapes.length == 15) {
                var shape = line.previousShapes.pop();
                shape.remove();
            }
        }
    }
    return line;
}


function makePoint(x, y) {

    if (arguments.length <= 1) {
        y = x.y;
        x = x.x;
    }

    var v = new Two.Anchor(x, y);
    v.position = new Two.Vector().copy(v);

    return v;

}


setup();