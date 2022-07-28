'use strict';

const math = {
    createInteger(min, max) {return ~~(Math.random() * (max - min + 1) + min)},

    clamp(value, min, max) {
        if (value > max) return max;
        if (value < min) return min;
        return value;
    } 
}

export default math;

export let { clamp, createInteger } = math;