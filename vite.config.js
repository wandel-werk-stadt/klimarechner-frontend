import 'dotenv/config'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from 'vite-plugin-top-level-await'
import { createHtmlPlugin } from 'vite-plugin-html'

import wasm from 'vite-plugin-wasm'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import svgLoader from 'vite-svg-loader'
import pkg from './package.json'

const isProd = process.env.NODE_ENV !== 'development'
const publicURL = process.env.VITE_PUBLIC_URL || ''
const domain = (/https?:\/\/([^/]+)/.exec(publicURL) || [])[1]

// const title = `Klimarechner 🌍`
// const desc = `Wie wirken sich Klimaschutzmaßnahmen auf unsere Stadt aus?`

const tags = [
    // {
    //     injectTo: 'head',
    //     tag: 'title',
    //     children: title,
    // },
    // {
    //     injectTo: 'head',
    //     tag: 'meta',
    //     attrs: {
    //         name: 'description',
    //         content: desc,
    //     },
    // },
    // {
    //     injectTo: 'head',
    //     tag: 'meta',
    //     attrs: {
    //         property: 'og:title',
    //         content: title,
    //     },
    // },
    // {
    //     injectTo: 'head',
    //     tag: 'meta',
    //     attrs: {
    //         property: 'og:description',
    //         content: desc,
    //     },
    // },
    // {
    //     injectTo: 'head',
    //     tag: 'meta',
    //     attrs: {
    //         property: 'og:image',
    //         content: `${publicURL}/favicon.png`,
    //     },
    // },
    // {
    //     injectTo: 'head',
    //     tag: 'meta',
    //     attrs: {
    //         property: 'og:url',
    //         content: publicURL,
    //     },
    // },
    // {
    //     injectTo: 'head',
    //     tag: 'meta',
    //     attrs: {
    //         property: 'og:type',
    //         content: 'website',
    //     },
    // },
]

if (isProd) {
    tags.push({
        injectTo: 'head',
        tag: 'script',
        attrs: {
            defer: true,
            'data-domain': domain,
            'data-api': `${publicURL}/plio/api/event`,
            src: '/plio/js/script.js',
        },
    })
}

fs.writeFileSync('./public/meta.json', JSON.stringify({ version: pkg.version }))

// https://vitejs.dev/config/
export default defineConfig({
    // base: '/files/konjunkturrechner-preview/',

    plugins: [
        topLevelAwait(),

        vue({
            template: { transformAssetUrls },
        }),

        svgLoader(),

        wasm(),

        quasar({
            //   sassVariables: 'src/quasar-variables.scss'
        }),

        createHtmlPlugin({
            inject: {
                tags,
            },
        }),
    ],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },

    server: {
        host: true,
    },

    // build: {
    //     outDir: `dist/${pkg.version}`,
    // },
})
