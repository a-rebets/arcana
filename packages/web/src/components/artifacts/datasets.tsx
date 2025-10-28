import { ChecksIcon, FilesIcon } from "@phosphor-icons/react";
import { motion, stagger, type Variants } from "motion/react";
import type { ArcanaToolResult } from "@/lib/convex-agent/types";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.2),
    },
  },
};

const child: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function DatasetsList({
  data,
}: {
  data: ArcanaToolResult<"tool-datasets_listDatasetsTool">;
}) {
  return (
    <div className="-ml-px max-w-[70%] md:max-w-none mb-4 text-muted-foreground">
      <OutputHeader message="Listed available datasets" />
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1.5"
      >
        {data.slice(0, 2).map((dataset) => (
          <motion.li
            key={dataset.id}
            className="flex items-center gap-2 border rounded-full pl-3 pr-3.5 py-1 md:w-fit"
            variants={child}
          >
            <FilesIcon className="size-4 shrink-0" />
            <h3 className="text-sm truncate">{dataset.name}</h3>
          </motion.li>
        ))}
        {data.length > 2 && (
          <motion.li
            key="more"
            variants={child}
            className="border text-sm rounded-full px-6 py-px w-fit font-mono"
          >
            +{data.length - 2}
          </motion.li>
        )}
      </motion.ul>
    </div>
  );
}

export function SavedDataset({
  data,
}: {
  data: ArcanaToolResult<"tool-datasets_createDatasetTool">;
}) {
  return (
    <div className="-ml-px max-w-[70%] mb-4 text-muted-foreground">
      <OutputHeader message="Saved the dataset" />
      {data.id && (
        <motion.li
          key={data.id}
          className="flex items-center gap-2 border rounded-full pl-3 pr-3.5 py-1 md:w-fit"
          variants={child}
          initial="hidden"
          animate="show"
        >
          <FilesIcon className="size-4 shrink-0" />
          <h3 className="text-sm truncate">{data.name}</h3>
        </motion.li>
      )}
    </div>
  );
}

function OutputHeader({ message }: { message: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="flex items-center gap-2 ml-1 mb-2.5"
    >
      <span className="text-sm">{message}</span>
      <ChecksIcon className="size-4" />
    </motion.div>
  );
}
