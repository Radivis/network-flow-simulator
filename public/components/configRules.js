'use strict';

import { createElement } from '../util/dom.js';
import inputCheckbox from './inputCheckbox.js';

const configRules = (parent) => {
    // Collect input fields in a separate object, so that they can be accessed more easily
    const inputElements = {}
    const nonInputElements = {}
    
    nonInputElements.container = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.header = createElement({
        type: 'h4',
        parent: nonInputElements.container,
        content: 'Simulation Rules'
    });

    inputElements.donations = inputCheckbox({
        name: 'donations',
        label: 'Simulate donations',
        defaultValue: true,
        parent: nonInputElements.container
    }).checkbox

    inputElements.exchanges = inputCheckbox({
        name: 'exchanges',
        label: 'Simulate exchanges (trade)',
        defaultValue: true,
        parent: nonInputElements.container
    }).checkbox

    inputElements.inheritance = inputCheckbox({
        name: 'inheritance',
        label: 'Simulate inheritance (after death of a node)',
        defaultValue: true,
        parent: nonInputElements.container
    }).checkbox

    return inputElements
}

export default configRules;