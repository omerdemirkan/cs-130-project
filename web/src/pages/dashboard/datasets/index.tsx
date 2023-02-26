import { useSession } from "next-auth/react";
import Link from "next/link";
import { withAuth } from "../../../client/hoc/withAuth";
import { Button, Input, Modal } from "antd";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";

const DashboardPage: React.FC = () => {
  const { data: sessionData } = useSession();
  const [createDatasetModalOpen, setCreateDatasetModalOpen] = useState(false);

  const serverDataQuery = api.fuseki.getServerData.useQuery();
  const createDatasetMutation = api.fuseki.createDataset.useMutation();

  async function createDataset(datasetName: string) {
      await createDatasetMutation.mutateAsync({ datasetName });
      // await router.push(`/dashboard/datasets/${datasetName}/query`);
      serverDataQuery.refetch();
      setCreateDatasetModalOpen(false);
  }

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
        onSubmit={createDataset}
        loading={createDatasetMutation.isLoading}
      />
      {serverDataQuery.data?.datasets?.length === 0 ? (
        <p>Hmm, looks like you don&apos;t have any datasets</p>
      ) : null}
      {!!serverDataQuery.data && serverDataQuery.isLoading ? <p>Datasets are loading</p> : null}
      {serverDataQuery.data?.datasets?.length ? (
        <div>
          {serverDataQuery.data.datasets.map((dataset) => (
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
