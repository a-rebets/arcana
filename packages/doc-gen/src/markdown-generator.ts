/** biome-ignore-all lint/suspicious/noExplicitAny: parser */
import type { EndpointInfo, ParsedOpenAPISpec } from "./schema-parser";

const REQUIRED_CHECKMARK = "✅";
const OPTIONAL_CROSS = "❌";
const UNKNOWN_TYPE = "unknown";
const NO_DESCRIPTION = "No description";
const NO_CONSTRAINTS = "-";

const MAX_ARRAY_ITEMS = 4;
const OPTIONAL_FIELD_PROBABILITY = 0.9;
const MAX_NUMBER_VALUE = 100;

const DEFAULT_HTTP_DESCRIPTIONS: Record<string, string> = {
	"200": "Successfully retrieved the requested resource",
	"201": "Resource created successfully",
	"204": "Request processed successfully with no content to return",
	"400": "Bad Request - The request was invalid or cannot be served",
	"401":
		"Unauthorized - Authentication is required and has failed or has not been provided",
	"403": "Forbidden - The request was valid but the server is refusing action",
	"404": "Not Found - The requested resource could not be found",
	"422":
		"Unprocessable Entity - The request was well-formed but contains semantic errors",
	"429": "Too Many Requests - Rate limit exceeded",
	"500":
		"Internal Server Error - The server encountered an unexpected condition",
	"502":
		"Bad Gateway - The server received an invalid response from an upstream server",
	"503": "Service Unavailable - The server is currently unavailable",
} as const;

export const ERROR_REFERENCE_CODES = [
	"400",
	"401",
	"402",
	"403",
	"404",
	"412",
	"424",
	"500",
	"501",
	"503",
	"504",
] as const;

interface ParameterInfo {
	name: string;
	in?: string;
	required?: boolean;
	description?: string;
	schema?: unknown;
	type?: string;
	default?: unknown;
}

interface ResponseInfo {
	description?: string;
	headers?: Record<string, unknown>;
	content?: Record<string, unknown>;
}

interface ErrorResponses {
	[key: string]: ResponseInfo;
}

function sanitizeDescription(description: string): string {
	return description.replace(/\n/g, " ").replace(/\r/g, " ");
}

function extractOptFields(endpoint: EndpointInfo): string[] | null {
	// Find opt_fields parameter in query parameters
	const optFieldsParam = endpoint.parameters?.find(
		(param) => param.name === "opt_fields" && param.in === "query",
	);

	if (!optFieldsParam?.schema) return null;

	// Navigate to the enum values: schema.items.enum
	const schema = optFieldsParam.schema as any;
	if (schema.type === "array" && schema.items?.enum) {
		return schema.items.enum as string[];
	}

	return null;
}

