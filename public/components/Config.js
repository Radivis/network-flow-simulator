'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './inputRange.js';
import configResourcesOuter from './configResourcesOuter.js';

const config = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElements = {}

    const containerEl = createElement({
        classes: ['container'],
        parent
    });

    const headerEl = createElement({
        type: 'h3',
        parent: containerEl,
        content: 'Simulation Settings'
    });

    inputElements.amountOfNodes = inputRange({
        name: 'amountOfNodes',
        label: 'Number of nodes',
        min: 2,
        defaultValue: 100,
        max: 1000,
        isInteger: true,
        parent: containerEl
    }).field

    inputElements.resources = configResourcesOuter(containerEl);

    inputElements.amountOfTicks = inputRange({
        name: 'amountOfTicks',
        label: 'Number of time steps (days) to compute',
        min: 1,
        defaultValue: 360,
        max: 7500,
        step: 30,
        isInteger: true,
        parent: containerEl
    }).field

    inputElements.amountOfNewRuns = inputRange({
        name: 'amountOfNewRuns',
        label: 'Number of simulation runs',
        min: 1,
        defaultValue: 4,
        max: 240,
        isInteger: true,
        parent: containerEl
    }).field

    return inputElements;
}

export default config;