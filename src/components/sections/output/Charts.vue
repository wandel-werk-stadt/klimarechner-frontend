<template>
    <div class="charts">
        <q-btn-group spread rounded flat class="button-list">
            <template v-for="tab of tabs" :key="tab.name">
                <q-btn
                    v-if="!hideTabs.includes(tab.name)"
                    @click="activeTab = tab.name"
                    :class="[{ active: activeTab === tab.name }]"
                    v-html="tab.label"
                    unelevated
                />
            </template>
        </q-btn-group>

        <q-tab-panels
            v-model="activeTab"
            animated
            :dark="false"
            dense
            active-bg-color="transparent"
            transition-prev="jump-up"
            transition-next="jump-up"
        >
            <q-tab-panel name="emissions">
                <ChartEmissions :compact="true" />
            </q-tab-panel>
            <q-tab-panel name="economy">
                <ChartEconomy :compact="true" />
            </q-tab-panel>
            <q-tab-panel name="jobs">
                <ChartJobs :compact="true" />
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import ChartEconomy from '@/components/charts/ChartEconomy.vue'
import ChartJobs from '@/components/charts/ChartJobs.vue'
import ChartEmissions from '@/components/charts/ChartEmissions.vue'

export default {
    name: 'Charts',

    components: {
        ChartEmissions,
        ChartEconomy,
        ChartJobs,
    },

    inject: ['i18n', 'filters'],
    emit: ['tab-change'],

    setup() {
        const calculator = useCalculatorStore()

        return {
            calculator,
        }
    },

    data() {
        const tabs = [
            {
                name: 'emissions',
                label: 'CO₂&shy; Emissionen',
            },
            {
                name: 'economy',
                label: 'Kosten & Rendite',
            },
            {
                name: 'jobs',
                label: 'Arbeits&shy;plätze',
            },
        ]

        return {
            tabs,
            activeTab: 'emissions',
        }
    },

    computed: {
        hideTabs() {
            const list = []

            if (this.calculator.sectorFocus) {
                list.push('jobs')
            }

            return list
        },
    },

    watch: {
        'calculator.sectorFocus': {
            immediate: true,
            handler(sector) {
                if (sector && this.activeTab === 'jobs') {
                    this.activeTab = 'emissions'
                }
            },
        },

        activeTab(name) {
            this.$emit('tab-change', name)
        },
    },
}
</script>

<style scoped lang="scss">
.charts {
}

.button-list {
    border: 1px solid var(--k-color-section-border);

    .q-btn {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        border-left: 1px solid var(--k-color-section-border);
        background-color: rgba(#000, 0);
        color: #000;
        font-size: 0.75rem;
        line-height: 1.2;
        padding: 0.25rem 0.5rem;
        text-transform: none;
        transition: color 0.25s, background-color 0.25s;

        &:first-child {
            border-left: none;
        }

        &.active {
            background-color: rgba(#000, 1);
            color: #fff;
        }
    }
}

.q-tab-panels {
    background-color: transparent;

    :deep(.q-tab-panel) {
        padding: 0;
        overflow: hidden;
    }
}
</style>
