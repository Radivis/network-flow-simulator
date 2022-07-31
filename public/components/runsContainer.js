'use strict';

import { createElement } from '../util/dom.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import run from './run.js'
import runs from './runs.js'

const runsContainer = (parent, simulationData, configInputElements, renderVisualization) => {
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
        const runElements = runs(parent, simulationData, renderVisualization);

        // Compute new simulation runs with webworkers
        for (let i = amountOfPreviousRuns; i < (simulationData.config.amountOfNewRuns + amountOfPreviousRuns); i++) {
            const currentRun = simulationData.runs[i]

            let index = i

            currentRun.id = index;

            // Workers need to have type: 'module', so that they can import the models
            const simulationWorker = new Worker('../workers/simulator.js', { type: 'module' });

            simulationWorker.onmessage = msg => {
                if (msg.data.status == 'complete') {
                    const states = msg.data.payload;
                    currentRun.states = states
                    currentRun.progress = 1
                    runElements[i].style.backgroundSize = `100% 100%`

                    // DEBUG
                    console.log(states);

                    simulationWorker.terminate();
                } else if (msg.data.status == 'pending') {
                    let progress = msg.data.payload;
                    currentRun.progress = progress
                    runElements[i].style.backgroundSize = `${~~(progress*100)}% 100%`

                } else if (msg.data.status == 'debugging') {
                    console.log(msg.data.payload);
                }
            }

            simulationWorker.onerror = console.error

            simulationWorker.postMessage({
                config: simulationData.config
            })
        }
    })
}

export default runsContainer;