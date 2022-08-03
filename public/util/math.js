'use strict';

const math = {
    createInteger(min, max) {return ~~(Math.random() * (max - min + 1) + min)},

    clamp(value, min, max) {
        if (value > max) return max;
        if (value < min) return min;
        return value;
    },

    // Selects n distinct random elements from an array
    selectRandomElements(arr, amount) {
        const elements = new Set()

        while (elements.size < amount) {
            const randomIndex = createInteger(0, arr.length -1)
            elements.add(arr[randomIndex])
        }

        return Array.from(elements)
    },
    
    // Returns the middle value of an array of numbers
    median(arr) {
        if (arr.length == 0) return NaN

        // Copy array in order not to change it by sorting
        arr = [...arr]

        arr.sort((a,b) => a-b)

        // in the case of an even amount of elements this would be the higher middle index
        const middleIndex = Math.floor(arr.length / 2)

        if (arr.length % 2 == 1) {
            return arr[middleIndex]
        } else {
            return (arr[middleIndex -1] + arr[middleIndex] ) / 2
        }
    }
}

export default math;

// Named exports
export let { clamp, createInteger, selectRandomElements, median } = math;