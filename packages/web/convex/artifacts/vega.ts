"use node";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { compile, type TopLevelSpec } from "vega-lite";
import type { LayoutSizeMixins } from "vega-lite/build/src/spec";
import vlSchema from "vega-lite/build/vega-lite-schema.json";
import type { Doc } from "../_generated/dataModel";
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

type ValidateVLSpecResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      errors: string;
    };

export const validateVLSpec = internalAction({
  handler: async (
    _ctx,
    { vlSpec }: { vlSpec: string },
  ): Promise<ValidateVLSpecResult> => {
    const parsed = JSON.parse(vlSpec);

    if (!isVegaLiteSpec(parsed)) {
      const errors =
        validateVegaLite.errors
          ?.map((err) => `${err.instancePath || "root"}: ${err.message}`)
          .join(", ") || "Unknown validation error";
      return { valid: false, errors };
    }

    return { valid: true };
  },
});

type CompileVLSpecArgs = {
  vlSpec: string;
  dataset: Doc<"datasets">["rows"];
};

type CompileVLSpecResult = {
  vlSpec: string;
  vegaSpec: string;
};

export const compileVLSpec = internalAction({
  handler: async (
    _ctx,
    { vlSpec, dataset }: CompileVLSpecArgs,
  ): Promise<CompileVLSpecResult> => {
    const parsed = JSON.parse(vlSpec);

    parsed.width = "container";
    parsed.height = "container";
    parsed.autosize = {
      type: "fit",
      resize: true,
      contains: "padding",
    };
    parsed.datasets = {
      current: dataset,
    };

    // Compile to Vega
    const vegaSpec = compile(parsed).spec;

    if (!vegaSpec) {
      throw new Error("Failed to compile Vega-Lite spec");
    }

    return {
      vlSpec: JSON.stringify(parsed),
      vegaSpec: JSON.stringify(vegaSpec),
    };
  },
});
