'use strict';

import { createElement } from '../util/dom.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import run from './run.js'
import runs from './runs.js'

const runsContainer = (parent, simulationData, configInputElements) => {
    // clear
    parent.innerHTML = '';

    const headerEl = createElement({
        type: 'h3',
        parent: parent,
        content: 'Simulation Runs'
    });

    const computeButtonEl = createElement({
        type: 'button',
        parent: parent,
        content: 'Run Simulation'
    })
    computeButtonEl.addEventListener('click', () => {
        // Go through all input elements and extract their values
        simulationData.config = mapElementsToValues(configInputElements);

        // Update button label to indicate that extra runs can be simulated
        computeButtonEl.innerHTML = 'Add Extra Simulation Runs'

        // DEBUG
        console.log(simulationData);

        const amountOfPreviousRuns = simulationData.runs ? simulationData.runs.length : 0

         // render and get "Simulation run" buttons
        const runElements = runs(parent, simulationData);

        // Compute new simulation runs with webworkers
        for (let i = amountOfPreviousRuns; i < (simulationData.config.amountOfNewRuns + amountOfPreviousRuns); i++) {
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
                config: simulationData.config,
                runIndex: i + 1
            })
        }
    })
}

export default runsContainer;