import type { AdjacencyList } from "./generate";

export function calcMeanDegree(adjacencyList: AdjacencyList): number {
  let totalDegree: number = 0;
  const numVertices: number = Object.keys(adjacencyList).length;
  for (const vertex in adjacencyList) {
    totalDegree += adjacencyList[vertex].length;
  }
  return totalDegree / numVertices;
}

export function calcStdDevDegree(adjacencyList: AdjacencyList): number {
  const numVertices: number = Object.keys(adjacencyList).length;
  const meanDegree: number = calcMeanDegree(adjacencyList);
  const variance: number =
    Object.values(adjacencyList)
      .map((deg: number[]) => deg.length)
      .reduce((acc: number, deg: number) => acc + Math.pow(deg - meanDegree, 2), 0) / numVertices;
  return Math.sqrt(variance);
}

export function adjacencyListToDegreeDistribution(
  adjacencyList: AdjacencyList
): Map<number, number> {
  const degreeDistribution: Map<number, number> = new Map();
  for (const vertex in adjacencyList) {
    const degree: number = adjacencyList[vertex].length;
    degreeDistribution.set(degree, (degreeDistribution.get(degree) || 0) + 1);
  }
  return degreeDistribution;
}

type Point = { x: number; y: number };

type RegressionResult = {
  slope: number;
  intercept: number;
};

