"use client"

import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { createContext, ReactNode, useContext } from "react"
import { ProfileWithPermissions } from "@/types/profileModel"
import { User } from "@workos-inc/node"

interface ProfileContextType {
  profile: ProfileWithPermissions | null;
  user?: User;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: isLoadingUser } = useAuth()

  const profile = useQuery(
    api.profile.getProfileWithPermissionsByUserId,
    user ? { userId: user.id } : "skip"
  )

  const isLoadingProfile = user && profile === undefined

  const contextValue = {
    profile: profile ?? null,
    user,
    isLoading: isLoadingUser || isLoadingProfile,
  } as ProfileContextType

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}