// Models a momentary state of the network

'use strict';

class State {
    constructor(nodes, vertices) {
        this.nodes = nodes;
        this.vertices = vertices;
    }

    copy() {
        const newNodes = this.nodes.map(node => node.copy());
        const newVertices = this.vertices.map(vertex => vertex.copy());
        return new State(newNodes, newVertices)
    }
}

export default State;