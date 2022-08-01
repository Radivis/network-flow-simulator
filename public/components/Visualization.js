'use strict';

import { createElement } from "../util/dom.js";
import RunCanvas from "./runCanvas.js";

const visualization = (parent, runData) => {
    const elements = {}

    elements.headerEl = createElement({
        type: 'h4',
        parent: parent,
        content: 'Visualization of Run ' + runData.id
    })

    elements.runCanvas = new RunCanvas({
        parent,
        initialState: runData.states[1]
    })

    console.log(runData);
}

export default visualization;