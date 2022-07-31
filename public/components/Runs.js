'use strict';

import { createElement } from '../util/dom.js';

const runs = (parent, simulationData) => {
    // clear
    parent.innerHTML = '';

    const headerEl = createElement({
        type: 'h3',
        parent: parent,
        content: 'Simulation Runs'
    });

    const runElements = [];

    const { runs } = simulationData

    for (let i = 0; i < runs.length; i++) {
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