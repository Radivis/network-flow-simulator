'use strict';

import { createElement } from '../util/dom.js';

const run = (parent, runData, index) => {
    const runButtonEl = createElement({
        type: 'Button',
        parent: parent,
        content: `Simulation run ${index}`,
        classes: ['progress-background'],
        styles: {
            backgroundSize: `${~~(runData.progress * 100)}% 100%`
        }
    })

    return runButtonEl;
}

export default run;