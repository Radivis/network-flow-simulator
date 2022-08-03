// Transactions model instantaneous transactions between two nodes

'use strict';

import Node from './Node.js';
import Vertex from './Vertex.js';

class Transaction extends Vertex {
    constructor({
        sourceIndex,
        targetIndex,
        sourceId,
        targetId,
        resources
    } = {}) {
        super({
            sourceIndex,
            targetIndex,
            sourceId,
            targetId,
        });

        this.sourceIndex = sourceIndex;
        this.targetIndex = targetIndex;
        this.sourceId = sourceId;
        this.targetId = targetId;

        // Resources are modeled as an array of non-negative numbers
        if (!resources) this.resources = []
        else this.resources = resources
    }

    copy() {
        return new Transaction({
            sourceIndex: this.sourceIndex,
            targetIndex: this.targetIndex,
            sourceId: this.sourceId,
            targetId: this.targetId,
            resources: [...this.resources]
        })
    }

    // The execution of a transaction actually transfers resources
    // DON'T FORGET THIS STEP!
    execute(nodes, config) {
        let sourceNode = this.getSourceNode(nodes)
        let targetNode = this.getTargetNode(nodes)

        for (let r = 0; r < config.resources.length; r++) {
            // Target gets resources
            targetNode.resources[r] += this.resources[r]

            // Source loses resources
            sourceNode.resources[r] -= this.resources[r]

            // Nodes will die from deprivation of existential resources
            if (config.resources[r].existential) {
                // Don't remove nodes immediately, since that would result in a loss of state data
                if (sourceNode.resources[r] <= 0) sourceNode.isGoingToDie = true

                // Note that transaction amounts can be negative (see exchanges)!
                if (targetNode.resources[r] <= 0) targetNode.isGoingToDie = true
            }
        }
    }

    getSourceNode(nodes) {
        let sourceNode
        if (isFinite(this.sourceIndex)) sourceNode = nodes[this.sourceIndex]
        if (isFinite(this.sourceId)) sourceNode = Node.getNodeById(nodes, this.sourceId)

        return sourceNode
    }

    getTargetNode(nodes) {
        let targetNode
        if (isFinite(this.targetIndex)) targetNode = nodes[this.targetIndex]
        if (isFinite(this.targetId)) targetNode = Node.getNodeById(nodes, this.targetId)

        return targetNode
    }
}

export default Transaction;