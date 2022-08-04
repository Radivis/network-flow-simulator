'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import runsInner from './runsInner.js'

const runsOuter = (parent, simulationData, configInputElements, renderVisualization) => {
    const elements = {}

    elements.outerContainer = createElement({
        parent,
        classes: ['container'],
        id: `runs-container-${simulationData.id}`
    })

    elements.innerContainer = createElement({
        parent: elements.outerContainer,
        classes: ['formal-container']
    })

    // clear for rerendering
    elements.innerContainer.innerHTML = '';

    elements.computeButton = createElement({
        type: 'button',
        parent: elements.outerContainer,
        content: 'Run Simulation'
    })
    elements.computeButton.addEventListener('click', () => {
        // Go through all input elements and extract their values
        simulationData.config = mapElementsToValues(configInputElements);

        // Update button label to indicate that extra runs can be simulated
        elements.computeButton.innerHTML = 'Add Extra Simulation Runs'

        // DEBUG
        console.log(simulationData);

        const amountOfPreviousRuns = simulationData.runs ? simulationData.runs.length : 0

        // render and get "Simulation run" buttons
        const runElements = runsInner(elements.outerContainer, simulationData, renderVisualization);

        // Compute new simulation runs with webworkers
        for (let i = amountOfPreviousRuns; i < (simulationData.config.amountOfNewRuns + amountOfPreviousRuns); i++) {
            simulationData.runs[i].id = i;

            // Runs should have a copy of the simulation config
            simulationData.runs[i].config = simulationData.config

            // Workers need to have type: 'module', so that they can import the models
            const simulationWorker = new Worker('../workers/simulator.js', { type: 'module' });

            simulationWorker.onmessage = msg => {
                if (msg.data.status == 'complete') {
                    const states = msg.data.payload;
                    simulationData.runs[i].states = states
                    simulationData.runs[i].progress = 1
                    runElements[i].style.backgroundSize = `100% 100%`

                    // DEBUG
                    console.log(states);

                    simulationWorker.terminate();
                } else if (msg.data.status == 'pending') {
                    let progress = msg.data.payload;
                    simulationData.runs[i].progress = progress
                    runElements[i].style.backgroundSize = `${~~(progress * 100)}% 100%`

                } else if (msg.data.status == 'debugging') {
                    console.log(msg.data.payload);
                }
            }

            simulationWorker.onerror = console.error

            simulationWorker.postMessage({
                config: simulationData.config,
                runId: i
            })
        }
    })

    // COMPONENT PANEL SETUP

    const importDataCallback = runsData => {
        // Go through all input elements and extract their values
        simulationData.config = mapElementsToValues(configInputElements);

        // render and get "Simulation run" buttons
        const runElements = runsInner(elements.outerContainer, simulationData, renderVisualization);

        // Fill simulationData with imported runData
        simulationData.runs = runsData

        // Set run elements to completely loaded
        runElements.forEach(runElement => runElement.style.backgroundSize = `100% 100%`)
    }

    const exportDataCallback = () => {
        if (simulationData.runs) {
            return JSON.stringify(simulationData.runs)
        } else {
            alert('No runs to download, yet! Please press the "Run Simulation" button first!')
        }

    }

    elements.panel = componentPanel({
        parent: elements.outerContainer,
        title: `Simulation Runs`,
        headerTagName: 'h3',
        isExportable: true,
        importDataCallback,
        exportDataCallback,
        collapsableContainer: elements.innerContainer,
        prepend: true,
    })

    return elements
}

export default runsOuter;