'use strict';

import { createElement } from '../util/dom.js';

const runs = (parent, simulationData) => {
    const container = createElement({
        classes: ['container'],
        parent
    });

    const headerEl = createElement({
        type: 'h3',
        parent: container,
        content: 'Simulation Runs'
    });

    const runElements = [];

    const { amountOfRuns } = simulationData.config

    for (let i = 0; i < amountOfRuns; i++) {
        const runButtonEl = createElement({
            type: 'Button',
            parent: container,
            content: `Simulation run ${i}`,
            classes: ['progress-background'],
            styles: {
                backgroundSize: '0% 100%'
            }
        })
        runElements.push(runButtonEl);

        // const runProgressEl = createElement({
        //     type: 'Progress',
        //     parent: container,
        //     props: {
        //         max: 1,
        //         value: 0
        //     }
        // })
        // runElements.push(runProgressEl);
    }

    return runElements;
}

export default runs;