import { readFileSync, writeFileSync } from "fs";
import { generateSimpleGraphWithDegrees, getDegreesOfAdjacencyList } from "./analysis";
import { edgeListToAdjacencyList, readEdgeList, type AdjacencyList } from "./generate";
const file = readFileSync("edgelist.txt", "utf-8");

function saveGraphToFile(adjacencyList: AdjacencyList, filePath: string): void {
  const edges: Set<string> = new Set();
  for (const u in adjacencyList) {
    for (const v of adjacencyList[u]) {
      if (parseInt(u) < v) {
        edges.add(`${u}\t${v}`);
      }
    }
  }
  const data: string = Array.from(edges).join("\n");
  writeFileSync(filePath, data, "utf-8");
}

const edgeList = readEdgeList(file);
const adjList = edgeListToAdjacencyList(edgeList);
const graph = generateSimpleGraphWithDegrees(getDegreesOfAdjacencyList(adjList));
console.log(Object.keys(graph).length);
saveGraphToFile(graph, "edgelist2.txt");
