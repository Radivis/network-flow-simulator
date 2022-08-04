'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import config from './config.js'
import runsContainer from './runsContainer.js';
import visualizations from './visualizations.js';
import visualization from './visualization.js';

const simulation = (parent, simulationData) => {
    const elements = {}

    elements.outerContainer = createElement({
        classes: ['container'],
        parent
    });

    elements.innerContainer = createElement({
        parent: elements.outerContainer,
        classes: ['container'],
    });

    const importDataCallback = importedData => {
        simulationData = importedData;
        console.log(simulationData);
    }

    elements.panel = componentPanel({
        parent: elements.outerContainer,
        title: `Simulation ${simulationData.id}`,
        headerTagName: 'h2',
        isExportable: true,
        data: simulationData,
        importDataCallback,
        collapsableContainer: elements.innerContainer,
        prepend: true,
    })

    // #1: Config
    elements.configInput = config(elements.innerContainer, simulationData);

    // #2: Runs
    elements.runsOuterContainer = createElement({
        parent: elements.innerContainer,
        classes: ['container'],
        id: `runs-container-${simulationData.id}`
    })

    // Array of ids to store which runs should be visualized
    let activeVisualizations = [];

    // Callback for rendering a visualization
    const renderVisualization = (id) => {
        let visualizationsContainers = {}
        if (activeVisualizations.length <= 0) {
            visualizationsContainers = visualizations(elements.innerContainer, simulationData)
        } else {
            visualizationsContainers.outerContainer = elements.innerContainer
                .querySelector(`#visualizations-outer-${simulationData.id}`);
            visualizationsContainers.innerContainer = visualizationsContainers.outerContainer
                .querySelector(`#visualizations-inner-${simulationData.id}`);
        }

        if (activeVisualizations.includes(id)) {
            activeVisualizations = activeVisualizations.filter(entry => entry != id)
        }
        else {
            activeVisualizations.push(id)
            visualization(visualizationsContainers.innerContainer, simulationData.runs[id], simulationData.config)
        }

        // clear visualizations container, if all runs are deactivated
        if (activeVisualizations.length <= 0) visualizationsContainers.outerContainer.remove()
    }

    elements.runsContainer = runsContainer(elements.runsOuterContainer, simulationData, elements.configInput, renderVisualization)
}

export default simulation;