'use strict';

import { createElement } from "../util/dom.js";

const visualization = (parent, runData) => {
    const headerEl = createElement({
        type: 'h4',
        parent: parent,
        content: 'Visualization of Run ' + runData.id
    })

    console.log(runData);
}

export default visualization;