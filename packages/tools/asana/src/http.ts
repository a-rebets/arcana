import { createAsanaSdk } from "asana-sdk";

export function createAsanaClient(token: string) {
  return createAsanaSdk({ token });
}

export type AsanaSdkClient = ReturnType<typeof createAsanaClient>;
