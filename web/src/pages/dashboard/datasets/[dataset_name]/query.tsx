import { useMutation } from "@tanstack/react-query";
import { withAuth } from "../../../../client/hoc/withAuth";
import { fusekiClient } from "../../../../utils/fuseki";
import { useState } from "react";

import { Editor } from "../../../../client/components/Editor";
import { useRouter } from "next/router";

import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const INITIAL_QUERY = `
SELECT * WHERE {
  ?sub ?pred ?obj
} LIMIT 10
`;

function QueryPage() {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [query, setQuery] = useState(INITIAL_QUERY);
  const router = useRouter();
  const queryMutation = useMutation({
    mutationFn: fusekiClient.queryDataset,
  });

  const datasetName = router.query["dataset_name"] as string;
  function sendQuery() {
    if (typeof datasetName !== "string") {
      return;
    }
    queryMutation.mutate({ datasetName, query });
  }

  return (
    <>
      {messageContextHolder}
      <div className="flex h-screen items-start gap-4">
        <div className="w-72">
          <Dragger
            name="file"
            multiple
            action={fusekiClient.getFusekiUploadUrl(datasetName)}
            onChange={(info) => {
              const { status } = info.file;
              if (status !== "uploading") {
                console.log(info.file, info.fileList);
              }
              console.log(info);
              if (status === "done") {
                messageApi.open({
                  type: "success",
                  content: `${info.file.name} file uploaded successfully.`,
                });
              } else if (status === "error") {
                messageApi.open({
                  type: "error",
                  content: `${info.file.name} file upload failed.`,
                });
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
        </div>
        <main className="flex-shrink flex-grow">
          <Editor value={query} onChange={setQuery} />
          <button onClick={sendQuery}>Send query</button>
        </main>
      </div>
    </>
  );
}

export default withAuth(QueryPage);

const draggerProps: UploadProps = {};
