<script>
import { useCityStore } from '@/stores/city'
import { useCalculatorStore } from '@/stores/calculator/index'
import KRange from '@/components/KRange.vue'
import KSection from '@/components/KSection.vue'
import KSectionInner from '@/components/KSectionInner.vue'
import KSectionButton from '@/components/KSectionButton.vue'
import SourcesOverlay from '@/components/overlays/Sources.vue'
import DataAkkordeons from './DataAkkordeons.vue'
import FossilScenario from './FossilScenario.vue'

export default {
    components: {
        KRange,
        KSection,
        KSectionInner,
        KSectionButton,
        FossilScenario,
        DataAkkordeons,
        SourcesOverlay,
    },

    inject: ['i18n', 'filters'],

    setup() {
        const store = useCityStore()
        const calculator = useCalculatorStore()

        return {
            store,
            calculator,
        }
    },

    data() {
        const year = this.calculator.year

        return {
            population: '' + this.store.population,
            year,
            minYear: parseInt(year / 5) * 5,

            dataInputs: { show: false, state: false, visible: false },

            showSourcesOverlay: false,
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.dataInputs.show = this.store.inputMode === 'expert'
        })
    },

    computed: {
        populationChanged() {
            return this.population.replace(/\./g, '') !== this.store.population + ''
        },
    },

    methods: {
        validatePopulation(value) {
            const raw = value.replace(/\./g, '').replace(',', '.')
            value = parseInt(raw)

            if (isNaN(value)) {
                return 'Einwohnerzahl darf nicht leer sein.'
            }

            if (value < 1000) {
                return 'Einwohnerzahl darf nicht kleiner als 1.000 sein.'
            }

            if (value > 84_000_000) {
                return 'Einwohnerzahl darf nicht größer als 84.000.000 sein.'
            }

            return true
        },

        updatePopulation(value) {
            if (this.validatePopulation(value) !== true) {
                return
            }

            const pop = parseInt(value.replace(/\./g, ''), 10)
            this.store.populationSimple = pop
            // this.$refs.popInput.nativeEl.blur()
        },
    },

    watch: {
        'dataInputs.show'(value) {
            if (value) {
                this.$nextTick(() => {
                    this.dataInputs.state = true
                })
            } else {
                this.dataInputs.state = false
            }
        },

        'dataInputs.visible'(value) {
            this.store.inputMode = value ? 'expert' : 'simple'
        },

        'store.inputMode': {
            handler(mode) {
                this.dataInputs.show = mode === 'expert'

                if (mode === 'simple') {
                    this.$nextTick(() => {
                        this.$refs.popInput.$forceUpdate()
                    })
                }
            },
        },

        'store.population'(value) {
            this.population = '' + value
        },
    },
}
</script>

<template>
    <KSection title="Daten der Stadt">
        <template v-slot:title-suffix>
            <span class="btn sources-btn" ref="sources-btn" @click="showSourcesOverlay = true">
                <q-icon name="o_info" />
                Quellenangaben
            </span>
        </template>

        <template v-slot:description>
            Über die Einwohnerzahl werden durchschnittliche Werte für Deutschland (anteilig) für die
            Stadt übernommen. Passen Sie die Werte an, um ein genaueres Ergebnis zu erhalten.
        </template>

        <div class="simple-config">
            <div class="inputs">
                <q-input v-model="store.name" type="text" label="Name der Stadt" />

                <q-input
                    v-if="store.inputMode === 'simple'"
                    v-model="population"
                    type="text"
                    ref="popInput"
                    :class="['population']"
                    min="1000"
                    step="1"
                    label="Anzahl der Einwohner"
                    v-number="{
                        decimal: ',',
                        separator: '.',
                        precision: 0,
                        minimumFractionDigits: 0,
                    }"
                    @blur="(ev) => updatePopulation(ev.target.value)"
                    @keyup.enter="(ev) => updatePopulation(ev.target.value)"
                    :rules="[validatePopulation]"
                    :hint="populationChanged ? '[Enter] zum übernehmen' : ''"
                />
                <q-input
                    v-else
                    type="text"
                    :class="['population']"
                    label="Anzahl der Einwohner"
                    class="deactivated"
                    model-value="siehe Basisdaten"
                />

                <KRange
                    label="Zeitraum der Maßnahmen"
                    :min="year - 1"
                    :max="2045"
                    :marker-spacing="5"
                    v-model:valueMin="this.calculator.startYear"
                    v-model:valueMax="this.calculator.endYear"
                />
            </div>

            <q-expansion-item
                class="data-container"
                v-model="dataInputs.state"
                @after-hide="dataInputs.visible = false"
                @after-show="dataInputs.visible = true"
            >
                <DataAkkordeons
                    v-if="dataInputs.visible || dataInputs.state"
                    ref="dataAkkordeons"
                />
            </q-expansion-item>

            <transition mode="out-in" name="quick-fade">
                <KSectionButton
                    v-if="!dataInputs.show"
                    class="enter-base-data"
                    @click="dataInputs.show = !dataInputs.show"
                    >Manuelle Dateneingabe (Für Fortgeschrittene)
                </KSectionButton>
                <KSectionButton
                    v-else
                    class="enter-base-data"
                    @click="dataInputs.show = !dataInputs.show"
                    >Durchschnittswerte nutzen (Einfacher Modus)
                </KSectionButton>
            </transition>
        </div>

        <q-dialog
            v-model="showSourcesOverlay"
            transition-show="jump-up"
            transition-hide="jump-down"
        >
            <SourcesOverlay />
        </q-dialog>

        <template v-slot:sub-section>
            <KSectionInner title="Preise für fossile Energien">
                <template v-slot:description>
                    Durch zunehmende Bepreisung von CO<sub>2</sub>-Emissionen ist mit einem
                    deutlichen Kostenanstieg für fossile Energien zu rechnen. Eingegebene Preise
                    gelten für heute und werden mit der Preis-Entwicklung dann hochgerechnet.
                </template>

                <FossilScenario />
            </KSectionInner>
        </template>
    </KSection>
</template>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.sources-btn {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0.5rem;
    color: var(--k-color-label);
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;

    &:hover {
        color: #000;
    }
}

.inputs {
    display: flex;
    flex-flow: column;
    gap: var(--k-gap);
    margin: 0 0 2.5rem;

    .k-range {
        padding: 0;
    }

    @include bp-sm {
        flex-flow: row nowrap;
        height: 4.25rem;
        margin: 0 0 1.5rem;

        .q-input,
        .q-field {
            width: calc(50% - var(--k-gap) / 2);
        }

        .k-range {
            padding: 0 0.5rem 1.25rem;
        }
    }
}

.k-section {
    :deep(> .inner > .content) {
        padding-bottom: 0;
    }
}

.enter-base-data {
    // margin: 1.5rem 0 0;
}

:deep(.data-container) {
    width: calc(100% + 6rem);
    margin-left: -3rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;

    > .q-expansion-item__container {
        > .q-item {
            display: none;
        }
    }
}
</style>
