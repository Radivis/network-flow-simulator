// Models a momentary state of the network

'use strict';

class State {
    constructor(nodes, transactions) {
        this.nodes = nodes

        if (!transactions) this.transactions = []
        else this.transactions = transactions
    }

    // A state is mostly defined through its nodes
    // Transactions rarely need to be copied, too
    copy(isFullCopy) {
        const newNodes = this.nodes.map(node => node.copy())

        let newTransactions = []

        if (isFullCopy) newTransactions = this.transactions.map(transaction => transaction.copy())
        
        return new State(newNodes, newTransactions)
    }
}

export default State;