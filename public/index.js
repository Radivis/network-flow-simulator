'use strict';

import { $ } from './util/dom.js';
import config from './components/config.js';
import simulations from './components/simulations.js';

const elements = {};

const simulationsData = [];

const domMapping = () => {
    elements.app = $('#app');
}

const init = () => {
    domMapping();
    simulations(elements.app, simulationsData);
}

init();