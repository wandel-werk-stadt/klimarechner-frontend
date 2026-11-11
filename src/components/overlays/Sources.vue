<template>
    <q-card class="sources-overlay">
        <q-card-section class="header">
            <header>
                <span>Quellenangaben</span>
                <q-space />
                <q-btn icon="o_close" flat round dense v-close-popup />
            </header>
        </q-card-section>

        <q-card-section>
            <h4>Statistische Werte & Benutzereingaben</h4>
            <p>
                Der Klimarechner basiert auf bundesweiten, statistischen & durchschnittlichen
                Werten. Diese Werte werden über die Einwohnerzahl für eine Kommune runtergebrochen
                und übernommen. Die Werte lassen sich anpassen, um ein genaueres Ergebnis zu
                erhalten.
            </p>

            <p>
                Achten Sie in den Basisdaten auf farblich markierte Einträge, diese sind
                benutzerdefiniert und weichen von den statistischen Werten ab. Entsprechende
                Quellenangaben sind für diese Einträge nicht mehr relevant!
            </p>
        </q-card-section>

        <q-separator />

        <q-card-section v-for="type of types" :key="type">
            <h4>{{ i18n('dataCategories.' + type) }}</h4>
            <div class="row" v-for="input in sources[type]" :key="input.key">
                <span class="label">{{ input.label }}</span>
                <div class="sources">
                    <ul>
                        <li class="category" v-for="source in input.sources" :key="source.link">
                            {{
                                source.categories
                                    .map((c) => i18n('sources.categories.' + c))
                                    .join(', ')
                            }}

                            <a class="anchor multiline" :href="source.link" target="_blank"
                                ><span class="text">{{ source.title }}</span></a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </q-card-section>

        <q-card-section>
            <Credits />
        </q-card-section>
    </q-card>
</template>

<script>
import Credits from '@/components/Credits.vue'

export default {
    components: {
        Credits,
    },

    inject: ['i18n'],

    data() {
        return {
            types: ['buildings', 'energy', 'mobility'],
        }
    },

    methods: {
        resolveSources(sources) {
            const resolved = {}
            const refs = []

            for (const [category, list] of Object.entries(sources)) {
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

            // group by link
            const grouped = {}
            for (const category in resolved) {
                const items = resolved[category]

                for (const item of items) {
                    grouped[item.link] = grouped[item.link] || { categories: [], ...item }
                    grouped[item.link].categories.push(category)
                }
            }
            const compacted = Object.values(grouped)

            return compacted
        },
    },

    computed: {
        sources() {
            const result = {}
            const inputs = this.i18n.raw('inputs')

            for (const [key, value] of Object.entries(inputs)) {
                if (value.sources && Object.keys(value.sources).length > 0) {
                    const category = key.split('/')[0]

                    result[category] = result[category] || []

                    const sources = this.resolveSources(value.sources)

                    if (Object.keys(sources).length) {
                        result[category].push({
                            key,
                            label: value.label,
                            sources,
                        })
                    }
                }
            }

            return result
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.sources-overlay {
    background-color: var(--k-color-section-base);
    padding: 0 1.5rem 1.5rem;
    border-radius: 0.25rem;
    color: #000;
    font-size: 0.875rem;
    max-width: calc(var(--k-page-max-width) - var(--k-page-padding-x) * 2);
    width: calc(100% - var(--k-page-padding-x) * 2);

    header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        font-size: 1.25rem;
        line-height: 1.2;
        font-weight: 700;
    }

    h4 {
        font-size: 1rem;
        margin: 0 0 0.5rem;
        line-height: 1.2;
        font-weight: 700;
    }
}

.q-card__section {
    padding: 1rem 0;

    &.header {
        margin: 0;
        border-bottom: 1px solid #d7dadd;
    }
}

.q-separator {
    margin: 0 0 1rem;
}

.row {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    border-top: 1px solid #d7dadd;
    padding: 0.25rem 0;

    &:last-child {
        border-bottom: 1px solid #d7dadd;
    }

    .label {
        display: block;
        font-weight: 700;
        width: 30ch;
    }
}

.sources {
    width: 100%;
    flex: auto 1 1;

    > ul {
        display: flex;
        flex-flow: row wrap;
        // align-items: center;
        justify-content: flex-end;
        gap: 0.25rem;
    }

    .category {
        display: inline-block;
    }

    .category-sources {
        display: inline-flex;
        flex-flow: row wrap;
        gap: 0.25rem 0.5rem;

        li {
            &:after {
                content: ',';
            }

            &:last-child {
                &:after {
                    content: '';
                }
            }
        }
    }
}
</style>
