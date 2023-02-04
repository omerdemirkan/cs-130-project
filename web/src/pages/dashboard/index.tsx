import { useSession } from "next-auth/react";
import { withAuth } from "../../client/hoc/withAuth";

const DashboardPage: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div>
      <p>{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>
    </div>
  );
};

export default withAuth(DashboardPage);
