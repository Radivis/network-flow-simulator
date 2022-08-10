'use strict';

import { createElement } from '../util/dom.js';
import componentPanel from './componentPanel.js';
import mapElementsToValues from './helpers/mapElementsToValues.js';
import config from './config.js'
import runsOuter from './runsOuter.js';
import Visualizations from './Visualizations.js';

const simulation = (parent, simulationData) => {
    const elements = {}

    elements.outerContainer = createElement({
        classes: ['container'],
        parent
    });

    elements.innerContainer = createElement({
        parent: elements.outerContainer,
        classes: ['formal-container'],
    });

    const visualizations = new Visualizations({
        parent: elements.innerContainer,
        simulationData
    })

    // #1: Config
    const { inputElements, importConfigDataCallback } = config(elements.innerContainer, simulationData);

    elements.configInput = inputElements

    // #2: Runs
    const { outerRunsElements, importRunsDataCallback} = runsOuter(
        elements.innerContainer, simulationData,
        elements.configInput,
        visualizations.toggleVisualization
        )

    elements.runsOuter = outerRunsElements

    // #3: Visualizations
    elements.visualizations = visualizations.render()

    // COMPONENT PANEL SETUP

    const importDataCallback = simulationData => {
        importConfigDataCallback(simulationData.config)
        importRunsDataCallback(simulationData.runs)
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