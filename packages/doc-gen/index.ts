/** biome-ignore-all lint/suspicious/noExplicitAny: parser */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { usedMethods, usedTags } from "./src/filter";
import {
	ERROR_REFERENCE_CODES,
	generateAboutMarkdown,
	generateEndpointMarkdown,
	generateErrorsMarkdown,
} from "./src/markdown-generator";
import { OpenAPIParser } from "./src/schema-parser";

async function fetchSpec(url: string): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${url}: ${response.status} ${response.statusText}`,
		);
	}
	return response.text();
}

function isUrl(str: string): boolean {
	return str.startsWith("http://") || str.startsWith("https://");
}

const schemaPath = process.argv[2];
const outputDir = process.argv[3] || "./docs/asana-sdk";

if (!schemaPath) {
	console.error("Please provide a schema file path as argument");
	console.error("Usage: node index.ts <schema-file> [output-dir]");
	process.exit(1);
}

async function generateDocs() {
	try {
		const parser = new OpenAPIParser();

		let specContent: string;
		if (isUrl(schemaPath)) {
			console.log(`Fetching OpenAPI spec from ${schemaPath}...`);
			specContent = await fetchSpec(schemaPath);
		} else {
			console.log(`Reading OpenAPI spec from ${schemaPath}...`);
			specContent = readFileSync(schemaPath, "utf8");
		}

		await parser.parseSpec(specContent);

		mkdirSync(outputDir, { recursive: true });

		const endpointsByTag: Record<string, any[]> = {};
		const endpoints = parser.getEndpoints();

		for (const endpoint of endpoints) {
			const method = endpoint.method.toLowerCase();
			if (!usedMethods.includes(method)) continue;

			const tags = endpoint.tags || ["untagged"];
			for (const tag of tags) {
				if (!usedTags.includes(tag)) continue;

				if (!endpointsByTag[tag]) {
					endpointsByTag[tag] = [];
				}
				endpointsByTag[tag].push(endpoint);
			}
		}

		const allErrors: Record<string, any> = {};

		for (const endpoint of endpoints) {
			const method = endpoint.method.toLowerCase();
			if (!usedMethods.includes(method)) continue;

			if (endpoint.responses) {
				Object.entries(endpoint.responses).forEach(
					([code, response]: [string, any]) => {
						if (
							ERROR_REFERENCE_CODES.includes(
								code as (typeof ERROR_REFERENCE_CODES)[number],
							)
						) {
							const hasContent =
								response.content && Object.keys(response.content).length > 0;
							const storedHasContent =
								allErrors[code]?.content &&
								Object.keys(allErrors[code].content).length > 0;

							if (!allErrors[code] || (hasContent && !storedHasContent)) {
								allErrors[code] = response;
							}
						}
					},
				);
			}
		}

		const errorsMarkdown = generateErrorsMarkdown(allErrors);
		writeFileSync(join(outputDir, "errors.md"), errorsMarkdown);

		for (const [tagName, tagEndpoints] of Object.entries(endpointsByTag)) {
			const resourceName = tagName.toLowerCase().replace(/\s+/g, "-");
			const resourceDir = join(outputDir, resourceName);

			mkdirSync(resourceDir, { recursive: true });

			const aboutMarkdown = generateAboutMarkdown(parser.getSpec(), tagName);
			writeFileSync(join(resourceDir, "about.md"), aboutMarkdown);

			const endpointsByMethod: Record<string, any[]> = {};
			for (const endpoint of tagEndpoints) {
				const method = endpoint.method.toLowerCase();
				if (!endpointsByMethod[method]) {
					endpointsByMethod[method] = [];
				}
				endpointsByMethod[method].push(endpoint);
			}

			for (const [method, methodEndpoints] of Object.entries(
				endpointsByMethod,
			)) {
				const methodDir = join(resourceDir, method);
				mkdirSync(methodDir, { recursive: true });

				for (const endpoint of methodEndpoints) {
					const operationId = endpoint.operation?.operationId;
					if (!operationId) continue;

					const markdown = generateEndpointMarkdown(endpoint, true);
					const filename = `${operationId}.md`;
					writeFileSync(join(methodDir, filename), markdown);
				}
			}
		}

		console.log(`Documentation generated successfully in ${outputDir}`);
	} catch (error) {
		console.error("Error generating documentation:", error);
		process.exit(1);
	}
}

generateDocs();
