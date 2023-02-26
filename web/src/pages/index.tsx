import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../utils/api"


const Home: NextPage = () => {
  return (
    <main>
      <AuthShowcase />
      {/* <ProcedureTest /> */}
    </main>
  );
};

export default Home;



/**
 * Test component which checks if Fuseki is online.
 * @see exampleRouter$getFusekiServerStatus
 */
const ProcedureTest: React.FC = () => {
  {/* BELOW IS OUR TESTING EXAMPLE */}
  const status = api.fuseki.getStatus.useQuery()
  const getStats = api.fuseki.getDatasetStats.useQuery({datasetName: 'my_dataset'})
  const query = api.fuseki.queryDataset.useQuery({datasetName: 'my_dataset', query: 
      'SELECT ?subject ?predicate ?object\nWHERE {\n   ?subject ?predicate ?object .\n}'})
  const createDataset = api.fuseki.createDataset.useMutation()
  const uploadData = api.fuseki.uploadData.useMutation()

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    // We have to convert the file's contents into a string because tRPC doesn't
    // allow file inputs?!?!? 
    //    * Note: Unsure if mutateAsync() is needed, mutate() may be sufficient.
    var dataset = await event.target.files[0]?.text()
    if (dataset)
      uploadData.mutateAsync({datasetName: 'my_dataset', dataset: dataset})
  }

  return (
    <div>
      <div><button
          onClick={ () => {
            void console.log(status.data ? "Fuseki is online!" : "Fuseki has passed :(")
          }}
        >
          {"Click me to test if Fuseki is online!!"}
        </button></div>

      <div><button
          onClick={ () => {
            createDataset.mutate({ datasetName: 'my_dataset' })
          }}
        > 
        {"Click me to create a dataset!"}
      </button></div>

      <div><button
          onClick={ () => {
            void console.log(getStats.data)
          }}
        > 
        {"Click me to check dataset stats!"}
      </button></div>
      
      <div><button
          onClick={ () => {
            void console.log(query.data)
          }}
        > 
        {"Click me to query the dataset!"}
      </button></div>

      <div>
        <input type="file" onChange={ onFileUpload } accept =".ttl"/>
        {"<- click to upload data to the created dataset!"}
      </div>
    </div>
  )
};


const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (sessionData?.user) {
      router.push("/dashboard/datasets").then(console.log).catch(console.error);
    }
  }, [router, sessionData?.user]);

  return (
    <div>
      <button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
