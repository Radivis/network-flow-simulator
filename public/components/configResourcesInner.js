'use strict';

import { createElement } from '../util/dom.js';
import configResource from './configResource.js';

const configResourcesInner = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElementsArray = []
    const nonInputElements = {}
    
    nonInputElements.container = createElement({
        classes: ['formal-container'],
        parent
    });

    const addResource = () => {
        const resourceId = inputElementsArray.length + 1
        inputElementsArray.push(configResource(nonInputElements.container, simulationData, resourceId))
    }


    return { inputElementsArray, addResource }
}

export default configResourcesInner;