/** biome-ignore-all lint/suspicious/noExplicitAny: parser */

interface OpenAPISchema {
	type?: string;
	properties?: Record<string, OpenAPISchema>;
	required?: string[];
	items?: OpenAPISchema;
	$ref?: string;
	allOf?: OpenAPISchema[];
	oneOf?: OpenAPISchema[];
	anyOf?: OpenAPISchema[];
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	enum?: unknown[];
	default?: unknown;
	example?: unknown;
	format?: string;
	description?: string;
	[key: string]: unknown;
}

interface OpenAPIParameter {
	name: string;
	in?: string;
	required?: boolean;
	schema?: OpenAPISchema;
	description?: string;
	$ref?: string;
	[key: string]: unknown;
}

interface OpenAPIResponse {
	description?: string;
	content?: Record<string, { schema?: OpenAPISchema; example?: unknown }>;
	headers?: Record<string, unknown>;
}

interface OpenAPIRequestBody {
	description?: string;
	required?: boolean;
	content?: Record<string, { schema?: OpenAPISchema; example?: unknown }>;
}

interface OpenAPIOperation {
	summary?: string;
	description?: string;
	operationId?: string;
	tags?: string[];
	parameters?: OpenAPIParameter[];
	requestBody?: OpenAPIRequestBody;
	responses?: Record<string, OpenAPIResponse>;
	security?: unknown[];
	[key: string]: unknown;
}

interface OpenAPIPathItem {
	parameters?: OpenAPIParameter[];
	get?: OpenAPIOperation;
	post?: OpenAPIOperation;
	put?: OpenAPIOperation;
	delete?: OpenAPIOperation;
	patch?: OpenAPIOperation;
	head?: OpenAPIOperation;
	options?: OpenAPIOperation;
	trace?: OpenAPIOperation;
}

interface OpenAPITag {
	name: string;
	description?: string;
	externalDocs?: {
		url: string;
		description?: string;
	};
}

export interface ParsedOpenAPISpec {
	openapi?: string;
	swagger?: string;
	info?: {
		title?: string;
		version?: string;
		description?: string;
		contact?: unknown;
		license?: unknown;
	};
	paths?: Record<string, OpenAPIPathItem>;
	components?: {
		schemas?: Record<string, OpenAPISchema>;
		parameters?: Record<string, OpenAPIParameter>;
		responses?: Record<string, OpenAPIResponse>;
		[key: string]: unknown;
	};
	servers?: unknown[];
	tags?: OpenAPITag[];
	security?: unknown[];
	externalDocs?: unknown;
	[key: string]: unknown;
}

export interface EndpointInfo {
	path: string;
	method: string;
	operation: OpenAPIOperation;
	summary?: string;
	description?: string;
	tags?: string[];
	parameters?: OpenAPIParameter[];
	requestBody?: OpenAPIRequestBody;
	responses?: Record<string, OpenAPIResponse>;
	security?: unknown[];
}

export class OpenAPIParser {
	private spec: ParsedOpenAPISpec | null = null;

	getSpec(): ParsedOpenAPISpec | null {
		return this.spec;
	}

