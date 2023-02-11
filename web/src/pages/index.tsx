import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../utils/api"

const Home: NextPage = () => {
  return (
    <main>
      <AuthShowcase />
      <ProcedureTest />
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
  const status = api.example.getFusekiServerStatus.useQuery().data

  return (
    <div>
      <button
        onClick={ () => void console.log(status ? "Fuseki is online!" : "Fuseki has passed :(") }
      >
        {"Click me to test if Fuseki is online!!"}
      </button>
    </div>
  )
}



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
