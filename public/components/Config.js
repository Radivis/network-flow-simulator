'use strict';

import { createElement } from '../util/dom.js';
import inputRange from './inputRange.js';
import configResource from './configResource.js';
import runs from './runs.js';
import castNumberIfNumeric from '../util/string.js';

// Goes through a possibly nested object of HTML elements and returns a possibly nested object of their values
// Used to extract the values from the config form
const mapElementsToValues = object => {
    const array = Object.entries(object);

    const valueArray = array.map(pair => {
        let [key, val] = pair;
        // nested objects get processed recursively
        if (val.constructor == Object) {
            return [key, mapElementsToValues(val)]
        }
        // nested arrays also get processed recursively by entry
        else if (val.constructor == Array) {
            return [key, val.map(entry => mapElementsToValues(entry))]
        } else {
            // Otherwise the value is a HTML input element
            return [key, castNumberIfNumeric(val.value)]
        }
    })

    return Object.fromEntries(valueArray)
}

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
    })

    inputElements.resources = [];

    inputElements.resources.push(configResource(containerEl));

    inputElements.amountOfTicks = inputRange({
        name: 'amountOfTicks',
        label: 'Number of time steps (days) to compute',
        min: 1,
        defaultValue: 360,
        max: 7500,
        step: 30,
        isInteger: true,
        parent: containerEl
    })

    inputElements.amountOfNewRuns = inputRange({
        name: 'amountOfNewRuns',
        label: 'Number of simulation runs',
        min: 1,
        defaultValue: 4,
        max: 240,
        isInteger: true,
        parent: containerEl
    })

    const computeButtonEl = createElement({
        type: 'button',
        parent: containerEl,
        content: 'Run Simulation'
    })
    computeButtonEl.addEventListener('click', () => {
        // Go through all input elements and extract their values
        const config = mapElementsToValues(inputElements);

        // Initialize simulationData object
        simulationData.config = config;

        const newRuns = [...new Array(+config.amountOfNewRuns)].fill({
            progress: 0,
            states: {}
        })

        let amountOfPreviousRuns = 0;
        let runsContainerEl;
        if(simulationData.runs) {
            // Previous runs have been done
            amountOfPreviousRuns = simulationData.runs.length
            simulationData.runs = [...simulationData.runs, ...newRuns]

            runsContainerEl = containerEl.querySelector(`#runs-container-${simulationData.id}`)
        } else {
            // No previous run, initialization required
            simulationData.runs = newRuns;

            runsContainerEl = createElement({
                parent: containerEl,
                classes: ['container'],
                id: `runs-container-${simulationData.id}`
             })
        }

        // Update button label to indicate that extra runs can be simulated
        computeButtonEl.innerHTML = 'Add Extra Simulation Runs'

         // DEBUG
         console.log(simulationData);

         // render and get "Simulation run" buttons
        const runElements = runs(runsContainerEl, simulationData);

        for (let i = amountOfPreviousRuns; i < (config.amountOfNewRuns + amountOfPreviousRuns); i++) {
            // Workers need to have type: 'module', so that they can import the models
            const simulationWorker = new Worker('../workers/simulator.js', { type: 'module' });

            simulationWorker.onmessage = msg => {
                if (msg.data.status == 'complete') {
                    const states = msg.data.payload;
                    simulationData.runs[i].states = states
                    simulationData.runs[i].progress = 1
                    runElements[i].style.backgroundSize = `100% 100%`
                    console.log(states);
                    simulationWorker.terminate();
                } else if (msg.data.status == 'pending') {
                    let progress = msg.data.payload;
                    simulationData.runs[i].progress = progress
                    runElements[i].style.backgroundSize = `${~~(progress*100)}% 100%`
                } else if (msg.data.status == 'debugging') {
                    console.log(msg.data.payload);
                }
            }

            simulationWorker.onerror = console.error

            simulationWorker.postMessage({
                config,
                runIndex: i + 1
            })
        }
    })
}

export default config;