	async parseSpec(content: string): Promise<ParsedOpenAPISpec> {
		try {
			let parsedContent: any;
			try {
				parsedContent = JSON.parse(content);
			} catch {
				const yaml = await import("js-yaml");
				parsedContent = yaml.load(content);
			}

			if (!parsedContent || typeof parsedContent !== "object") {
				throw new Error("Invalid file format");
			}

			if (!parsedContent.openapi && !parsedContent.swagger) {
				throw new Error("Not a valid OpenAPI/Swagger specification");
			}

			this.spec = parsedContent as ParsedOpenAPISpec;
			return this.spec;
		} catch (error) {
			throw new Error(
				`Failed to parse OpenAPI spec: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	private resolveSchema(
		schema: OpenAPISchema,
		visited = new Set<string>(),
	): OpenAPISchema {
		if (!schema || typeof schema !== "object") return schema;

		if (schema.$ref) {
			const refPath = schema.$ref;
			if (visited.has(refPath)) {
				return {
					type: "object",
					description: `Circular reference to ${refPath}`,
				};
			}

			visited.add(refPath);

			// Parse the reference path (e.g., "#/components/schemas/Task")
			const parts = refPath.replace("#/", "").split("/");
			let resolved: unknown = this.spec;

			for (const part of parts) {
				if (resolved && typeof resolved === "object") {
					resolved = (resolved as Record<string, unknown>)[part];
				} else {
					resolved = undefined;
					break;
				}
			}

			if (resolved && typeof resolved === "object") {
				return this.resolveSchema(resolved as OpenAPISchema, visited);
			}

			return {
				type: "unknown",
				description: `Unresolved reference: ${refPath}`,
			};
		}

		if (schema.type === "array" && schema.items) {
			return {
				...schema,
				items: this.resolveSchema(schema.items, visited),
			};
		}

		if (schema.properties) {
			const resolvedProperties: Record<string, OpenAPISchema> = {};
			for (const [key, value] of Object.entries(schema.properties)) {
				resolvedProperties[key] = this.resolveSchema(value, visited);
			}
			return {
				...schema,
				properties: resolvedProperties,
			};
		}

		if (schema.allOf) {
			const merged: OpenAPISchema = { type: "object", properties: {} };
			for (const subSchema of schema.allOf) {
				const resolved = this.resolveSchema(subSchema, visited);
				if (resolved.properties && merged.properties) {
					Object.assign(merged.properties, resolved.properties);
				}
				if (resolved.required) {
					merged.required = [...(merged.required || []), ...resolved.required];
				}
			}
			return merged;
		}

		if (schema.oneOf || schema.anyOf) {
			const options = schema.oneOf || schema.anyOf;
			return {
				...schema,
				[schema.oneOf ? "oneOf" : "anyOf"]: options?.map((opt) =>
					this.resolveSchema(opt, visited),
				),
			};
		}

		return schema;
	}

	private resolveParameter(parameter: OpenAPIParameter): OpenAPIParameter {
		if (!parameter || typeof parameter !== "object") return parameter;

		// Handle $ref resolution for parameters
		if (parameter.$ref) {
			const refPath = parameter.$ref;
			// Parse the reference path (e.g., "#/components/parameters/Limit")
			const parts = refPath.replace("#/", "").split("/");
			let resolved: unknown = this.spec;

			for (const part of parts) {
				if (resolved && typeof resolved === "object") {
					resolved = (resolved as Record<string, unknown>)[part];
				} else {
					resolved = undefined;
					break;
				}
			}

			if (resolved) {
				return this.resolveParameter(resolved as OpenAPIParameter);
			}

			return {
				name: "unknown",
				description: `Unresolved parameter reference: ${refPath}`,
			};
		}

		if (parameter.schema) {
			return {
				...parameter,
				schema: this.resolveSchema(parameter.schema),
			};
		}

		return parameter;
	}

	getEndpoints(): EndpointInfo[] {
		if (!this.spec?.paths) return [];

		const endpoints: EndpointInfo[] = [];
		const httpMethods = [
			"get",
			"post",
			"put",
			"delete",
			"patch",
			"head",
			"options",
			"trace",
		];

		Object.entries(this.spec.paths).forEach(([path, pathItem]) => {
			const pathLevelParameters = pathItem?.parameters
				? pathItem.parameters.map((param) => this.resolveParameter(param))
				: [];

			httpMethods.forEach((method) => {
				const operation = pathItem?.[method as keyof OpenAPIPathItem] as
					| OpenAPIOperation
					| undefined;
				if (operation) {
					const resolvedResponses: Record<string, OpenAPIResponse> = {};
					if (operation.responses) {
						Object.entries(operation.responses).forEach(([code, response]) => {
							const resolvedResponse = this.resolveSchema(
								response as OpenAPISchema,
							);
							resolvedResponses[code] = {
								...resolvedResponse,
								content: resolvedResponse.content
									? Object.fromEntries(
											Object.entries(resolvedResponse.content).map(
												([contentType, content]) => [
													contentType,
													{
														...content,
														schema: content.schema
															? this.resolveSchema(content.schema)
															: undefined,
													},
												],
											),
										)
									: undefined,
							} as OpenAPIResponse;
						});
					}

					const resolvedRequestBody = operation.requestBody
						? {
								...operation.requestBody,
								content: operation.requestBody.content
									? Object.fromEntries(
											Object.entries(operation.requestBody.content).map(
												([contentType, content]) => [
													contentType,
													{
														...content,
														schema: content.schema
															? this.resolveSchema(content.schema)
															: undefined,
													},
												],
											),
										)
									: undefined,
							}
						: undefined;

					const operationParameters = operation.parameters
						? operation.parameters.map((param) => this.resolveParameter(param))
						: [];

					const allParameters = [
						...pathLevelParameters,
						...operationParameters,
					];
					const uniqueParameters = allParameters.reduce(
						(acc: OpenAPIParameter[], param) => {
							const existing = acc.find(
								(p) => p.name === param.name && p.in === param.in,
							);
							if (!existing) {
								acc.push(param);
							}
							return acc;
						},
						[],
					);

					endpoints.push({
						path,
						method: method.toUpperCase(),
						operation,
						summary: operation.summary,
						description: operation.description,
						tags: operation.tags || [],
						parameters: uniqueParameters,
						requestBody: resolvedRequestBody,
						responses: resolvedResponses,
						security: operation.security,
					});
				}
			});
		});

		return endpoints;
	}

	getEndpointsByTag(tagName: string): EndpointInfo[] {
		return this.getEndpoints().filter((endpoint) =>
			endpoint.tags?.includes(tagName),
		);
	}

	getStats() {
		if (!this.spec) return null;

		const endpoints = this.getEndpoints();
		return {
			endpointCount: endpoints.length,
			tagCount: this.spec.tags?.length || 0,
			componentCount: this.spec.components
				? Object.keys(this.spec.components).reduce((acc, key) => {
						const componentGroup = this.spec?.components?.[key];
						if (componentGroup && typeof componentGroup === "object") {
							return acc + Object.keys(componentGroup).length;
						}
						return acc;
					}, 0)
				: 0,
			serverCount: this.spec.servers?.length || 0,
			version: this.spec.info?.version || "Unknown",
			title: this.spec.info?.title || "Untitled API",
		};
	}
}
