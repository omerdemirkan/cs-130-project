import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../utils/api"

const Home: NextPage = () => {
  return (
    <main>
      <AuthShowcase />
    </main>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  {/* LINE IS OUR TESTING EXAMPLE */}
  const { data: exampleData } = api.example.hello.useQuery({ text: 'client' })

  const router = useRouter();
  useEffect(() => {
    if (sessionData?.user) {
      router.push("/dashboard/datasets").then(console.log).catch(console.error);
    }
  }, [router, sessionData?.user]);

  return (
    <div>
      <div><button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button></div>
      
      {/* BELOW IS OUR TESTING EXAMPLE */}
      <div><button
        onClick={ () => void console.log(exampleData ? exampleData.greeting : "ERROR") }
      >
        {"Click me to test a procedure!"}
      </button></div>
    </div>
  );
};
