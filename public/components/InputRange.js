'use strict';

import { createElement } from '../util/dom.js';

import { clamp } from '../util/math';

const inputRange = ({
    name: label,
    min = 0,
    max,
    defaultValue,
    isInteger = false,
    parent
} = {}) => {
    const container = createElement({
        classes: ['container'],
        parent
    });

    const label = createElement({
        type: 'label',
        content: label,
        props: {
            for: label
        }
    })

    const field = createElement({
        type: 'input',
        parent: container,
        props: {
            value: defaultValue
        }
    });
    if (isInteger) field.type = 'number'

    const range = createElement({
        type: 'input',
        parent: container,
        props: {
            value: defaultValue
        }
    })
    range.type = 'range'
    range.min = min;
    range.max = max;

    field.addEventListener('change', () => {
        field.value = clamp(field.value, min, max);
        range.value = field.value;
    })

    range.addEventListener('input', () => {
        field.value = range.value
    })

    return container
}

export default inputRange;