'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './inputRange.js';
import configResourcesOuter from './configResourcesOuter.js';
import configRules from './configRules.js';

const config = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElements = {}
    const nonInputElements = {}

    nonInputElements.container = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.header = createElement({
        type: 'h3',
        parent: nonInputElements.container,
        content: 'Simulation Settings'
    });

    inputElements.amountOfNodes = inputRange({
        name: 'amountOfNodes',
        label: 'Number of nodes',
        min: 2,
        defaultValue: 100,
        max: 1000,
        isInteger: true,
        parent: nonInputElements.container
    }).field

    inputElements.rules = configRules(nonInputElements.container)

    inputElements.amountOfNeighborsInheriting = inputRange({
        name: 'amountOfNeighborsInheriting',
        label: 'After death resources get distributed among the nearest n neighbors',
        min: 1,
        max: 100,
        defaultValue: 3,
        step: 1,
        isInteger: true,
        parent: nonInputElements.container
    }).field

    inputElements.resources = configResourcesOuter(nonInputElements.container);

    inputElements.amountOfTicks = inputRange({
        name: 'amountOfTicks',
        label: 'Number of time steps (days) to compute',
        min: 1,
        defaultValue: 360,
        max: 7500,
        step: 30,
        isInteger: true,
        parent: nonInputElements.container
    }).field

    inputElements.amountOfNewRuns = inputRange({
        name: 'amountOfNewRuns',
        label: 'Number of simulation runs',
        min: 1,
        defaultValue: 4,
        max: 240,
        isInteger: true,
        parent: nonInputElements.container
    }).field

    return inputElements;
}

export default config;