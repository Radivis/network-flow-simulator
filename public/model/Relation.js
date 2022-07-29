// Relations model persistent relationships between two nodes

'use strict';

import Vertex from './Vertex.js';

class Relation extends Vertex {
    constructor(sourceIndex, targetIndex, types) {
        super(sourceIndex, targetIndex);
        // this.sourceIndex = sourceIndex;
        // this.targetIndex = targetIndex;

        // Resources are modeled as an array of non-negative numbers
        if (!types) this.types = []
        else this.types = types
    }

    copy() {
        return new Relation(this.sourceIndex, this.targetIndex, [...this.types])
    }
}

export default Relation;