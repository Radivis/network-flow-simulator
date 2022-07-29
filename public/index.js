'use strict';

import { $ } from './util/dom.js';
import config from './components/config.js';
import simulation from './components/simulation.js';

const elements = {};

const renderSettings = (parent) => {
    parent.append(config())
}

const renderSimulation = (parent) => {
    parent.append(simulation())
}

const domMapping = () => {
    elements.app = $('#app');
}

const init = () => {
    domMapping();
    renderSimulation(elements.app);
}

init();