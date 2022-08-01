'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './inputRange.js';
import inputText from './inputText.js';

const configResource = (parent) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElements = {}
    
    const container = createElement({
        classes: ['container'],
        parent
    });

    const header = createElement({
        type: 'h4',
        parent: container,
        content: 'Resource Settings'
    });

    inputElements.name = inputText({
        name: 'name',
        label: 'Name of Resource',
        defaultValue: 'stuff',
        parent: container
    }).field

    inputElements.initialNodeStock = inputRange({
        name: 'initialNodeStock',
        label: 'Node starts with',
        min: 0,
        defaultValue: 100,
        max: 1000,
        step: 4,
        parent: container
    }).field

    inputElements.outflowBaseProbability = inputRange({
        name: 'outflowBaseProbability',
        label: 'Base probability of outflow',
        min: 0,
        defaultValue: 0.01,
        max: 1,
        step: 0.004,
        parent: container
    }).field

    inputElements.outflowMean = inputRange({
        name: 'outflowMean',
        label: 'Median value of outflow as percentage of total resource',
        min: 0,
        defaultValue: 1,
        max: 100,
        step: 0.4,
        parent: container
    }).field

    return inputElements
}

export default configResource;