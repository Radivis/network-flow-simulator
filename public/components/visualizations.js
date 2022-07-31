'use strict';

import { createElement } from "../util/dom.js";

const visualizations = (parent, simulationData) => {
    const elements = {}

    elements.outerContainer = createElement({
        parent,
        classes: ['container'],
        id: `visualizations-outer-${simulationData.id}`
    })

    elements.header = createElement({
        type: 'h3',
        parent: elements.outerContainer,
        content: 'Visualization'
    })

    elements.innerContainer = createElement({
        parent: elements.outerContainer,
        classes: ['container'],
        id: `visualizations-inner-${simulationData.id}`
    })

    return elements
}

export default visualizations;

