// Class for the canvas visualizating a simulation run

'use strict';

import { createElement } from '../util/dom.js';
import Draw from '../util/Draw.js';

class RunCanvas {
    constructor({
        parent,
        width = 800,
        height = 800,
        initialState
    } = {}) {
        this.canvas = createElement({
            type:'canvas',
            parent,
            props: {
                width,
                height
            }
        });

        this.width = width;
        this.height = height;

        this.state = initialState;

        this.draw = new Draw(this.canvas);

        this.renderState(initialState)
    }

    drawNode(node) {
        this.draw.polarDiagram({
            x: node.x * this.width,
            y: node.y * this.height,
            radii: node.resources.map(value => Math.sqrt(value)),
            colors: node.resources.map(value => '#000')
        })
    }

    drawTransaction({
        transaction,
        sourceNode,
        targetNode
    } = {}) {

        const startX = sourceNode.x * this.width;
        const startY = sourceNode.y * this.height;
        const endX = targetNode.x * this.width;
        const endY = targetNode.y * this.height;
        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2

        this.draw.line({
            startX,
            startY,
            endX,
            endY,
        })

        /*
        transaction arrows point towards the target and are close to it
        if r resources are involved, the line segment close to the
        target node is subdivided into r+1 segments and the triangles are
        drawn at the segment boundaries
        */

        this.draw.centeredTriangle({
            x: (midX + endX) / 2,
            y: (midY + endY) / 2,
            size: transaction.resources[0] * 10,
            color: '#123'
        })
    }

    // renders a momentary state of a simulation run
    renderState(state) {
        for (let i=0; i < state.nodes.length; i++) {
            this.drawNode(this.state.nodes[i])
        }

        for (let i=0; i < state.transactions.length; i++) {
            const currentTransaction = state.transactions[i]
            this.drawTransaction({
                transaction: currentTransaction,
                sourceNode: state.nodes[currentTransaction.sourceIndex],
                targetNode: state.nodes[currentTransaction.targetIndex],
            })
        }
    }
}

export default RunCanvas;