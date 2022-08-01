// Rule that elimates all nodes that were marked to die

'use strict';

import Node from '../model/Node.js'
import Transaction from '../model/Transaction.js';

// Worker is passed for debugging purposes
const death = (state, config, worker) => {
    const { nodes } = state;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].isGoingToDie) {
            state.nodes = state.nodes.filter((node, index) => index != i)

            worker.log(`RIP Node ${i}`);
        }
    }
}

export default death;

