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

        this.canvas.addEventListener('mousemove', (ev) => {
            this.selectNode(ev, this.state)
        })
    }

    clearCanvas() {
        this.draw.clearCanvas()
    }

    drawNode(node, isHighlighted) {
        let colors = [];
        if (isHighlighted) {
            colors = node.resources.map(value => '#0f0')
        } else {
            colors = node.resources.map(value => '#000')
        }

        this.draw.polarDiagram({
            x: node.x * this.width,
            y: node.y * this.height,
            radii: node.resources.map(value => Math.sqrt(value)),
            colors
        })
    }

    drawTransaction({
        transaction,
        sourceNode,
        targetNode,
        isHighlighted
    } = {}) {
        const arrowScalingFactor = 10

        const startX = sourceNode.x * this.width;
        const startY = sourceNode.y * this.height;
        const endX = targetNode.x * this.width;
        const endY = targetNode.y * this.height;
        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2

        const color = isHighlighted ? '#0f0' : '#000'

        this.draw.line({
            startX,
            startY,
            endX,
            endY,
            color
        })

        // compute angle that the transaction arrow points to (0 is downwards)
        const angle = -Math.atan((endX - startX) / (endY - startY))

        /*
        transaction arrows point towards the target and are close to it
        if r resources are involved, the line segment close to the
        target node is subdivided into r+1 segments and the triangles are
        drawn at the segment boundaries
        */


        this.draw.centeredTriangle({
            x: (midX + endX) / 2,
            y: (midY + endY) / 2,
            size: transaction.resources[0] * arrowScalingFactor,
            angle,
            color
        })
    }

    // renders a momentary state of a simulation run
    renderState(state) {
        this.clearCanvas()

        for (let i=0; i < state.nodes.length; i++) {
            this.drawNode(this.state.nodes[i], this.selectedNodeIndex == i ? true : false)
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

    // onmousemove event handler for selecting a node
    selectNode(ev, state) {
        const boundingClientRect = ev.target.getBoundingClientRect();

        const x = ev.clientX - boundingClientRect.left;
        const y = ev.clientY - boundingClientRect.top;

        for (let i = 0; i < state.nodes.length; i++) {
            const node = state.nodes[i];

            const dx = x - node.x * this.width;
            const dy = y - node.y * this.height;

            // the squared distance is compared to the squared radius
            if ((dx**2 + dy **2) <= node.resources[0]) {
                this.selectedNodeIndex = i;
                this.drawNode(node, true)

                // DEBUG
                console.log(node);

                // Get all transactions that involve this node
                const nodeTransactions = state.transactions.filter(transaction => {
                    return transaction.sourceIndex == i || transaction.targetIndex == i
                })

                nodeTransactions.forEach(transaction => {
                    this.drawTransaction({
                        transaction,
                        sourceNode: state.nodes[transaction.sourceIndex],
                        targetNode: state.nodes[transaction.targetIndex],
                        isHighlighted: true})
                })

                this.deselectNodeListener = this.canvas.addEventListener('mousemove', (ev) => {
                    this.unselectNode(ev, node, nodeTransactions)
                })
            }
        }
    }

    unselectNode(ev, node, nodeTransactions) {
        const boundingClientRect = ev.target.getBoundingClientRect();

        const x = ev.clientX - boundingClientRect.left;
        const y = ev.clientY - boundingClientRect.top;

        const dx = x - node.x * this.width;
        const dy = y - node.y * this.height;

        if ((dx**2 + dy **2) > node.resources[0]) {
            this.selectedNodeIndex = null;
            this.drawNode(node, false)
            nodeTransactions.forEach(transaction => {
                this.drawTransaction({
                    transaction,
                    sourceNode: this.state.nodes[transaction.sourceIndex],
                    targetNode: this.state.nodes[transaction.targetIndex],
                    isHighlighted: false})
                })

            this.canvas.removeEventListener('mousemmove', this.deselectNodeListener)
        }
    }
}

export default RunCanvas;