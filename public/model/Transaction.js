// Transactions model instantaneous transactions between two nodes

'use strict';

import Vertex from './Vertex.js';

class Transaction extends Vertex {
    constructor({
        sourceIndex,
        targetIndex,
        sourceId,
        targetId,
        resources
    } = {}) {
        super(sourceId, targetId);

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
}

export default Transaction;