export function generateEndpointMarkdown(
	endpoint: EndpointInfo,
	useErrorReferences = false,
): string {
	let markdown = `# ${endpoint.method} ${endpoint.path}\n\n`;

	if (endpoint.summary) {
		markdown += `**Summary:** ${endpoint.summary}\n\n`;
	}

	if (endpoint.description) {
		markdown += `**Description:** ${endpoint.description}\n\n`;
	}

	if (endpoint.operation.operationId) {
		markdown += `**Operation ID:** ${endpoint.operation.operationId}\n\n`;
	}

	if (endpoint.tags && endpoint.tags.length > 0) {
		markdown += `**Tags:** ${endpoint.tags.join(", ")}\n\n`;
	}

	const pathParams = endpoint.parameters?.filter((p) => p.in === "path") || [];
	const queryParams =
		endpoint.parameters?.filter((p) => p.in === "query") || [];
	const headerParams =
		endpoint.parameters?.filter((p) => p.in === "header") || [];

	if (pathParams.length > 0) {
		markdown += `## Path Parameters\n\n`;
		markdown += `| Name | Type | Required | Description | Constraints |\n`;
		markdown += `|------|------|----------|-------------|-------------|\n`;
		pathParams.forEach((param: ParameterInfo) => {
			const type = getParameterType(param);
			const required = param.required ? REQUIRED_CHECKMARK : OPTIONAL_CROSS;
			const description = sanitizeDescription(
				param.description || NO_DESCRIPTION,
			);
			const constraints = getParameterConstraints(param);
			markdown += `| ${param.name} | ${type} | ${required} | ${description} | ${constraints} |\n`;
		});
		markdown += `\n`;
	}

	if (queryParams.length > 0) {
		markdown += `## Query Parameters\n\n`;
		markdown += `| Name | Type | Required | Description | Default | Constraints |\n`;
		markdown += `|------|------|----------|-------------|---------|-------------|\n`;
		queryParams.forEach((param: ParameterInfo) => {
			const type = getParameterType(param);
			const required = param.required ? REQUIRED_CHECKMARK : OPTIONAL_CROSS;
			const description = sanitizeDescription(
				param.description || NO_DESCRIPTION,
			);
			const defaultValue =
				(param.schema &&
					typeof param.schema === "object" &&
					(param.schema as Record<string, unknown>).default) ||
				param.default ||
				NO_CONSTRAINTS;
			const constraints = getParameterConstraints(param);
			markdown += `| ${param.name} | ${type} | ${required} | ${description} | ${defaultValue} | ${constraints} |\n`;
		});
		markdown += `\n`;
	}

	if (headerParams.length > 0) {
		markdown += `## Header Parameters\n\n`;
		markdown += `| Name | Type | Required | Description | Constraints |\n`;
		markdown += `|------|------|----------|-------------|-------------|\n`;
		headerParams.forEach((param: ParameterInfo) => {
			const type = getParameterType(param);
			const required = param.required ? REQUIRED_CHECKMARK : OPTIONAL_CROSS;
			const description = sanitizeDescription(
				param.description || NO_DESCRIPTION,
			);
			const constraints = getParameterConstraints(param);
			markdown += `| ${param.name} | ${type} | ${required} | ${description} | ${constraints} |\n`;
		});
		markdown += `\n`;
	}

	if (endpoint.requestBody) {
		markdown += `## Request Body\n\n`;
		if (endpoint.requestBody.description) {
			markdown += `${endpoint.requestBody.description}\n\n`;
		}

		const required = endpoint.requestBody.required
			? `${REQUIRED_CHECKMARK} Required`
			: `${OPTIONAL_CROSS} Optional`;
		markdown += `**Required:** ${required}\n\n`;

		if (endpoint.requestBody.content) {
			markdown += `### Content Types\n\n`;
			Object.entries(endpoint.requestBody.content).forEach(
				([contentType, content]: [string, any]) => {
					markdown += `#### ${contentType}\n\n`;

					if (content.schema) {
						const example = generateExampleFromSchema(
							content.schema,
							new Set(),
						);
						if (example !== null) {
							markdown += `**Example:**\n\n`;
							markdown += `\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
						}
					}

					if (content.example) {
						markdown += `**Example:**\n\n`;
						markdown += `\`\`\`json\n${JSON.stringify(content.example, null, 2)}\n\`\`\`\n\n`;
					}
				},
			);
		}
	}

	// Add allowed optional fields section if opt_fields parameter exists
	const optFields = extractOptFields(endpoint);
	if (optFields && optFields.length > 0) {
		markdown += `## Allowed optional fields\n\n`;
		markdown += `\`\`\`\n${optFields.join(",")}\n\`\`\`\n\n`;
	}

	if (endpoint.responses && Object.keys(endpoint.responses).length > 0) {
		markdown += `## Responses\n\n`;
		Object.entries(endpoint.responses).forEach(
			([code, response]: [string, any]) => {
				markdown += `### ${code}\n\n`;

				if (
					useErrorReferences &&
					ERROR_REFERENCE_CODES.includes(
						code as (typeof ERROR_REFERENCE_CODES)[number],
					)
				) {
					markdown += `<reference>\n\n`;
					return;
				}

				if (response.description) {
					markdown += `${response.description}\n\n`;
				} else {
					const defaultDescription = DEFAULT_HTTP_DESCRIPTIONS[code];
					if (defaultDescription) {
						markdown += `${defaultDescription}\n\n`;
					}
				}

				if (response.headers && Object.keys(response.headers).length > 0) {
					markdown += `**Headers:**\n\n`;
					markdown += `| Name | Type | Description |\n`;
					markdown += `|------|------|--------------|\n`;
					Object.entries(response.headers).forEach(
						([headerName, header]: [string, any]) => {
							const type = header.schema?.type || header.type || UNKNOWN_TYPE;
							const description = sanitizeDescription(
								header.description || NO_DESCRIPTION,
							);
							markdown += `| ${headerName} | ${type} | ${description} |\n`;
						},
					);
					markdown += `\n`;
				}

				if (response.content) {
					markdown += `**Content Types:**\n\n`;
					Object.entries(response.content).forEach(
						([contentType, content]: [string, any]) => {
							markdown += `#### ${contentType}\n\n`;

							if (content.schema) {
								const example = generateExampleFromSchema(
									content.schema,
									new Set(),
								);
								if (example !== null) {
									markdown += `**Example Response:**\n\n`;
									markdown += `\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
								}
							}

							if (content.example) {
								markdown += `**Example Response:**\n\n`;
								markdown += `\`\`\`json\n${JSON.stringify(content.example, null, 2)}\n\`\`\`\n\n`;
							}
						},
					);
				}
			},
		);
	}

	if (endpoint.security && endpoint.security.length > 0) {
		markdown += `## Security\n\n`;
		endpoint.security.forEach((security: any) => {
			Object.entries(security).forEach(
				([securityName, scopes]: [string, any]) => {
					markdown += `- **${securityName}**`;
					if (Array.isArray(scopes) && scopes.length > 0) {
						markdown += ` (scopes: ${scopes.join(", ")})`;
					}
					markdown += `\n`;
				},
			);
		});
		markdown += `\n`;
	}

	return markdown;
}

function getParameterType(param: ParameterInfo): string {
	if (param.schema && typeof param.schema === "object") {
		const schema = param.schema as Record<string, unknown>;
		const type = (schema.type as string) || UNKNOWN_TYPE;
		const format = schema.format as string;
		return format ? `${type} (${format})` : type;
	}
	return param.type || UNKNOWN_TYPE;
}

function getParameterConstraints(param: ParameterInfo): string {
	const constraints: string[] = [];

	const getConstraintValue = (obj: unknown, key: string): unknown => {
		if (obj && typeof obj === "object") {
			return (obj as Record<string, unknown>)[key];
		}
		return undefined;
	};

	if (param.schema) {
		const minimum = getConstraintValue(param.schema, "minimum");
		const maximum = getConstraintValue(param.schema, "maximum");
		const minLength = getConstraintValue(param.schema, "minLength");
		const maxLength = getConstraintValue(param.schema, "maxLength");
		const pattern = getConstraintValue(param.schema, "pattern");
		const enumValues = getConstraintValue(param.schema, "enum");

		if (minimum !== undefined) constraints.push(`min: ${minimum}`);
		if (maximum !== undefined) constraints.push(`max: ${maximum}`);
		if (minLength !== undefined) constraints.push(`minLen: ${minLength}`);
		if (maxLength !== undefined) constraints.push(`maxLen: ${maxLength}`);
		if (pattern) constraints.push(`pattern: ${pattern}`);
		if (Array.isArray(enumValues))
			constraints.push(`enum: [${enumValues.join(", ")}]`);
	}

	return constraints.length > 0 ? constraints.join(", ") : NO_CONSTRAINTS;
}

function generateExampleFromSchema(
	schema: unknown,
	visited = new Set(),
	anyOfIndex = 0,
): unknown {
	if (!schema || typeof schema !== "object") return null;

	if (visited.has(schema)) return {};
	visited.add(schema);

	try {
		const schemaObj = schema as Record<string, unknown>;

		if (schemaObj.example !== undefined) return schemaObj.example;

		const schemaType = schemaObj.type as string;

		switch (schemaType) {
			case "string": {
				if (Array.isArray(schemaObj.enum) && schemaObj.enum.length > 0) {
					return schemaObj.enum[0];
				}

				if (schemaObj.default !== undefined) return schemaObj.default;

				const format = schemaObj.format as string;
				if (format === "email") return "email@example.com";
				if (format === "date") return "2024-01-01";
				if (format === "date-time") return "2024-01-01T12:00:00Z";
				if (format === "uuid") return "550e8400-e29b-41d4-a716-446655440000";
				if (format === "uri") return "https://example.com";
				if (format === "hostname") return "example.com";

				return "string";
			}

			case "number":
			case "integer":
				if (schemaObj.minimum !== undefined) return schemaObj.minimum;
				if (schemaObj.maximum !== undefined)
					return Math.min(schemaObj.maximum as number, MAX_NUMBER_VALUE);
				if (schemaObj.default !== undefined) return schemaObj.default;

				return schemaType === "integer" ? 1 : 1.0;

			case "boolean":
				return schemaObj.default !== undefined ? schemaObj.default : true;

			case "array": {
				if (!schemaObj.items) return [];

				const minItems = (schemaObj.minItems as number) || 1;
				const maxItems = Math.min(
					(schemaObj.maxItems as number) || minItems,
					MAX_ARRAY_ITEMS,
				);
				const itemCount = Math.max(
					minItems,
					maxItems > minItems ? 2 : minItems,
				);

				// Check if items have anyOf - if so, generate more items to show variety
				const itemsSchema = schemaObj.items as Record<string, unknown>;
				const hasAnyOf = itemsSchema.anyOf || itemsSchema.oneOf;
				const actualItemCount = hasAnyOf ? Math.max(itemCount, 4) : itemCount;

				// Generate examples for array items, using different anyOfIndex for variety
				return Array.from({ length: actualItemCount }, (_, index) => {
					return generateExampleFromSchema(schemaObj.items, visited, index);
				});
			}

			case "object": {
				const example: Record<string, unknown> = {};

				if (schemaObj.properties && typeof schemaObj.properties === "object") {
					const properties = schemaObj.properties as Record<string, unknown>;
					const required = Array.isArray(schemaObj.required)
						? (schemaObj.required as string[])
						: [];

					Object.entries(properties).forEach(([key, prop]) => {
						const isRequired = required.includes(key);
						if (
							required.length === 0 ||
							isRequired ||
							Math.random() < OPTIONAL_FIELD_PROBABILITY
						) {
							example[key] = generateExampleFromSchema(
								prop,
								visited,
								anyOfIndex,
							);
						}
					});
				}

				if (
					schemaObj.additionalProperties &&
					typeof schemaObj.additionalProperties === "object"
				) {
					const additionalExample = generateExampleFromSchema(
						schemaObj.additionalProperties,
						visited,
						anyOfIndex,
					);
					if (additionalExample !== null) {
						example.additionalProperty = additionalExample;
					}
				}

				return example;
			}

			default:
				if (schemaObj.$ref) {
					// For unresolved references, return empty object to allow schema structure to emerge
					return {};
				}

				if (Array.isArray(schemaObj.oneOf) && schemaObj.oneOf.length > 0) {
					// For oneOf, pick the first option (they're mutually exclusive)
					return generateExampleFromSchema(
						schemaObj.oneOf[0],
						visited,
						anyOfIndex,
					);
				}

				if (Array.isArray(schemaObj.anyOf) && schemaObj.anyOf.length > 0) {
					// For anyOf, use the anyOfIndex to pick different options
					const optionIndex = anyOfIndex % schemaObj.anyOf.length;
					return generateExampleFromSchema(
						schemaObj.anyOf[optionIndex],
						visited,
						anyOfIndex,
					);
				}

				if (Array.isArray(schemaObj.allOf) && schemaObj.allOf.length > 0) {
					const merged: Record<string, unknown> = {};
					schemaObj.allOf.forEach((subSchema) => {
						const subExample = generateExampleFromSchema(
							subSchema,
							visited,
							anyOfIndex,
						);
						if (typeof subExample === "object" && subExample !== null) {
							Object.assign(merged, subExample as Record<string, unknown>);
						}
					});
					return merged;
				}

				return schemaObj.default ?? UNKNOWN_TYPE;
		}
	} finally {
		visited.delete(schema);
	}
}

export function generateErrorsMarkdown(errors: ErrorResponses): string {
	let markdown = `# Error Responses\n\n`;
	markdown += `This document contains the standard error responses used across the Asana API.\n\n`;

	for (const code of ERROR_REFERENCE_CODES) {
		if (errors[code]) {
			const response = errors[code];
			markdown += `## ${code}\n\n`;

			if (response.description) {
				markdown += `${response.description}\n\n`;
			}

			if (response.content) {
				markdown += `**Content Types:**\n\n`;
				Object.entries(response.content).forEach(
					([contentType, content]: [string, any]) => {
						markdown += `#### ${contentType}\n\n`;

						if (content.schema) {
							const example = generateExampleFromSchema(
								content.schema,
								new Set(),
							);
							if (example !== null) {
								markdown += `**Example Response:**\n\n`;
								markdown += `\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
							}
						}

						if (content.example) {
							markdown += `**Example Response:**\n\n`;
							markdown += `\`\`\`json\n${JSON.stringify(content.example, null, 2)}\n\`\`\`\n\n`;
						}
					},
				);
			}
		}
	}

	return markdown;
}

export function generateAboutMarkdown(
	spec: ParsedOpenAPISpec | null,
	tagName: string,
): string {
	const tag = spec?.tags?.find((t: any) => t.name === tagName);

	let markdown = `# ${tagName}\n\n`;

	if (tag?.description) {
		markdown += `${tag.description}\n\n`;
	}

	return markdown;
}
