'use strict';

import { createElement } from '../util/dom.js';
import run from './run.js'

const runs = (parent, simulationData) => {
    const { config, runs } = simulationData;

    const newRuns = [...new Array(+config.amountOfNewRuns)].fill({
        progress: 0,
        states: {}
    })

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
            classes: ['container'],
            id: `runs-container-${simulationData.id}`
         })
    }

    // Render new run elements
    for (let i = amountOfPreviousRuns; i < simulationData.runs.length; i++) {
        const runButtonEl = run(runsContainerEl, simulationData.runs[i], i)
        runElements.push(runButtonEl)
    }

    return runElements

}

export default runs;