import { LandingPage } from "@/features/landing";
import { getUserSessionFromServer } from "@repo/utils";
import { VITE_API_URL } from "@/env/env.client";

export const clientLoader = async () => {
  const { data: user, success } = await getUserSessionFromServer(VITE_API_URL);

  if (success && user) {
    return { userLoggedIn: true };
  }

  return { userLoggedIn: false };
};

export default function Home({ loaderData }: any) {
  return <LandingPage userLoggedIn={loaderData?.userLoggedIn} />;
}
