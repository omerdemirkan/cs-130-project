/**
 * @module web/client
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FusekiExpansionQueryResults,
  FusekiObjectType,
} from "../../utils/fuseki";

/**
 * Type representing a graph node. It includes an associated identifier,
 * label, and turtle triple.
 * @category Components
 */
export type GraphNode = {
  id: string;
  label: string;
  fusekiObjectType: FusekiObjectType;
};

/**
 * Type representing a graph edge. It includes the source node,
 * target node, an associated identifer, and a label.
 * @category Components
 */
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
  removeNodeById(removedNodeId: string): void;
  setStartNode(startNode: GraphNode): void;
};

/**
 * @returns A GraphStoreState hook containing no nodes or edges.
 * @category Components
 */
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
    }); // TO-DO: can try to make new function? basically tryna process this query result
  },
  removeNodeById(removedNodeId: string) {
    const { nodes, edges } = get();
    const { newNodes, newEdges } = processNodeRemoval({
      removedNodeId,
      existingNodes: nodes,
      existingEdges: edges,
    });
    set({
      nodes: newNodes,
      edges: newEdges,
    }); // TO-DO: can try to make new function? basically tryna process this query result
  },

  setStartNode(startNode) {
    set({ nodes: [startNode], edges: [] });
  },
}));

/**
 *
 **/
export function processNodeRemoval({
  removedNodeId,
  existingNodes = [],
  existingEdges = [],
}: {
  removedNodeId: string;
  existingNodes?: GraphNode[];
  existingEdges?: GraphEdge[];
}) {
  const newNodes = existingNodes.filter((node) => node.id !== removedNodeId);
  const newEdges = existingEdges.filter(
    (edge) => edge.source !== removedNodeId && edge.target !== removedNodeId
  );
  return { newNodes, newEdges };
}

/**
 * Takes an {@code FusekiExpansionQueryResults} and adds it to specified
 * existing nodes and branches.
 * @category Components
 */
export function processFusekiExpansionQueryResults({
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
