// Renders the bar at the top of a component

'use strict';

import { createElement } from '../util/dom.js';

const componentPanel = ({
    parent,
    title,
    headerTagName,
    collapsableContainer,
    isExportable = false,
    prepend
} = {}) => {
    const elements = {}

    elements.panel = createElement({
        parent,
        type: 'div',
        classes: ['component-panel'],
        prepend
    })

    elements.header = createElement({
        parent: elements.panel,
        type: headerTagName,
        content: title,
        classes: ['inline-block']
    })

    elements.buttonContainer = createElement({
        parent: elements.panel,
        classes: ['inline-block']
    })

    
    if (isExportable) {
        elements.exportToServerButton = createElement({
            parent: elements.buttonContainer,
            type: 'button',
            content: 'export To Server'
        })
        
        elements.importFromServerButton = createElement({
            parent: elements.buttonContainer,
            type: 'button',
            content: 'importFromServer'
        })
        
        elements.exportToClientButton = createElement({
            parent: elements.buttonContainer,
            type: 'button',
            content: 'exportToClient'
        })
        
        elements.importFromClientButton = createElement({
            parent: elements.buttonContainer,
            type: 'button',
            content: 'importFromClient'
        })
    }

    elements.collapseButton = createElement({
        parent: elements.buttonContainer,
        type: 'button',
        content: '-',
        classes: ['collapse-button']
    })
    
    const collapse = () => {
        collapsableContainer.classList.toggle('collapsed')

        if (elements.collapseButton.innerHTML == '-') {
            elements.collapseButton.innerHTML = '+'
        } else {
            elements.collapseButton.innerHTML = '-'
        }
    }

    elements.collapseButton.addEventListener('click', collapse)

    return elements
}

export default componentPanel