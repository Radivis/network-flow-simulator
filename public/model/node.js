'use strict';

import { createInteger } from "../util/math.js";

class Node {
    constructor(resources, x, y, color) {
        // Resources are modeled as an array of non-negative numbers
        if (!resources) this.resources = []
        else this.resources = resources

        if (!x) this.x = Math.random()
        else this.x = x;
        if (!y) this.y = Math.random()
        else this.y = y;

        if (!color) this.color = `hsl(${createInteger(0, 360)}, ${50 + createInteger(0, 50)}%, ${25 + createInteger(0, 50)}%)`
        else this.color = color
    }

    copy() {
        return new Node(
            [...this.resources],
            this.x,
            this.y,
            this.color
        );
    }

    // Euclidean distance between two nodes
    static d(node1, node2) {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        return Math.sqrt(dx * dx + dy * dy)
    }
}

export default Node;