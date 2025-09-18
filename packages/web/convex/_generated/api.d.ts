/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accounts from "../accounts.js";
import type * as asana_oauth_actions from "../asana/oauth/actions.js";
import type * as asana_oauth_http from "../asana/oauth/http.js";
import type * as asana_oauth_pkce from "../asana/oauth/pkce.js";
import type * as asana_oauth_protected from "../asana/oauth/protected.js";
import type * as asana_oauth_schemas from "../asana/oauth/schemas.js";
import type * as asana_oauth_scopes from "../asana/oauth/scopes.js";
import type * as asana_oauth_util from "../asana/oauth/util.js";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as core_connections from "../core/connections.js";
import type * as http from "../http.js";
import type * as lib_env from "../lib/env.js";
import type * as otp_LoginCodeEmail from "../otp/LoginCodeEmail.js";
import type * as otp_ResendOTP from "../otp/ResendOTP.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  "asana/oauth/actions": typeof asana_oauth_actions;
  "asana/oauth/http": typeof asana_oauth_http;
  "asana/oauth/pkce": typeof asana_oauth_pkce;
  "asana/oauth/protected": typeof asana_oauth_protected;
  "asana/oauth/schemas": typeof asana_oauth_schemas;
  "asana/oauth/scopes": typeof asana_oauth_scopes;
  "asana/oauth/util": typeof asana_oauth_util;
  auth: typeof auth;
  chat: typeof chat;
  "core/connections": typeof core_connections;
  http: typeof http;
  "lib/env": typeof lib_env;
  "otp/LoginCodeEmail": typeof otp_LoginCodeEmail;
  "otp/ResendOTP": typeof otp_ResendOTP;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
