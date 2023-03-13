import { withAuth } from "../../../../client/hoc/withAuth";
import { useRouter } from "next/router";
import { NetworkGraph } from "../../../../client/components/NetworkGraph";
import { api } from "../../../../utils/api";

function ReadPage() {
  const router = useRouter();
  const graphId = router.query["graph_id"] as string;

  const readGraph = api.prisma.readGraph.useQuery({ graphId });

  console.log(readGraph);
  const graphContents = readGraph.data?.graphContents
    ? JSON.parse(readGraph.data?.graphContents)
    : { nodes: [], edges: [] };

  const edgeTable = graphContents.edges.map(
    (edge)=>{return (
        <tr>
            <td>{edge.id}</td>
            <td>{edge.label}</td>
            <td>{edge.source}</td>
            <td>{edge.target}</td>
        </tr>
    )}
  )

  return (
    <>
      <div>
        <table>
            <tr>
                <td>ID</td>
                <td>Label</td>
                <td>Source</td>
                <td>Target</td>
            </tr>
            {edgeTable}
        </table>
      </div>
      <div className="flex h-screen items-start gap-4">
        <main className="h-full flex-shrink flex-grow">
          <NetworkGraph
            labelType="all"
            nodes={graphContents.nodes}
            edges={graphContents.edges}
          />
        </main>
      </div>
    </>
  );
}

export default ReadPage;
