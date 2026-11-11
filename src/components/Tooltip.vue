<template>
    <q-icon
        v-if="active"
        name="o_info"
        :class="'info-icon ' + infoClass"
        @mouseenter="
            () => {
                hoverInfo = true
            }
        "
        @mouseleave="
            () => {
                hoverInfo = false
            }
        "
    />
    <q-tooltip
        v-if="active"
        :model-value="show"
        :target="'.' + infoClass"
        no-parent-event
        anchor="bottom left"
        self="top left"
        transition-show="jump-up"
        transition-hide="jump-down"
        :transition-duration="250"
        @mouseenter="
            () => {
                hoverTooltip = true
            }
        "
        @mouseleave="
            () => {
                hoverTooltip = false
            }
        "
    >
        <div class="html" v-if="html" v-html="html"></div>
        <hr v-if="html && Object.keys(sourcesResolved).length" />
        <div class="sources" v-if="Object.keys(sourcesResolved).length">
            <ul>
                <li v-for="(list, category) in sourcesResolved" :key="category">
                    <div class="category">
                        <ul>
                            <li v-if="category !== 'all'">
                                {{ i18n('sources.label', Object.values(list).length) }}
                                ({{ i18n('sources.categories.' + category) }}):
                            </li>
                            <li v-for="item in list" :key="item.title">
                                <a class="anchor multiline" :href="item.link" target="_blank"
                                    ><span class="text">{{ item.title }}</span></a
                                >
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </q-tooltip>
</template>

<script>
import { sectors } from '@/stores/calculator/shared'
let instanceCounter = 0

export default {
    inject: ['i18n'],

    props: {
        id: {
            type: String,
            required: true,
        },
        i18nBase: {
            type: String,
            required: false,
        },
        i18nKey: {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: false,
        },
        sector: {
            type: String,
            required: false,
            validator: (s) => sectors.includes(s),
        },
    },

    data() {
        return {
            hoverInfo: false,
            hoverTooltip: false,

            show: false,
            showTimer: null,
            showDelay: 500,
            hideTimer: null,
            hideDelay: 250,
        }
    },

    computed: {
        hover() {
            return this.hoverInfo || this.hoverTooltip
        },

        infoClass() {
            return 'info-' + instanceCounter + '-' + this.id
        },

        active() {
            return (
                this.id &&
                (this.text || (this.i18n.has(this.i18nPath) && this.html) || this.sources)
            )
        },

        i18nPath() {
            return this.i18nKey || this.i18nBase + '.tooltip'
        },

        html() {
            return this.text || this.i18n(this.i18nPath).replace(/\n/g, '<br />')
        },

        sources() {
            return this.i18n.raw(this.i18nBase + '.sources') || false
        },

        sourcesResolved() {
            const resolved = {}
            const refs = []

            for (const [category, list] of Object.entries(this.sources)) {
                const items = []
                resolved[category] = items

                for (const [title, link] of Object.entries(list)) {
                    if (Array.isArray(link)) {
                        link.forEach((ref) => {
                            refs.push({ category, refCategory: title, ref })
                        })
                    } else {
                        items.push({ title, link })
                    }
                }
            }

            for (const { category, refCategory, ref } of refs) {
                const src = resolved[refCategory].find((i) => i.title === ref)
                if (src) {
                    resolved[category].push(src)
                }
            }

            for (const category in resolved) {
                if (resolved[category].length === 0) {
                    delete resolved[category]
                }
            }
            return resolved
        },
    },

    created() {
        instanceCounter++
    },

    watch: {
        hover(state) {
            if (this.showTimer) {
                clearTimeout(this.showTimer)
                this.showTimer = null
            }

            if (this.hideTimer) {
                clearTimeout(this.hideTimer)
                this.hideTimer = null
            }

            if (state) {
                this.showTimer = setTimeout(() => {
                    this.show = true
                }, this.showDelay)
            } else {
                this.hideTimer = setTimeout(() => {
                    this.show = false
                }, this.hideDelay)
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.q-icon {
    color: var(--k-color-label-subtle);
    margin-right: 0.125rem;
    vertical-align: sub;
    font-size: 1.125rem;
    cursor: default;
}

hr {
    margin: 0.5rem 0;
    background-color: #d7dadd;
    border: none;
}

.sources {
    ul {
        display: flex;
        flex-flow: column;
        gap: 0.75rem;
    }

    .category {
        ul {
            display: flex;
            flex-flow: row wrap;
            gap: 0.25rem 0.5rem;
            align-items: center;
            justify-content: flex-start;

            li:first-child {
                font-weight: 700;
            }
        }
    }
}

.anchor {
    font-size: 0.8125rem;
    font-weight: 500;
    --anchor-bg-size: 15px;
}

html.print {
    .q-icon,
    .q-tooltip {
        display: none;
    }
}
</style>
