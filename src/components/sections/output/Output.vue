<script>
import KSection from '@/components/KSection.vue'
import KGlow from '@/components/KGlow.vue'
import KValue from '@/components/KValue.vue'
import Credits from '@/components/Credits.vue'
import { useCityStore } from '@/stores/city'
import { useCalculatorStore } from '@/stores/calculator'
import { useQuasar } from 'quasar'

import ActionList from './ActionList.vue'
import Charts from './Charts.vue'
import Report from '@/components/report/Report.vue'
import Tooltip from '@/components/Tooltip.vue'

export default {
    components: {
        KSection,
        KGlow,
        KValue,
        Credits,

        ActionList,
        Charts,
        Report,
        Tooltip,
    },

    inject: [
        'i18n',
        'filters',
        'generateShareLink',
        'isMobile',
        'drawerState',
        'showCreditsOverlay',
    ],

    setup() {
        const q = useQuasar()
        const city = useCityStore()
        const calculator = useCalculatorStore()

        return {
            q,
            city,
            calculator,
        }
    },

    data() {
        return {
            chart: 'emissions',

            sectorOptions: [
                { value: 'aggregate', label: 'alle Sektoren' },
                { value: 'private', label: this.i18n('sectorsShort.private') },
                { value: 'industry', label: this.i18n('sectorsShort.industry') },
                { value: 'public', label: this.i18n('sectorsShort.public') },
            ],

            selectedSector: this.calculator.sectorFocus || 'aggregate',

            showReport: false,
        }
    },

    computed: {
        effects() {
            return this.calculator.results.all?.effects || undefined
        },

        invest() {
            if (!this.effects) {
                return 0
            }

            return this.effects[this.selectedSector]['invest_total[M*EUR]']
        },

        directEffects() {
            if (!this.effects) {
                return 0
            }

            return this.effects[this.selectedSector]['direct_effects_total[M*EUR]']
        },

        indirectEffects() {
            if (!this.effects) {
                return 0
            }

            return this.effects[this.selectedSector]['indirect_effects_total[M*EUR]']
        },

        emissionsSaved() {
            if (!this.effects) {
                return 0
            }

            return this.effects[this.selectedSector]['emissions_saved_share[%]']
        },
    },

    methods: {
        openReport() {
            this.calculator.sectorFocus = undefined
            this.showReport = true
        },

        updateSector(name) {
            if (name === 'aggregate') {
                this.calculator.sectorFocus = undefined
                return
            }
            this.calculator.sectorFocus = name
        },

        handleDrawerSwipe(swipe) {
            if (!this.isMobile) {
                return
            }

            if (swipe.direction === 'up') {
                this.drawerState = true
            } else if (swipe.direction === 'down') {
                this.drawerState = false
            }
        },

        handleDrawerClick() {
            if (!this.isMobile) {
                return
            }

            this.drawerState = !this.drawerState
        },
    },

    watch: {
        'calculator.sectorFocus': {
            handler() {
                this.selectedSector = this.calculator.sectorFocus || 'aggregate'
            },
        },
    },
}
</script>

