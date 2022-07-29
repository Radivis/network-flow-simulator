// Transactions model instantaneous transactions between two nodes

'use strict';

import Vertex from './Vertex.js';

class Transaction extends Vertex {
    constructor(sourceIndex, targetIndex, resources) {
        super(sourceIndex, targetIndex);
        // this.sourceIndex = sourceIndex;
        // this.targetIndex = targetIndex;

        // Resources are modeled as an array of non-negative numbers
        if (!resources) this.resources = []
        else this.resources = resources
    }

    copy() {
        return new Transaction(this.sourceIndex, this.targetIndex, [...this.resources])
    }
}

export default Transaction;