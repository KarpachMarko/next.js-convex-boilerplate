import Image from "next/image";
import {getSignInUrl, getSignUpUrl, signOut, withAuth} from "@workos-inc/authkit-nextjs";
import {TodoListSection} from "@/containers/home-page/todo-list-section";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/components/ui/theme-toggle";

export default async function Home() {

  const {user} = await withAuth();
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-end w-full gap-2">
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
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <TodoListSection/>

      </main>
    </div>
  );
}