<template>
    <KSection title="Effekte für" :class="['output', { mobile: isMobile }]">
        <template v-slot:title-suffix>
            <div
                class="numbers-mobile"
                v-touch-swipe.mouse.up.down="handleDrawerSwipe"
                @click.prevent.stop="handleDrawerClick"
            >
                <div class="number invest">
                    <KValue :value="invest" :precision="0" suffix="Mio €" />
                    <div class="sub">Investitionen</div>
                </div>
                <div class="number direct-effects">
                    <KValue :value="directEffects" :precision="0" suffix="Mio €" />
                    <div class="sub">Direkte Effekte</div>
                </div>
                <div class="number co2-reduction">
                    <KValue :value="emissionsSaved" suffix="%" :speed="12" :min-duration="500" />
                    <div class="sub">CO<sub>2</sub> Reduktion</div>
                </div>
            </div>

            <q-select
                class="economy-sector"
                v-model="selectedSector"
                :options="sectorOptions"
                borderless
                map-options
                emit-value
                dense
                @update:model-value="updateSector"
            />
        </template>
        <template v-slot:background>
            <KGlow type="top" />
            <KGlow type="bottom" />
        </template>

        <div class="piece numbers">
            <div class="number invest">
                <KValue :value="invest" :precision="0" suffix="Mio €" />
                <div class="sub">
                    Investitionen
                    <Tooltip id="invest" i18n-base="kpis.invest" />
                </div>
            </div>
            <div class="number co2-reduction">
                <KValue :value="emissionsSaved" suffix="%" :speed="12" :min-duration="500" />
                <div class="sub">
                    CO<sub>2</sub> Reduktion
                    <Tooltip id="co2Reduction" i18n-base="kpis.co2Reduction" />
                </div>
            </div>
            <div class="number direct-effects">
                <KValue :value="directEffects" :precision="0" suffix="Mio €" />
                <div class="sub">
                    Direkte Effekte <Tooltip id="directEffects" i18n-base="kpis.directEffects" />
                </div>
            </div>
            <div class="number indirect-effects">
                <KValue :value="indirectEffects" :precision="0" suffix="Mio €" />
                <div class="sub">
                    Indirekte Effekte
                    <Tooltip id="indirectEffects" i18n-base="kpis.indirectEffects" />
                </div>
            </div>
        </div>

        <div class="piece piece-charts">
            <Charts @tab-change="chart = $event" />
        </div>

        <div v-if="!isMobile" :class="['piece', { hide: !calculator.actionsActive.length }]">
            <ActionList :chart="chart" />
        </div>

        <template v-slot:footer>
            <q-btn color="black" unelevated rounded label="Zum Reporting" @click="openReport" />

            <div class="btn-share" @click="generateShareLink">
                <span> <q-icon name="o_link" /> Link teilen </span>
            </div>

            <div class="btn-credits" @click="showCreditsOverlay()">
                <span> Wer steckt dahinter? </span>
            </div>
        </template>

        <q-dialog v-model="showReport" transition-show="jump-up" transition-hide="jump-down">
            <Report />
        </q-dialog>
    </KSection>
</template>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.output {
    position: relative;

    &.mobile {
        :deep(> .inner) {
            > .content {
                padding-bottom: 0;
            }
        }
    }

    &.drawer {
        &:before {
            content: '';
            display: block;
            position: absolute;
            top: 0.75rem;
            left: 25%;
            width: 50%;
            height: 4px;
            border-radius: 4px;
            background: #000;
            mix-blend-mode: overlay;
            opacity: 0.5;
            z-index: 2;
        }

        @include bp-sm {
            &:before {
                left: 28%;
                width: 44%;
            }
        }

        @include bp-md {
            &:before {
                left: 32.5%;
                width: 35%;
            }
        }
    }

    &.drawer-open {
        .numbers-mobile {
            opacity: 0;
        }

        :deep(> .inner) {
            > header {
                > .title {
                    h2,
                    .economy-sector {
                        opacity: 1;
                    }
                }
            }
        }
    }

    :deep(> .inner) {
        > header {
            // padding: 0.5rem 1.5rem 0;
            margin-bottom: 1rem;

            > .title {
                gap: 0.5rem;

                h2,
                .economy-sector {
                    opacity: 0;
                    transition: opacity 0.4s;
                }

                h2 {
                    font-size: 1.5rem;
                    font-weight: 400;
                }

                .economy-sector {
                    font-size: 1.5rem;
                    font-weight: 400;

                    .q-field__native,
                    .q-field__marginal {
                        color: #000;
                    }
                }

                @include bp-lg {
                    h2,
                    .economy-sector {
                        opacity: 1;
                    }
                }
            }
        }
    }
}

.k-glow {
    &.top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    &.bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}

.numbers-mobile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 1.5rem 1.5rem 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    gap: 3rem;
    z-index: 100;
    opacity: 1;
    user-select: none;
    transition: opacity 0.4s;

    .number {
        :deep(.k-value) {
            font-size: 1.6875rem;
            font-weight: 700;
        }
    }

    @include bp-lg {
        display: none;
    }
}

