import {getSignInUrl, getSignUpUrl, signOut, withAuth} from "@workos-inc/authkit-nextjs";
import HeaderClient from "./header-client";

export default async function Header() {
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return <HeaderClient signInUrl={signInUrl} signUpUrl={signUpUrl} logout={async () => {
    "use server";
    await signOut();
  }}/>
}
