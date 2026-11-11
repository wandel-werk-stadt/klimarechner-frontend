<template>
    <div class="chart">
        <apexchart
            class="chart-emissions"
            type="bar"
            :height="240"
            :options="options"
            :series="series"
        ></apexchart>
    </div>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import { useQuasar } from 'quasar'
import { compactSeries, createChartDefaultOptions } from '@/tools/chart'

export default {
    name: 'ChartEmissions',

    inject: ['i18n', 'filters'],

    setup() {
        const q = useQuasar()
        const calculator = useCalculatorStore()

        return {
            q,
            calculator,
        }
    },

    props: {
        compact: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        const opts = createChartDefaultOptions({ dark: false })

        opts.colors = ['#FBB174']

        opts.tooltip.unit = 'tsd. t CO₂'
        opts.tooltip.precision = 1
        opts.tooltip.titleFn = ({ year, unit }) => `Emissionen in ${year}`

        opts.xaxis.overwriteCategories = []

        opts.yaxis[0].labels.formatter = (value) =>
            this.filters.number(value, 0) + ' ' + opts.tooltip.unit

        opts.customData = [
            {
                key: 'emissions',
                name: '',
                factor: 1,
                color: '#FBB174',
            },
        ]

        return {
            yMax: 50,
            breakEvenYear: 0,

            options: opts,
        }
    },

    computed: {
        effects() {
            const sector = this.calculator.sectorFocus || 'aggregate'
            return this.calculator.results.all?.effects?.[sector] || undefined
        },

        emissionsData() {
            const yearRange = this.calculator.yearRangeCalculated
            let data = []

            if (this.effects) {
                data = this.effects['emissions_total[k*to_coe/a]'].map((value, index) => ({
                    year: yearRange[index],
                    value,
                }))

                if (this.compact) {
                    data = compactSeries(data)
                }
            }

            return data
        },

        series() {
            return [
                {
                    name: 'Emissionen',
                    data: this.emissionsData.map(({ value }) => {
                        return value
                    }),
                },
            ]
        },
    },

    watch: {
        emissionsData: {
            handler(data) {
                this.options.xaxis.categories.length = 0
                this.options.xaxis.categories.push(...data.map(({ year }) => year))

                this.options.xaxis.overwriteCategories.length = 0
                this.options.xaxis.overwriteCategories.push(
                    ...data.map(({ year }, index) => {
                        if (!this.compact) {
                            if (index % 2 === 0) {
                                return year
                            }
                            return ''
                        }

                        return year
                    }),
                )
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.chart {
}
</style>
