'use strict';

import { createElement } from "../util/dom.js";
import inputCheckbox from "./inputCheckbox.js";
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
        initialState: runData.states[0],
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

    elements.showTranactions = inputCheckbox({
        name: 'showTranactions',
        parent: elements.controlsContainer,
        label: 'Show Tranactions',
        defaultValue: true
    })
    elements.showTranactions.checkbox.addEventListener('change', () => {
        elements.runCanvas.areTransactionsVisible = elements.showTranactions.checkbox.checked
        elements.runCanvas.renderState(elements.runCanvas.state)
    })

    console.log(runData);
}

export default visualization;