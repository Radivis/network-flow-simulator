'use strict';

const castNumberIfNumeric = value => {
    // pass booleans unchanged
    if (typeof value === 'boolean') return value

    // handle special numbers
    if (value === "NaN" || value === "Infinity" || value === "-Infinity") return Number(value)

    // Check if the string actually represents a valid number
    if (!isNaN(Number(value))) return Number(value) 

    // If the string can be interpreted as number, return it unchanged
    return value
}

export default castNumberIfNumeric;