'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import updateElementValues from './helpers/updateElementValues.js';
import configResourcesInner from './configResourcesInner.js';

const configResourcesOuter = (parent, simulationData) => {
    // Collect input fields in an object, so that they can be accessed more easily
    const nonInputElements = {}
    
    nonInputElements.outerContainer = createElement({
        classes: ['container'],
        parent
    });

    nonInputElements.innerContainer = createElement({
        classes: ['container'],
        parent: nonInputElements.outerContainer
    });

    // nonInputElements.header = createElement({
    //     type: 'h4',
    //     parent: nonInputElements.outerContainer,
    //     content: 'Resource Settings'
    // });

    const { inputElementsArray, addResource } = configResourcesInner(nonInputElements.innerContainer, simulationData);

    // Have one resource added at initialization
    addResource()

    nonInputElements.addResourceButton = createElement({
        type: 'button',
        parent: nonInputElements.innerContainer,
        content: 'Add Resource'
    })
    nonInputElements.addResourceButton.addEventListener('click', addResource)

    const importDataCallback = resourceData => {
        // First create enough resource windows
        const amountOfMissingResourceElements = Object.keys(resourceData).length - inputElementsArray.length

        for (let i = 0; i < amountOfMissingResourceElements; i++) {
            addResource()
        }

        updateElementValues(inputElementsArray, resourceData)
    }

    const exportDataCallback = () => {
        return JSON.stringify(mapElementsToValues(inputElementsArray))
    }

    nonInputElements.panel = componentPanel({
        parent: nonInputElements.outerContainer,
        title: `Resource Settings`,
        headerTagName: 'h4',
        isExportable: true,
        data: simulationData,
        importDataCallback,
        exportDataCallback,
        collapsableContainer: nonInputElements.innerContainer,
        prepend: true,
    })


    return inputElementsArray
}

export default configResourcesOuter;