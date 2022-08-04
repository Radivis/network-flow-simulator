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
        classes: ['formal-container'],
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

    // COMPONENT PANEL SETUP

    const importDataCallback = resourcesData => {
        // First create enough resource windows
        const amountOfResources = resourcesData.constructor == Array ? resourcesData.length : Object.keys(resourcesData).length

        const amountOfMissingResourceElements = amountOfResources - inputElementsArray.length

        for (let i = 0; i < amountOfMissingResourceElements; i++) {
            addResource()
        }

        updateElementValues(inputElementsArray, resourcesData)
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

    return { inputElementsArray, importResourceDataCallback: importDataCallback }
}

export default configResourcesOuter;