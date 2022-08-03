// A vertex models an abstract connection between two nodes

'use strict';

class Vertex {
    constructor({
        sourceIndex,
        targetIndex,
        sourceId,
        targetId,
    } = {}) {
        this.sourceIndex = sourceIndex;
        this.targetIndex = targetIndex;
        this.sourceId = sourceId;
        this.targetId = targetId;
    }

    copy() {
        return new Vertex({
            sourceIndex: this.sourceIndex,
            targetIndex: this.targetIndex,
            sourceId: this.sourceId,
            targetId: this.targetId
        }
        )
    }
}

export default Vertex;