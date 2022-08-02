// Class for the canvas visualizating a simulation run

'use strict';

import { createElement } from '../util/dom.js';
import Draw from '../util/Draw.js';
import Debouncer from '../util/Debouncer.js';

const debouncingDelay = 20

class RunCanvas {
    constructor({
        parent,
        width = 800,
        height = 800,
        initialState,
        config
    } = {}) {
        this.parent = parent;

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
        this.config = config;

        this.draw = new Draw(this.canvas);

        this.renderState(initialState)
        
        this.debouncedSelectNode = new Debouncer({
            func: this.selectNode.bind(this),
            delay: debouncingDelay
        })

        this.debouncedUnselectNode = new Debouncer({
            func: this.unselectNode.bind(this),
            delay: debouncingDelay
        })

    }

    clearCanvas() {
        this.draw.clearCanvas()
    }

    // Currently doesn't work. After this method is called, the canvas stays blank!
    removeAllEventListeners() {
        // const newCanvas = this.canvas.cloneNode(true)
        // this.parent.replaceChild(newCanvas, this.canvas)
        // this.canvas = newCanvas;
        // this.canvas = this.parent.querySelector('canvas')
    }

    drawNode(node, isHighlighted) {
        let colors = this.config.resources.map(resource => resource.color);
        if (isHighlighted) {
            colors = node.resources.map(value => '#0f0')
        } else {
            // colors = node.resources.map(value => '#000')
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
        const arrowScalingFactor = 5

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
            size: Math.sqrt(transaction.resources[0]) * arrowScalingFactor,
            angle,
            color
        })
    }

    // renders a momentary state of a simulation run
    renderState(state) {
        this.removeAllEventListeners()
        this.clearCanvas()

        // DEBUG
        console.log('Rendering canvas');

        state.nodes.forEach((node, index) => {
            this.drawNode(node, this.selectedNodeIndex == index ? true : false)
        })

        for (let i=0; i < state.transactions.length; i++) {
            const currentTransaction = state.transactions[i]
            this.drawTransaction({
                transaction: currentTransaction,
                sourceNode: state.nodes[currentTransaction.sourceIndex],
                targetNode: state.nodes[currentTransaction.targetIndex],
            })
        }

        this.canvas.addEventListener('mousemove', (ev) => {
            this.debouncedSelectNode(ev, state)
        })
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
                // console.log(node.resources[0]);

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

                this.unselectNodeListener = (ev) => {
                    this.debouncedUnselectNode(ev, node)
                }

                this.canvas.addEventListener('mousemove', this.unselectNodeListener)
            }
        }
    }

    unselectNode(ev, node) {
        const boundingClientRect = ev.target.getBoundingClientRect();

        const x = ev.clientX - boundingClientRect.left;
        const y = ev.clientY - boundingClientRect.top;

        const dx = x - node.x * this.width;
        const dy = y - node.y * this.height;

        if ((dx**2 + dy **2) > node.resources[0]) {
            this.selectedNodeIndex = null;

            this.canvas.removeEventListener('mousemove', this.unselectNodeListener)
            this.renderState(this.state)
        }
    }
}

export default RunCanvas;