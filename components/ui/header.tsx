"use server"

import { getSignInUrl, getSignUpUrl, withAuth } from "@workos-inc/authkit-nextjs"
import HeaderClient from "./header-client"

export default async function Header() {
  const { user } = await withAuth()
  const signInUrl = await getSignInUrl()
  const signUpUrl = await getSignUpUrl()

  return <HeaderClient user={user} signInUrl={signInUrl} signUpUrl={signUpUrl}/>
}
