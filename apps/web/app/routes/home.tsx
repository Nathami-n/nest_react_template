import { LandingPage } from "@/features/landing";
import { getUserSessionFromServer } from "@repo/utils";
import { VITE_API_URL } from "@/env/env.client";

export const clientLoader = async () => {
  try {
    const { data: user, success } =
      await getUserSessionFromServer(VITE_API_URL);

    if (success && user) {
      return { userLoggedIn: true };
    }

    return { userLoggedIn: false };
  } catch (error) {
    // If API is not available, just show landing page
    console.warn("Could not fetch user session:", error);
    return { userLoggedIn: false };
  }
};

export default function Home({ loaderData }: any) {
  return <LandingPage userLoggedIn={loaderData?.userLoggedIn} />;
}
