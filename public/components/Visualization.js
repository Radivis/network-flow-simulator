'use strict';

import { createElement } from "../util/dom.js";
import RunCanvas from "./runCanvas.js";

const visualization = (parent, runData) => {
    const headerEl = createElement({
        type: 'h4',
        parent: parent,
        content: 'Visualization of Run ' + runData.id
    })

    const runCanvas = new RunCanvas({
        parent,
        width: '100%',
        initialState: runData.states[0]
    })

    console.log(runData);
}

export default visualization;