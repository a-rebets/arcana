import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./otp/resendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
});
