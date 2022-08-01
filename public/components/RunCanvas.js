// Class for the canvas visualizating a simulation run

'use strict';

import { createElement } from '../util/dom.js';

class RunCanvas {
    constructor({
        parent,
        width = 400,
        height = 400,
        initialState
    } = {}) {
        this.canvas = createElement({
            type:'canvas',
            parent,
            props: {
                width,
                height
            }
        });

        this.width = width;
        this.height = height;

        this.state = initialState;
    }

    // renders a momentary state of a simulation run
    renderState(state) {

    }
}

export default RunCanvas;