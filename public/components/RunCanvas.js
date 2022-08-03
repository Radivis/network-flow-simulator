// Class for the canvas visualizating a simulation run

'use strict';

import { createElement } from '../util/dom.js';
import Draw from '../util/Draw.js';
import Debouncer from '../util/Debouncer.js';
import Transaction from '../model/Transaction.js';

const debouncingDelay = 20
const defaultFrameDuration = 100

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

        // defaults and stuff
        this.areTransactionsVisible = true;

        this.draw = new Draw(this.canvas);

        this.frameDuration = defaultFrameDuration
        this.isAnimationReversed = false

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
        this.setFrameDuration = this.setFrameDuration.bind(this)

        // initialize canvas
        this.setStateIndex(initialStateIndex)
    }

    // ANIMATION STUFF
    animateRun() {
        this.stopRunAnimation()

        this.animation = setInterval(() => {
            if ((!this.isAnimationReversed)
                && this.stateIndex < this.runData.states.length - 1) {
                this.setStateIndex(this.stateIndex + 1)
            } else if (this.isAnimationReversed
                && this.stateIndex > 0) {
                this.setStateIndex(this.stateIndex - 1)
            } else {
                this.stopRunAnimation()
            }
        }
            , this.frameDuration)
    }

    stopRunAnimation() {
        clearInterval(this.animation)
    }

    // RENDERING STUFF

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
        let angle = -Math.atan((endX - startX) / (endY - startY))

        // if the y axis is "reversed", the arrow needs to point in the opposite direction
        if (endY -startY < 0) angle = angle + Math.PI

        /*
        transaction arrows point towards the target and are close to it
        if r resources are involved, the line segment close to the
        target node is subdivided into r+1 segments and the triangles are
        drawn at the segment boundaries
        */
        const targetSegmentBoundariesX = [];
        const targetSegmentBoundariesY = [];

        /*
        negative amount transactions (see exchanges) point
        towards the source and are close to it.
        The direction of the arrows are reversed.
        Otherwise the same logic as for positive transactions applies
        */
        const sourceSegmentBoundariesX = [];
        const sourceSegmentBoundariesY = [];

        const amountOfResources = this.config.resources.length

        for (let r = 0; r < amountOfResources; r++) {
            targetSegmentBoundariesX.push(midX + (endX - midX) * (r + 1) / (amountOfResources + 1))
            targetSegmentBoundariesY.push(midY + (endY - midY) * (r + 1) / (amountOfResources + 1))
            sourceSegmentBoundariesX.push(midX + (startX - midX) * (r + 1) / (amountOfResources + 1))
            sourceSegmentBoundariesY.push(midY + (startY - midY) * (r + 1) / (amountOfResources + 1))
            
            if (transaction.resources[r] > 0) {
                this.draw.centeredTriangle({
                    x: targetSegmentBoundariesX[r],
                    y: targetSegmentBoundariesY[r],
                    size: Math.sqrt(transaction.resources[r]) * arrowScalingFactor,
                    angle,
                    color: this.config.resources[r].color
                })
            } else {
                this.draw.centeredTriangle({
                    x: sourceSegmentBoundariesX[r],
                    y: sourceSegmentBoundariesY[r],
                    size: Math.sqrt(-transaction.resources[r]) * arrowScalingFactor,
                    angle: angle + Math.PI,
                    color: this.config.resources[r].color
                })
            }

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

    // EVENT HANDLERS

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

                // Get all transactions that involve this node
                const nodeTransactions = state.transactions.filter(transaction => {
                    return transaction.sourceIndex == i
                    || transaction.targetIndex == i
                    || transaction.sourceId == node.id
                    || transaction.targetId == node.id
                })

                nodeTransactions.forEach(transaction => {
                    // Note that at this stage, the transaction is a raw object without methods
                    transaction = new Transaction(transaction)
                    this.drawTransaction({
                        transaction,
                        sourceNode: transaction.getSourceNode(state.nodes),
                        targetNode: transaction.getTargetNode(state.nodes),
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

    // GETTERS & SETTERS

    setStateIndex(index) {
        this.stateIndex = index
        this.renderState(this.runData.states[this.stateIndex])

        // Notify external elements to update
        if (this.setStateIndexCallback) this.setStateIndexCallback(index)
    }

    setFrameDuration(duration) {
        this.frameDuration = duration
        if (this.animation) this.animateRun()
    }

}

export default RunCanvas;