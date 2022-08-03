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
        config: configData,
        runData: runData,
    })
    
    elements.controlsContainer = createElement({
        parent,
        classes: ['container']
    })
    
    const setStateIndex = (ev) => {
        elements.runCanvas.setStateIndex(+ev.target.value)
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
    elements.stateInputRange.field.addEventListener('change', setStateIndex)
    elements.stateInputRange.range.addEventListener('input', setStateIndex)

    elements.runCanvas.setStateIndexCallback = elements.stateInputRange.setValue

    elements.animationControls = createElement({
        parent: elements.controlsContainer
    })

    elements.animationReverseButton = createElement({
        type: 'button',
        parent: elements.animationControls,
        content: 'reverse animation'
    })
    elements.animationReverseButton.addEventListener('click', () => elements.runCanvas.animateRun({reversed: true}))

    elements.animationPauseButton = createElement({
        type: 'button',
        parent: elements.animationControls,
        content: 'pause animation'
    })
    elements.animationPauseButton.addEventListener('click', elements.runCanvas.stopRunAnimation)

    elements.animationPlayButton = createElement({
        type: 'button',
        parent: elements.animationControls,
        content: 'play animation'
    })
    elements.animationPlayButton.addEventListener('click', elements.runCanvas.animateRun)


    elements.showTransactions = inputCheckbox({
        name: 'showTransactions',
        parent: elements.controlsContainer,
        label: 'Show Transactions',
        defaultValue: true
    })
    elements.showTransactions.checkbox.addEventListener('change', () => {
        elements.runCanvas.areTransactionsVisible = elements.showTransactions.checkbox.checked
        elements.runCanvas.renderState(elements.runCanvas.state)
    })

    console.log(runData);
}

export default visualization;