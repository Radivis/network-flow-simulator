'use strict';

import { createElement } from '../util/dom.js';

import { clamp } from '../util/math.js';

const inputRange = ({
    name,
    label,
    min = 0,
    max,
    defaultValue,
    step,
    isInteger = false,
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
            for: name
        }
    })

    elements.field = createElement({
        type: 'input',
        parent: elements.container,
        props: {
            value: defaultValue,
            name
        }
    });
    if (isInteger) elements.field.type = 'number'

    elements.range = createElement({
        type: 'input',
        parent: elements.container,
        props: {
            value: defaultValue,
            step
        }
    })
    elements.range.type = 'range'
    elements.range.min = min;
    elements.range.max = max;

    elements.field.addEventListener('change', () => {
        elements.field.value = clamp(elements.field.value, min, max);
        elements.range.value = elements.field.value;
    })

    elements.range.addEventListener('input', () => {
        elements.field.value = elements.range.value
    })

    return elements
}

export default inputRange;