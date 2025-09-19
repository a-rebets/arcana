import { internal } from "$/_generated/api";
import { httpAction } from "$/_generated/server";

export const handleCallback = httpAction(async (ctx, request) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");

	if (error) {
		return new Response(closePopupHTML(`OAuth error: ${error}`), {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}

	if (!code || !state) {
		return new Response(closePopupHTML("Missing code or state"), {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}

	try {
		await ctx.runAction(internal.asana.oauth.protected.completeOAuthFlow, {
			state,
			code,
		});

		return new Response(closePopupHTML("success"), {
			headers: { "Content-Type": "text/html; charset=utf-8" },
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
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}
});

function closePopupHTML(message: string) {
	return `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <p>${message === "success" ? "✅ Connected!" : `❌ ${message}`}<br><br>Closing this window...</p>
          <script>
            setTimeout(() => {
              window.opener?.postMessage({ type: 'asana_oauth', success: ${message === "success"}, message: '${message}' }, '*');
              window.close();
            }, 1000);
          </script>
        </body>
      </html>
    `;
}
