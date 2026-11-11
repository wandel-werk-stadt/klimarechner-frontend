<template>
    <div class="chart">
        <apexchart
            v-if="ready"
            :key="chartKey"
            ref="chart"
            class="chart-economy"
            type="bar"
            :height="240"
            :options="options"
            :series="series"
        ></apexchart>
        <div class="legend">
            <div
                v-for="item in legend"
                :key="item.key"
                :class="['legend-item', { visible: item.visible }, item.type]"
                :style="{ '--color': item.color }"
            >
                <div class="marker"></div>
                <div class="text">{{ item.name }}</div>
                <Tooltip :id="item.key" :i18n-base="'charts.economy.' + item.key" />
            </div>
        </div>
    </div>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import { useQuasar } from 'quasar'
import { compactSeries, createChartDefaultOptions } from '@/tools/chart'
import Tooltip from '@/components/Tooltip.vue'

export default {
    name: 'ChartEconomy',

    components: {
        Tooltip,
    },

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

        separateCashFlowAxis: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        const opts = createChartDefaultOptions({ dark: false })

        opts.colors = ['#0AB480', '#73BCFF', '#F87373', '#000']

        opts.stroke.width = [0, 0, 0, 2]
        opts.stroke.dashArray = [0, 0, 0, 5]
        // opts.fill.opacity = [1, 1, 1, 1, 1]

        opts.plotOptions.bar.borderRadius = 2

        opts.tooltip.unit = ''
        opts.tooltip.precision = 1
        opts.tooltip.titleFn = ({ year }) => `Effekte in ${year} in Mio €`

        opts.annotations = {
            xaxis: [],
        }

        opts.yaxis[0].labels.formatter = (value) => this.filters.number(value, 0) + ' Mio €'
        opts.yaxis[0].opposite = !this.separateCashFlowAxis

        if (this.separateCashFlowAxis) {
            opts.yaxis[0].seriesName = 'Direkte Effeke'

            opts.yaxis[1] = {
                show: false,
                seriesName: 'Indirekte Effekte',
            }

            opts.yaxis[2] = {
                show: false,
                seriesName: 'Investitionen',
            }

            opts.yaxis[3] = { ...opts.yaxis[0] }
            opts.yaxis[3].seriesName = 'Cash-Flow (Netto)'
            opts.yaxis[3].opposite = true
            opts.yaxis[3].title = {
                text: 'Cash-Flow',
                style: {
                    color: undefined,
                    fontSize: '12px',
                    fontWeight: 500,
                },
            }
        }

        opts.legend.show = false

        opts.customData = [
            {
                key: 'direct_effects',
                name: 'Direkte Effeke',
                factor: 1,
                color: '#0AB480',
                visible: true,
            },
            {
                key: 'indirect_effects',
                name: 'Indirekte Effekte',
                factor: 1,
                color: '#73BCFF',
                visible: true,
            },
            { key: 'invest', name: 'Investitionen', factor: -1, color: '#F87373', visible: true },
            {
                key: 'cash_flow_netto',
                name: 'Cash-Flow (Netto)',
                factor: 1,
                type: 'line',
                color: '#000',
                visible: true,
            },
        ]

        return {
            yMaxDefault: 2,
            ready: false,
            // breakEvenYear: 0,

            options: opts,
        }
    },

    mounted() {
        this.ready = true
    },

    computed: {
        effects() {
            const sector = this.calculator.sectorFocus || 'aggregate'
            return this.calculator.results.all?.effects?.[sector] || undefined
        },

        legend() {
            const list = []
            const efxList = this.options.customData

            for (const { key, name, color, type = 'bar', visible } of efxList) {
                list.push({
                    key,
                    name,
                    color,
                    type,
                    visible,
                })
            }

            return list
        },

        seriesData() {
            const yearRange = this.calculator.yearRangeCalculated
            const map = {}
            const efxList = this.options.customData

            if (this.effects) {
                for (const { key, factor } of efxList) {
                    map[key] = [].slice
                        .call(this.effects[key + '[M*EUR/a]'])
                        .map((value, index) => {
                            return {
                                year: yearRange[index],
                                value: value * factor,
                            }
                        })

                    if (this.compact) {
                        map[key] = compactSeries(map[key])
                    }
                }
            }

            return map
        },

        currentYRange() {
            const efxList = this.options.customData
            let yRange = efxList.map(() => ({ min: 0, max: 0 }))

            Object.entries(this.seriesData).forEach(([key, data], index) => {
                const item = efxList.find((item) => item.key === key)
                if (!item?.visible) {
                    return
                }

                data.forEach(({ value }) => {
                    if (value * 1.1 > yRange[index].max) {
                        yRange[index].max = Math.ceil((value * 1.1) / 5) * 5
                    } else if (value * 1.1 < yRange[index].min) {
                        yRange[index].min = Math.ceil((value * 1.1) / 5) * 5
                    }
                })
            })

            return yRange
        },

        chartKey() {
            return (
                'ck-' +
                this.currentYRange.map((range) => range.min + '-' + range.max) +
                '-' +
                this.series.length
            )
        },

        isDataProvided() {
            return Object.values(this.seriesData)[0].some(({ value }) => value !== 0)
        },

        series() {
            const list = []
            const efxList = this.options.customData

            Object.entries(this.seriesData).map(([key, data]) => {
                const item = efxList.find((item) => item.key === key)

                if (!item?.visible) {
                    return
                }

                list.push({
                    name: item.name,
                    data: data.map(({ value }) => value),
                    type: item.type || 'bar',
                })
            })

            return list
        },
    },

    /*created() {
        this.$watch(
            () => this.effects['break_even[a]'],
            (year) => {
                if (!year || !this.isDataProvided) {
                    this.breakEvenYear = 0
                    this.options.annotations.xaxis.length = 0
                    return
                }

                this.breakEvenYear = this.findBreakEvenYear(year)
                console.log('breakEvenYear', this.breakEvenYear, year)

                if (this.breakEvenYear) {
                    this.options.annotations.xaxis[0] = this.createBreakEvenAnnotation(
                        this.breakEvenYear,
                    )
                }
            },
            { immediate: true },
        )
    },*/

    methods: {
        toggleSeries(key) {
            const item = this.options.customData.find((item) => item.key === key)
            item.visible = !item.visible
            // const method = (item.visible ? 'show' : 'hide') + 'Series'

            // this.$refs.chart.chart?.[method](item.name)
        },
        /*findBreakEvenYear(year) {
            const nYear = parseInt(year)
            const list = Object.values(this.seriesData)[1]
            let lastYear = 0
            let sYear = 0
            let fYear = 0

            for (let i = 0; i < list.length; i++) {
                sYear = parseInt(list[i].year)
                if (!sYear) {
                    continue
                }

                if (sYear === nYear) {
                    fYear = sYear
                    break
                } else if (lastYear < nYear && sYear > nYear) {
                    const d1 = sYear - nYear
                    const d2 = nYear - lastYear
                    if (d1 > d2) {
                        fYear = lastYear
                    } else {
                        fYear = sYear
                    }
                    break
                }
                lastYear = sYear
            }

            return fYear
        },

        createBreakEvenAnnotation(year) {
            return {
                x: '' + year,
                strokeDashArray: 6,
                borderColor: '#000',
                fillColor: '#000',
                opacity: 1,
                label: {
                    text: 'Break-Even',
                    textAnchor: 'middle',
                    borderWidth: 0,
                    borderRadius: 0,
                    orientation: 'horizontal',
                    offsetY: -10,
                    style: {
                        color: '#000',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: 'transparent',
                        padding: {
                            left: 2,
                            right: 2,
                            top: 0,
                            bottom: 0,
                        },
                    },
                },
            }
        },*/
    },

    watch: {
        currentYRange: {
            handler(yRange) {
                if (this.separateCashFlowAxis) {
                    const yMin = Math.min(yRange[0].min, yRange[1].min, yRange[2].min)
                    const yMax = Math.max(yRange[0].max, yRange[1].max, yRange[2].max)
                    const yAbs = Math.max(Math.abs(yMin), Math.abs(yMax))

                    const yAbs2 = Math.max(Math.abs(yRange[3].min), Math.abs(yRange[3].max))

                    this.options.yaxis[0].min = yAbs * -1
                    this.options.yaxis[0].max = yAbs

                    this.options.yaxis[1].min = yAbs * -1
                    this.options.yaxis[1].max = yAbs

                    this.options.yaxis[2].min = yAbs * -1
                    this.options.yaxis[2].max = yAbs

                    this.options.yaxis[3].min = yAbs2 * -1
                    this.options.yaxis[3].max = yAbs2
                } else {
                    const yMin = Math.min(
                        yRange[0].min,
                        yRange[1].min,
                        yRange[2].min,
                        // yRange[3].min,
                    )
                    const yMax = Math.max(
                        yRange[0].max,
                        yRange[1].max,
                        yRange[2].max,
                        // yRange[3].max,
                    )
                    const yAbs = Math.max(Math.abs(yMin), Math.abs(yMax))

                    this.options.yaxis[0].min = yAbs * -1
                    this.options.yaxis[0].max = yAbs
                }
            },
            immediate: true,
        },

        seriesData: {
            handler(data) {
                this.options.xaxis.categories.length = 0
                this.options.xaxis.categories.push(
                    ...Object.values(data)[1].map(({ year }) => year),
                )
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.chart {
    .legend {
        position: relative;
        z-index: 10;
        display: flex;
        flex-flow: row wrap;
        gap: 0.5rem;
        margin-top: -1rem;
        padding: 0 1rem;
    }

    .legend-item {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        --color: var(--color, #000);
        cursor: default;
        transition: opacity 0.25s;

        &:not(.visible) {
            opacity: 0.5;
        }

        &:hover {
            .text {
                color: #000;
            }
        }

        &.line {
            .marker {
                border-radius: 0;
                border: 1px dashed var(--color);
                background-color: transparent;
            }
        }

        .marker {
            width: 1rem;
            height: 0.25rem;
            border-radius: 0.25rem;
            margin-right: 0.375rem;
            background-color: var(--color);
        }

        .text {
            font-size: 0.875rem;
            color: var(--k-color-label);
            user-select: none;
            transition: color 0.25s;
        }

        :deep(.q-icon) {
            margin-left: 0.25rem;
            font-size: 0.875rem;
            color: var(--k-color-label);
        }
    }
}
</style>
