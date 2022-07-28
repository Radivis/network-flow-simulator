'use strict';

import { $ } from './util/dom.js';
import config from './components/config.js';

const elements = {};

const renderSettings = (parent) => {
    parent.append(config())
}

const domMapping = () => {
    elements.app = $('#app');
}

const init = () => {
    domMapping();
    renderSettings(elements.app);
}

init();