'use strict';

// IMPORTS
import Node from '../model/Node.js'
import State from '../model/State.js'
import rules from '../rules/rules.js';

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
        payload: `Worker Debug Message: ${debugString}`
    })
}

self.onmessage = msg => {
    // Load config
    const { config, runIndex } = msg.data;

    let { amountOfNodes, amountOfTicks } = config;

    // DEBUG
    // self.log(JSON.stringify(msg.data))

    // Explicit cast of config values
    amountOfNodes = Number(amountOfNodes)
    amountOfTicks = Number(amountOfTicks)

    // Create nodes
    const resources = [... new Array(config.resources.length)]
        .map((nothing, index) => Number(config.resources[index].initialNodeStock));
    const nodes = [... new Array(amountOfNodes)].map(() => new Node(resources))

    // Create vertices <- this approach is very inefficient, because this creates too many empty vertices
    // const vertices = [];
    // for (let i = 0; i < amountOfNodes; i++) {
    //     for (let j = 0; j < amountOfNodes; j++) {
    //         vertices.push(new Vertex(i, j))
    //     }
    // }

    // Create initial state
    const states = [new State(nodes)]

    const computeNextState = state => {
        // Copy state to keep the old state unchanged
        state = state.copy();

        // Mutate the state by applying each rule in turn
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
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
    }

    computeStates()
}


