import { readFileSync } from "fs";
import { calcMeanDegree, calcStdDevDegree } from "./analysis";
import { edgeListToAdjacencyList, readEdgeList } from "./generate";
const file = readFileSync("edgelist.txt", "utf-8");
/*
Q1. Compute the mean and the deviation of the degree distribution of the graph 
whose edges are in the attached file
*/
const edgeList = readEdgeList(file);
const adjList = edgeListToAdjacencyList(edgeList);

const meanDegree = calcMeanDegree(adjList);
console.log("Mean Degree:", meanDegree);

const standardDeviation = calcStdDevDegree(adjList);
console.log("Standard Deviation of Degree:", standardDeviation);
