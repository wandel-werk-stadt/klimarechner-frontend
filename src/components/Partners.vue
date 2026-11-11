<template>
    <q-card class="partners">
        <k-glow type="bottom" preserveAspectRatio="xMidYMin slice" />

        <q-card-section class="header">
            <h4>
                Regionale Wertschöpfung ankurbeln und das Klima schützen?<br />
                Wir unterstützen Sie gern.
            </h4>
            <p>
                Wir erstellen mit unseren Partnern Klimaschutzkonzepte und THG-Bilanzierungen sowie
                kommunale Wärmeplanung. Wir entwickeln Flächen für die Produktion erneuerbarer
                Energie oder aktivieren Ihre Stadtgesellschaft mit interaktiven Formaten und
                digitalen Plattformen und kommunikativer Begleitung oder Kampagnen.
            </p>
        </q-card-section>

        <q-card-section class="list">
            <ul>
                <li v-for="item of partners" :key="item.name">
                    <h5>
                        <span>{{ item.name }}</span>
                    </h5>
                    <p>{{ item.description }}</p>
                    <ul class="contact">
                        <li>
                            <a class="anchor" :href="'mailto:' + item.email" target="_blank">
                                <q-icon class="icon" name="o_email" />
                                <span class="text">{{ item.email }}</span>
                            </a>
                        </li>
                        <li>
                            <a class="anchor" :href="item.url" target="_blank">
                                <q-icon class="icon" name="o_public" />
                                <span class="text">{{ cleanURL(item.url) }}</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </q-card-section>
    </q-card>
</template>

<script>
import KGlow from '@/components/KGlow.vue'

export default {
    components: {
        KGlow,
    },

    name: 'Partners',

    inject: ['i18n'],

    computed: {
        partners() {
            return this.i18n.raw('partners')
        },
    },

    methods: {
        cleanURL(url) {
            return url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.anchor {
    --anchor-color: #000;
}

.partners {
    position: relative;
    background-color: #fff;
    overflow: hidden;

    h4 {
        line-height: 1.2;
        margin: 0 0 0.5rem;
    }
}

.k-glow {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150%;
    z-index: 1;
    opacity: 0.75;
}

.q-card__section {
    position: relative;
    z-index: 5;
}

.list {
    > ul {
        display: flex;
        flex-flow: row wrap;
        align-items: stretch;
        justify-content: space-between;
        gap: 1.5rem 0;

        > li {
            display: flex;
            flex-flow: column;
            width: calc(50% - 1.5rem);
            overflow: hidden;
        }
    }

    h5 {
        display: block;
        font-size: 0.875rem;
        line-height: 1;
        font-weight: bold;
        margin: 0 0 0.25rem;

        span {
            display: inline-block;
            vertical-align: top;
            line-height: 1rem;
        }
    }

    p {
        flex: auto 1 1;
        font-size: 0.875rem;
        margin: 0 0 0.5rem;
        border-bottom: 1px solid var(--k-color-section-border);
        padding-bottom: 0.5rem;
    }
}

ul.contact {
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        // display: flex;
        // flex-flow: row nowrap;
        // align-items: center;
        width: 100%;
        margin-top: 0.25rem;
        // overflow: hidden;

        &:first-child {
            margin-top: 0;
        }
    }

    :deep(.anchor) {
        font-weight: 500;
        overflow: hidden;
        width: 100%;

        span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .icon {
            &:before {
                display: flex;
                padding: 0;
                content: none;
            }
        }
    }
}

@include bp-lg {
    .k-glow {
        height: 200%;
        opacity: 0.5;
    }

    .list {
        > ul {
            flex-flow: row nowrap;

            > li {
                width: calc(25% - 1.5rem);
            }
        }

        h5 {
            line-height: 1.75rem;
            height: 2rem;

            // span {
            //     display: inline-block;
            //     vertical-align: top;
            //     line-height: 1rem;
            // }
        }
    }
}
</style>
