<template>
    <ChartDistribution
        :items="items"
        :kpi-value="filters.number(calculator.output?.heatingDistribution?.delta, 1)"
        kpi-unit="GWh"
        :kpi-label="i18n('heatingDistribution.savings')"
    />
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import ChartDistribution from '@/components/charts/ChartDistribution.vue'

export default {
    name: 'ChartHeatingDistribution',

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
                gas: 'red',
                oil: 'orange',
                'heat-pump': 'green',
                'district-heating': 'blue',
                other: 'yellow',
            }

            return this.calculator.output.heatingDistribution.types.map((item) => {
                return {
                    name: this.i18n('heatTypes.' + item.type),
                    type: item.type,
                    color: `var(--k-color-${colors[item.type]})`,
                    value: item.consumptionShare,
                }
            })
        },
    },
}
</script>
