'use strict';

import { createElement } from "../util/dom.js";
import inputRange from "./inputRange.js";
import RunCanvas from "./runCanvas.js";


const visualization = (parent, runData, configData) => {
    const elements = {}
    
    elements.headerEl = createElement({
        type: 'h4',
        parent: parent,
        content: 'Visualization of Run ' + runData.id
    })
    
    elements.runCanvas = new RunCanvas({
        parent,
        initialState: runData.states[1],
        config: configData
    })
    
    elements.controlsContainer = createElement({
        parent,
        classes: ['container']
    })
    
    const setRenderedState = (ev) => {
        const stateIndex = +ev.target.value
        const state = runData.states[stateIndex]
        elements.runCanvas.state = state
        elements.runCanvas.renderState(state)
    }

    elements.stateInputRange = inputRange({
        label: 'State at time step',
        min: 0,
        max: runData.states.length - 1,
        defaultValue: 0,
        step: 1,
        isInteger: true,
        parent: elements.controlsContainer
    })
    elements.stateInputRange.field.addEventListener('change', setRenderedState)
    elements.stateInputRange.range.addEventListener('input', setRenderedState)

    console.log(runData);
}

export default visualization;