/**
 * @module web/pages
 */
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * A component representing the homepage of the app. Contains an authorization button.
 * @category Pages
 */
const Home: NextPage = () => {
  return (
    <main>
      <AuthShowcase />
    </main>
  );
};

/**
 * A component representing an authorization button to sign in with the respective service.
 * @category Pages
 */
export const AuthShowcase: React.FC = () => {
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

export default Home;
