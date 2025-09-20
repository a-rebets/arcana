import type { components, operations } from "../lib/api";

export type OptFields<T extends keyof operations> = NonNullable<
	operations[T]["parameters"]["query"]
> extends {
	opt_fields?: infer F;
}
	? Exclude<F, undefined>
	: never;

// Casting helpers for SDK clients to assert expanded shapes after using opt_fields
export type ProjectExpandedShape = {
	team?: components["schemas"]["TeamCompact"];
	workspace?: components["schemas"]["WorkspaceCompact"];
	members?: Array<components["schemas"]["UserCompact"]>;
};

export type TeamMembershipExpandedShape = {
	team?: components["schemas"]["TeamCompact"];
};

export function castExpandedArray<TBase, TExpanded>(
	arr: Array<TBase>,
): Array<TBase & TExpanded> {
	return arr as unknown as Array<TBase & TExpanded>;
}
