/*
Top component for visualizations.
Originally I wanted this to remain a function component,
but since this is rendered after the runs component,
passing the "renderVisualization" function/method would
have been difficult!
*/

'use strict';

import { createElement } from "../util/dom.js";
import visualization from './visualization.js'

class Visualizations {
    constructor({
        parent,
        simulationData
    }) {
        this.parent = parent
        this.simulationData = simulationData

        this.elements = {}

        // Array of ids to store which runs should be visualized
        this.activeVisualizations = [];

        // This binding
        this.toggleVisualization = this.toggleVisualization.bind(this)
    }

    render() {
        this.elements.outerContainer = createElement({
            parent: this.parent,
            classes: ['container', 'hidden'],
            id: `visualizations-outer-${this.simulationData.id}`
        })
    
        this.elements.header = createElement({
            type: 'h3',
            parent: this.elements.outerContainer,
            content: 'Visualization'
        })
    
        this.elements.innerContainer = createElement({
            parent: this.elements.outerContainer,
            classes: ['formal-container'],
            id: `visualizations-inner-${this.simulationData.id}`
        })

        return this.elements
    }

    /*
    Callback that opens a visualization window, if the user presses on a run button.

    If a user presses on the button again, the window should disappear.

    The array this.activeVisualizations keeps track of which windows are open or not.
    It stores the ids of the open visualization windows
    */
    toggleVisualization(id) {
        if (this.activeVisualizations.includes(id)) {
            // Remove id
            this.activeVisualizations = this.activeVisualizations.filter(entry => entry != id)
        }
        else {
            // Add id
            this.activeVisualizations.push(id)
        }

        // Clear and re-render all open visualizations
        // TODO: Implement this better, since this causes the visualization components to lose their current state!
        this.elements.innerContainer.innerHTML = ''

        this.activeVisualizations.forEach(id => {
            visualization(this.elements.innerContainer, this.simulationData.runs[id], this.simulationData.config)
        })

        // hide visualizations container, if all runs are deactivated
        if (this.activeVisualizations.length <= 0) this.elements.outerContainer.classList.add('hidden')
        else this.elements.outerContainer.classList.remove('hidden')
    }
}

export default Visualizations;

