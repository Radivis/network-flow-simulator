'use strict';

import castNumberIfNumeric from '../../util/string.js';

// Goes through a possibly nested object of HTML elements and updates the value of each of them according to the values of a given values object
const updateElementValues = (htmlObject, valuesObject) => {
    const array = Object.entries(htmlObject);

    const valueArray = array.map(pair => {
        let [key, val] = pair;
        // nested objects get processed recursively
        if (val.constructor == Object) {
            updateElementValues(val, valuesObject[key])
        }
        // nested arrays also get processed recursively by entry
        else if (val.constructor == Array) {
            val.forEach((entry, index) => updateElementValues(entry, valuesObject[key][index]))
        } else {
            // Otherwise the value is a HTML input element

            // The value of a checkbox is by default "on". Instead the "checked" property needs to be updated
            if (val.type == 'checkbox') val.checked = valuesObject[key]

            val.value = valuesObject[key]
        }
    })
}

export default updateElementValues;