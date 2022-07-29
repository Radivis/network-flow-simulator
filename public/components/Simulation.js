'use strict';

import { createElement } from '../util/dom.js';
import config from './config.js'

const simulation = (parent) => {
    const simulationData = {};

    const container = createElement({
        classes: ['container'],
        parent
    });

    const headerEl = createElement({
        type: 'h2',
        parent: container,
        content: 'Simulation'
    });

    config(container, simulationData);

    return container
}

export default simulation;