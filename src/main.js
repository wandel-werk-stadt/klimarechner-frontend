import { createApp } from 'vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/de'
import quasarIconSet from 'quasar/icon-set/svg-material-icons-outlined'
import VueApexCharts from 'vue3-apexcharts'
import VueNumberFormat from '@coders-tm/vue-number-format'

import i18n from './i18n/index.js'
import filters from './tools/filters.js'

import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import 'quasar/src/css/index.sass'

import './assets/index.scss'

const app = createApp(App)

app.provide('i18n', i18n)
app.provide('filters', filters)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(Quasar, {
    plugins: { Notify }, // import Quasar plugins and add here
    lang: quasarLang,
    iconSet: quasarIconSet,

    config: {
        dark: false,
    },
})

app.use(VueApexCharts)

app.use(VueNumberFormat, {
    decimal: ',',
    separator: '.',
    precision: 2,
    minimumFractionDigits: 2,
    prefill: false,
    masked: false,
})

app.mount('#app-wrapper')
