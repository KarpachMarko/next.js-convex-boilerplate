"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { logout } from "@/app/auth/logout"
import { User } from "@workos-inc/node"

interface HeaderClientProps {
  user: User | null
  signInUrl: string;
  signUpUrl: string;
}

export default function HeaderClient({ user, signInUrl, signUpUrl }: HeaderClientProps) {
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
            <Button onClick={() => logout()} className="cursor-pointer">Logout</Button>
          </>
          : <>
            <Link href={signUpUrl}><Button className="cursor-pointer">Register</Button></Link>
            <Link href={signInUrl}><Button className="cursor-pointer" variant="secondary">Log
              In</Button></Link>
          </>
        }
        <ThemeToggle/>
      </div>
    </header>
  )
}