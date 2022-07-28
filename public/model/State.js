// Models a momentary state of the network

'use strict';

class State {
    constructor(nodes, vertices) {
        // Given nodes and vertices are copied, because a state needs to be immutable!
        this.nodes = nodes.map(node => node.copy());
        this.vertices = vertices.map(vertex => vertex.copy());
    }
}

export default State;