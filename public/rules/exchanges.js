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
import { clamp, median } from '../util/math.js'

// CONSTANTS
const minDesire = 0.1
const maxDesire = 10;

// Worker is passed for debugging purposes
const exchanges = (state, config, worker) => {
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

    // compute relative welaths and transaction desires of each node
    const relativeWealths = [];
    const purchaseDesires = [];
    const saleDesires = [];
    for (let i = 0; i < nodes.length; i++) {
        relativeWealths[i] = []
        purchaseDesires[i] = []
        saleDesires[i] = []
        for (let r = 0; r < resources.length; r++) {
            const relativeWealth = nodes[i].resources[r] / medians[r]

            let saleDesire = clamp(relativeWealth, minDesire, maxDesire)
            // NaN needs to be treated separately, because it can't be compared to other numbers
            if (isNaN(saleDesire)) saleDesire = maxDesire

            const purchaseDesire = 1 / saleDesire

            relativeWealths[i].push(relativeWealth)
            saleDesires[i].push(saleDesire)
            purchaseDesires[i].push(purchaseDesire)
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i < j) {

                // Node distance
                const d = Node.d(nodes[i], nodes[j])

                const transactionResources = [... new Array(resources.length)].fill(0)

                let isTransactionHappening = false;

                for (let r = 0; r < resources.length; r++) {
                    for (let s = 0; s < resources.length; s++) {
                        // only exchanges of different resources make sense
                        if (r < s) {
                            let exchangeProbability = 0;

                            let exchangeDesire = purchaseDesires[i][r] * saleDesires[j][s]

                            // the desires are good to know, but i needs to have s and j needs to have r in sufficient quantities
                            if (nodes[i].resources[s] > 0 && nodes[j].resources[r] > 0) {
                                exchangeProbability = exchangeDesire
                                    * resources[r].purchaseBaseProbability
                                    * resources[s].saleBaseProbability
                                    / d
                            }

                            if (Math.random() < exchangeProbability) {
                                isTransactionHappening = true;

                                // How much is exchanged?
                                // If j is poor in r, or i is poor in s, the fraction will be reduced
                                const exchangeFraction = Math.min(
                                    nodes[j].resources[r] / resources[r].outflowMean,
                                    nodes[i].resources[s] / resources[s].outflowMean,
                                    1
                                )

                                // How much r does i purchase from j?
                                const purchaseValue = resources[r].outflowMean * exchangeFraction

                                // Since resource r flows from j to i, the direction is reversed
                                transactionResources[r] = -purchaseValue;

                                // How much s dies i sell to j?
                                const saleValue = resources[s].outflowMean * exchangeFraction
                                transactionResources[s] = saleValue;
                            }
                        }
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


export default exchanges;