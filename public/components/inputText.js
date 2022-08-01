'use strict';

import { createElement } from '../util/dom.js';

const inputText = ({
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
            type: 'text',
            value: defaultValue,
            name
        }
    });

    return elements
}

export default inputText;