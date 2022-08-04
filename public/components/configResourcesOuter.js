'use strict';

import { createElement } from '../util/dom.js';
import configResourcesInner from './configResourcesInner.js';

const configResourcesOuter = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const nonInputElements = {}
    
    nonInputElements.outerContainer = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.header = createElement({
        type: 'h4',
        parent: nonInputElements.outerContainer,
        content: 'Resource Settings'
    });

    const { inputElementsArray, addResource } = configResourcesInner(nonInputElements.outerContainer, simulationData);

    // Have one resource added at initialization
    addResource()

    nonInputElements.addResourceButton = createElement({
        type: 'button',
        parent: nonInputElements.outerContainer,
        content: 'Add Resource'
    })
    nonInputElements.addResourceButton.addEventListener('click', addResource)

    return inputElementsArray
}

export default configResourcesOuter;