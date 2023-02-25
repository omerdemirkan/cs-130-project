import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { withAuth } from "../../../client/hoc/withAuth";
import { fusekiClient } from "../../../utils/fuseki";
import { Button, Input, Modal } from "antd";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";

const DashboardPage: React.FC = () => {
  const { data: sessionData } = useSession();
  const [createDatasetModalOpen, setCreateDatasetModalOpen] = useState(false);

  const { data: datasetsData, isLoading: isDatasetsLoading } = useQuery(
    ["fuseki", "getServerData"],
    () => fusekiClient.getServerData()
  );

  const createDatasetMutation = useMutation({
    mutationFn: async (datasetName: string) => {
      await fusekiClient.createDataset({ datasetName, datasetType: "tdb2" });
      await router.push(`/dashboard/datasets/${datasetName}/query`);
    },
  });

  const router = useRouter();

  return (
    <div>
      <p>{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>
      <Button onClick={() => setCreateDatasetModalOpen(true)}>
        Create new dataset
      </Button>
      <CreateDatasetModal
        open={createDatasetModalOpen}
        onClose={() => setCreateDatasetModalOpen(false)}
        onSubmit={createDatasetMutation.mutate}
        loading={createDatasetMutation.isLoading}
      />
      {datasetsData?.datasets?.length === 0 ? (
        <p>Hmm, looks like you don&apos;t have any datasets</p>
      ) : null}
      {!!datasetsData && isDatasetsLoading ? <p>Datasets are loading</p> : null}
      {datasetsData?.datasets?.length ? (
        <div>
          {datasetsData.datasets.map((dataset) => (
            <div key={dataset["ds.name"]}>
              <p>Dataset Name: {dataset["ds.name"]}</p>
              <Link
                href="/dashboard/datasets/[dataset_name]/query"
                as={`/dashboard/datasets${dataset["ds.name"]}/query`}
              >
                <button>Query</button>
              </Link>
              <hr />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

type CreateDatasetModalProps = {
  onSubmit(datasetName: string): void | Promise<void>;
  open: boolean;
  onClose(): void;
  loading: boolean;
};

const CreateDatasetModal: React.FC<CreateDatasetModalProps> = ({
  onSubmit,
  open,
  onClose,
  loading,
}) => {
  const [datasetName, setDatasetName] = useState("");
  const handleCancel = useCallback(() => {
    onClose();
    setDatasetName("");
  }, [onClose]);
  const handleOk = useCallback(() => {
    void onSubmit(datasetName);
    setDatasetName("");
  }, [datasetName, onSubmit]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Create a New Dataset"
        confirmLoading={loading}
      >
        <p>We'll first need to create a dataset to hold our .ttl files!</p>
        <Input
          placeholder="E.g us-flight-paths"
          value={datasetName}
          onChange={(e) =>
            setDatasetName(e.target.value.replace(" ", "-").toLowerCase())
          }
        />
      </Modal>
    </>
  );
};

export default withAuth(DashboardPage);
