import { useSession } from "next-auth/react";
import Link from "next/link";
import { withAuth } from "../../../client/hoc/withAuth";
import { Button, Input, Modal } from "antd";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";

/**
 * Dashboard page!
 * @returns 
 */
const DashboardPage: React.FC = () => {
  const { data: sessionData } = useSession();
  const [createDatasetModalOpen, setCreateDatasetModalOpen] = useState(false);
  const [deleteDatasetModalOpen, setDeleteDatasetModalOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState("");

  const serverDataQuery = api.fuseki.getServerData.useQuery();
  const createDatasetMutation = api.fuseki.createDataset.useMutation();
  const deleteDatasetMutation = api.fuseki.deleteDataset.useMutation();

  async function createDataset(datasetName: string) {
      await createDatasetMutation.mutateAsync({ datasetName });
      // await router.push(`/dashboard/datasets/${datasetName}/query`);
      serverDataQuery.refetch();
      setCreateDatasetModalOpen(false);
  }

  async function deleteDataset(datasetName: string) {
    await deleteDatasetMutation.mutateAsync({ datasetName });
    serverDataQuery.refetch();
    setDeleteDatasetModalOpen(false);
  }

  const router = useRouter();

  return (
    <div id="content-wrapper" className="flex h-screen flex-col">
      <CreateDatasetModal
        open={createDatasetModalOpen}
        onClose={() => setCreateDatasetModalOpen(false)}
        onSubmit={createDataset}
        loading={createDatasetMutation.isLoading}
      />
      <DeleteDatasetModal
        datasetName = {datasetToDelete}
        open={deleteDatasetModalOpen}
        onClose={() => setDeleteDatasetModalOpen(false)}
        onSubmit={deleteDataset}
        loading={deleteDatasetMutation.isLoading}
      />
      <div id="dashboard-header" className="w-screen bg-slate-200">
        <p className='text-end mx-4'>{sessionData && <span>Logged in as <a href={"https://github.com/"+sessionData.user?.name}>{sessionData.user?.name}</a></span>}</p>
      </div>
      <div id="database-field" className="bg-slate-600 h-screen w-screen">
        <h1 className="text-slate-50 ml-5">Datasets</h1>
        <div id="create-dataset-button" className="mb-5 ml-5">
          <Button onClick={() => setCreateDatasetModalOpen(true)}>
            Create new dataset
          </Button>
        </div>
        {serverDataQuery.data?.datasets?.length === 0 ? (
          <p>Hmm, looks like you don&apos;t have any datasets</p>
        ) : null}
        {!!serverDataQuery.data && serverDataQuery.isLoading ? <p>Datasets are loading</p> : null}
        {serverDataQuery.data?.datasets?.length ? (
          <div id="dataset-list" className="flex flex-row flex-wrap ml-5">
            {serverDataQuery.data.datasets.map((dataset) => (
              <div className='basis-1/4 mr-4 mb-4 bg-slate-300' key={dataset["ds.name"]}>
                <p className='ml-4'>Dataset Name: {dataset["ds.name"]}</p>
                <div className="datasetButtons ml-4">
                  <Link
                    href="/dashboard/datasets/[dataset_name]/query"
                    as={`/dashboard/datasets${dataset["ds.name"]}/query`}
                  >
                    <Button>Query</Button>
                  </Link>
                  <Button onClick={() => {setDeleteDatasetModalOpen(true); setDatasetToDelete(dataset["ds.name"])}}>
                    Delete
                  </Button>
                </div>
                <hr/>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

type CreateDatasetModalProps = {
  onSubmit(datasetName: string): void | Promise<void>;
  open: boolean;
  onClose(): void;
  loading: boolean;
};

export const CreateDatasetModal: React.FC<CreateDatasetModalProps> = ({
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
          placeholder="e.g us-flight-paths"
          value={datasetName}
          onChange={(e) =>
            setDatasetName(e.target.value.replaceAll(" ", "-").toLowerCase())
          }
        />
      </Modal>
    </>
  );
};

type DeleteDatasetModalProps = {
  datasetName : string;
  onSubmit(datasetName: string): void | Promise<void>;
  open: boolean;
  onClose(): void;
  loading: boolean;
};

export const DeleteDatasetModal: React.FC<DeleteDatasetModalProps> = ({
  datasetName,
  onSubmit,
  open,
  onClose,
  loading,
}) => {
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);
  const handleOk = useCallback(() => {
    void onSubmit(datasetName);
  }, [datasetName, onSubmit]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Delete a Dataset"
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this dataset? This cannot be undone!</p>
      </Modal>
    </>
  );
};

export default withAuth(DashboardPage);
