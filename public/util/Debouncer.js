'use strict';

/*
 The given function is only fired after the delay,
 if the trigger of the function hasn't been fired in the meantime
 Arguments can be passed to the function as array or as object(?)

 Note that the given function loses its "this" object,
 if passed to the Debouncer constructor, so you might need to
 pass "func: functionName.bind(this)" as argument, rather than
 merely "func: functionName"!
*/

class Debouncer {
    constructor({
        func,
        delay
    } = {}) {
        return (...args) => {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => func(...args), delay)
        }
    }
}

export default Debouncer