const Car = require("./car.js");
const { spawn } = require('child_process');

let car1 = new Car();
car1.init();

const gamepad = require("gamepad");

// Initialize the library
gamepad.init()

// List the state of all currently attached devices

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

// Listen for move events on all gamepads
gamepad.on("move", function(id, axis, value) {
    car1.axisValue = `${axis}${value}`

    // left
    if (car1.axisValue === '0-1') {
        car1.xAxis = -1;
        car1.updateMotorState();
    }
    // right
    if (car1.axisValue === '01') {
        car1.xAxis = 1;
        car1.updateMotorState();
    }
    // stright
    console.log(car1.axisValue);

    if (car1.axisValue.includes('0-0.00392')) {
        car1.xAxis = 0;
        car1.updateMotorState();
    }
});

// Listen for button up events on all gamepads
gamepad.on("up", function(id, num) {
    console.log('up');

    if (num === 0) {
        car1.acceleration.fwd = false;
        car1.updateMotorState();

    }

    if (num === 1) {
        car1.acceleration.back = false;
        car1.updateMotorState();
    }

    // lb
    if (num === 6) {
        car1.sharpTurn.shift();
        car1.updateMotorState();
    }
    // rb
    if (num === 7) {
        car1.sharpTurn.pop();
        car1.updateMotorState();
    }

});

// Listen for button down events on all gamepads
gamepad.on("down", function(id, num) {
    // a
    console.log(num);

    if (num === 0) {
        car1.yAxis = 1;
        car1.acceleration.fwd = true;
        car1.acceleration.direction = 'fwd';
        car1.updateMotorState();
    }
    // b
    if (num === 1) {
        car1.yAxis = -1
        car1.acceleration.back = true;
        car1.acceleration.direction = 'back';
        car1.updateMotorState();

    }

    // lb
    if (num === 6) {
        car1.sharpTurn.push('L')
        car1.sharpTurn.sort()
        car1.updateMotorState();
    }
    // rb
    if (num === 7) {
        car1.sharpTurn.push('R')
        car1.sharpTurn.sort()
        car1.updateMotorState();
    }
    if (num === 10) {
        restartProcess();
    }
});

restartProcess = () => {
    process.exit(1);

}