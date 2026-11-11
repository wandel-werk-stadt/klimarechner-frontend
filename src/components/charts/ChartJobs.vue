<template>
    <div class="chart">
        <apexchart
            class="chart-jobs"
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
    name: 'ChartJobs',

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

        opts.colors = ['#A073FF']

        opts.tooltip.unit = 'VZÄ'
        opts.tooltip.precision = 1
        opts.tooltip.titleFn = ({ year }) => `Zusätzliche Arbeitsplätze in ${year}`

        opts.yaxis[0].labels.formatter = (value) =>
            this.filters.number(value, 0) + ' ' + opts.tooltip.unit

        opts.customData = [
            {
                name: '',
                factor: 1,
                color: '#A073FF',
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
            // const sector = this.calculator.sectorFocus || 'aggregate'
            return this.calculator.results.all?.effects?.aggregate || undefined
        },

        jobsData() {
            const yearRange = this.calculator.yearRangeCalculated
            let data = []

            if (this.effects) {
                data = this.effects['jobs_local_total[n/a]'].map((value, index) => ({
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
                    name: 'VZÄ regional',
                    data: this.jobsData.map(({ value }) => {
                        return value
                    }),
                },
            ]
        },
    },

    watch: {
        jobsData: {
            handler(data) {
                this.options.xaxis.categories.length = 0
                this.options.xaxis.categories.push(...data.map(({ year }) => year))
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
