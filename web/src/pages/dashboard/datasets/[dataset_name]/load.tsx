import { withAuth } from "../../../../client/hoc/withAuth";
import { useState } from "react";
import { useRouter } from "next/router";

import { Input } from "antd";
import { message, Upload } from "antd";
import { NetworkGraph } from "../../../../client/components/NetworkGraph";
import { useGraphStore } from "../../../../client/store/graph";
import { api } from "../../../../utils/api"
import type { GraphNode } from "../../../../client/store/graph";

function LoadPage() {
  const [messageApi, messageContextHolder] = message.useMessage();
  const router = useRouter();
  const { nodes, edges, setStartNode, addFusekiExpansionQueryResult } =
    useGraphStore();
  const datasetName = router.query["dataset_name"] as string;

  const expansionQueryMutation = api.fuseki.expansionQueryDataset.useMutation();
  const readGraph = api.prisma.readGraph.useMutation();


  async function handleNodeClicked(node: GraphNode) {
    const result = await expansionQueryMutation.mutateAsync({datasetName: datasetName, expansionNode: node});

    if (!result.results.bindings.length) {
      await messageApi.open({ type: "error", content: 'No expansions possible!', });
      return;
    }
    addFusekiExpansionQueryResult(result);    
  }

  async function handleReadGraphSearch(graphId: string) {
    const result = await readGraph.mutateAsync({graphId});

    console.log(result)
    console.log(JSON.parse(result.graphContents).nodes)
    setStartNode(JSON.parse(result.graphContents).nodes[0])
  }

  return (
    <>
      {messageContextHolder}
      <div className="flex justify-center">
        <SearchBar onSearch={(graphId) => handleReadGraphSearch(graphId)}/>
      </div>
      <div className="flex h-screen items-start gap-4">
        <main className="h-full flex-shrink flex-grow">
          <NetworkGraph
            nodes={nodes}
            edges={edges}
            onNodeClick={(networkNode) => handleNodeClicked(networkNode.data)}
          />
        </main>
      </div>
    </>
  );
}

export default withAuth(LoadPage);

type SearchBarProps = {
  onSearch(searchStr: string): void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchVal, setSearchValue] = useState("");

  return (
    <div>
      <Input.Search
        value={searchVal}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={() => {
          onSearch(searchVal);
          setSearchValue("");
        }}
      />
    </div>
  );
};

type ReadGraphProps = {
  open: boolean;
  graphId: string;
};

const ReadGraph: React.FC<ReadGraphProps> = (
  open,
  graphId,
) => {
  console.log(graphId);
  console.log(String(graphId));
  const graphResult = api.prisma.readGraph.mutate({graphId});

  return (
    <div>
      <p>test test</p>
    </div>
  );
};
