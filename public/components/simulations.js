// Renders all simulation components

'use strict';

import { createElement } from '../util/dom.js';
import simulation from './simulation.js';

const simulations = (parent, simulationsData) => {
    // clear parent
    parent.innerHTML = '';

    const elements = {}

    elements.outerContainer = createElement({
        parent
    });

    elements.innerContainer = createElement({
        parent: elements.outerContainer
    });
    
    if (simulationsData.length > 0) {
        // update
        for (let i = 0; i < simulationsData.length; i++) {
            simulation(elements.innerContainer, simulatiosData[i])
        }
    } else {
        // initialization
        simulationsData.push(simulation(elements.innerContainer, {id: 1}))
    }

    elements.addSimulationButton = createElement({
        type: 'button',
        parent: elements.outerContainer,
        content: 'Add simulation',
    })
    addSimulationButtonEl.addEventListener('click', () => {
        simulationsData.push(simulation(elements.innerContainer, {id: simulationsData.length+1}))
    })
}

export default simulations;