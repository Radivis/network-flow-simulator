'use strict';

import { createElement } from '../util/dom.js';

const inputText = ({
    name,
    label,
    defaultValue,
    parent
} = {}) => {
    const containerEl = createElement({
        classes: ['container'],
        parent
    });

    const labelEl = createElement({
        type: 'label',
        parent: containerEl,
        content: label,
        props: {
            for: name,
        }
    })

    const fieldEl = createElement({
        type: 'input',
        parent: containerEl,
        props: {
            type: 'text',
            value: defaultValue,
            name
        }
    });

    // the fieldEl is returned, so that the value can be accessed easily
    return fieldEl
}

export default inputText;