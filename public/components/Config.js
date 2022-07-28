'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './InputRange.js';

const config = (parent) => {
    const container = createElement({
        classes: ['container'],
        parent
    });

    const header = createElement({
        type: h3,
        content: 'Simulation Settings'
    });

    const amountOfNodes = inputRange({
        label: 'Number of nodes',
        min: 2,
        defaultValue: 100,
        max: 1000,
        isInteger: true,
        parent: container
    })

    return container
}

export default config;