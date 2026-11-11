<template>
    <ChartDistribution
        :items="items"
        :kpi-value="filters.number(calculator.output?.electricityDistribution?.delta, 1)"
        kpi-unit="GWh"
        kpi-label="Überschuss"
    />
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import ChartDistribution from '@/components/charts/ChartDistribution.vue'

export default {
    name: 'ChartElectricityDistribution',

    components: { ChartDistribution },

    inject: ['i18n', 'filters'],

    setup() {
        const calculator = useCalculatorStore()

        return {
            calculator,
        }
    },

    computed: {
        items() {
            if (!this.calculator.output) return []

            const colors = {
                'photovoltaics-roof': 'yellow',
                'photovoltaics-landscape': 'orange',
                'wind-energy': 'blue',
                'purchased-energy-renewable': 'green',
                'purchased-energy-mix': 'pink',
            }

            return this.calculator.output.electricityDistribution.types.map((item) => {
                return {
                    name: this.i18n('electricityTypes.' + item.type),
                    type: item.type,
                    color: `var(--k-color-${colors[item.type]})`,
                    value: item.share,
                }
            })
        },
    },
}
</script>
