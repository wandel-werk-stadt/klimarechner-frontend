<template>
    <div class="chart-distribution">
        <div class="wrapper">
            <apexchart
                type="donut"
                ref="chart"
                :height="height"
                :options="options"
                :series="series"
                @dataPointMouseEnter="(event, ctx, config) => showCenterText(config.dataPointIndex)"
                @dataPointMouseLeave="hideCenterText"
                @animationEnd="$emit('animation-end')"
            ></apexchart>
            <div class="content">
                <slot>
                    <transition-group name="quick-fade">
                        <div
                            class="center-text"
                            v-for="(item, index) of options.customData"
                            :key="item.type"
                            v-show="activeIndex === index"
                        >
                            <div class="value">
                                {{ filters.number(series[index] * 100, 1) }}
                                <span class="unit">%</span>
                            </div>
                            <div class="label">{{ item.name }}</div>
                        </div>
                    </transition-group>
                    <transition name="quick-fade">
                        <div class="default-text" v-if="activeIndex === false">
                            <div class="value">
                                {{ kpiValue }}
                                <span class="unit">{{ kpiUnit }}</span>
                            </div>
                            <div class="label">{{ kpiLabel }}</div>
                        </div>
                    </transition>
                </slot>
            </div>
        </div>

        <ChartLegend v-if="showLegend" :items="legendItems" />
    </div>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import { useQuasar } from 'quasar'
import { createChartDefaultOptions } from '@/tools/chart'
import ChartLegend from '@/components/charts/ChartLegend.vue'

export default {
    name: 'ChartDistribution',

    components: { ChartLegend },

    inject: ['i18n', 'filters'],

    emits: ['animation-end'],

    props: {
        kpiValue: {
            type: String,
            default: '',
        },

        kpiUnit: {
            type: String,
            default: '',
        },

        kpiLabel: {
            type: String,
            default: '',
        },

        items: {
            type: Array,
            default: () => [],
        },

        showLegend: {
            type: Boolean,
            default: true,
        },

        height: {
            type: Number,
            default: 220,
        },
    },

    setup() {
        const q = useQuasar()
        const calculator = useCalculatorStore()

        return {
            q,
            calculator,
        }
    },

    data() {
        const opts = createChartDefaultOptions({ dark: false })

        opts.customData = this.items

        opts.labels = opts.customData.map((item) => item.name)
        opts.colors = opts.customData.map((item) => item.color)

        opts.legend.show = false

        opts.dataLabels = {
            enabled: false,
        }

        opts.plotOptions.pie = {
            expandOnClick: false,
            donut: {
                size: '80%',
            },
        }

        opts.stroke.width = 0.5
        opts.stroke.colors = ['#000']

        opts.tooltip.enabled = false

        return {
            options: opts,

            activeIndex: false,
            hideTimer: null,

            legendItems: opts.customData.map((item) => ({
                key: item.type,
                name: item.name,
                color: item.color,
                type: 'bar',
                visible: true,
            })),
        }
    },

    computed: {
        series() {
            return this.items.map((item) => item.value)
        },
    },

    methods: {
        showCenterText(index) {
            if (this.hideTimer) clearTimeout(this.hideTimer)
            this.activeIndex = index
        },

        hideCenterText() {
            if (this.hideTimer) clearTimeout(this.hideTimer)

            this.hideTimer = setTimeout(() => {
                this.activeIndex = false
            }, 500)
        },

        // toggleSeries(key) {
        //     const item = this.legendItems.find((i) => i.key === key)
        //     if (!item) {
        //         return
        //     }

        //     item.visible = !item.visible
        //     this.$refs.chart[(item.visible ? 'show' : 'hide') + 'Series'](item.name)
        // },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.chart {
    position: relative;
}

.wrapper {
    position: relative;
}

.center-text,
.default-text {
    position: absolute;
    top: 2rem;
    left: 50%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 65%;
    // border: 1px solid red;
    background-color: #fff;
    transform: translate(-50%, 0);

    .value {
        display: block;
        white-space: nowrap;
        font-size: 2rem;
        font-weight: 700;

        .unit {
            font-size: 0.875rem;
            font-weight: 500;
        }
    }

    .label {
        font-size: 1rem;
    }
}

.center-text {
    z-index: 10;
}

.vue-apexcharts {
    position: relative;
    z-index: 50;
}

.chart-legend {
    pointer-events: none;
}
</style>
