<script>
import KAmount from '@/components/KAmount.vue'
import KRange from '@/components/KRange.vue'
import Tooltip from '@/components/Tooltip.vue'
import { useCityStore } from '@/stores/city'
import { useCalculatorStore } from '@/stores/calculator/index'

export default {
    components: { KRange, KAmount, Tooltip },

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
        const action = this.calculator.actions.find((a) => a.name === 'fossil-price-increase')

        // const priceForecastOptions = [
        //     { value: '0.1', label: 'Anstieg um 10%' },
        //     { value: '0.2', label: 'Anstieg um 20%' },
        // ]

        return {
            action,

            co2Price: '50,00',
            heatingOil: this.filters.number(this.store.fossilPrices.heatingOil, 2),
            heatingGas: this.filters.number(this.store.fossilPrices.heatingGas, 2),
            fuel: this.filters.number(this.store.fossilPrices.fuel, 2),

            numberFormat: {
                decimal: ',',
                separator: '',
                precision: 2,
                minimumFractionDigits: 2,
                prefill: false,
                masked: false,
            },

            // priceForecast: 10,

            // timeframe: {
            //     min: year,
            //     max: this.calculator.endYear,
            // },
            year,
            minYear: parseInt(year / 5) * 5,
        }
    },

    methods: {
        validatePrice(max, value) {
            const num = this.filters.parseNumber(value)

            if (num < 0.01) {
                return 'Preis muss größer als 0 sein.'
            }

            if (num > max) {
                return `Preis muss kleiner als ${max} sein.`
            }

            return true
        },

        updatePrices() {
            this.store.fossilPrices.heatingOil = this.filters.parseNumber(this.heatingOil)
            this.store.fossilPrices.heatingGas = this.filters.parseNumber(this.heatingGas)
            this.store.fossilPrices.fuel = this.filters.parseNumber(this.fuel)
        },
    },

    watch: {
        'store.fossilPrices.heatingOil'(value) {
            this.heatingOil = this.filters.number(value, 2)
        },
        'store.fossilPrices.heatingGas'(value) {
            this.heatingGas = this.filters.number(value, 2)
        },
        'store.fossilPrices.fuel'(value) {
            this.fuel = this.filters.number(value, 2)
        },
    },
}
</script>

<template>
    <div class="fossil-scenario">
        <div class="prices">
            <q-input
                v-model.lazy="co2Price"
                type="text"
                label="CO₂-Preis"
                v-number="numberFormat"
                :rules="[validatePrice.bind(null, 500)]"
                suffix="€/t"
                no-error-icon
                class="co2-price"
            />

            <q-input
                v-model.lazy="heatingOil"
                @blur="(ev) => updatePrices()"
                @keyup.enter="(ev) => updatePrices()"
                type="text"
                label="Heizöl"
                v-number="numberFormat"
                :rules="[validatePrice.bind(null, 100)]"
                suffix="€/l"
                no-error-icon
            />

            <q-input
                v-model.lazy="heatingGas"
                @blur="(ev) => updatePrices()"
                @keyup.enter="(ev) => updatePrices()"
                type="text"
                label="Heizgas"
                v-number="numberFormat"
                :rules="[validatePrice.bind(null, 100)]"
                suffix="€/m³"
                no-error-icon
            />

            <q-input
                v-model.lazy="fuel"
                @blur="(ev) => updatePrices()"
                @keyup.enter="(ev) => updatePrices()"
                type="text"
                label="Benzin"
                v-number="numberFormat"
                :rules="[validatePrice.bind(null, 100)]"
                suffix="€/l"
                no-error-icon
            />
        </div>

        <div class="scenario">
            <KAmount
                :label="i18n('actions.fossil-price-increase.label')"
                :model-value="action.deltaRelative * 100"
                :step="5"
                :min="0"
                :max="50"
                unit="%"
                :marker-spacing="5"
                description-mode="of"
                @update:model-value="
                    (val) => {
                        action.deltaRelative = val / 100
                        action.active = val > 0
                    }
                "
            />

            <Tooltip :id="'fossil-price-increase'" :i18n-base="'actions.fossil-price-increase'" />

            <KRange
                label="Zeitraum"
                :show-marker-labels="true"
                :min="calculator.startYear"
                :max="calculator.endYearCalculated"
                :marker-spacing="1"
                v-model:valueMin="action.startYear"
                v-model:valueMax="action.endYear"
            />
        </div>
    </div>
</template>

<style lang="scss">
@import 'src/assets/tools.scss';

.fossil-scenario {
    padding-bottom: 1.5rem;
    display: flex;
    flex-flow: column;
    gap: var(--k-gap);

    .prices {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--k-gap);
        width: 100%;
    }

    .co2-price {
        pointer-events: none;

        input {
            color: var(--k-color-label);
        }
    }

    .scenario {
        position: relative;
        display: flex;
        flex-flow: column;
        width: 100%;
    }

    .q-icon {
        position: absolute;
        top: 0.25rem;
        right: 0;
    }

    .k-amount {
        margin-top: 0.5rem;
    }

    .k-range {
        margin-top: 0.5rem;
    }

    @include bp-sm {
        padding-bottom: 0.5rem;
        flex-flow: row nowrap;

        .prices {
            width: calc(50% - var(--k-gap) / 2);
        }

        .scenario {
            width: calc(50% - var(--k-gap) / 2);
        }
    }
}
</style>
