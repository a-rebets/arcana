import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./otp/ResendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [ResendOTP],
});
