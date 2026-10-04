/**
 * Distributed System Simulation (5 Virtual Nodes, Lamport/Vector Clocks, Conflict Resolution)
 */
export class VirtualNode {
  constructor(id) {
    this.id = id;
    this.state = new Map();
    this.messageQueue = [];
    this.lamportClock = 0;
    this.vectorClock = {};
    this.isCrashed = false;
  }

  send(targetNode, message) {
    if (this.isCrashed) throw new Error(`Node ${this.id} is crashed`);
    this.lamportClock++;
    message.clock = this.lamportClock;
    message.sender = this.id;
    
    // Simulate network delay / packet loss
    if (Math.random() < 0.05) {
      // Packet loss simulation
      return;
    }

    setTimeout(() => {
      if (!targetNode.isCrashed) {
        targetNode.receive(message);
      }
    }, Math.random() * 50);
  }

  receive(message) {
    if (this.isCrashed) return;
    this.lamportClock = Math.max(this.lamportClock, message.clock) + 1;
    this.messageQueue.push(message);
    this.resolveConflict(message);
  }

  resolveConflict(message) {
    // Last-write-wins with Lamport clocktie breaker
    if (message.key && message.value) {
      const existing = this.state.get(message.key);
      if (!existing || message.clock > existing.clock) {
        this.state.set(message.key, { value: message.value, clock: message.clock, sender: message.sender });
      }
    }
  }

  crash() {
    this.isCrashed = true;
  }

  recover() {
    this.isCrashed = false;
  }
}

export class DistributedCluster {
  constructor() {
    this.nodes = {
      A: new VirtualNode('A'),
      B: new VirtualNode('B'),
      C: new VirtualNode('C'),
      D: new VirtualNode('D'),
      E: new VirtualNode('E')
    };
  }

  broadcast(senderId, key, value) {
    const sender = this.nodes[senderId];
    for (const [id, node] of Object.entries(this.nodes)) {
      if (id !== senderId) {
        sender.send(node, { key, value });
      }
    }
  }
}
