import type { AsanaApiClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/type-utilities";
import type { components } from "../lib/api";

export type SectionCompact = components["schemas"]["SectionCompact"];
export type SectionResponse = components["schemas"]["SectionResponse"];

export function createSections(client: AsanaApiClient) {
  return {
    async getSection(
      section_gid: string,
      opts?: { fields?: OptFields<"getSection"> },
    ) {
      const { data } = await client.GET("/sections/{section_gid}", {
        params: {
          path: { section_gid },
          query: {
            opt_fields: opts?.fields ?? ["name", "project"],
          },
        },
      });
      return data?.data;
    },

    async getSectionsForProject(
      project_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getSectionsForProject">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/projects/{project_gid}/sections", {
          params: {
            path: { project_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "project"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },
  };
}
