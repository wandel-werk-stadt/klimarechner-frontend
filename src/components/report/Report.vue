<template>
    <q-card class="report">
        <q-card-section class="header">
            <div class="column full-width">
                <header class="row items-center q-pb-none">
                    <span
                        >Klimarechner <b>{{ city.name }}</b></span
                    >
                    <q-space />
                    <q-btn icon="o_close" flat round dense v-close-popup />
                </header>
                <div class="sector-selection">
                    Sektor:
                    <q-select
                        class="sector"
                        v-model="selectedSector"
                        :options="sectorOptions"
                        borderless
                        map-options
                        emit-value
                        dense
                        hide-bottom-space
                        @update:model-value="updateSector"
                    />
                </div>
            </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="intro">
            <div>
                Für den Zeitraum <b>{{ calculator.startYear }}</b> bis
                <b>{{ calculator.endYearCalculated }}</b> wurden folgende Klimamaßnahmen und Effekte
                berechnet.
            </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="section-kpis">
            <div class="kpi">
                <KValue :value="kpi.invest" :precision="0" suffix="Mio €" :force-prefix="true" />
                <span class="description"
                    ><b>Investitionen</b>: Die nötigen Investitionen (einmalige Ausgaben für
                    Material, Arbeit u.a.), um alle Maßnahmen über den gesamten Zeitraum
                    umzusetzen.</span
                >
            </div>

            <div class="kpi">
                <KValue
                    :value="kpi.directEffects"
                    :precision="0"
                    suffix="Mio €"
                    :force-prefix="true"
                />
                <span class="description"
                    ><b>Direkte Effekte</b>: Beschreibt wirtschaftliche Effekte von Klimamaßnahmen
                    wie Kostensenkungen, Effizienz- oder Einnahmensteigerungen sowie die
                    Preisentwicklung fossiler Energieträger. Werden über den Betrachtungszeitraum
                    kumuliert.</span
                >
            </div>

            <div class="kpi">
                <KValue
                    :value="kpi.indirectEffects"
                    :precision="0"
                    suffix="Mio €"
                    :force-prefix="true"
                />
                <span class="description"
                    ><b>Indirekte Effekte</b>: Beschreibt indirekte wirtschaftliche Effekte von
                    Klimamaßnahmen, etwa Einnahmensteigerung privater Haushalte durch zusätzliche
                    Arbeitsplätze, Gewinnsteigerung von Unternehmen, die in der Kommune ansässig
                    sind durch mehr Umsatz oder zusätzliche Steuereinnahmen der Kommune selbst.
                    Werden über den Betrachtungszeitraum kumuliert.</span
                >
            </div>

            <div class="kpi">
                <KValue :value="kpi.turnover" :precision="0" suffix="Mio €" :force-prefix="true" />
                <span class="description"><b>Umsatzsteigerung</b> in der lokalen Wirtschaft.</span>
            </div>

            <div class="kpi">
                <KValue
                    :value="kpi.emissionsSaved"
                    :precision="0"
                    suffix="%"
                    :force-prefix="true"
                />
                <span class="description"
                    ><b>CO<sub>2</sub>-Emissionen</b>: Welcher Anteil der gesamten CO₂-Emissionen
                    durch alle Maßnahmen über den gesamten Zeitraum eingespart wird</span
                >
            </div>

            <div class="kpi">
                <KValue
                    :value="kpi.additionalJobsLocal"
                    :precision="0"
                    suffix=""
                    :force-prefix="true"
                />
                <span class="description"
                    ><b>Arbeitsplätze</b> werden für die Umsetzung der Maßnahmen in der lokalen
                    Wirtschaft zusätzlich geschaffen</span
                >
            </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="emissions">
            <div class="chart-wrap">
                <h3>Reduktion der CO<sub>2</sub>-Emissionen</h3>
                <ChartEmissions />
            </div>

            <div class="description">
                <h3>Über die CO<sub>2</sub>-Emissionen</h3>

                <p>
                    Mit den Bereichen Wärme, Strom & Mobilität deckt der Klimarechner etwa ~90 % der
                    Gesamtemissionen ab. Die eingestellten Maßnahmen haben etwa
                    <b>{{ filters.number(emissionsSaved, 1) }} % Reduktion</b> erreicht.
                </p>

                <p>
                    Deutschland hat sich das Ziel gesetzt, die Klimaneutralität bis spätestens 2045
                    zu erreichen. In der Vergangenheit konnten Ziele ohne konkrete und mutige
                    Maßnahmen selten eingehalten werden.
                </p>

                <p>
                    Die Wirtschaft kann von einer unabhängigen und günstigeren Energieversorgung
                    enorm profitieren. <b>Kommunen müssen eine Vorreiterrolle übernehmen</b>, sie
                    haben einen übersichtlichen, aber entscheidenden Gestaltungsspielraum und können
                    die Klimaneutralität erheblich schneller erreichen als der Bund.
                </p>

                <p>
                    Die Klimakrise stellt uns vor wirtschaftliche und rechtliche Herausforderungen:
                    <b>Spätes Handeln führt zu enormen Einschränkungen</b> – durch Naturgewalten
                    draußen sowie drinnen im Gerichtssaal.
                </p>
            </div>
        </q-card-section>

        <q-separator />

        <transition name="fade">
            <div v-if="calculator.actionsActive.length > 1">
                <q-card-section class="actions">
                    <h3>Maßnahmenübersicht</h3>
                    <ActionRanking :max="0" />
                </q-card-section>
            </div>
        </transition>

        <q-card-section class="economy">
            <div class="chart-wrap economy">
                <h3>Kosten & Rendite</h3>
                <ChartEconomy :separate-cash-flow-axis="true" />
            </div>
            <div class="chart-wrap jobs">
                <h3>Beschäftigung</h3>
                <ChartJobs :compact="true" />
            </div>
        </q-card-section>

        <q-separator />

        <!-- <q-card-section class="distributions">
            <div class="distribution">
                <h3>Wärme ({{ calculator.endYear }})</h3>
                <ChartHeatingDistribution />
            </div>
            <div class="distribution">
                <h3>Strom ({{ calculator.endYear }})</h3>
                <ChartElectricityDistribution />
            </div>
            <div class="distribution">
                <h3>Mobilität ({{ calculator.endYear }})</h3>
                <ChartMobilityDistribution />
            </div>
        </q-card-section>

        <q-separator /> -->

        <q-card-section class="end">
            <h3>Ergebnis teilen & speichern</h3>
            <p>Wir entwickeln uns weiter: Mehr Funktionen folgen.</p>
        </q-card-section>

        <q-card-actions>
            <q-btn unelevated rounded label="Druckansicht" @click="print" />

            <q-btn
                class="secondary"
                unelevated
                rounded
                label="Link teilen"
                @click="generateShareLink"
                @loading="share.loading"
            />
        </q-card-actions>

        <q-card-section class="footer">
            <Partners />
        </q-card-section>
    </q-card>
