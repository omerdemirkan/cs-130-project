import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth(WithoutAuthComponent: React.FC<T>): React.FC<T> {
  const WithAuthComponent: React.FC<T> = (props) => {
    const { status } = useSession();
    const router = useRouter();
    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/").then(console.log).catch(console.error);
      }
    }, [router, status]);

    if (status === "loading") {
      return (
        <div>
          <p>Authenticating</p>
        </div>
      );
    }
    return <WithoutAuthComponent {...props} />;
  };

  return WithAuthComponent;
}
