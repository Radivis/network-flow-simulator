'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import config from './config.js'
import runsOuter from './runsOuter.js';
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

    // #1: Config
    const { inputElements, importConfigDataCallback } = config(elements.innerContainer, simulationData);

    elements.configInput = inputElements

    // #2: Runs
    elements.runsOuterContainer = createElement({
        parent: elements.innerContainer,
        classes: ['container'],
        id: `runs-container-${simulationData.id}`
    })

    // Array of ids to store which runs should be visualized
    let activeVisualizations = [];

    /*
    Callback for rendering a visualization

    Note that this callback is defined here,
    so that the visibility of the visualizations component can be controlled from here
    */
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

    elements.runsOuter = runsOuter(elements.runsOuterContainer, simulationData, elements.configInput, renderVisualization)

    const importDataCallback = simulationData => {
        importConfigDataCallback(simulationData.config)

        // Rerender runs element with new simulation data
        // TODO: Get this to work properly
        elements.runsOuter = runsOuter(elements.runsOuterContainer, simulationData, elements.configInput, renderVisualization)
    }

    const exportDataCallback = () => {
        simulationData.config = mapElementsToValues(elements.configInput)
        return JSON.stringify(simulationData)
    }

    elements.panel = componentPanel({
        parent: elements.outerContainer,
        title: `Simulation ${simulationData.id}`,
        headerTagName: 'h2',
        isExportable: true,
        importDataCallback,
        exportDataCallback,
        collapsableContainer: elements.innerContainer,
        prepend: true,
    })

}

export default simulation;