'use strict';

import { createElement } from '../util/dom.js';
import inputCheckbox from './inputCheckbox.js';
import inputColor from './inputColor.js';
import inputRange from './inputRange.js';
import inputText from './inputText.js';

const configResource = (parent) => {
    // Collect input fields in a separate object, so that they can be accessed more easily
    const inputElements = {}
    const nonInputElements = {}
    
    nonInputElements.container = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.header = createElement({
        type: 'h5',
        parent: nonInputElements.container,
        content: 'Stuff'
    });

    inputElements.name = inputText({
        name: 'name',
        label: 'Name of Resource',
        defaultValue: 'Stuff',
        parent: nonInputElements.container
    }).field
    inputElements.name.addEventListener('input', () => {
        nonInputElements.header.innerHTML = inputElements.name.value
    })

    inputElements.color = inputColor({
        name: 'color',
        label: 'Color',
        defaultValue: '#888',
        parent: nonInputElements.container
    }).field

    inputElements.initialNodeStock = inputRange({
        name: 'initialNodeStock',
        label: 'Node starts with',
        min: 0,
        defaultValue: 100,
        max: 1000,
        step: 4,
        parent: nonInputElements.container
    }).field

    inputElements.outflowBaseProbability = inputRange({
        name: 'outflowBaseProbability',
        label: 'Base probability of outflow',
        min: 0,
        defaultValue: 0.01,
        max: 1,
        step: 0.004,
        parent: nonInputElements.container
    }).field

    inputElements.outflowMean = inputRange({
        name: 'outflowMean',
        label: 'Median value of outflow as percentage of total resource',
        min: 0,
        defaultValue: 10,
        max: 100,
        step: 0.4,
        parent: nonInputElements.container
    }).field

    inputElements.existential = inputCheckbox({
        name: 'existential',
        label: 'Necessary for survival',
        defaultValue: false,
        parent: nonInputElements.container
    }).checkbox

    return inputElements
}

export default configResource;