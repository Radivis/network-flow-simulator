// Class for the canvas visualizating a simulation run

'use strict';

import { createElement } from '../util/dom.js';
import Draw from '../util/Draw.js';
import Debouncer from '../util/Debouncer.js';
import Transaction from '../model/Transaction.js';

const debouncingDelay = 20

class RunCanvas {
    constructor({
        parent,
        width = 800,
        height = 800,
        initialStateIndex = 0,
        config,
        runData,
        setStateIndexCallback
    } = {}) {
        this.parent = parent;

        this.canvas = createElement({
            type: 'canvas',
            parent,
            props: {
                width,
                height
            }
        });

        this.width = width;
        this.height = height;
        this.stateIndex = initialStateIndex;
        this.config = config;
        this.runData = runData;
        this.setStateIndexCallback = setStateIndexCallback;

        this.areTransactionsVisible = true;

        this.draw = new Draw(this.canvas);

        // debounce event handlers
        this.debouncedSelectNode = new Debouncer({
            func: this.selectNode.bind(this),
            delay: debouncingDelay
        })

        this.debouncedUnselectNode = new Debouncer({
            func: this.unselectNode.bind(this),
            delay: debouncingDelay
        })

        // this binding for methods that are used as callbacks
        this.animateRun = this.animateRun.bind(this)
        this.stopRunAnimation = this.stopRunAnimation.bind(this)
        this.setStateIndex = this.setStateIndex.bind(this)

        // initialize canvas
        this.setStateIndex(initialStateIndex)
    }

    animateRun({
        frameDuration = 100,
        reversed = false
    } = {}) {

        this.animation = setInterval(() => {
            // DEBUG
            console.log("Callback fired");

            if ((!reversed) && this.stateIndex < this.runData.states.length - 1) {
                this.setStateIndex(this.stateIndex + 1)
            } else if (reversed && this.stateIndex > 0) {
                this.setStateIndex(this.stateIndex - 1)
            } else {
                this.stopRunAnimation()
            }
        }
            , frameDuration)
    }

    stopRunAnimation() {
        clearInterval(this.animation)
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
        const boundariesX = [];
        const boundariesY = [];

        const amountOfResources = this.config.resources.length

        for (let r = 0; r < amountOfResources; r++) {
            boundariesX.push(midX + (endX - midX) * (r + 1) / (amountOfResources + 1))
            boundariesY.push(midY + (endY - midY) * (r + 1) / (amountOfResources + 1))

            this.draw.centeredTriangle({
                x: boundariesX[r],
                y: boundariesY[r],
                size: Math.sqrt(transaction.resources[r]) * arrowScalingFactor,
                angle,
                color: this.config.resources[r].color
            })
        }

    }

    // renders a momentary state of a simulation run
    renderState() {
        this.removeAllEventListeners()
        this.clearCanvas()

        // DEBUG
        console.log('Rendering canvas');

        const state = this.runData.states[this.stateIndex]

        state.nodes.forEach((node, index) => {
            this.drawNode(node, this.selectedNodeIndex == index ? true : false)
        })

        if (this.areTransactionsVisible) {
            for (let i = 0; i < state.transactions.length; i++) {
                // Note that at this stage, the transaction is a raw object without methods
                const currentTransaction = new Transaction(state.transactions[i])

                this.drawTransaction({
                    transaction: currentTransaction,
                    sourceNode: currentTransaction.getSourceNode(state.nodes),
                    targetNode: currentTransaction.getTargetNode(state.nodes),
                })
            }
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
            if ((dx ** 2 + dy ** 2) <= node.resources[0]) {
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
                        isHighlighted: true
                    })
                })

                this.unselectNodeListener = (ev) => {
                    this.debouncedUnselectNode(ev, node)
                }

                this.canvas.addEventListener('mousemove', this.unselectNodeListener)
            }
        }
    }

    setStateIndex(index) {
        this.stateIndex = index
        this.renderState(this.runData.states[this.stateIndex])

        // Notify external elements to update
        if (this.setStateIndexCallback) this.setStateIndexCallback(index)
    }

    unselectNode(ev, node) {
        const boundingClientRect = ev.target.getBoundingClientRect();

        const x = ev.clientX - boundingClientRect.left;
        const y = ev.clientY - boundingClientRect.top;

        const dx = x - node.x * this.width;
        const dy = y - node.y * this.height;

        if ((dx ** 2 + dy ** 2) > node.resources[0]) {
            this.selectedNodeIndex = null;

            this.canvas.removeEventListener('mousemove', this.unselectNodeListener)
            this.renderState(this.runData.states[this.stateIndex])
        }
    }
}

export default RunCanvas;