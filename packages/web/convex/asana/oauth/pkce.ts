"use node";

import { createHash, randomBytes } from "node:crypto";
import { v } from "convex/values";
import { internalAction } from "$/_generated/server";

function generateCodeVerifier(): string {
	return randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
	return createHash("sha256").update(verifier).digest("base64url");
}

function generateState(): string {
	return randomBytes(16).toString("hex");
}

export const generatePkceAndState = internalAction({
	args: {},
	returns: v.object({
		codeVerifier: v.string(),
		codeChallenge: v.string(),
		state: v.string(),
	}),
	handler: async () => {
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = generateCodeChallenge(codeVerifier);
		const state = generateState();
		return { codeVerifier, codeChallenge, state };
	},
});
