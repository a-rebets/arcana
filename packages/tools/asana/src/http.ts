import { createAsanaSdk } from "asana-sdk";

export type AsanaSdkClient = ReturnType<typeof createAsanaClient>;

export function createAsanaClient(token: string) {
	return createAsanaSdk({ token });
}
