/**
 * @module web/pages
 */
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";

/**
 * The main entrypoint for the Fuseki Graph Visualiation app.
 */
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

/**
 * The main entrypoint for the Fuseki Graph Visualiation app.
 * @category Pages
 */
export default api.withTRPC(MyApp);
