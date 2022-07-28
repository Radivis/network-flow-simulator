'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './inputRange.js';
import configResource from './configResource.js';

// Goes through a possibly nested object of HTML elements and returns a possibly nested object of their values 
const mapElementsToValues = object => {
    const array = Object.entries(object);

    const valueArray = array.map(pair => {
        let [key, val] = pair;
        // nested objects get processed recursively
        if (val.constructor == Object) {
            return [key, mapElementsToValues(val)]
        } else {
            // Otherwise the value is a HTML input element
            return [key, val.value]
        }
    })

    return Object.fromEntries(valueArray)
}

const config = (parent) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElements = {}

    const container = createElement({
        classes: ['container'],
        parent
    });

    const headerEl = createElement({
        type: 'h3',
        parent: container,
        content: 'Simulation Settings'
    });

    inputElements.amountOfNodes = inputRange({
        name: 'amountOfNodes',
        label: 'Number of nodes',
        min: 2,
        defaultValue: 100,
        max: 1000,
        isInteger: true,
        parent: container
    })

    inputElements.resource = configResource(container);

    inputElements.amountOfTicks = inputRange({
        name: 'amountOfTicks',
        label: 'Number of time steps (days) to compute',
        min: 1,
        defaultValue: 1000,
        max: 160000,
        step: 365,
        isInteger: true,
        parent: container
    })

    inputElements.amountOfRuns = inputRange({
        name: 'amountOfRuns',
        label: 'Number of simulation runs',
        min: 1,
        defaultValue: 4,
        max: 240,
        isInteger: true,
        parent: container
    })

    const computeButtonEl = createElement({
        type: 'button',
        parent: container,
        content: 'Run Simulation'
    }
    )
    computeButtonEl.addEventListener('click', () => {
        // Go through all input elements and extract their values
        const config = mapElementsToValues(inputElements);

        for (let i = 0; i < config.amountOfRuns; i++) {
            // Workers need to have type: 'module', so that they can import the models
            const simulationWorker = new Worker('../workers/simulator.js', {type: 'module'});

            simulationWorker.postMessage(config)

            simulationWorker.onmessage = msg => {
                if (msg.data.status == 'complete') {
                    console.log(msg.data);
                    simulationWorker.terminate();
                } else if (msg.data.status == 'debugging') {
                    console.log(msg.data.payload);
                }
            }

            simulationWorker.onerror = console.error
        }
    })

    return container
}

export default config;