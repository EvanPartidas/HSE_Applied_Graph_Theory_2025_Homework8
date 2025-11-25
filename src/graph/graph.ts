export type GraphNode = {
  // Unique identifier for the node
  id: number;
  // Set of connected edges (by node id)
  edges: Set<number>;
};

export class Graph {
  private nodes: Map<number, GraphNode>;

  constructor(nodeCount: number = 0) {
    this.nodes = new Map();
    for (let i = 0; i < nodeCount; i++) {
      this.addNode(i);
    }
  }
  addNode(id: number): void {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, edges: new Set() });
    }
  }

  addEdge(fromId: number, toId: number): void {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    if (fromNode && toNode) {
      fromNode.edges.add(toId);
      toNode.edges.add(fromId);
    }
  }

  getNode(id: number): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getNeighbors(id: number): GraphNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];
    return Array.from(node.edges)
      .map((edgeId) => this.nodes.get(edgeId)!)
      .filter((n) => n);
  }

  getEdgeCount(): number {
    let count = 0;
    for (const node of this.nodes.values()) {
      count += node.edges.size;
    }
    return count / 2; // Each edge is counted twice
  }
  getNodeCount(): number {
    return this.nodes.size;
  }
}
