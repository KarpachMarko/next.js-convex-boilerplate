import { handleAuth } from "@workos-inc/authkit-nextjs"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.CONVEX_SELF_HOSTED_URL!)

export const GET = handleAuth({
  onSuccess: async (data) => {
    const user = data.user

    if (user.id && user.email) {
      await convex.mutation(api.profile.createProfileIfMissing, {
        userId: user.id,
        email: user.email,
      })
    }
  },
})