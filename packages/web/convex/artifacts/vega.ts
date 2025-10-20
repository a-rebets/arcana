"use node";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { WithoutSystemFields } from "convex/server";
import { compile, type TopLevelSpec } from "vega-lite";
import type { LayoutSizeMixins } from "vega-lite/build/src/spec";
import vlSchema from "vega-lite/build/vega-lite-schema.json";
import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

const ajv = new Ajv({
  allowUnionTypes: true,
  strictTypes: false,
  strictTuples: false,
});

addFormats(ajv);
ajv.addFormat("color-hex", () => true);

const validateVegaLite = ajv.compile(vlSchema);

function isVegaLiteSpec(
  spec: unknown,
): spec is TopLevelSpec & LayoutSizeMixins {
  return validateVegaLite(spec);
}

type ProcessAndStoreChartArgs = Omit<
  WithoutSystemFields<Doc<"artifacts">>,
  "type" | "vegaSpec"
> & {
  dataset: Doc<"datasets">["rows"];
};

export const processAndStoreChart = internalAction({
  handler: async (
    ctx,
    args: ProcessAndStoreChartArgs,
  ): Promise<Id<"artifacts">> => {
    const { dataset, ...artifactData } = args;
    const vlSpec = artifactData.vlSpec ? JSON.parse(artifactData.vlSpec) : null;

    if (!vlSpec || !isVegaLiteSpec(vlSpec)) {
      throw new Error(
        `Invalid Vega-Lite specification: ${
          validateVegaLite.errors
            ?.map((err) => `${err.instancePath || "root"}: ${err.message}`)
            .join(", ") || "Unknown validation error"
        }`,
      );
    }

    vlSpec.width = "container";
    vlSpec.height = "container";
    vlSpec.autosize = {
      type: "fit",
      resize: true,
      contains: "padding",
    };
    vlSpec.datasets = {
      current: dataset,
    };

    const vegaSpec = compile(vlSpec).spec;

    if (!vegaSpec) {
      throw new Error("Failed to compile Vega-Lite spec");
    }

    const artifactId = await ctx.runMutation(
      internal.artifacts.protected.createArtifact,
      {
        ...artifactData,
        vegaSpec: JSON.stringify(vegaSpec),
        type: "vega-lite",
      },
    );

    return artifactId;
  },
});
