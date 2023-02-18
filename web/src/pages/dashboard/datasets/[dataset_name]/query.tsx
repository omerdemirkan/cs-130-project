import { useMutation } from "@tanstack/react-query";
import { withAuth } from "../../../../client/hoc/withAuth";
import { fusekiClient } from "../../../../utils/fuseki";
import { useState } from "react";

import { Editor } from "../../../../client/components/Editor";
import { useRouter } from "next/router";

const INITIAL_QUERY = `
SELECT * WHERE {
  ?sub ?pred ?obj
} LIMIT 10
`;

function QueryPage() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const router = useRouter();
  const queryMutation = useMutation({
    mutationFn: fusekiClient.queryDataset,
  });

  function sendQuery() {
    const datasetName = router.query["dataset_name"];
    if (typeof datasetName !== "string") {
      return;
    }
    queryMutation.mutate({ datasetName, query });
  }

  return (
    <div>
      <Editor value={query} onChange={setQuery} />
      <button onClick={sendQuery}>Send query</button>
    </div>
  );
}

export default withAuth(QueryPage);
