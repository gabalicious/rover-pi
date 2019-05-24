module.exports = class Car {

    constructor() {
        this.motorHat = require('motor-hat')({
            address: 0x60,
            dcs: ['M1', 'M2', 'M3', 'M4'],
            servos: [0, 14]
        });
        this.xAxis = 0;
        this.yAxis = 0;
        this.sharpTurn = [];
        this.acceleration = { fwd: false, back: false, direction: 'fwd' };
        this.axisValue = '00';
        this.motors = [{ speed: 100, frequency: 2048, direction: 'fwd' },
            { speed: 100, frequency: 2048, direction: 'fwd' },
            { speed: 100, frequency: 2048, direction: 'fwd' },
            { speed: 100, frequency: 2048, direction: 'fwd' }
        ];
    }

    init() {
        this.motorHat.init();
        console.log('Car initiated');

    }

    setSpeed(motor) {

        let { speed } = this.motors[motor];
        return new Promise(resolve => {
            this.motorHat.dcs[motor].setSpeed(speed, (err, result) => {
                resolve('resolved');

            });
        })
    }

    updateMotorProperties(property = 'speed', properties = [100, 100, 100, 100]) {

        for (let i = 0; i < properties.length; i++) {
            this.motors[i][property] = properties[i]
        }
    }

    updateMotorState() {

            let { direction } = this.acceleration;
            let directions = [direction, direction, direction, direction]
            this.updateMotorProperties('direction', directions);

            let XY = `${this.xAxis}${this.yAxis}`;
            let sharpTurnY = `${this.sharpTurn.join()}${this.yAxis}`;
            // fwd + noturn
            console.log('xAxis', this.xAxis);
            console.log('yAxis', this.yAxis);

            console.log(this.acceleration);

            if (XY === '01') {
                this.updateMotorProperties();
            }

            // back + noturn
            if (XY === '0-1') {
                this.updateMotorProperties();
            }

            // fwd + left
            if (XY === '-11') {
                this.updateMotorProperties('speed', [100, 30, 100, 30]);
            }


            // fwd + right
            if (XY === '11') {
                this.updateMotorProperties('speed', [30, 100, 30, 100]);

            }
            // back + left

            if (XY === '-1-1') {
                this.updateMotorProperties('speed', [30, 100, 30, 100]);
            }

            if (XY === '1-1') {

                this.updateMotorProperties('speed', [100, 30, 100, 30]);

            }

            // fwd + sharp left
            if (sharpTurnY === 'L1') {

                this.motors[1].speed -= 30;
                this.motors[3].speed -= 30;

            }

            // fwd + sharp right
            if (sharpTurnY === 'R1') {

                this.motors[0].speed -= 30;
                this.motors[2].speed -= 30;

            }
            // back + sharp left

            if (sharpTurnY === 'L-1') {

                this.motors[0].speed -= 30;
                this.motors[2].speed -= 30;
            }
            // back + sharp right

            if (sharpTurnY === 'R-1') {

                this.motors[1].speed -= 30;
                this.motors[3].speed -= 30;
            }

            console.log(this.motors);

            this.updateAccelerationState();

        }
        // Watches for acceleration and then updates motor state
    updateAccelerationState() {

        if (this.acceleration.fwd || this.acceleration.back) {
            this.allMotorsGo();
        } else {
            this.allMotorsStop();

        }
    }

    setFrequency(motor) {

        let { frequency } = this.motors[motor];
        return new Promise(resolve => {
            this.motorHat.dcs[motor].setFrequency(frequency, (err, result) => {
                resolve('resolved');

            });
        })
    }

    setDirection(motor) {

        let { direction } = this.motors[motor];

        return new Promise(resolve => {
            this.motorHat.dcs[motor].run(direction, (err, result) => {
                resolve('resolved');

            });
        })
    }

    stop(motor) {

        return new Promise(resolve => {
            this.motorHat.dcs[motor].stop((err, result) => {
                resolve('resolved');

            });
        })
    }

    allMotorsGo() {
        this.go(0);
        this.go(1);
        this.go(2);
        this.go(3);
    };

    allMotorsStop() {
        this.stop(0);
        this.stop(1);
        this.stop(2);
        this.stop(3);
    };

    async go(motor) {
        await this.setSpeed(motor);
        await this.setFrequency(motor);
        await this.setDirection(motor);
    };

}