export function linearRegression(points: Point[]): RegressionResult {
  points.sort((a, b) => a.x - b.x);
  const n = points.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export function getDegreesOfAdjacencyList(adjacencyList: AdjacencyList): number[] {
  return Object.values(adjacencyList).map((neighbors: number[]) => neighbors.length);
}

export function generateSimpleGraphWithDegrees(degrees: number[]): AdjacencyList {
  let adjacencyList: AdjacencyList = {};
  // init adjacency list
  for (let i = 0; i < degrees.length; i++) {
    adjacencyList[i] = [];
  }
  // we'll start by generating a graph starting with the smallest degrees first
  const sortedDegrees = [...degrees].sort((a, b) => a - b);
  const sortedDegreesCopy = [...degrees].sort((a, b) => a - b);
  let totalAttempts = 0;
  let degreesGreaterThanZero = sortedDegrees.map((_deg, idx) => idx);
  //
  // reverse degreesGreaterThanZero to start connecting from largest degree
  degreesGreaterThanZero = degreesGreaterThanZero.reverse();
  let degreesGreaterThanZeroStartingPoint = 0;

  let verticesWithNotEnoughDegree: number[] = [];

  for (let i = 0; i < sortedDegrees.length; i++) {
    const degree = sortedDegrees[i];
    for (
      let d = degreesGreaterThanZeroStartingPoint;
      d < degreesGreaterThanZero.length && adjacencyList[i]?.length < degree;
      d++
    ) {
      const potentialNeighbor = degreesGreaterThanZero[d];
      if (
        potentialNeighbor !== i &&
        !adjacencyList[i].includes(potentialNeighbor) &&
        sortedDegrees[potentialNeighbor] > 0
      ) {
        adjacencyList[i].push(potentialNeighbor);
        adjacencyList[potentialNeighbor].push(i);
        sortedDegrees[potentialNeighbor]--;
        sortedDegrees[i]--;
      }
    }
    if (adjacencyList[i]?.length < degree) {
      console.log(
        "Could not satisfy degree for vertex",
        i,
        "desired:",
        degree,
        "actual:",
        adjacencyList[i]?.length
      );
      verticesWithNotEnoughDegree.push(i);
    }
  }

  verticesWithNotEnoughDegree = Object.keys(adjacencyList)
    .filter((id) => adjacencyList[id].length < sortedDegreesCopy[id])
    .map((id) => Number.parseInt(id));
  // This just does some edge swaps because the "greedy" approach of just
  // selecting edges randomly can trap us into a corner
  while (verticesWithNotEnoughDegree.length > 0) {
    console.log(
      verticesWithNotEnoughDegree.map((id) => ({
        id,
        desired: sortedDegreesCopy[id],
        actual: adjacencyList[id].length,
      }))
    );
    // First type of fix:
    // If a vertex needs 2 more connections, we can find two adjacent vertices
    // That aren't adjacent to our initial vertex, disconnect them, and connect them
    // To our initial vertex.
    // ex: A needs 2 edges, B and C are connected, disconnect B and C, connect A to B and C
    const adjListKeys = Object.keys(adjacencyList);
    for (let toFix = 0; toFix < verticesWithNotEnoughDegree.length; toFix++) {
      const id = verticesWithNotEnoughDegree[toFix];
      const desiredDegree = sortedDegreesCopy[id];
      const realDegree = adjacencyList[id].length;
      if (desiredDegree - realDegree >= 2) {
        let foundAnEdgeToTransfer = false;
        for (let i = 0; i < adjListKeys.length && !foundAnEdgeToTransfer; i++) {
          if (adjacencyList[id].includes(i)) continue;
          for (let j = 0; j < adjacencyList[i].length && !foundAnEdgeToTransfer; j++) {
            if (adjacencyList[id].includes(adjacencyList[i][j])) continue;
            foundAnEdgeToTransfer = true;

            // console.log("Found an edge:", id, i, adjacencyList[i][j]);
            adjacencyList[id].push(i);
            adjacencyList[i].push(id);
            adjacencyList[id].push(adjacencyList[i][j]);
            adjacencyList[adjacencyList[i][j]].push(id);
            const neighbor = adjacencyList[i][j];
            adjacencyList[i] = adjacencyList[i].filter((elem) => elem != neighbor);
            adjacencyList[neighbor] = adjacencyList[neighbor].filter((elem) => elem != i);
            if (adjacencyList[id].length >= desiredDegree) {
              verticesWithNotEnoughDegree = verticesWithNotEnoughDegree.filter((x) => x != id);
            }
          }
        }
      }
    }
    // Sometimes a vertex may need only 1 more edge
    // In this case, there should exist another vertex
    // Which only needs 1 edge, we can similarly
    // Remove an existing edge and connect each of the initial vertices
    // To one of the vertices in the pair we just deleted the edge between
    // Ex: A needs 1 edge, B needs 1 edge, find adjacent edges C and D,
    // Disconnect C and D and connect A to C and B to D.
    let pair: number[] = [];
    for (let i = 0; i < verticesWithNotEnoughDegree.length; i++) {
      const vertexA = verticesWithNotEnoughDegree[i];
      const desiredDegreeA = sortedDegreesCopy[vertexA];
      if (desiredDegreeA - adjacencyList[vertexA].length != 1) continue;
      for (let j = i + 1; j < verticesWithNotEnoughDegree.length; j++) {
        const vertexB = verticesWithNotEnoughDegree[j];
        const desiredDegreeB = sortedDegreesCopy[vertexB];
        if (desiredDegreeB - adjacencyList[vertexB].length != 1) continue;
        pair = [vertexA, vertexB];
      }

      if (pair.length > 1) break;
    }

    if (pair.length > 1) {
      const recipientA = pair[0];
      const recipientB = pair[1];
      let addedFlag = false;
      for (let donerA = 0; donerA < adjListKeys.length; donerA++) {
        if (adjacencyList[recipientA].includes(donerA)) continue;
        for (let j = 0; j < adjacencyList[donerA].length; j++) {
          const donerB = adjacencyList[donerA][j];
          if (adjacencyList[recipientB].includes(donerB)) continue;
          addedFlag = true;
          adjacencyList[recipientA].push(donerA);
          adjacencyList[donerA].push(recipientA);
          adjacencyList[recipientB].push(donerB);
          adjacencyList[donerB].push(recipientB);
          adjacencyList[donerA] = adjacencyList[donerA].filter((x) => x != donerB);
          adjacencyList[donerB] = adjacencyList[donerB].filter((x) => x != donerA);
          if (adjacencyList[recipientA].length >= sortedDegreesCopy[recipientA]) {
            verticesWithNotEnoughDegree = verticesWithNotEnoughDegree.filter(
              (x) => x != recipientA
            );
          }

          if (adjacencyList[recipientB].length >= sortedDegreesCopy[recipientB]) {
            verticesWithNotEnoughDegree = verticesWithNotEnoughDegree.filter(
              (x) => x != recipientB
            );
          }
        }
        if (addedFlag) break;
      }
    }
  }
  console.log("finished");
  const keys = Object.keys(adjacencyList);
  for (let i = 0; i < keys.length; i++) {
    if (adjacencyList[i].length != sortedDegreesCopy[i]) {
      console.log("i:", i, ",", adjacencyList[i].length, " != ", sortedDegreesCopy[i]);
    }
  }

  return adjacencyList;
}
