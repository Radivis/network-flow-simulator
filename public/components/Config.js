'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './inputRange.js';
import inputText from './inputText.js';
import configResourcesOuter from './configResourcesOuter.js';
import configRules from './configRules.js';

const config = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElements = {}
    const nonInputElements = {}

    nonInputElements.outerContainer = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.innerContainer = createElement({
        classes: ['container'],
        parent: nonInputElements.outerContainer
    });

    nonInputElements.header = createElement({
        type: 'h3',
        parent: nonInputElements.outerContainer,
        content: 'Simulation Settings'
    });

    inputElements.simulationName = inputText({
        name: 'simulationName',
        label: 'Name of simulation',
        min: 2,
        defaultValue: `Simulation ${simulationData.id}`,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.amountOfNodes = inputRange({
        name: 'amountOfNodes',
        label: 'Number of nodes',
        min: 2,
        defaultValue: 100,
        max: 1000,
        isInteger: true,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.rules = configRules(nonInputElements.innerContainer)

    inputElements.amountOfNeighborsInheriting = inputRange({
        name: 'amountOfNeighborsInheriting',
        label: 'After death resources get distributed among the nearest n neighbors',
        min: 1,
        max: 100,
        defaultValue: 3,
        step: 1,
        isInteger: true,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.maxAmountOfDonations = inputRange({
        name: 'maxAmountOfDonations',
        label: 'Maximum number of donations per node and time step',
        min: 1,
        max: 100,
        defaultValue: 5,
        step: 1,
        isInteger: true,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.maxAmountOfExchanges = inputRange({
        name: 'maxAmountOfExchanges',
        label: 'Maximum number of exchanges per node and time step',
        min: 1,
        max: 100,
        defaultValue: 10,
        step: 1,
        isInteger: true,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.resources = configResourcesOuter(nonInputElements.innerContainer, simulationData);

    inputElements.amountOfTicks = inputRange({
        name: 'amountOfTicks',
        label: 'Number of time steps (days) to compute',
        min: 1,
        defaultValue: 360,
        max: 7500,
        step: 30,
        isInteger: true,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.amountOfNewRuns = inputRange({
        name: 'amountOfNewRuns',
        label: 'Number of simulation runs',
        min: 1,
        defaultValue: 4,
        max: 240,
        isInteger: true,
        parent: nonInputElements.innerContainer
    }).field

    return inputElements;
}

export default config;