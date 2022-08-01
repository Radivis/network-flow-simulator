'use strict';

import { createInteger } from "../util/math.js";

class Node {
    constructor({
        resources,
        x,
        y,
        color,
        id
    } = {}) {
        // Resources are modeled as an array of non-negative numbers
        if (!resources) this.resources = []
        else this.resources = resources

        if (!x) this.x = Math.random()
        else this.x = x;
        if (!y) this.y = Math.random()
        else this.y = y;

        if (!color) this.color = `hsl(${createInteger(0, 360)}, ${50 + createInteger(0, 50)}%, ${25 + createInteger(0, 50)}%)`
        else this.color = color

        if (id != undefined) this.id = id
    }

    copy() {
        return new Node({
            resources: [...this.resources],
            x: this.x,
            y: this.y,
            color: this.color,
            id: this.id
        }
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