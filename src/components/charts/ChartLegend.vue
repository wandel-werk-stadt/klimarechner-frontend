<template>
    <div class="chart-legend">
        <div
            v-for="item in items"
            :key="item.key"
            :class="['legend-item', { visible: item.visible }, item.type]"
            :style="{ '--color': item.color }"
            @click="toggleSeries(item.key)"
            @mouseenter="hoverSeries(item.key)"
            @mouseleave="hoverSeries(null)"
        >
            <div class="marker"></div>
            <div class="text">{{ item.name }}</div>

            <Tooltip :id="item.key" :text="item.tooltipText" />
        </div>
    </div>
</template>

<script>
import Tooltip from '@/components/Tooltip.vue'

export default {
    name: 'ChartLegend',

    components: {
        Tooltip,
    },

    inject: ['i18n', 'filters'],

    emits: ['hover', 'toggle'],

    props: {
        items: {
            type: Array,
            default: () => [
                /*
                {
                    key: 'key',
                    name: 'Name',
                    color: 'var(--k-color-red)',
                    type: 'bar',
                    visible: true,
                    tooltipText: 'Tooltip text',
                },
                */
            ],
        },
    },

    methods: {
        hoverSeries(key) {
            this.$emit('hover', key)
        },

        toggleSeries(key) {
            this.$emit('toggle', key)
        },
    },
}
</script>

<style scoped lang="scss">
.chart-legend {
    position: relative;
    z-index: 10;
    display: flex;
    flex-flow: row wrap;
    gap: 0.5rem;
    padding: 0;
}

.legend-item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    --color: var(--color, #000);
    cursor: pointer;
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
        transition: color 0.25s;
    }

    :deep(.q-icon) {
        margin-left: 0.25rem;
        font-size: 0.875rem;
        color: var(--k-color-label);
    }
}
</style>
