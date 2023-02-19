import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FusekiExpansionQueryResults,
  FusekiObjectType,
} from "../../utils/fuseki";

export type GraphNode = {
  id: string;
  label: string;
  fusekiObjectType: FusekiObjectType;
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
  addFusekiExpansionQueryResult(
    fusekiQueryResult: FusekiExpansionQueryResults
  ): void;
  setStartNode(startNode: GraphNode): void;
};

export const useGraphStore = create<GraphStoreState>()((set, get) => ({
  nodes: [],
  edges: [],
  addFusekiExpansionQueryResult(fusekiQueryResult) {
    const { nodes, edges } = get();
    const { newNodes, newEdges } = processFusekiExpansionQueryResults({
      fusekiQueryResult,
      existingNodes: nodes,
      existingEdges: edges,
    });
    set({
      nodes: newNodes,
      edges: newEdges,
    });
  },

  setStartNode(startNode) {
    set({ nodes: [startNode], edges: [] });
  },
}));

function processFusekiExpansionQueryResults({
  fusekiQueryResult,
  existingNodes = [],
  existingEdges = [],
}: {
  fusekiQueryResult: FusekiExpansionQueryResults;
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
        fusekiObjectType: subject.type,
      });

      const edgeId = getEdgeId({
        sourceId: subject.value,
        targetId: object.value,
        predicateId: predicate.value,
      });
      edgeMap.set(edgeId, {
        id: edgeId,
        label: predicate.value,
        source: subject.value,
        target: object.value,
      });
      nodeMap.set(object.value, {
        id: object.value,
        label: object.value,
        fusekiObjectType: object.type,
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
  console.log({
    newNodes,
    newEdges,
  });
  return {
    newNodes,
    newEdges,
  };
}

function getEdgeId({
  sourceId,
  targetId,
  predicateId,
}: {
  sourceId: string;
  targetId: string;
  predicateId: string;
}) {
  // NOTE (omer): we just need something distinct here
  // to avoid key collisions lol
  return `${predicateId}:${sourceId}_${targetId}`;
}
