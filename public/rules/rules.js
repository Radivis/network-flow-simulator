// Just collects all the rules into one array

'use strict';

import inheritance from "./inheritance.js";
import donations from "./donations.js";
import exchanges from "./exchanges.js";

const availableRules = {
    inheritance,
    donations,
    exchanges
}

const rules = (config) => {
    const namesOfActiveRules = []

    for (let ruleName in config.rules) {
        // config.rules is an object with boolean values!
        if (config.rules[ruleName]) namesOfActiveRules.push(ruleName)
    }

    return namesOfActiveRules.map(name => availableRules[name])
}

export default rules;