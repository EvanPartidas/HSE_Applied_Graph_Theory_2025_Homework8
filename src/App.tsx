import { ChartContainer, ChartsXAxis, ChartsYAxis, ScatterPlot } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { adjacencyListToDegreeDistribution, linearRegression } from "./graph/analysis";
import { edgeListToAdjacencyList, readEdgeList, type AdjacencyList } from "./graph/generate";

// Q4. Plot the degree distribution of the given graph in a log-log scale. Propose a model for the distribution.

function App() {
  const [adjList, setAdjList] = useState<AdjacencyList>([]);
  const [degreeDisitribution, setDegreeDistribution] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    fetch("edgelist.txt")
      .then((x) => x.text())
      .then((rawEdgeList) => {
        const edges = readEdgeList(rawEdgeList);
        const newAdjList = edgeListToAdjacencyList(edges);
        setAdjList(adjList);
        const newDegreeDistribution = adjacencyListToDegreeDistribution(newAdjList);
        setDegreeDistribution(newDegreeDistribution);
      });
  }, []);

  const degreeDistributionData = Array.from(degreeDisitribution.entries()).map((d) => ({
    x: Math.log(d[0]),
    y: Math.log(d[1]),
  }));
  const line = degreeDisitribution.size > 1 ? linearRegression(degreeDistributionData) : null;

  return (
    <div style={{ backgroundColor: "#ccc", padding: "20px" }}>
      <h1>
        Q4. Plot the degree distribution of the given graph in a log-log scale. Propose a model for
        the distribution.
      </h1>
      {degreeDisitribution.size > 0 && (
        <ChartContainer
          xAxis={[
            {
              data:
                degreeDisitribution.size > 0
                  ? Array.from(degreeDisitribution.keys()).map((x) => Math.log(x))
                  : [],
              label: "X-axis",
            },
          ]}
          series={[
            {
              data: degreeDisitribution.size > 0 ? degreeDistributionData : [],
              label: "y = log(x)",
              type: "scatter",
            },
          ]}
          height={300}
          margin={{ left: 50, right: 50, top: 30, bottom: 30 }}
        >
          <ScatterPlot />
          <ChartsXAxis />
          <ChartsYAxis />
        </ChartContainer>
      )}
      <p>{JSON.stringify(line)}</p>
    </div>
  );
}

export default App;
