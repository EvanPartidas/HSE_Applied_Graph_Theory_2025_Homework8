import { calcMeanDegree, calcStdDevDegree } from "./analysis";
import { generateGraphErdosRenyi, graphToAdjacencyList } from "./generate";

const n = 192244;
const m = 609066;
const smallerN = 10000;
const smallerM = (m * smallerN) / n;
const p = (2 * smallerM) / (smallerN * (smallerN - 1));

console.log("Generating Erdős-Rényi graph with", smallerN, "nodes and edge probability", p);
const graph = generateGraphErdosRenyi(smallerN, p);
console.log("Graph generation complete.");
const adjList = graphToAdjacencyList(graph);
console.log("Generated graph with", smallerN, "nodes and edge probability", p);
const mean = calcMeanDegree(adjList);
const stdDev = calcStdDevDegree(adjList);

console.log("Mean Degree:", mean);
console.log("Standard Deviation of Degree:", stdDev);
