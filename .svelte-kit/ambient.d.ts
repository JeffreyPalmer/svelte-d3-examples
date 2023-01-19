
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const npm_package_devDependencies_prettier: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const _P9K_TTY: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_typescript: string;
	export const INIT_CWD: string;
	export const TERM: string;
	export const SHELL: string;
	export const npm_package_devDependencies_vite: string;
	export const TMPDIR: string;
	export const npm_package_scripts_lint: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_devDependencies_eslint_plugin_svelte3: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const PNPM_HOME: string;
	export const ZSH: string;
	export const USER: string;
	export const npm_package_scripts_check_watch: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_dependencies_ramda: string;
	export const LSCOLORS: string;
	export const WEZTERM_EXECUTABLE_DIR: string;
	export const npm_package_devDependencies__typescript_eslint_parser: string;
	export const PATH: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_dependencies_arquero: string;
	export const EDITOR: string;
	export const P9K_SSH: string;
	export const npm_lifecycle_event: string;
	export const P9K_TTY: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const WEZTERM_PANE: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const XPC_FLAGS: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_package_dependencies__types_d3: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const WEZTERM_UNIX_SOCKET: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_type: string;
	export const npm_package_scripts_test: string;
	export const WEZTERM_CONFIG_DIR: string;
	export const npm_package_dependencies_d3: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const npm_package_dependencies__types_ramda: string;
	export const npm_lifecycle_script: string;
	export const npm_config_user_agent: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const WEZTERM_EXECUTABLE: string;
	export const WEZTERM_CONFIG_FILE: string;
	export const npm_package_scripts_check: string;
	export const COLORTERM: string;
	export const npm_package_scripts_test_unit: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {

}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		npm_package_devDependencies_prettier: string;
		TERM_PROGRAM: string;
		NODE: string;
		_P9K_TTY: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_typescript: string;
		INIT_CWD: string;
		TERM: string;
		SHELL: string;
		npm_package_devDependencies_vite: string;
		TMPDIR: string;
		npm_package_scripts_lint: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_devDependencies_eslint_plugin_svelte3: string;
		npm_package_scripts_dev: string;
		npm_package_private: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		PNPM_HOME: string;
		ZSH: string;
		USER: string;
		npm_package_scripts_check_watch: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_devDependencies_eslint: string;
		npm_package_devDependencies_postcss: string;
		npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
		npm_package_devDependencies_tslib: string;
		npm_execpath: string;
		PAGER: string;
		npm_package_devDependencies_svelte: string;
		npm_package_dependencies_ramda: string;
		LSCOLORS: string;
		WEZTERM_EXECUTABLE_DIR: string;
		npm_package_devDependencies__typescript_eslint_parser: string;
		PATH: string;
		__CFBundleIdentifier: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_scripts_preview: string;
		npm_package_dependencies_arquero: string;
		EDITOR: string;
		P9K_SSH: string;
		npm_lifecycle_event: string;
		P9K_TTY: string;
		LANG: string;
		npm_package_name: string;
		WEZTERM_PANE: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		XPC_FLAGS: string;
		npm_package_devDependencies_vitest: string;
		npm_package_dependencies__types_d3: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		WEZTERM_UNIX_SOCKET: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_svelte_check: string;
		SHLVL: string;
		HOME: string;
		npm_package_type: string;
		npm_package_scripts_test: string;
		WEZTERM_CONFIG_DIR: string;
		npm_package_dependencies_d3: string;
		LESS: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		npm_package_dependencies__types_ramda: string;
		npm_lifecycle_script: string;
		npm_config_user_agent: string;
		npm_package_devDependencies__playwright_test: string;
		WEZTERM_EXECUTABLE: string;
		WEZTERM_CONFIG_FILE: string;
		npm_package_scripts_check: string;
		COLORTERM: string;
		npm_package_scripts_test_unit: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: string]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
