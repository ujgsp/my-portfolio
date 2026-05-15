// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

// https://astro.build/config
export default defineConfig({
  site: "https://cahjenggot.my.id",

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Inter.woff2"],
            weight: "normal",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrainsMono",
      cssVariable: "--font-jet-brains-mono",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono.woff2"],
            weight: "normal",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],

  integrations: [
    sitemap(),
    pagefind(),
    icon(),
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ["aurora-x"],
    }),
  ],

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["anchor"] },
        },
      ],
    ],
  },

  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "object-src 'self'",
        "connect-src 'self' https://challenges.cloudflare.com https://images.unsplash.com https://script.google.com",
        "base-uri 'self'",
        "img-src 'self' https://res.cloudinary.com/dellp9a4z/ https://images.unsplash.com data:",
        "media-src 'self' https://res.cloudinary.com/dellp9a4z/ https://images.unsplash.com",
        "font-src 'self' data:",
        "frame-src 'self' https://challenges.cloudflare.com",
        "worker-src 'self' blob: https://challenges.cloudflare.com",
        "child-src 'self' https://challenges.cloudflare.com blob:",
        "manifest-src 'none'",
        "trusted-types 'allow-duplicates' goog#html astro-scripts astro-inline-scripts",
      ],
      scriptDirective: {
        resources: ["'self'", "https://challenges.cloudflare.com", "blob:", "'unsafe-inline'"],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-hashes'", "'unsafe-inline'"],
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
