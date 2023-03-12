import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Home Page!
 * @returns 
 * @components
 */
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
