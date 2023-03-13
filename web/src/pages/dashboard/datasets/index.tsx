/**
 * @module web/pages
 */
import { useSession } from "next-auth/react";
import Link from "next/link";
import { withAuth } from "../../../client/hoc/withAuth";
import { Button, Input, Modal, Card } from "antd";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { Header } from "../../../client/components/Header";
import { PagePadding } from "../../../client/components/PagePadding";

/**
 * A component representing the dashboard page which is displayed after signing
 * in. Includes a button to create a new dataset, as well as displays all existing
 * datasets associated with the currently signed in account.
 * @category Pages
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
        datasetName={datasetToDelete}
        open={deleteDatasetModalOpen}
        onClose={() => setDeleteDatasetModalOpen(false)}
        onSubmit={deleteDataset}
        loading={deleteDatasetMutation.isLoading}
      />
      <PagePadding>
        <Header
          username={sessionData && (sessionData.user?.name as string)}
          image={sessionData && (sessionData.user?.image as string)}
          itemList={[
            {
              title: "Datasets",
              href: "/dashboard/datasets",
            },
          ]}
        />
      </PagePadding>
      <div id="database-field" className="h-screen bg-slate-200">
        <PagePadding>
          <h1>Datasets</h1>
          <div id="create-dataset-button" className="mb-5">
            <Button
              type="primary"
              onClick={() => setCreateDatasetModalOpen(true)}
            >
              Create new dataset
            </Button>
          </div>
          {serverDataQuery.data?.datasets?.length === 0 ? (
            <div id="dataset-list" className="flex flex-row flex-wrap">
              <Card title="Hmm, looks like you don't have any datasets" />
            </div>
          ) : null}
          {serverDataQuery.data?.datasets?.length ? (
            <div id="dataset-list" className="flex flex-row flex-wrap">
              {!!serverDataQuery.data && serverDataQuery.isLoading ? (
                <p>Datasets are loading</p>
              ) : null}
              {serverDataQuery.data.datasets.map((dataset) => (
                <Card
                  title={"Dataset Name: " + dataset["ds.name"]}
                  className="mr-4 mb-4 basis-1/4"
                  key={dataset["ds.name"]}
                >
                  <div className="datasetButtons flex flex-row-reverse">
                    <Button
                      className="ml-3"
                      danger
                      onClick={() => {
                        setDeleteDatasetModalOpen(true);
                        setDatasetToDelete(dataset["ds.name"]);
                      }}
                    >
                      Delete
                    </Button>
                    <Link
                      href="/dashboard/datasets/[dataset_name]/query"
                      as={`/dashboard/datasets${dataset["ds.name"]}/query`}
                    >
                      <Button type="primary">Query</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </PagePadding>
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

/**
 * A component representing a model which can create a new dataset.
 * @category Pages
 */
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
  datasetName: string;
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
        <p>
          Are you sure you want to delete this dataset? This cannot be undone!
        </p>
      </Modal>
    </>
  );
};

export default withAuth(DashboardPage);
