/*
This rule determines the behavior of a node to start a resource transfert to another node.
This is the most important rule of all, because without this, nothing interesting happens!
*/

'use strict';

import Node from '../model/Node.js'
import Transaction from '../model/Transaction.js';

const randomOutflow = (state, config) => {
    const { nodes, transactions } = state;
    const { resources } = config;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            // Node distance
            const d = Node.d(nodes[i], nodes[j])

            debugger;

            const transactionResources = [... new Array(config.resources.length)].fill(0)

            let isTransactionHappening = false;

            for (let r = 0; r < resources.length; r++) {
                let resource = resources[r]
                let outflowProbability = +resource.outflowProbability / d;

                if (Math.random() < outflowProbability) {
                    isTransactionHappening = true;

                    const transactionValue = +config.resources[r].outflowMean;
                    transactionResources[r] = transactionValue;
                }
            }

            if (isTransactionHappening) {
                state.transactions.push(new Transaction(i, j, transactionResources))

                // Target gets resources
                nodes[j].resources += transactionResources

                // Source loses resources
                nodes[i].resources -= transactionResources
            }
        }
    }
}

export default randomOutflow;