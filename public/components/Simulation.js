'use strict';

import { createElement } from '../util/dom.js';
import config from './config.js'

const simulation = (parent, simulationData) => {
    const containerEl = createElement({
        classes: ['container'],
        parent
    });

    const headerEl = createElement({
        type: 'h2',
        parent: containerEl,
        content: `Simulation ${simulationData.id}`
    });

    config(containerEl, simulationData);
}

export default simulation;