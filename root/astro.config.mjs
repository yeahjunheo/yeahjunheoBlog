// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

export default defineConfig({
    site: "https://www.yeahjunheo.com",

    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [sitemap(), icon()],
});