.piece {
    padding: var(--k-gap) 0 0;
    opacity: 1;
    transition: opacity 0.4s;
    // border-top: 1px solid #ececec;

    &.hide {
        opacity: 0;
    }

    &.numbers {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem 0;
        padding-top: 0;

        .number {
            width: calc(50% - 0.5rem / 1 * 2);
            // width: calc(33% - 0.5rem / 2 * 3);
            // width: calc(25% - 0.5rem / 4 * 3);

            // &.indirect-effects {
            //     display: none;
            // }
        }

        @include bp-lg {
            justify-content: space-between;
            gap: 1rem 0;

            .number {
                width: calc(50% - 0.5rem / 1 * 2);

                // &.indirect-effects {
                //     display: block;
                // }

                &.co2-reduction,
                &.indirect-effects {
                    text-align: right;
                }

                :deep(.k-value) {
                    font-size: 1.625rem;
                }
            }
        }
    }

    .head-row {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-between;
    }

    @include bp-lg {
        &.numbers {
            justify-content: space-between;
        }
    }
}

.number {
    font-size: 0.875rem;
    line-height: 1.2;
    // max-width: 17ch;
    font-weight: 400;
    width: fit-content;
    flex: none;

    :deep(.k-value) {
        display: block;
        font-size: 1.375rem;
        font-weight: 400;
        white-space: nowrap;
        margin: 0 0 0.25rem;

        .suffix {
            font-size: 0.75rem;
        }
    }

    .sub {
        @include font-family('numeric');
        font-size: 0.75rem;
        line-height: 1;
        white-space: nowrap;
        color: var(--k-color-section-text-subtle);

        :deep(.q-icon) {
            color: var(--k-color-section-text-subtle);
            font-size: 0.875rem;
            line-height: 1;
            margin-left: 0.125rem;
            vertical-align: bottom;
        }
    }
}

.chart-numbers {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: var(--k-gap);
}

// .apexcharts-canvas {
//     width: 100%;
// }

:deep(footer) {
    padding: 1rem 1.5rem;

    .q-btn {
        width: 100%;
        margin-bottom: 1rem;
        font-size: 1.125rem;
        font-weight: 400;
        text-transform: none;
    }

    .btn-share {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 0 0 1rem;
        cursor: pointer;
        user-select: none;

        &:hover {
            span {
                color: var(--k-color-primary-base);
            }
        }

        &:active {
            span {
                transform: translate(0, 1px);
            }
        }

        .q-icon {
            flex: none;
            font-size: 1.25rem;
            margin-right: 0.375rem;
        }

        span {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            transition: color 0.2s, transform 0.1s;
        }

        &:after,
        &:before {
            content: ' ';
            display: block;
            width: auto;
            flex: auto 1 0;
            height: 1px;
            background-color: var(--k-color-section-border);
        }
    }

    .btn-credits {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        cursor: pointer;
        user-select: none;
        font-size: 0.875rem;

        &:hover {
            span {
                color: var(--k-color-primary-base);
            }
        }

        &:active {
            span {
                transform: translate(0, 1px);
            }
        }

        // .q-icon {
        //     flex: none;
        //     font-size: 1.25rem;
        //     margin-right: 0.375rem;
        // }

        span {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            transition: color 0.2s, transform 0.1s;
        }

        &:after,
        &:before {
            content: '–';
            display: block;
            width: auto;
            flex: auto 1 0;
            text-align: left;
            // color: var(--k-color-section-border);
        }

        &:before {
            text-align: right;
        }
    }

    @include bp-lg {
        .btn-share {
            font-size: 1.125rem;
        }
    }
}

.note {
    :deep(.credits) {
        font-size: 0.75rem;
        font-weight: 400;
        line-height: 1.4;

        .anchor {
            --anchor-color: #000;
            --anchor-text-color-active: #fff;
            --anchor-bg-size: 1rem;
            font-size: 0.75rem;
            font-weight: 400;
        }
    }
}
</style>
