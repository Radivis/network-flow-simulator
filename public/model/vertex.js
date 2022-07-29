// A vertex models an abstract connection between two nodes

'use strict';

class Vertex {
    constructor(sourceIndex, targetIndex, resources) {
        this.sourceIndex = sourceIndex;
        this.targetIndex = targetIndex;
    }

    copy() {
        return new Vertex(this.sourceIndex, this.targetIndex)
    }
}

export default Vertex;