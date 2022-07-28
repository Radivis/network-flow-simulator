'use strict';

const math = {
    createInteger(min, max) {return ~~(Math.random() * (max - min + 1) + min)}
}

export default math;

export let { createInteger } = math;