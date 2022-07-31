// Renders all simulation components

'use strict';

import { createElement } from '../util/dom.js';
import simulation from './simulation.js';

const simulations = (parent, simulationsData) => {
    // clear parent
    parent.innerHTML = '';

    const outerContainerEl = createElement({
        parent
    });

    const innerContainerEl = createElement({
        parent: outerContainerEl
    });
    
    if (simulationsData.length > 0) {
        // update
        for (let i = 0; i < simulationsData.length; i++) {
            simulation(innerContainerEl, simulatiosData[i])
        }
    } else {
        // initialization
        simulationsData.push(simulation(innerContainerEl, {id: 1}))
    }

    const addSimulationButtonEl = createElement({
        type: 'button',
        parent: outerContainerEl,
        content: 'Add simulation',
    })
    addSimulationButtonEl.addEventListener('click', () => {
        simulationsData.push(simulation(innerContainerEl, {id: simulationsData.length+1}))
    })
}

export default simulations;