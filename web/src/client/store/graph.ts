import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FusekiQueryResult } from "../../utils/fuseki";

export type GraphNode = {
  id: string;
  label: string;
};

export type GraphEdge = {
  source: string;
  target: string;
  id: string;
  label: string;
};

type GraphStoreState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  addFusekiQueryResult(fusekiQueryResult: FusekiQueryResult): void;
  setFusekiQueryResult(fusekiQueryResult: FusekiQueryResult): void;
  clearGraph(): void;
};

export const useGraphStore = create<GraphStoreState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      addFusekiQueryResult(fusekiQueryResult) {
        const { nodes, edges } = get();
        const { newNodes, newEdges } = processFusekiQueryResults({
          fusekiQueryResult,
          existingNodes: nodes,
          existingEdges: edges,
        });
        set({
          nodes: newNodes,
          edges: newEdges,
        });
      },

      setFusekiQueryResult(fusekiQueryResult) {
        const { newNodes, newEdges } = processFusekiQueryResults({
          fusekiQueryResult,
        });
        set({
          nodes: newNodes,
          edges: newEdges,
        });
      },

      clearGraph() {
        set({ nodes: [], edges: [] });
      },
    }),
    { name: "graph" }
  )
);

function processFusekiQueryResults({
  fusekiQueryResult,
  existingNodes = [],
  existingEdges = [],
}: {
  fusekiQueryResult: FusekiQueryResult;
  existingNodes?: GraphNode[];
  existingEdges?: GraphEdge[];
}) {
  const nodeMap = new Map<string, GraphNode>();
  const edgeMap = new Map<string, GraphEdge>();
  existingNodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });
  existingEdges.forEach((edge) => {
    edgeMap.set(edge.id, edge);
  });

  fusekiQueryResult.results.bindings.forEach(
    ({ predicate, subject, object }) => {
      nodeMap.set(subject.value, {
        id: subject.value,
        label: subject.value,
      });
      edgeMap.set(predicate.value, {
        id: predicate.value,
        label: predicate.value,
        source: subject.value,
        target: object.value,
      });
      nodeMap.set(object.value, {
        id: object.value,
        label: object.value,
      });
    }
  );

  const newNodes: GraphNode[] = [];
  const newEdges: GraphEdge[] = [];
  for (const node of nodeMap.values()) {
    newNodes.push(node);
  }
  for (const edge of edgeMap.values()) {
    newEdges.push(edge);
  }
  return {
    newNodes,
    newEdges,
  };
}
