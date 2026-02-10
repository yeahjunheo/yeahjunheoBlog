// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default defineConfig({
    site: "https://www.yeahjunheo.com",

    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [
        expressiveCode({
            themes: ["github-dark"],
            plugins: [pluginLineNumbers()],
            defaultProps: {
                showLineNumbers: true,
            },
        }),
        sitemap(),
        icon(),
    ],
});
