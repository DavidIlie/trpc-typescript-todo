import { AppProps } from "next/app";
import Head from "next/head";
import { withTRPC } from "@trpc/next";

import { AppRouter } from "./api/trpc/[trpc]";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <>
         <Head>
            <title>Todo</title>
         </Head>
         <Component {...pageProps} />
      </>
   );
}

export default withTRPC<AppRouter>({
   config({ ctx }) {
      const url = process.env.VERCEL_URL
         ? `https://${process.env.VERCEL_URL}/api/trpc`
         : "http://localhost:3000/api/trpc";

      return {
         url,
      };
   },
   ssr: false,
})(MyApp);
