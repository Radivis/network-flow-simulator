'use strict';

class Vertex {
    constructor(sourceIndex, targetIndex, resources) {
        this.sourceIndex = sourceIndex;
        this.targetIndex = targetIndex;

        // Resources are modeles as an array of non-negative numbers
        if (!resources) this.resources = []
        else this.resources = resources
    }

    copy() {
        return new Vertex(this.sourceIndex, this.targetIndex, [...this.resources])
    }
}

export default Vertex;