'use strict';

const castNumberIfNumeric = str => {
    // handle special numbers
    if (str === "NaN" || str === "Infinity" || str === "-Infinity") return Number(str)

    // Check if the string actually represents a valid number
    if (Number(str) != NaN) return Number(str) 

    // If the string can be interpreted as number, return it unchanged
    return str
}

export default castNumberIfNumeric;