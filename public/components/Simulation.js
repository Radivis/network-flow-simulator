'use strict';

import { createElement } from '../util/dom.js';
import config from './config.js'
import runsContainer from './runsContainer.js';
import visualizations from './visualizations.js';
import visualization from './visualization.js';

const simulation = (parent, simulationData) => {
    const containerEl = createElement({
        classes: ['container'],
        parent
    });

    const headerEl = createElement({
        type: 'h2',
        parent: containerEl,
        content: `Simulation ${simulationData.id}`
    });

    // #1: Config
    const configInputElements = config(containerEl, simulationData);

    // #2: Runs
    const runsOuterContainerEl = createElement({
        parent: containerEl,
        classes: ['container'],
        id: `runs-container-${simulationData.id}`
    })

    // Array of ids to store which runs should be visualized
    let activeVisualizations = [];

    // Callback for rendering a visualization
    const renderVisualization = (id) => {
        let visualizationsContainers = {}
        if (activeVisualizations.length <= 0) {
            visualizationsContainers = visualizations(containerEl, simulationData)
        } else {
            visualizationsContainers.outerContainer = containerEl
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

    runsContainer(runsOuterContainerEl, simulationData, configInputElements, renderVisualization)
}

export default simulation;