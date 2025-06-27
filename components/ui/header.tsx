import {Button} from "@/components/ui/button";
import {getSignInUrl, getSignUpUrl, signOut, withAuth} from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import {ThemeToggle} from "@/components/ui/theme-toggle";

const lastGoodNestOrg = "org_01JYPW2CN0D7A306BN8X2VCKEY";

export default async function Header() {
  const {user} = await withAuth();
  const signInUrl = await getSignInUrl({organizationId: lastGoodNestOrg});
  const signUpUrl = await getSignUpUrl({organizationId: lastGoodNestOrg});

  return (
    <header className="flex items-center justify-between w-full gap-5">
      <div className="flex items-center gap-2">
        <Link href="/"><span className="font-bold mr-5 ">last-good-team</span></Link>
        <nav>
          <Link href="/drivers">Drivers</Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {user ?
          <>
            <p>Welcome back, {user.firstName}</p>
            <Button onClick={async () => {
              "use server";
              await signOut();
            }} className="cursor-pointer">Logout</Button>
          </>
          : <>
            <Link href={signUpUrl}><Button className="cursor-pointer">Register</Button></Link>
            <Link href={signInUrl}><Button className="cursor-pointer" variant="secondary">Log In</Button></Link>
          </>
        }
        <ThemeToggle/>
      </div>
    </header>
  )
}