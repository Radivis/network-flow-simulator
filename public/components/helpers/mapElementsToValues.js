'use strict';

import castNumberIfNumeric from '../../util/string.js';

// Goes through a possibly nested object of HTML elements and returns a possibly nested object of their values
// Used to extract the values from the config form
const mapElementsToValues = object => {
    const array = Object.entries(object);

    const valueArray = array.map(pair => {
        let [key, val] = pair;
        // nested objects get processed recursively
        if (val.constructor == Object) {
            return [key, mapElementsToValues(val)]
        }
        // nested arrays also get processed recursively by entry
        else if (val.constructor == Array) {
            return [key, val.map(entry => mapElementsToValues(entry))]
        } else {
            // Otherwise the value is a HTML input element

            let value = val.value
            // The value of a checkbox is by default "on". Instead the "checked" property needs to be checked
            if (val.type == 'checkbox') value = val.checked

            return [key, castNumberIfNumeric(value)]
        }
    })

    return Object.fromEntries(valueArray)
}

export default mapElementsToValues;