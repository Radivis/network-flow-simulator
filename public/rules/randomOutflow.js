/*
This rule determines the behavior of a node to start a resource transfert to another node.
This is the most important rule of all, because without this, nothing interesting happens!
*/

'use strict';

import Node from '../model/Node.js'

const randomOutflow = (state, config) => {
    const { nodes, vertices } = state;
    const { resources } = config; 

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            const vertex = vertices
            .filter(vertex => vertex.sourceIndex == i && vertex.targetIndex == j)

            // Node distance
            const d = Node.d(nodes[i], nodes[j])

            for (let r = 0; r < resources.length; r++) {
                let resource = resources[r]
                let outflowProbability = resource.outflowProbability / d;

                if (Math.random() < outflowProbability) {
                    vertex.resources[r] = resource.outflowMean
                }

            }
        }

    }
}

export default randomOutflow;