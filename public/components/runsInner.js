'use strict';

import { createElement } from '../util/dom.js';
import run from './run.js'

const runsInner = (parent, simulationData, renderVisualization) => {
    const { config, runs } = simulationData;

    const newRuns = [];
    for (let i = 0; i < +config.amountOfNewRuns; i++) {
        newRuns.push({
                progress: 0,
                states: {}
            })
    }

    let runsContainerEl;
    let runElements = [];
    let amountOfPreviousRuns = 0;
    
    if(simulationData.runs) {
        // Previous runs have been done
        amountOfPreviousRuns = runs.length;

        simulationData.runs = [...runs, ...newRuns]

        runsContainerEl = parent.querySelector(`#runs-container-${simulationData.id}`)

        // Get old run elements
        // This is necessary since clearing and rerendering would break the progress update of the elements!
        runElements = Array.from(runsContainerEl.children)
    } else {
        // No previous run, initialization required
        simulationData.runs = newRuns;

        runsContainerEl = createElement({
            parent: parent,
            classes: ['formal-container'],
            id: `runs-container-${simulationData.id}`
         })
    }

    // Render new run elements
    for (let i = amountOfPreviousRuns; i < simulationData.runs.length; i++) {
        const runButtonEl = run(runsContainerEl, simulationData.runs[i], i, renderVisualization)
        runElements.push(runButtonEl)
    }

    // Event listener for rendering Visualizations
    runsContainerEl.addEventListener('click', (ev) => {
        ev.stopPropagation();

        const target = ev.target

        if (target.tagName === 'BUTTON') {
            // Extract run id from target
            const idParts = target.id.split('-')
            const id = Number(idParts[idParts.length -1])
    
            renderVisualization(id)
        }
    })

    return runElements

}

export default runsInner;