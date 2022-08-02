/*
This rule determines the behavior of a node to start a unilateral resource transfer to another node.
*/

'use strict';

import Node from '../model/Node.js'
import Transaction from '../model/Transaction.js';

// Worker is passed for debugging purposes
const randomDonation = (state, config, worker) => {
    const { nodes } = state;
    const { resources } = config;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i != j) {

                // Node distance
                const d = Node.d(nodes[i], nodes[j])

                const transactionResources = [... new Array(resources.length)].fill(0)

                let isTransactionHappening = false;

                for (let r = 0; r < resources.length; r++) {
                    let resource = resources[r]

                    let outflowProbability = +resource.outflowBaseProbability / d;

                    if (Math.random() < outflowProbability) {
                        isTransactionHappening = true;

                        // A node can't give more than it has!
                        const transactionValue = Math.min(
                            config.resources[r].outflowMean,
                            nodes[i].resources[r]
                        );
                        transactionResources[r] = transactionValue;
                    }
                }

                if (isTransactionHappening) {
                    state.transactions.push(new Transaction({
                        sourceIndex: i,
                        targetIndex: j,
                        resources: transactionResources
                    }))

                    for (let r = 0; r < resources.length; r++) {
                        // Target gets resources
                        nodes[j].resources[r] += transactionResources[r]

                        // Source loses resources
                        nodes[i].resources[r] -= transactionResources[r]

                        // Nodes will die from deprivation of existential resources
                        if (config.resources[r].existential && nodes[i].resources[r] <= 0) {
                            // Don't remove nodes immediately, since that would result in a loss of state data
                            nodes[i].isGoingToDie = true;
                            worker.log(`RIP Node ${i}`);
                        }
                    }
                }
            }
        }
    }
}

export default randomDonation;