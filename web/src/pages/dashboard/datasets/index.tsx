import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { withAuth } from "../../../client/hoc/withAuth";
import { fusekiClient } from "../../../utils/fuseki";
import { Button, Input, Modal } from "antd";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";

const DashboardPage: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: datasetsData, isLoading: isDatasetsLoading } = useQuery(
    ["fuseki", "getServerData"],
    () => fusekiClient.getServerData()
  );

  const router = useRouter();
  const handleCreateNewDataset = async (datasetName: string) => {
    try {
      await fusekiClient.createDataset({ datasetName, datasetType: "tdb2" });
      await router.push(`/dashboard/datasets/${datasetName}/query`);
    } catch (error) {
      console.log("Error in creating dataset!", error);
    }
  };

  return (
    <div>
      <p>{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>
      <CreateDatasetModalTrigger onSubmit={handleCreateNewDataset}>
        <Button>Create new dataset</Button>
      </CreateDatasetModalTrigger>
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

type CreateDatasetModalTriggerProps = {
  children: React.ReactNode;
  onSubmit(datasetName: string): void | Promise<void>;
};

const CreateDatasetModalTrigger: React.FC<CreateDatasetModalTriggerProps> = ({
  children,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const handleCancel = useCallback(() => {
    setOpen((prev) => !prev);
    setDatasetName("");
  }, []);
  const handleOk = useCallback(() => {
    onSubmit(datasetName);
    setDatasetName("");
  }, [datasetName, onSubmit]);

  return (
    <>
      <span onClick={handleCancel}>{children}</span>
      <Modal
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Create a New Dataset"
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
