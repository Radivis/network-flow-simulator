// Just collects all the rules into one array

'use strict';

import randomDonation from "./randomDonation.js";
import randomExchange from "./randomExchange.js";
import death from "./death.js";

const rules = [
    randomDonation,
    randomExchange
]

export default rules;