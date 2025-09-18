import { internal } from "$/_generated/api";
import { httpAction } from "$/_generated/server";

export const handleCallback = httpAction(async (ctx, request) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");

	if (error) {
		return new Response(closePopupHTML(`OAuth error: ${error}`), {
			headers: { "Content-Type": "text/html" },
		});
	}

	if (!code || !state) {
		return new Response(closePopupHTML("Missing code or state"), {
			headers: { "Content-Type": "text/html" },
		});
	}

	try {
		await ctx.runAction(internal.asana.oauth.protected.completeOAuthFlow, {
			state,
			code,
		});

		return new Response(closePopupHTML("success"), {
			headers: { "Content-Type": "text/html" },
		});
	} catch (error) {
		console.error("OAuth callback error:", error);
		try {
			if (state) {
				await ctx.runMutation(internal.asana.oauth.protected.deleteOAuthState, {
					state,
				});
			}
		} catch (cleanupErr) {
			console.error("Failed to cleanup OAuth state:", cleanupErr);
		}
		return new Response(closePopupHTML("Connection failed"), {
			headers: { "Content-Type": "text/html" },
		});
	}
});

function closePopupHTML(message: string) {
	return `
      <script>
        window.opener?.postMessage({ type: 'asana_oauth', success: ${message === "success"}, message: '${message}' }, '*');
        window.close();
      </script>
      <p>${message === "success" ? "✅ Connected!" : `❌ ${message}`}</p>
    `;
}
