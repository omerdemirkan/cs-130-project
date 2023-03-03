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
import { api } from "../../../../utils/api"
import type { GraphNode } from "../../../../client/store/graph";

const { Dragger } = Upload;

function QueryPage() {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const router = useRouter();
  const { nodes, edges, setStartNode, addFusekiExpansionQueryResult } =
    useGraphStore();
  const datasetName = router.query["dataset_name"] as string;

  const queryMutation = api.fuseki.queryDataset.useMutation();
  const expansionQueryMutation = api.fuseki.expansionQueryDataset.useMutation();

  async function handleNodeSearch(node: GraphNode) {
    const result = await expansionQueryMutation.mutateAsync({datasetName: datasetName, expansionNode: node});

    if (!result.results.bindings.length) {
      await messageApi.open({ type: "error", content: `Either not a node or has no neighbors`, });
      return;
    }
    setStartNode(node);
    setEditorDrawerOpen(false);
  }



  async function handleNodeClicked(node: GraphNode) {
    const result = await expansionQueryMutation.mutateAsync({datasetName: datasetName, expansionNode: node});

    if (!result.results.bindings.length) {
      await messageApi.open({ type: "error", content: 'No expansions possible!', });
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
        onSubmit={(query: string) => queryMutation.mutateAsync({ datasetName, query })}
        loading={queryMutation.isLoading}
        queryResults={queryMutation.data}
        onNodeSearch={handleNodeSearch}
      />
      <div className="flex justify-center">
        <SearchBar
          onSearch={(val) =>
            void handleNodeSearch({
              id: val,
              fusekiObjectType: val.includes("://") ? "uri" : "literal",
              label: val,
            })
          }
        />
        <Button onClick={() => setEditorDrawerOpen(true)}>
          Write SPARQL Query
        </Button>
      </div>
      <div className="flex h-screen items-start gap-4">
        <div className="w-72">
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

export default withAuth(QueryPage);

type EditorDrawerProps = {
  open: boolean;
  onClose(): void;
  onSubmit(editorValue: string): void;
  loading: boolean;
  queryResults?: FusekiQueryResult;
  onNodeSearch?(node: GraphNode): void | Promise<void>;
};

const EditorDrawer: React.FC<EditorDrawerProps> = ({
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

const FileUploadDragger: React.FC<FileUploadDraggerProps> = ({
  datasetName,
  onSuccess,
  onError,
}) => {
  const getUploadUrlQuery = api.fuseki.getUploadUrl.useQuery({datasetName});

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
