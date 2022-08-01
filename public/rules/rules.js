// Just collects all the rules into one array

'use strict';

import randomOutflow from "./randomOutflow.js";
import death from "./death.js";

const rules = [
    randomOutflow,
    death
]

export default rules;