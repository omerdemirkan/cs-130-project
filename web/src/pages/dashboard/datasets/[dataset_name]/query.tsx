import { withAuth } from "../../../../client/hoc/withAuth";
import type {
  FusekiQueryResult,
  FusekiQueryBinding,
} from "../../../../utils/fuseki";
import { useState } from "react";

import { Editor } from "../../../../client/components/Editor";
import { useRouter } from "next/router";

import { InboxOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, Space, Table, Tooltip } from "antd";
import { message, Upload } from "antd";
import { useSparqlEditorStore } from "../../../../client/store/editor";
import { NetworkGraph } from "../../../../client/components/NetworkGraph";
import { useGraphStore } from "../../../../client/store/graph";
import { api } from "../../../../utils/api";
import type { GraphNode } from "../../../../client/store/graph";

const { Dragger } = Upload;

/**
 * A component representing the graph visualization page. It contains a search bar
 * for making dataset searches, a field for uploading .ttl files to amend the dataset,
 * a modal for making SPARQL searches, and the graph vizualizer itself.
 */
function QueryPage() {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const router = useRouter();
  const { nodes, edges, setStartNode, addFusekiExpansionQueryResult } =
    useGraphStore();
  const datasetName = router.query["dataset_name"] as string;

  const queryMutation = api.fuseki.queryDataset.useMutation();
  const expansionQueryMutation = api.fuseki.expansionQueryDataset.useMutation();
  const saveGraph = api.prisma.saveGraph.useMutation({
    onSuccess({ id }) {
      const url = `http://localhost:3000/dashboard/datasets/${datasetName}/${id}`;
      navigator.clipboard.writeText(url);
      messageApi.open({ content: "URL copied to clipboard!", type: "success" });
    },
  });

  async function handleNodeSearch(node: GraphNode) {
    const result = await expansionQueryMutation.mutateAsync({
      datasetName: datasetName,
      expansionNode: node,
    });

    if (!result.results.bindings.length) {
      await messageApi.open({
        type: "error",
        content: `Either not a node or has no neighbors`,
      });
      return;
    }
    setStartNode(node);
    setEditorDrawerOpen(false);
  }

  async function handleNodeClicked(node: GraphNode) {
    const result = await expansionQueryMutation.mutateAsync({
      datasetName: datasetName,
      expansionNode: node,
    });

    if (!result.results.bindings.length) {
      await messageApi.open({
        type: "error",
        content: "No expansions possible!",
      });
      return;
    }
    addFusekiExpansionQueryResult(result);
    setEditorDrawerOpen(false);
  }

  return (
    <>
      {messageContextHolder}
      <EditorDrawer
        open={editorDrawerOpen}
        onClose={() => setEditorDrawerOpen(false)}
        onSubmit={(query: string) =>
          queryMutation.mutateAsync({ datasetName, query })
        }
        loading={queryMutation.isLoading}
        queryResults={queryMutation.data}
        onNodeSearch={handleNodeSearch}
      />
      <div
        id="content-wrapper"
        className="flex h-screen flex-col justify-center"
      >
        <div
          id="graph-header"
          className="flex justify-center space-x-4 bg-slate-700 py-3 px-3"
        >
          <div id="search-bar" className="w-2/3">
            <SearchBar
              onSearch={(val) =>
                void handleNodeSearch({
                  id: val,
                  fusekiObjectType: val.includes("://") ? "uri" : "literal",
                  label: val,
                })
              }
            />
          </div>
          <Button onClick={() => setEditorDrawerOpen(true)}>
            Write SPARQL Query
          </Button>
          <Button onClick={() => saveGraph.mutateAsync({nodes: nodes, edges: edges})}>
            Share graph
          </Button>
        </div>
        <div className="flex justify-center">
          {/*<ProcedureTest/> Commenting this out for now to test visual things*/}
        </div>
        <div className="relative h-full items-start bg-transparent">
          <main className="absolute z-1 h-full w-full">
            <NetworkGraph
              // theme={darkTheme}
              // draggable
              // Note: We might want to use this for the sharing part, but for now it causes weird issues, so no dragging during construction. - Satsuki
              labelType="all"
              nodes={nodes}
              edges={edges}
              onNodeClick={(networkNode) => handleNodeClicked(networkNode.data)}
            />
          </main>
          <div className="absolute z-2 w-72 bg-slate-200 bg-opacity-90 px-2 py-2 pb-2 m-5 rounded-md">
            <FileUploadDragger
              datasetName={datasetName}
              onSuccess={() =>
                void messageApi.open({
                  type: "success",
                  content: `File uploaded successfully.`,
                })
              }
              onError={() =>
                void messageApi.open({
                  type: "error",
                  content: `File uploaded successfully.`,
                })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(QueryPage);

type EditorDrawerProps = {
  open: boolean;
  onClose(): void;
  onSubmit(editorValue: string): void;
  loading: boolean;
  queryResults?: FusekiQueryResult;
  onNodeSearch?(node: GraphNode): void | Promise<void>;
};

/**
 * A component representing a modal which has an input field for sending SPARQL queries
 * into the currently loaded dataset. When submitted the modal will display the result
 * in a table.
 */
export const EditorDrawer: React.FC<EditorDrawerProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  queryResults,
  onNodeSearch,
}) => {
  const { editorText, setEditorText } = useSparqlEditorStore();

  const tableColumns = queryResults?.head.vars;
  return (
    <Drawer
      title="Custom SPARQL Query"
      placement="right"
      width={700}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => onSubmit(editorText)}
            loading={loading}
          >
            SEND
          </Button>
        </Space>
      }
    >
      <div className="rounded-md border-2 border-gray-300 p-2">
        <Editor value={editorText} onChange={setEditorText} />

        {queryResults ? (
          <Table
            dataSource={queryResults?.results.bindings.map((binding, i) => ({
              key: i,
              ...Object.fromEntries(
                queryResults.head.vars.map((v) => [v, binding[v]])
              ),
            }))}
            columns={queryResults.head.vars.map((v) => ({
              title: v,
              key: v,
              dataIndex: v,
              render: (binding: FusekiQueryBinding) => (
                <Tooltip title="Click to search node">
                  <p
                    className="cursor-pointer"
                    onClick={() =>
                      void onNodeSearch?.({
                        id: binding.value,
                        label: binding.value,
                        fusekiObjectType: binding.type,
                      })
                    }
                  >
                    {binding.value}
                  </p>
                </Tooltip>
              ),
            }))}
          />
        ) : null}
      </div>
    </Drawer>
  );
};

type FileUploadDraggerProps = {
  datasetName: string;
  onSuccess(): void;
  onError(): void;
};

/**
 * A component representing an area which .ttl files can be dragged onto to upload
 * to the current dataset.
 */
export const FileUploadDragger: React.FC<FileUploadDraggerProps> = ({
  datasetName,
  onSuccess,
  onError,
}) => {
  const getUploadUrlQuery = api.fuseki.getUploadUrl.useQuery({ datasetName });

  return (
    <Dragger
      name="file"
      multiple
      action={getUploadUrlQuery.data}
      onChange={(info) => {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        console.log(info);
        if (status === "done") {
          onSuccess();
        } else if (status === "error") {
          onError();
        }
      }}
      onDrop={(e) => {
        console.log("Dropped files", e.dataTransfer.files);
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload of .ttl files (RDF format).
      </p>
    </Dragger>
  );
};

type SearchBarProps = {
  onSearch(searchStr: string): void;
};

/**
 * A component representing a search bar.
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
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
