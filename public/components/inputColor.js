'use strict';

import { createElement } from '../util/dom.js';

const inputColor = ({
    name,
    label,
    defaultValue,
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

    elements.field = createElement({
        type: 'input',
        parent: elements.container,
        props: {
            type: 'color',
            value: defaultValue,
            name
        }
    });

    return elements
}

export default inputColor;