<template>
    <q-markup-table class="action-list" dense :dark="false" wrap-cells>
        <thead>
            <tr>
                <th>Top Maßnahmen</th>
                <th
                    v-for="col in columns"
                    :key="col"
                    class="sortable"
                    @click.prevent.stop="() => updateSortColumn(col)"
                >
                    <span
                        >{{ i18n('actionList.' + col + '.label') }}
                        <template v-if="sortByColumn === col">
                            {{ sortOrder === 'desc' ? '▾' : '▴' }}
                        </template></span
                    >
                </th>
            </tr>
        </thead>
        <transition-group v-if="topActions" name="list-shuffle" tag="tbody">
            <tr v-for="item of topActions" :key="item.name">
                <td>{{ item.name }}</td>
                <td v-for="col in columns" :key="col">
                    {{ item[col] === null ? '—' : filters.number(item[col], 1) }}
                    <span class="unit">{{ i18n('actionList.' + col + '.unit') }}</span>
                </td>
            </tr>
        </transition-group>
    </q-markup-table>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator'
import { debounce } from 'quasar'

export default {
    name: 'ActionList',

    inject: ['i18n', 'filters'],

    setup() {
        const calculator = useCalculatorStore()

        return {
            calculator,
        }
    },

    props: {
        chart: {
            type: String,
            default: 'emissions',
        },
    },

    data() {
        return {
            actions: [],
            sortByColumn: 'return',
            sortOrder: 'desc',
        }
    },

    mounted() {
        this.actions = this.prepareActions()
        this.prepareActionsDebounced = debounce(() => (this.actions = this.prepareActions()), 1000)
    },

    computed: {
        sortedActions() {
            const sorted = [].slice.call(this.actions)
            sorted.sort((a, b) => {
                const aValue = a[this.sortByColumn]
                const bValue = b[this.sortByColumn]

                if (aValue === null) {
                    return 1
                } else if (bValue === null) {
                    return -1
                }

                return this.sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })

            return sorted
        },

        topActions() {
            return this.sortedActions.slice(0, 3)
        },

        columns() {
            const cols = {
                emissions: ['emissionsSaved', 'effectsOfReduction'],
                economy: ['effectsOfReduction', 'return'],
                jobs: ['effectsOfReduction', 'return'],
            }[this.chart]

            return cols
        },
    },

    methods: {
        effects(actionName, effectName) {
            const sector = this.calculator.sectorFocus || 'aggregate'
            const effects = this.calculator.results?.[actionName]?.effects?.[sector]
            if (!effects) return 0

            return effects[effectName]
        },

        prepareActions() {
            const list = this.calculator.actions.filter((a) => !!a.group && a.active)

            return list.map((action) => {
                return {
                    ...action,
                    name: this.i18n('actions.' + action.name + '.label'),
                    emissionsSaved: this.effects(action.name, 'emissions_saved_share[%]'),
                    effectsOfReduction: this.effects(action.name, 'effects_of_reduction[EUR/t]'),
                    return: this.effects(action.name, 'return[%]'),
                }
            })
        },

        updateSortColumn(column) {
            if (this.sortByColumn === column) {
                this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc'
            } else {
                this.sortByColumn = column
                this.sortOrder = 'desc'
            }
        },
    },

    watch: {
        'calculator.results': {
            handler() {
                if (this.prepareActionsDebounced) {
                    this.prepareActionsDebounced()
                }
            },
            deep: true,
        },
        'calculator.sectorFocus': {
            handler() {
                if (this.prepareActionsDebounced) {
                    this.prepareActionsDebounced()
                }
            },
        },

        chart: {
            handler(value) {
                const settings = {
                    emissions: ['emissionsSaved', 'desc'],
                    economy: ['return', 'desc'],
                    jobs: ['return', 'desc'],
                }[value]

                this.sortByColumn = settings[0]
                this.sortOrder = settings[1]
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.action-list {
}

.q-markup-table {
    position: relative;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;

    :deep(.q-table) {
        // display: block;
        width: 100%;
        line-height: 1.2;
        font-weight: 500;

        thead th {
            font-size: 0.875rem;
            font-weight: 700;

            &.sortable {
                cursor: pointer;
                user-select: none;
            }

            span {
                display: block;
                white-space: nowrap;
            }
        }

        thead th,
        tbody td {
            text-align: left;

            &:first-child {
                padding-left: 0;
            }

            &:last-child {
                padding-right: 0;
                text-align: right;
            }
        }

        tbody td {
            font-size: 0.8125rem;
        }

        thead tr th,
        tbody tr td {
            border-color: var(--k-color-section-border);
        }

        tbody {
            tr:last-child td {
                border-bottom: 1px solid var(--k-color-section-border);
            }

            overflow: hidden;
        }

        tbody tr td:nth-child(n + 2) {
            white-space: nowrap;
        }

        .unit {
            font-weight: 400;
            font-size: 0.75rem;
        }
    }
}
</style>
