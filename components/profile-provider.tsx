"use client";

import {withAuth} from "@workos-inc/authkit-nextjs";
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ProfileWithPermissions} from "@/types/profileModel";
import {User} from "@workos-inc/node";

interface ProfileContextType {
  profile: ProfileWithPermissions | null;
  user?: User;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // State to track user loading

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user: workosUser } = await withAuth();
        console.log("fetched work os user", workosUser)
        setUser(workosUser);
      } catch (error) {
        console.error("Error fetching WorkOS user:", error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const profile = useQuery(
    api.profile.getProfileWithPermissions,
    user ? { userId: user.id } : "skip"
  );

  const isLoadingProfile = user && profile === undefined && !isLoadingUser;

  const contextValue = {
    profile: profile ?? null,
    user,
    isLoading: isLoadingUser || isLoadingProfile,
  } as ProfileContextType;

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};