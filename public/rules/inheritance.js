// Rule that deals with resource distribution after a node has been flagged to die

'use strict';

import Node from '../model/Node.js'
import Transaction from '../model/Transaction.js';

const getNearestNeighbors = (nodes, node, amountOfNeighbors) => {
    const distances = [];
    for (let i = 0; i < nodes.length; i++) {
        distances.push({
            node: nodes[i],
            distance: Node.d(node, nodes[i])
        })
    }

    distances.sort((a, b) => a.distance - b.distance)

    const neighbors = [];
    // i starts with 1, since the node in question has a distance of 0 to itself!
    for (let i = 1; i < Math.min(nodes.length, amountOfNeighbors+1); i++) {
        neighbors.push(distances[i].node)
    }

    return neighbors
}

// Worker is passed for debugging purposes
const inheritance = (state, config, worker) => {
    const { nodes } = state;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].isGoingToDie) {
            const nearestNeighbors = getNearestNeighbors(
                nodes,
                nodes[i],
                config.amountOfNeighborsInheriting
            )

            // Nodes don't store their index in the nodes array, so we have to work with the node id here!
            nearestNeighbors.forEach(neighbor => {
                const transactionResources = []
                for (let r = 0; r < config.resources.length; r++) {
                    // Split up every resource equally among all neighbors
                    transactionResources[r] = nodes[i].resources[r] / nearestNeighbors.length
                }

                const transaction = new Transaction({
                    sourceIndex: i,
                    targetId: neighbor.id,
                    resources: transactionResources
                })
                state.transactions.push(transaction)
                transaction.execute(nodes, config)

            })
        }
    }
}

export default inheritance;

