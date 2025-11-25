import { Graph } from "./graph";

export type Edge = [number, number];
export type AdjacencyList = { [vertex: number]: number[] };

export function generateGraphErdosRenyi(nodeCount: number, edgeProbability: number): Graph {
  const graph = new Graph(nodeCount);

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < edgeProbability) {
        graph.addEdge(i, j);
      }
    }
  }

  return graph;
}

export function readEdgeList(data: string): Edge[] {
  const lines: string[] = data.trim().split("\n");
  const edges: Edge[] = [];
  for (const line of lines) {
    const [u, v] = line.split("\t").map(Number);
    edges.push([u, v]);
  }
  return edges;
}

export function edgeListToAdjacencyList(edges: Edge[]): AdjacencyList {
  const adjacencyList: AdjacencyList = {};
  for (const [u, v] of edges) {
    if (!adjacencyList[u]) {
      adjacencyList[u] = [];
    }
    adjacencyList[u].push(v);
    if (!adjacencyList[v]) {
      adjacencyList[v] = [];
    }
    adjacencyList[v].push(u);
  }
  return adjacencyList;
}

export function graphToAdjacencyList(graph: Graph): AdjacencyList {
  const adjacencyList: AdjacencyList = {};
  for (let i = 0; i < graph.getNodeCount(); i++) {
    const neighbors = graph.getNeighbors(i).map((node) => node.id);
    adjacencyList[i] = neighbors;
  }
  return adjacencyList;
}
