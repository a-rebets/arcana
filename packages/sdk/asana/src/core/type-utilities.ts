import type { operations } from "../lib/api";

export type OptFields<T extends keyof operations> = NonNullable<
  operations[T]["parameters"]["query"]
> extends {
  opt_fields?: infer F;
}
  ? Exclude<F, undefined>
  : never;

export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export function castWithOptFields<T, K extends keyof T>(
  value: T,
): WithRequired<T, K> {
  return value as unknown as WithRequired<T, K>;
}

export function castArrayWithOptFields<T, K extends keyof T>(
  arr: Array<T>,
): Array<WithRequired<T, K>> {
  return arr as unknown as Array<WithRequired<T, K>>;
}
