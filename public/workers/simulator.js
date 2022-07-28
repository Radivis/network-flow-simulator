'use strict';

// IMPORTS
import Node from '../model/Node.js'
import Vertex from '../model/Vertex.js';
import State from '../model/State.js'

self.onmessage = msg => {
    // Load config
    const { config } = msg.data;
    
    // Array of functions, each depending on the config
    const rules = [];
    
    const { amountOfNodes, amountOfTicks } = config;
    
    // Create nodes
    const nodes = [... new Array(amountOfNodes)].map(() => new Node())
    
    // Create vertices
    const vertices = [];
    for (let i = 0; i < amountOfNodes; i++) {
        for (let j = 0; j < amountOfNodes; j++) {
            vertices.push(new Vertex(i,j))
        }
    }
    
    // Create initial state
    const states = [new State(nodes, vertices)]
    
    const computeNextState = state => {
        // Copy state to keep the old state unchanged
        const state = new State(state);
    
        // Mutate the state by applying each rule in turn
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            state = rule(state, config)
        }
    
        return state;
    }
    
    const computeStates = () => {
        for (let i = 1; i < amountOfTicks; i++) {
            states.push(computeNextState(states[i]))
            
            // Status update
            if (i % 1000 == 0) {
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


