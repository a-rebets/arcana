export type PageBody<T> = {
  data?: Array<T> | null;
  next_page?: { offset?: string | null } | null;
};

export async function paginate<T>(
  fetchPage: (
    offset?: string | null,
  ) => Promise<
    | { data?: Array<T> | null; next_page?: { offset?: string | null } | null }
    | undefined
  >,
  options?: { limitTotal?: number },
): Promise<Array<T>> {
  const results: Array<T> = [];
  let offset: string | null | undefined;

  do {
    const page = await fetchPage(offset ?? undefined);
    if (!page) break;

    const items = page.data ?? [];
    for (const item of items) {
      results.push(item);
      if (options?.limitTotal && results.length >= options.limitTotal) {
        return results;
      }
    }
    offset = page.next_page?.offset ?? null;
  } while (offset);

  return results;
}
