'use strict';

// IMPORTS
import Node from '../model/Node.js'
import State from '../model/State.js'
import rules from '../rules/rules.js';

// CONSTANTS

// HELPER FUNCTIONS

// With these settings there is enough space for at least 1000 nodes
// However, the process of placing 1000 nodes can take a couple of seconds!
const defaultSafeDistance = 0.025
const defaultPadding = 0.02

const getFreeCoordinates = ({
    nodes,
    safeDistance = defaultSafeDistance,
    padding = defaultPadding
} = {}) => {
    let candidateX, candidateY;
    let isTooCloseToNode = true;

    while (isTooCloseToNode) {
        // The padding creates a distance to the boundary
        candidateX = padding + Math.random() * (1 - 2 * padding);
        candidateY = padding + Math.random() * (1 - 2 * padding);

        isTooCloseToNode = false;

        for (let i = 0; i < nodes.length && !isTooCloseToNode; i++) {
            const candidateNode = new Node({x: candidateX, y: candidateY});
            if (Node.d(candidateNode, nodes[i]) < safeDistance) {
                isTooCloseToNode = true;
            }
        }
    }

    return {x: candidateX, y: candidateY}
}

self.log = value => {
    let debugString = value;

    if (!(typeof value == 'string')
        && !(typeof value == 'number')
        && !(typeof value == 'boolean')
    ) {
        debugString = JSON.stringify(value)
    }

    self.postMessage({
        status: 'debugging',
        payload: `Debug Message from Worker #${self.id}: ${debugString}`
    })
}

// MESSAGE HANDLERS

self.onmessage = msg => {
    // Load config
    const { config, runId } = msg.data;

    self.id = runId;

    let { amountOfNodes, amountOfTicks } = config;

    // DEBUG
    // self.log(JSON.stringify(msg.data))

    // Explicit cast of config values
    amountOfNodes = Number(amountOfNodes)
    amountOfTicks = Number(amountOfTicks)

    // Create nodes
    const resources = [... new Array(config.resources.length)]
        .map((nothing, index) => Number(config.resources[index].initialNodeStock));

    const nodes = []
    for (let i = 0; i < amountOfNodes; i++) {
        const {x, y} = getFreeCoordinates({nodes})
        nodes.push(new Node({x, y, resources, id: i}))
    }

    // Create initial state
    const states = [new State(nodes)]

    const computeNextState = state => {
        // Get a copy of the old state with the nodes removed that have died
        state = state.next();

        const activeRules = rules(config)

        // Mutate the state by applying each rule in turn
        for (let i = 0; i < activeRules.length; i++) {
            const rule = activeRules[i];
            rule(state, config, self)
        }

        return state;
    }

    const computeStates = () => {
        for (let i = 0; i < amountOfTicks; i++) {
            states.push(computeNextState(states[i]))

            // Status update
            if (i % 10 == 0) {
                self.postMessage({
                    status: 'pending',
                    payload: i / amountOfTicks
                })
            }
        }

        self.postMessage({
            status: 'complete',
            payload: states
        })

        // Note: The payload seems to be transmitted as raw data wihout the methods on the object instances!
    }

    computeStates()
}


