let spec = {
    address: 0x60,
    dcs: ['M1', 'M2', 'M3', 'M4'],
    servos: [0, 14]
};
let xAxis = 0; // [-1] left or [1] right
let yAxis = 0; // [-1] back or [1] fwd
let sharpTurn = [];
let acceleration = { fwd: false, back: false, direction: 'fwd' };
let axisValue = '00'
const motorHat = require('motor-hat')(spec);
let motors = {
    0: { speed: 100, frequency: 2048, direction: 'fwd' },
    1: { speed: 100, frequency: 2048, direction: 'fwd' },
    2: { speed: 100, frequency: 2048, direction: 'fwd' },
    3: { speed: 100, frequency: 2048, direction: 'fwd' }
};

motorHat.init();
const gamepad = require("gamepad");

// Initialize the library
gamepad.init()

// List the state of all currently attached devices
for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
    // console.log(i, gamepad.deviceAtIndex());
}

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

// Listen for move events on all gamepads
gamepad.on("move", function(id, axis, value) {
    axisValue = `${axis}${value}`
    console.log('axisValue', axis, value);

    // left
    if (axisValue === '0-1') {
        xAxis = -1;
        updateMotorState();
    }
    // right
    if (axisValue === '01') {
        xAxis = 1;
        updateMotorState();
    }
    // stright
    console.log('axisValue');

    if (axisValue.includes('0-0.00392')) {
        xAxis = 0;
        updateMotorState();
    }
});

// Listen for button up events on all gamepads
gamepad.on("up", function(id, num) {

    if (num === 0) {
        acceleration.fwd = false;
        updateMotorState();

    }

    if (num === 1) {
        acceleration.back = false;
        updateMotorState();
    }

    // lb
    if (num === 6) {
        sharpTurn.shift();
        updateMotorState();
    }
    // rb
    if (num === 7) {
        sharpTurn.pop();
        updateMotorState();
    }
    console.log(sharpTurn)

});

// Listen for button down events on all gamepads
gamepad.on("down", function(id, num) {
    console.log(num);
    // a
    if (num === 0) {
        console.log('a');

        yAxis = 1;
        acceleration.fwd = true;
        acceleration.direction = 'fwd';
        updateMotorState();
    }
    // b
    if (num === 1) {
        console.log('b');
        yAxis = -1
        acceleration.back = true;
        acceleration.direction = 'back';
        updateMotorState();

    }

    // lb
    if (num === 6) {
        sharpTurn.push('L')
        sharpTurn.sort()
        updateMotorState();
    }
    // rb
    if (num === 7) {
        sharpTurn.push('R')
        sharpTurn.sort()
        updateMotorState();
    }
    console.log(sharpTurn)
});


function setSpeed(motor) {

    let { speed } = motors[motor];
    return new Promise(resolve => {
        motorHat.dcs[motor].setSpeed(speed, (err, result) => {
            resolve('resolved');
            // console.log('setSpeed');

        });
    })
}

function updateMotorState() {
    motors[0].direction = acceleration.direction;
    motors[1].direction = acceleration.direction;
    motors[2].direction = acceleration.direction;
    motors[3].direction = acceleration.direction;

    let XY = `${xAxis}${yAxis}`;
    console.log('XY', XY);

    let sharpTurnY = `${sharpTurn.join()}${yAxis}`;
    // fwd + noturn
    if (XY === '01') {
        console.log('fwd');

        motors[0].speed = 100
        motors[1].speed = 100
        motors[2].speed = 100
        motors[3].speed = 100
    }

    // back + noturn
    if (XY === '0-1') {
        console.log('back');

        motors[0].speed = 100
        motors[1].speed = 100
        motors[2].speed = 100
        motors[3].speed = 100
    }

    // fwd + left
    if (XY === '-11') {
        console.log('fwd + left');

        motors[0].speed = 100;
        motors[1].speed = 30;
        motors[2].speed = 100;
        motors[3].speed = 30;

    }


    // fwd + right
    if (XY === '11') {
        console.log('fwd + right');

        motors[0].speed = 30;
        motors[1].speed = 100;
        motors[2].speed = 30;
        motors[3].speed = 100;

    }
    // back + left
    console.log(XY);

    if (XY === '-1-1') {
        console.log('back + left');

        motors[0].speed = 30;
        motors[1].speed = 100;
        motors[2].speed = 30;
        motors[3].speed = 100;
    }

    if (XY === '1-1') {
        console.log('back + right');

        motors[0].speed = 100;
        motors[1].speed = 30;
        motors[2].speed = 100;
        motors[3].speed = 30;
    }

    // fwd + sharp left
    if (sharpTurnY === 'L1') {
        console.log('sharpTurnY fwd left');

        motors[1].speed -= 30;
        motors[3].speed -= 30;

    }


    // fwd + sharp right
    if (sharpTurnY === 'R1') {
        console.log('sharpTurnY fwd right');

        motors[0].speed -= 30;
        motors[2].speed -= 30;

    }
    // back + sharp left

    if (sharpTurnY === 'L-1') {
        console.log('sharpTurnY back left');

        motors[0].speed -= 30;
        motors[2].speed -= 30;
    }
    // back + sharp right

    if (sharpTurnY === 'R-1') {
        console.log('sharpTurnY back right');

        motors[1].speed -= 30;
        motors[3].speed -= 30;
    }

    // console.log('xAxis ', xAxis, 'yAxis', yAxis, 'acceleration', acceleration);

    if (acceleration.fwd || acceleration.back) {
        allMotorsGo();
    } else {
        allMotorsStop();

    }

}

function setFrequency(motor) {

    let { frequency } = motors[motor];
    return new Promise(resolve => {
        motorHat.dcs[motor].setFrequency(frequency, (err, result) => {
            resolve('resolved');

        });
    })
}

function setDirection(motor) {

    let { direction } = motors[motor];

    return new Promise(resolve => {
        motorHat.dcs[motor].run(direction, (err, result) => {
            resolve('resolved');

        });
    })
}

function stop(motor) {

    return new Promise(resolve => {
        motorHat.dcs[motor].stop((err, result) => {
            resolve('resolved');

        });
    })
}

function allMotorsGo() {
    go(0);
    go(1);
    go(2);
    go(3);
};

function allMotorsStop() {
    stop(0);
    stop(1);
    stop(2);
    stop(3);
};

async function go(motor) {
    await setSpeed(motor);
    await setFrequency(motor);
    await setDirection(motor);
};
