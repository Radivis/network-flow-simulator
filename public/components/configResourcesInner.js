'use strict';

import { createElement } from '../util/dom.js';
import configResource from './configResource.js';

const configResourcesInner = (parent) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const inputElementsArray = []
    const nonInputElements = {}
    
    nonInputElements.container = createElement({
        classes: ['container'],
        parent
    });

    const addResource = () => {
        inputElementsArray.push(configResource(nonInputElements.container))
    }


    return { inputElementsArray, addResource }
}

export default configResourcesInner;