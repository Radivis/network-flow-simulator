'use strict';

import { createElement } from '../util/dom.js';
import config from './config.js'
import runsContainer from './runsContainer.js';

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

    // #1: Config
    const configInputElements = config(containerEl, simulationData);

    // #2: Runs
    const runsOuterContainerEl = createElement({
        parent: containerEl,
        classes: ['container'],
        id: `runs-container-${simulationData.id}`
     })

     runsContainer(runsOuterContainerEl, simulationData, configInputElements)
}

export default simulation;