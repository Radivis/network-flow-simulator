// Renders the bar at the top of a component

'use strict';

import { createElement } from '../util/dom.js';

const componentPanel = ({
    parent,
    title,
    headerTagName,
    collapsableContainer,
    isExportable = false,
    importDataCallback,
    exportDataCallback,
    prepend,
    data
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
        })

        elements.exportToClientLink = createElement({
            parent: elements.exportToClientButton,
            type: 'a',
            content: 'exportToClient',
            classes: ['stealth-link']
        })

        const exportDataToClient = () => {
            // const exportData = JSON.stringify(data);
            const exportData = exportDataCallback()

            const file = new Blob([exportData], { type: "text/json", charset: "utf-8" });
            const filename = "data.json";
            const url = URL.createObjectURL(file);

            elements.exportToClientLink.href = url;
            elements.exportToClientLink.download = filename;

            // This is needed to clear up memory that was used up by the blob
            setTimeout(function () {
                window.URL.revokeObjectURL(url);
            }, 0);
        }

        elements.exportToClientButton.addEventListener('click', exportDataToClient)

        // elements.importFromClientButton = createElement({
        //     parent: elements.buttonContainer,
        //     type: 'button',
        //     content: 'importFromClient'
        // })

        elements.importFromClientInput = createElement({
            parent: elements.buttonContainer,
            type: 'input',
            props: {
                type: 'file'
            },
            classes: ['buttony-file-import'],
            content: 'importFromClient'
        })

        const importDataFromClient = () => {
            // TODO: refactor this to fetch syntax later
            let request = new XMLHttpRequest();
            let file = elements.importFromClientInput.files[0];
            let url = URL.createObjectURL(file);

            request.open("GET", url);
            request.addEventListener("load", (ev) => {
                if (ev.target.status == 200) {
                    let loadedData = ev.target.response;

                    importDataCallback(JSON.parse(loadedData))
                } else {
                    console.warn(ev.target.statusText);
                }
            })
            request.send();
        }

        elements.importFromClientInput.addEventListener('change', importDataFromClient)

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