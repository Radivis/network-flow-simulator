// A vertex models an abstract connection between two nodes

'use strict';

class Vertex {
    constructor(sourceIndex, targetIndex, resources) {
        this.sourceId = sourceIndex;
        this.targetId = targetIndex;
    }

    copy() {
        return new Vertex(this.sourceId, this.targetId)
    }
}

export default Vertex;