</template>

<script>
import { useCityStore } from '@/stores/city'
import { useCalculatorStore } from '@/stores/calculator'
import { useShareStore } from '@/stores/share'
import KValue from '@/components/KValue.vue'
import KSectionButton from '@/components/KSectionButton.vue'
import Credits from '@/components/Credits.vue'
import Partners from '@/components/Partners.vue'

import ChartEconomy from '@/components/charts/ChartEconomy.vue'
import ChartJobs from '@/components/charts/ChartJobs.vue'
import ChartEmissions from '@/components/charts/ChartEmissions.vue'
import ActionRanking from './ActionRanking.vue'

// import ChartHeatingDistribution from '@/components/charts/ChartHeatingDistribution.vue'
// import ChartElectricityDistribution from '@/components/charts/ChartElectricityDistribution.vue'
// import ChartMobilityDistribution from '@/components/charts/ChartMobilityDistribution.vue'

// import { debounce } from 'quasar'

export default {
    name: 'Report',

    components: {
        KValue,
        KSectionButton,
        Credits,
        Partners,

        ChartEmissions,
        ChartEconomy,
        ChartJobs,
        ActionRanking,
        // ChartHeatingDistribution,
        // ChartElectricityDistribution,
        // ChartMobilityDistribution,
    },

    inject: ['i18n', 'filters', 'generateShareLink', 'print'],

    setup() {
        const city = useCityStore()
        const calculator = useCalculatorStore()
        const share = useShareStore()

        return {
            city,
            calculator,
            share,
        }
    },

    props: {
        // chart: {
        //     type: String,
        //     default: 'emissions',
        // },
    },

    data() {
        return {
            kpi: {
                directEffects: 0,
                indirectEffects: 0,
                turnover: 0,
                invest: 0,
                emissionsSaved: 0,
                additionalJobsLocal: 0,
            },

            showAllActions: false,

            sectorOptions: [
                { value: 'aggregate', label: 'Alle' },
                { value: 'private', label: this.i18n('sectorsShort.private') },
                { value: 'industry', label: this.i18n('sectorsShort.industry') },
                { value: 'public', label: this.i18n('sectorsShort.public') },
            ],

            selectedSector: this.calculator.sectorFocus || 'aggregate',
            // actions: [],
            // sortByColumn: 'return',
            // sortOrder: 'desc',
        }
    },

    mounted() {
        this.setKPIs()
    },

    computed: {
        sector() {
            return this.calculator.sectorFocus || 'aggregate'
        },

        effects() {
            return this.calculator.results.all?.effects || undefined
        },

        sectorEffects() {
            return this.calculator.results.all?.effects?.[this.sector] || undefined
        },

        emissionsSaved() {
            if (!this.sectorEffects) {
                return 0
            }

            return this.sectorEffects['emissions_saved_share[%]']
        },
    },

    methods: {
        setKPIs() {
            this.kpi.directEffects = this.sectorEffects['direct_effects_total[M*EUR]'] || 0
            this.kpi.indirectEffects = this.sectorEffects['indirect_effects_total[M*EUR]'] || 0
            this.kpi.turnover = this.sectorEffects['turnover_local_total[M*EUR]'] || 0
            this.kpi.invest = this.sectorEffects['invest_total[M*EUR]'] || 0
            this.kpi.emissionsSaved = (this.sectorEffects['emissions_saved_share[%]'] || -0) * -1
            this.kpi.additionalJobsLocal = this.effects.aggregate['jobs_local_total[n]'] || 0
        },

        updateSector(name) {
            if (name === 'aggregate') {
                this.calculator.sectorFocus = undefined
                return
            }
            this.calculator.sectorFocus = name
        },
    },

    watch: {
        sector() {
            this.setKPIs()
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.report {
    background-color: #fff;
    padding: 0 1.5rem;
    border-radius: 0.25rem;
    color: #000;
    max-width: 56.25rem;
    width: calc(100% - var(--k-page-padding-x) * 2);

    header {
        font-size: 1.5rem;
        line-height: 1.2;
        font-weight: 400;
    }

    .sector-selection {
        display: flex;
        flex-flow: row nowrap;
        font-size: 1.5rem;
        line-height: 2rem;
        align-items: center;

        :deep(.q-field) {
            margin-left: 0.5rem;
            color: #000;
            font-size: 1.5rem;

            .q-field__control {
                min-height: 2rem;
                height: 2rem;
            }

            .q-field__native,
            .q-field__marginal {
                color: #000;
                font-weight: 700;
                line-height: 2rem;
                min-height: 0;
                padding: 0;
            }

            .q-field__append {
                height: 2rem;
            }
        }
    }
}

.q-separator {
    background-color: #d7dadd;
}

.report > .q-card__section {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    gap: 2.5rem;
    padding: 1.5rem 0;
    font-size: 0.875rem;

    &.section-kpis {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        // display: flex;
        // flex-flow: row wrap;
        // justify-content: space-between;
        // align-items: stretch;
        gap: 2.5rem;
    }

    .kpi {
        display: flex;
        flex-flow: column;
        // width: calc(33.3% - 1.25rem);
        // flex: none;

        :deep(.k-value) {
            display: block;
            font-size: 2.5rem;
            font-weight: 700;

            .value {
                margin-right: 0.5rem;
            }

            .suffix {
                font-size: 1rem;
                font-weight: 500;
            }
        }

        .description {
            font-size: 0.875rem;
        }
    }
}

:deep(.q-card__section) {
    h3 {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        line-height: 1.2;
    }

    &.intro {
        font-size: 1rem;
    }

    &.emissions {
        // .chart {
        //     width: 50%;
        //     flex: none;
        // }

        .description {
        }
    }

    &.actions {
        position: relative;
        display: block;
        width: 100%;

        .action-ranking {
            margin-top: 1rem;
            width: 100%;
        }
    }

    &.economy {
        margin-top: 1rem;

        .chart-wrap {
            &.economy {
                width: calc(66.6% - 1.25rem);
            }

            &.jobs {
                width: calc(33.3% - 1.25rem);
            }
        }
    }

    &.distributions {
        .distribution {
            position: relative;
            flex: 1% 1 0;

            &:after {
                content: '';
                position: absolute;
                right: -1.25rem;
                top: 15%;
                display: block;
                width: 1px;
                height: 70%;
                background-color: var(--k-color-section-border);
            }

            &:last-child {
                &:after {
                    display: none;
                }
            }
        }
    }

    &.end {
        display: flex;
        flex-flow: column;
        align-items: center;
        gap: 0;

        h3 {
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.2;
        }
    }
}

.chart-wrap {
    position: relative;
    display: block;
    width: 50%;
    flex: none;

    .chart {
        width: calc(100% + 1.5rem);
        margin: -0.75rem -0.75rem 0;
    }
}

:deep(.q-card__actions) {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: stretch;
    gap: 1.5rem;
    padding: 0 0 1rem;

    .q-btn {
        font-size: 1.125rem;
        font-weight: 400;
        text-transform: none;
        padding: 0 2rem;
        background-color: #000;
        color: #fff;

        &.secondary {
            background-color: #fff;
            border: 1px solid #000;
            color: #000;
        }
    }

    @include bp-lg {
        .q-btn {
            font-size: 1.125rem;
        }
    }
}

// :deep(.credits) {
//     width: 100%;
//     font-size: 0.75rem;
//     font-weight: 400;
//     text-align: center;

//     .anchor {
//         --anchor-color: #000;
//         --anchor-text-color-active: #fff;
//         --anchor-bg-size: 1rem;
//         font-size: 0.75rem;
//         font-weight: 400;
//     }
// }

html.print {
    .report {
        border-radius: 0;
        max-height: none !important;
        max-width: none;
        width: 100%;
        box-shadow: none;
        padding: 0 1rem;

        .header .column {
            display: flex;
            flex-flow: row nowrap;

            .sector-selection {
                margin-left: auto;

                :deep(.q-field__append) {
                    display: none;
                }
            }
        }

        header {
            .q-btn {
                display: none;
            }
        }

        .chart-wrap {
            .chart {
                width: calc(100% + 1.5rem);
                margin: -0.75rem -0.75rem 0;
            }
        }

        .show-all-actions {
            display: none;
        }

        .q-card__section.end {
            display: none;
        }

        :deep(.q-card__actions) {
            display: none;
        }
    }
}
</style>
