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
    const containerEl = createElement({
        classes: ['container'],
        parent
    });

    const labelEl = createElement({
        type: 'label',
        parent: containerEl,
        content: label,
        props: {
            for: name
        }
    })

    const fieldEl = createElement({
        type: 'input',
        parent: containerEl,
        props: {
            value: defaultValue,
            name
        }
    });
    if (isInteger) fieldEl.type = 'number'

    const rangeEl = createElement({
        type: 'input',
        parent: containerEl,
        props: {
            value: defaultValue,
            step
        }
    })
    rangeEl.type = 'range'
    rangeEl.min = min;
    rangeEl.max = max;

    fieldEl.addEventListener('change', () => {
        fieldEl.value = clamp(fieldEl.value, min, max);
        rangeEl.value = fieldEl.value;
    })

    rangeEl.addEventListener('input', () => {
        fieldEl.value = rangeEl.value
    })

    // the fieldEl is returned, so that the value can be accessed easily
    return fieldEl
}

export default inputRange;