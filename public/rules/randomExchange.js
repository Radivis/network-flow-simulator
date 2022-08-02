/*
This rule determines the behavior of two nodes exchaning resources.

The basic idea is that nodes have a strong desire to get
a resource, if they have less than the median.

They are eager to trade those for resources, if they have
more of them than the median.
*/

'use strict';

import Node from '../model/Node.js'
import Transaction from '../model/Transaction.js';
import { median } from '../util/math.js'

// CONSTANTS
const maxDesire = 10;

// Worker is passed for debugging purposes
const randomExchange = (state, config, worker) => {
    const { nodes } = state;
    const { resources } = config;

    // compute medians
    const medians = [];
    for (let r = 0; r < resources.length; r++) {
        const resourceValues = []
        for (let i = 0; i < nodes.length; i++) {
            resourceValues.push(nodes[i].resources[r])
        }
        medians.push(median(resourceValues))
    }

    // DEBUG
    worker.log(medians)

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i != j) {

                // Node distance
                const d = Node.d(nodes[i], nodes[j])

                const transactionResources = [... new Array(resources.length)].fill(0)

                let isTransactionHappening = false;

                for (let r = 0; r < resources.length; r++) {
                    for (let s = 0; s < resources[r].length; s++) {
                        // only exchanges of different resources make sense
                        if (r != s) {

                            // The desire of node i to purchase resource r
                            let purchaseDesire = Math.min(
                                medians[r] / nodes[i].resources[r],
                                maxDesire
                            )

                            if (isNaN(purchaseDesire)) purchaseDesire = maxDesire

                            // The desire of node j to sell resource s
                            const saleDesire = nodes[j].resources[s] / medians[s]

                            const exchangeProbability = purchaseDesire * saleDesire * resources[s].outflowBaseProbability / d

                            if (Math.random() < exchangeProbability) {
                                isTransactionHappening = true;

                                // How much r does i purchase from j?
                                const purchaseValue = Math.min(
                                    config.resources[r].outflowMean,
                                    nodes[j].resources[r]
                                );
                                transactionResources[r] = -purchaseValue;

                                // How much s dies i sell to j?
                                const saleValue = Math.min(
                                    config.resources[s].outflowMean,
                                    nodes[i].resources[s]
                                );
                                transactionResources[s] = saleValue;
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
    }
}

export default randomExchange;