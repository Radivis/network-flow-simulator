'use strict';

import { createElement } from '../util/dom.js';

const inputCheckbox = ({
    name,
    label,
    defaultValue = false,
    parent
} = {}) => {
    const elements = {}

    elements.container = createElement({
        classes: ['container'],
        parent
    });

    elements.label = createElement({
        type: 'label',
        parent: elements.container,
        content: label,
        props: {
            for: name,
        }
    })

    elements.checkbox = createElement({
        type: 'input',
        parent: elements.container,
        props: {
            type: 'checkbox',
            checked: defaultValue,
            name
        }
    });

    return elements
}

export default inputCheckbox;