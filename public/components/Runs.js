'use strict';

import { createElement } from '../util/dom.js';

const runs = (parent, simulationData, amountOfPreviousRuns) => {
    // clear
    parent.innerHTML = '';

    const headerEl = createElement({
        type: 'h3',
        parent: parent,
        content: 'Simulation Runs'
    });

    const runElements = [];

    const { amountOfRuns } = simulationData.config

    const { runs } = simulationData

    for (let i = 0; i < amountOfRuns; i++) {
        const runButtonEl = createElement({
            type: 'Button',
            parent: parent,
            content: `Simulation run ${i}`,
            classes: ['progress-background'],
            styles: {
                backgroundSize: `${~~(runs[i].progress * 100)}% 100%`
            }
        })
        runElements.push(runButtonEl);
    }

    return runElements;
}

export default runs;