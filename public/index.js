'use strict';

import { $ } from './util/dom.js';

const elements = {};

const domMapping = () => {
    elements.main = $('main');
}

const init = () => {
    domMapping();
}