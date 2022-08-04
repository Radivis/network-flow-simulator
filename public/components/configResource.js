'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import updateElementValues from './helpers/updateElementValues.js';
import inputCheckbox from './inputCheckbox.js';
import inputColor from './inputColor.js';
import inputRange from './inputRange.js';
import inputText from './inputText.js';

const configResource = (parent, simulationData, resourceId) => {
    // Collect input fields in a separate object, so that they can be accessed more easily
    const inputElements = {}
    const nonInputElements = {}
    
    nonInputElements.outerContainer = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.innerContainer = createElement({
        classes: ['formal-container'],
        parent: nonInputElements.outerContainer
    });

    inputElements.name = inputText({
        name: 'name',
        label: 'Name of Resource',
        defaultValue: 'Stuff',
        parent: nonInputElements.innerContainer
    }).field

    inputElements.color = inputColor({
        name: 'color',
        label: 'Color',
        defaultValue: '#888',
        parent: nonInputElements.innerContainer
    }).field

    inputElements.initialNodeStock = inputRange({
        name: 'initialNodeStock',
        label: 'Node starts with',
        min: 0,
        defaultValue: 100,
        max: 1000,
        step: 4,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.donationBaseProbability = inputRange({
        name: 'donationBaseProbability',
        label: 'Base probability of donation',
        min: 0,
        defaultValue: 0.01,
        max: 1,
        step: 0.004,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.saleBaseProbability = inputRange({
        name: 'saleBaseProbability',
        label: 'Base sale probability of this resource',
        min: 0,
        defaultValue: 0.03,
        max: 1,
        step: 0.004,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.purchaseBaseProbability = inputRange({
        name: 'purchaseBaseProbability',
        label: 'Base purchase probability of this resource',
        min: 0,
        defaultValue: 0.03,
        max: 1,
        step: 0.004,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.outflowMean = inputRange({
        name: 'outflowMean',
        label: 'Median value of outflow as percentage of total resource',
        min: 0,
        defaultValue: 10,
        max: 100,
        step: 0.4,
        parent: nonInputElements.innerContainer
    }).field

    inputElements.existential = inputCheckbox({
        name: 'existential',
        label: 'Necessary for survival',
        defaultValue: false,
        parent: nonInputElements.innerContainer
    }).checkbox

    // COMPONENT PANEL SETUP

    const importDataCallback = resourceData => {
        updateElementValues(inputElements, resourceData)
    }

    const exportDataCallback = () => {
        return JSON.stringify(mapElementsToValues(inputElements))
    }

    nonInputElements.panel = componentPanel({
        parent: nonInputElements.outerContainer,
        title: `Resource ${resourceId}`,
        headerTagName: 'h5',
        isExportable: true,
        data: simulationData,
        importDataCallback,
        exportDataCallback,
        collapsableContainer: nonInputElements.innerContainer,
        prepend: true,
    })


    return inputElements
}

export default configResource;