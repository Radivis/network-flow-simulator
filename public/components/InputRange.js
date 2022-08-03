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
    // Contains elements and callbacks!
    const expo = {}

    expo.container = createElement({
        classes: ['container'],
        parent
    });

    expo.label = createElement({
        type: 'label',
        parent: expo.container,
        content: label,
        props: {
            for: name
        }
    })

    expo.field = createElement({
        type: 'input',
        parent: expo.container,
        props: {
            value: defaultValue,
            name
        }
    });
    if (isInteger) expo.field.type = 'number'

    expo.range = createElement({
        type: 'input',
        parent: expo.container,
        props: {
            value: defaultValue,
            step
        }
    })
    expo.range.type = 'range'
    expo.range.min = min;
    expo.range.max = max;

    expo.field.addEventListener('change', () => {
        expo.field.value = clamp(expo.field.value, min, max);
        expo.range.value = expo.field.value;
    })

    expo.range.addEventListener('input', () => {
        expo.field.value = expo.range.value
    })

    expo.setValue = val => {
        val = clamp(val, min, max)
        expo.field.value = val;
        expo.range.value = val;
    }

    return expo
}

export default inputRange;