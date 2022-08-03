/*
This rule determines the behavior of a node to start a unilateral resource transfer to another node.
*/

'use strict';

import Node from '../model/Node.js'
import Transaction from '../model/Transaction.js';
import { selectRandomElements } from '../util/math.js';

// Worker is passed for debugging purposes
const donations = (state, config, worker) => {
    const { nodes } = state;
    const { resources } = config;

    for (let i = 0; i < nodes.length; i++) {
        // Need to remove i in nodes for the following step!
        const partners = selectRandomElements(nodes, config.maxAmountOfDonations)

        for (let j = 0; j < partners.length; j++) {
            if (i != j) {

                // Node distance
                const d = Node.d(nodes[i], partners[j])

                const transactionResources = [... new Array(resources.length)].fill(0)

                let isTransactionHappening = false;

                for (let r = 0; r < resources.length; r++) {
                    let resource = resources[r]

                    let donationProbability = +resource.donationBaseProbability / d;

                    if (Math.random() < donationProbability) {
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
                    const transaction = new Transaction({
                        sourceIndex: i,
                        targetId: partners[j].id,
                        resources: transactionResources
                    })
                    state.transactions.push(transaction)
                    transaction.execute(nodes, config)
                }
            }
        }
    }
}

export default donations;