import { Email } from "@convex-dev/auth/providers/Email";
import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { Resend as ResendAPI } from "resend";
import { env } from "$/lib/env";
import { LoginCodeEmail } from "./LoginCodeEmail";

export const ResendOTP = Email({
	id: "resend-otp",
	apiKey: env.AUTH_RESEND_KEY,
	maxAge: 60 * 15, // 15 minutes
	async generateVerificationToken() {
		const random: RandomReader = {
			read(bytes) {
				crypto.getRandomValues(bytes);
			},
		};
		const alphabet = "0123456789";
		const length = 6;
		return generateRandomString(random, alphabet, length);
	},
	async sendVerificationRequest({
		identifier: email,
		provider,
		token,
		expires,
	}) {
		const resend = new ResendAPI(provider.apiKey);
		const { error } = await resend.emails.send({
			from: "Arcana <auth@notifications.tryarcana.app>",
			to: [email],
			subject: `Sign in to Arcana`,
			react: LoginCodeEmail({ code: token, expires }),
		});

		if (error) {
			throw new Error(JSON.stringify(error));
		}
	},
});
