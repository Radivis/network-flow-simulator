'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import updateElementValues from './helpers/updateElementValues.js';
import inputRange from './inputRange.js';
import inputText from './inputText.js';
import configResourcesOuter from './configResourcesOuter.js';
import configRules from './configRules.js';

const config = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElements = {}
    const nonInputElements = {}

    nonInputElements.outerContainer = createElement({
        parent,
        classes: ['container'],
    });

    nonInputElements.innerContainer = createElement({
        parent: nonInputElements.outerContainer,
        classes: ['formal-container'],
    });

    inputElements.simulationName = inputText({
        parent: nonInputElements.innerContainer,
        name: 'simulationName',
        label: 'Name of simulation',
        min: 2,
        defaultValue: `Simulation ${simulationData.id}`,
    }).field

    inputElements.amountOfNodes = inputRange({
        parent: nonInputElements.innerContainer,
        name: 'amountOfNodes',
        label: 'Number of nodes',
        min: 2,
        defaultValue: 100,
        max: 1000,
        isInteger: true,
    }).field

    inputElements.rules = configRules(nonInputElements.innerContainer)

    inputElements.amountOfNeighborsInheriting = inputRange({
        parent: nonInputElements.innerContainer,
        name: 'amountOfNeighborsInheriting',
        label: 'After death resources get distributed among the nearest n neighbors',
        min: 1,
        max: 100,
        defaultValue: 3,
        step: 1,
        isInteger: true,
    }).field

    inputElements.maxAmountOfDonations = inputRange({
        parent: nonInputElements.innerContainer,
        name: 'maxAmountOfDonations',
        label: 'Maximum number of donations per node and time step',
        min: 1,
        max: 100,
        defaultValue: 5,
        step: 1,
        isInteger: true,
    }).field

    inputElements.maxAmountOfExchanges = inputRange({
        parent: nonInputElements.innerContainer,
        name: 'maxAmountOfExchanges',
        label: 'Maximum number of exchanges per node and time step',
        min: 1,
        max: 100,
        defaultValue: 10,
        step: 1,
        isInteger: true,
    }).field

    const { inputElementsArray, importResourceDataCallback } = configResourcesOuter(nonInputElements.innerContainer, simulationData);

    inputElements.resources = inputElementsArray

    inputElements.amountOfTicks = inputRange({
        parent: nonInputElements.innerContainer,
        name: 'amountOfTicks',
        label: 'Number of time steps (days) to compute',
        min: 1,
        defaultValue: 360,
        max: 7500,
        step: 30,
        isInteger: true,
    }).field

    inputElements.amountOfNewRuns = inputRange({
        parent: nonInputElements.innerContainer,
        name: 'amountOfNewRuns',
        label: 'Number of simulation runs',
        min: 1,
        defaultValue: 4,
        max: 240,
        isInteger: true,
    }).field

    // COMPONENT PANEL SETUP

    const importDataCallback = configData => {
        importResourceDataCallback(configData.resources);
        updateElementValues(inputElements, configData)
    }

    const exportDataCallback = () => {
        return JSON.stringify(mapElementsToValues(inputElements))
    }

    nonInputElements.panel = componentPanel({
        parent: nonInputElements.outerContainer,
        title: `Simulation Settings`,
        headerTagName: 'h3',
        isExportable: true,
        data: simulationData,
        importDataCallback,
        exportDataCallback,
        collapsableContainer: nonInputElements.innerContainer,
        prepend: true,
    })

    return { inputElements, importConfigDataCallback: importDataCallback };
}

export default config;