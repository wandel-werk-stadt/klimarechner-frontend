<template>
    <q-markup-table class="action-ranking" dense :dark="false" wrap-cells>
        <thead>
            <tr>
                <th></th>
                <th
                    v-for="col in columns"
                    :key="col"
                    class="sortable"
                    @click.prevent.stop="() => updateSortColumn(col)"
                >
                    <span>
                        <span :class="['sort', { active: sortByColumn === col }]">
                            <q-icon
                                v-if="sortOrder === 'desc'"
                                name="o_arrow_downward"
                                class="down"
                            />
                            <q-icon v-else name="o_arrow_upward" class="up" />
                        </span>
                        {{ i18n('actionList.' + col + '.label') }}
                    </span>
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
    name: 'ActionRanking',

    inject: ['i18n', 'filters'],

    setup() {
        const calculator = useCalculatorStore()

        return {
            calculator,
        }
    },

    props: {
        max: {
            type: Number,
            default: 5,
        },
    },

    data() {
        return {
            actions: [],
            columns: ['emissionsSaved', 'invest', 'effectsOfReduction', 'return', 'directEffects'],

            sortByColumn: 'emissionsSaved',
            sortOrder: 'desc',
        }
    },

    mounted() {
        this.actions = this.prepareActions()
        this.prepareActionsDebounced = debounce(() => (this.actions = this.prepareActions()), 1000)

        if (this.calculator.actionsActive.length > 0) {
            this.prepareActions()
        }
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
            return this.max ? this.sortedActions.slice(0, this.max) : this.sortedActions
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
                    invest: this.effects(action.name, 'invest_total[M*EUR]'),
                    effectsOfReduction: this.effects(action.name, 'effects_of_reduction[EUR/t]'),
                    emissionsSaved: this.effects(action.name, 'emissions_saved_share[%]'),
                    return: this.effects(action.name, 'return[%]'),
                    directEffects: this.effects(action.name, 'direct_effects[M*EUR]') * 1000,
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
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.q-markup-table {
    position: relative;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
    border-radius: 0.25rem;
    border: 1px solid var(--k-color-section-border);
    // box-shadow: 0 0.125rem 0.25rem 0.125rem rgba(#000, 0.125);

    :deep(.q-table) {
        // display: block;
        width: 100%;
        line-height: 1.2;
        color: var(--k-color-section-text-subtle);
        // border-radius: 0.25rem;

        thead {
            background-color: var(--k-color-primary-base);
            color: var(--k-color-primary-base-text);
        }

        thead th {
            font-size: 0.875rem;
            line-height: 1rem;
            font-weight: 400;
            line-height: 1;
            padding: 0.5rem;
            text-align: right;
            width: calc(80% / 6);

            &.sortable {
                cursor: pointer;
                user-select: none;
            }

            > span {
                display: block;
                white-space: nowrap;

                .sort {
                    display: inline-block;
                    // width: 1ch;
                    font-size: 1.125rem;
                    line-height: 1;
                    // margin-right: 0.25rem;
                    vertical-align: sub;
                    opacity: 0;
                    transition: opacity 0.25s;

                    &.active {
                        opacity: 1;
                    }

                    .q-icon {
                        display: block;
                    }
                }
            }

            &:first-child {
                // border-top-left-radius: 0.25rem;
                text-align: left;
                font-size: 0.9375rem;
                text-transform: none;
                width: 20%;
            }

            &:last-child {
                // border-top-right-radius: 0.25rem;
            }
        }

        tbody {
            @include font-family('numeric');
        }

        tbody td {
            text-align: right;

            &:first-child {
                padding-left: 0.5rem;
                text-align: left;
                color: var(--k-color-section-text-subtle);
            }

            &:last-child {
                padding-right: 0.5rem;
            }
        }

        tbody td {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--k-color-primary-base);

            .unit {
                font-size: 0.75rem;
                font-weight: 300;
                color: var(--k-color-section-text-subtle);
            }
        }

        thead tr th,
        tbody tr td {
            border-color: var(--k-color-section-border);
        }

        tbody {
            tr:last-child td {
                // border-bottom: 1px solid var(--k-color-section-border);

                &:first-child {
                    // border-bottom-left-radius: 0.25rem;
                }

                &:last-child {
                    // border-bottom-right-radius: 0.25rem;
                }
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
