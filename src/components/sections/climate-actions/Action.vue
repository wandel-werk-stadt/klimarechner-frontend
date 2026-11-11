<template>
    <div
        :class="[
            'action',
            action.name,
            {
                unavailable: isDisabled,
            },
        ]"
    >
        <div class="header">
            <q-checkbox
                :model-value="state"
                @update:model-value="(val) => (state = val)"
                size="xs"
                color="black"
            >
                {{ i18n('actions.' + action.name + '.label') }}
            </q-checkbox>

            <Tooltip :id="action.name" :i18n-base="'actions.' + action.name" />
        </div>

        <template v-if="sector">
            <KAmount
                :model-value="inputsDeltaRelative * 100"
                :step="10"
                :min="0"
                :max="100"
                :precision="inputs?.[0]?.precision || 0"
                :previousValue="change[sector]?.previousValue"
                :targetValue="change[sector]?.targetValue"
                :unit="unit"
                :marker-spacing="10"
                @update:model-value="
                    (val) => {
                        inputsDeltaRelative = val / 100
                        state = val > 0
                    }
                "
            />

            <KAmount
                v-for="input of separateInputs"
                :class="['separate-input', input.name]"
                :key="input.slug"
                :model-value="input.deltaRelative * 100"
                :step="10"
                :min="0"
                :max="100"
                left-text="Wärmepumpe"
                right-text="Fernwärme"
                description-mode="ratio"
                :marker-spacing="10"
                @update:model-value="
                    (val) => {
                        updateSeparateInputs(input.name, val / 100)
                    }
                "
            >
                <template v-slot:label> <div class="spacer-lines">durch</div> </template>
            </KAmount>

            <KRange
                :key="'reset-' + calculator.resetCounter"
                :min="calculator.startYear"
                :max="calculator.endYear"
                :marker-spacing="1"
                v-model:valueMin="inputsStartYear"
                v-model:valueMax="inputsEndYear"
                :showMarkerLabels="true"
            />
        </template>
        <template v-else>
            <div class="change">
                <div :class="['sector-change', sector]" v-for="sector of sectorsMain" :key="sector">
                    <div class="row">
                        <span>{{ i18n('sectorsShort.' + sector) }}</span>
                        <span
                            >Von
                            {{
                                filters.number(
                                    change[sector]?.previousValue,
                                    action.mainInputs?.[0]?.precision || 0,
                                )
                            }}
                            auf
                            <b>{{
                                filters.number(
                                    change[sector]?.targetValue,
                                    action.mainInputs?.[0]?.precision || 0,
                                )
                            }}</b>
                            {{ unit }}</span
                        >
                    </div>
                    <template v-if="separateInputs.length > 0">
                        <div :class="['row', 'separate']">
                            <span>durch Wärmepumpen</span>
                            <span>
                                <b>{{
                                    100 -
                                    separateInputs.find((i) => i.sector === sector).deltaRelative *
                                        100
                                }}</b>
                                %
                            </span>
                        </div>

                        <div :class="['row', 'separate']">
                            <span>durch Fernwärme</span>
                            <span>
                                <b>{{
                                    separateInputs.find((i) => i.sector === sector).deltaRelative *
                                    100
                                }}</b>
                                %
                            </span>
                        </div>
                    </template>
                </div>
            </div>
        </template>

        <KCollapse :state="showDetails" ref="collapse">
            <ul class="details">
                <li v-for="item of effects" :key="item.key">
                    <span v-html="item.html"></span>
                    <Tooltip
                        :id="item.key + '-' + action.name"
                        :i18n-base="'effects.' + item.effectKey"
                    />
                </li>
            </ul>

            <!-- <ul class="inputs">
                <li v-for="entry of action.inputs" :key="entry.name">
                    <header>
                        <q-checkbox v-model="entry.active" size="xs" color="black">
                            {{ i18n(entry.name) + ' ' + i18n('sectorsShort.' + entry.sector) }}
                        </q-checkbox>
                    </header>

                    <KRange
                        :min="calculator.startYear"
                        :max="calculator.endYear"
                        :marker-spacing="1"
                        v-model:valueMin="entry.startYear"
                        v-model:valueMax="entry.endYear"
                    />

                    <q-slider
                        :model-value="entry.deltaRelative"
                        :min="0"
                        :step="0.01"
                        :max="1"
                        @change="(val) => (entry.deltaRelative = val)"
                    />

                    <div class="numbers">
                        <q-input
                            :label="
                                'Wert (Basis: ' +
                                filters.number(entry.valueRef || entry.value, 2) +
                                ')'
                            "
                            v-model.number="entry.delta"
                            :prefix="filters.number(entry.value, 2) + ' - '"
                            :suffix="' = ' + filters.number(entry.value - entry.delta, 2)"
                        />
                    </div>
                </li>
            </ul> -->
        </KCollapse>
    </div>
</template>

<script>
import KRange from '@/components/KRange.vue'
import KAmount from '@/components/KAmount.vue'
import KCollapse from '@/components/KCollapse.vue'
import Tooltip from '@/components/Tooltip.vue'
import { useCalculatorStore } from '@/stores/calculator/index'
import { getPathByInputId, sectorsMain } from '@/stores/calculator/shared'

export default {
    components: {
        KRange,
        KAmount,
        KCollapse,
        Tooltip,
    },

    props: {
        action: {
            type: Object,
            required: true,
        },
        sector: {
            type: String,
            required: false,
        },

        showDetails: {
            type: Boolean,
            default: false,
        },
    },

    inject: ['i18n', 'filters'],

    setup() {
        const calculator = useCalculatorStore()

        return {
            calculator,
            actions: calculator.actions,
            sectorsMain,
        }
    },

    data() {
        return {
            change: {},
            unit: '',
        }
    },

    mounted() {
        this.updateDescription()
    },

    computed: {
        // handle inputs or whole action
        state: {
            get() {
                return this.sector ? this.inputs[0].active : this.action.activeState
            },
            set(value) {
                if (this.sector) {
                    this.inputs.forEach((input) => (input.active = value))
                    this.separateInputs.forEach((input) => (input.active = value))
                    return
                }

                this.action.active = value
            },
        },

        isDisabled() {
            return (
                this.action.disabled ||
                this.action.disabledSectors?.includes(this.sector) ||
                (this.sector && !this.inputsValue)
            )
        },

        // handle deltaRelative for all filtered inputs
        inputsDeltaRelative: {
            get() {
                return this.inputs?.[0]?.deltaRelative || 0
            },
            set(value) {
                this.inputs.forEach((input) => (input.deltaRelative = value))
            },
        },

        inputsValue() {
            return !!this.inputs.find((i) => i.main && (i.value || i.valueRef))
        },

        inputsStartYear: {
            get() {
                return this.inputs?.[0]?.startYear
            },
            set(value) {
                this.inputs.forEach((input) => (input.startYear = value))
            },
        },

        inputsEndYear: {
            get() {
                return this.inputs?.[0]?.endYear
            },
            set(value) {
                this.inputs.forEach((input) => (input.endYear = value))
            },
        },

        // filter inputs by sector
        inputs() {
            if (!this.sector) return []
            const sectors = [this.sector]
            if (this.sector === 'public') {
                sectors.push('schools')
            }

            return this.action.inputs.filter(
                (input) => !input.separate && (!input.sector || sectors.includes(input.sector)),
            )
        },

        separateInputs() {
            const sectors = this.sector ? [this.sector] : []

            return this.action.inputs.filter(
                (input) => input.separate && (!this.sector || sectors.includes(input.sector)),
            )
        },

        effects() {
            const list = []
            const actionResults = this.calculator.results[this.action.name]
            const data = Object.assign(
                {
                    'emissions_saved_share[%]': 0,
                    'emissions_change_per_year[k*to_coe]': -0,
                    'invest_total[M*EUR]': 0,
                    'effects_of_reduction[EUR/t]': 0,
                    'direct_effects[M*EUR]': 0,
                    'break_even[a]': 0,
                    'return[%]': 0,
                },
                actionResults?.effects[this.calculator.sectorFocus || 'aggregate'],
            )

            list.push({
                key: 'co2-reduction-relative',
                effectKey: 'co2Reduction[%]',
                html: this.i18n('effects.co2Reduction[%].label', {
                    value: this.effectNumber(
                        this.filters.number(data['emissions_saved_share[%]'], 1),
                        data['emissions_saved_share[%]'],
                    ),
                }),
            })

            list.push({
                key: 'co2-reduction',
                effectKey: 'co2Reduction[k*to_coe]',
                html: this.i18n('effects.co2Reduction[k*to_coe].label', {
                    value: this.effectNumber(
                        this.filters.number(-1 * data['emissions_change_per_year[k*to_coe]'], 1),
                        -1 * data['emissions_change_per_year[k*to_coe]'],
                    ),
                }),
            })
            list.push({
                key: 'investment',
                effectKey: 'investment[EUR]',
                html: this.i18n('effects.investment[EUR].label', {
                    value: this.effectNumber(
                        this.filters.number(data['invest_total[M*EUR]'], 1),
                        data['invest_total[M*EUR]'],
                    ),
                }),
            })
            list.push({
                key: 'costs-of-reduction',
                effectKey: 'effectsOfReduction[EUR/t]',
                html: this.i18n('effects.effectsOfReduction[EUR/t].label', {
                    value: this.effectNumber(
                        data['effects_of_reduction[EUR/t]'] === null
                            ? '—'
                            : this.filters.number(data['effects_of_reduction[EUR/t]'], 1),
                        data['effects_of_reduction[EUR/t]'],
                    ),
                }),
            })
            list.push({
                key: 'direct-effects',
                effectKey: 'directEffects[k*EUR/a]',
                html: this.i18n('effects.directEffects[k*EUR/a].label', {
                    value: this.effectNumber(
                        this.filters.number(data['direct_effects[M*EUR]'], 1),
                        data['direct_effects[M*EUR]'],
                    ),
                }),
            })
            list.push({
                key: 'break-even',
                effectKey: 'breakEven[a]',
                html: this.i18n('effects.breakEven[a].label', {
                    year: this.effectNumber(data['break_even[a]'] || '—', data['break_even[a]']),
                }),
            })
            list.push({
                key: 'return',
                effectKey: 'return[%]',
                html: this.i18n('effects.return[%].label', {
                    percent: this.effectNumber(
                        data['return[%]'] === null
                            ? '—'
                            : this.filters.number(data['return[%]'], 1),
                        data['return[%]'],
                    ),
                }),
            })

            return list
        },
    },

    methods: {
        effectNumber(value, rawValue) {
            return '<i class="' + (rawValue >= 0 ? 'positive' : 'negative') + '">' + value + '</i>'
        },

        updateDescription() {
            const result = {}

            if (this.action.mainInputs?.[0]?.unit) {
                this.unit = this.i18n('units.' + this.action.mainInputs[0].unit)
            } else {
                this.unit = this.getUnit(this.action.mainInputs?.[0]?.id)
            }

            for (let sector of sectorsMain) {
                if (!this.action.absolute) {
                    result[sector] = {
                        previousValue: this.action.value(sector),
                        targetValue: this.action.target(sector),
                    }
                } else {
                    const sectors = [sector]
                    if (sector === 'public') {
                        sectors.push('schools')
                    }

                    result[sector] = sectors.reduce(
                        (res, sector) => {
                            res.previousValue += this.action.value(sector)
                            res.targetValue += this.action.target(sector)
                            return res
                        },
                        {
                            previousValue: 0,
                            targetValue: 0,
                        },
                    )
                }

                if (this.unit === '%') {
                    result[sector].previousValue *= 100
                    result[sector].targetValue *= 100
                }
            }

            this.change = result
        },

        updateSeparateInputs(name, value) {
            if (!this.sector) return []
            const sectors = [this.sector]
            if (this.sector === 'public') {
                sectors.push('schools')
            }

            this.action.inputs.forEach((input) => {
                if (input.separate && input.name === name && sectors.includes(input.sector)) {
                    input.deltaRelative = value
                }
            })
        },

        getUnit(inputId) {
            if (!inputId) {
                return ''
            }

            const path = getPathByInputId(inputId)
            if (!path || !path.length) {
                return ''
            }

            const unit = this.i18n('inputs.' + path[0] + '.unit')
            return unit
        },
    },

    watch: {
        state(value, oldValue) {
            if (!oldValue && value) {
                this.$nextTick(() => {
                    this.$refs.collapse.updateMaxHeight()
                })
            }
        },

        showDetails(value) {
            if (value) {
                this.$refs.collapse.updateMaxHeight()
            }
        },

        'calculator.processing'(value) {
            if (value) {
                return
            }

            this.updateDescription()
        },

        inputsDeltaRelative() {
            this.updateDescription()
        },

        sector() {
            this.updateDescription()
        },
    },
}
</script>

<style scoped lang="scss">
@import '@/assets/tools.scss';

.action {
    position: relative;
    display: flex;
    flex-flow: column;
    padding: 0;
    user-select: none;
    opacity: 1;
    transition: opacity 0.2s;

    &.unavailable {
        opacity: 0.5 !important;
        filter: grayscale(1);
        pointer-events: none;
    }

    &.reduce-heat-demand {
        .header + .k-amount {
            margin-bottom: 5.75rem;
        }
    }

    .header {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 0;
        margin: 0 0 0.5rem;
    }

    .q-checkbox {
        :deep(.q-checkbox__inner) {
            margin-left: -0.25rem;
        }

        :deep(.q-checkbox__label) {
            line-height: 1;
        }
    }

    :deep(.q-icon) {
        margin-left: auto;
        color: var(--k-color-label-subtle);
    }

    :deep(.heat-pump-district-heating-distribution) {
        margin-bottom: 0.5rem;

        .q-field__label {
            width: 100%;
        }
    }
    :deep(.spacer-lines) {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        &:after,
        &:before {
            content: ' ';
            display: block;
            width: auto;
            flex: auto 1 0;
            height: 1px;
            background-color: var(--k-color-section-border);
        }
    }

    .header + .k-amount {
        margin-bottom: 0.5rem;
    }

    .k-range {
        margin-top: 0.5rem;
    }

    :deep(.collapse) {
        margin: 0.25rem 0 0;

        .content {
            text-align: center;
        }
    }

    :deep(.details) {
        display: inline-block;
        width: auto;
        max-width: 100%;
        min-height: 175px;
        color: var(--k-color-label);
        font-size: 0.75rem;
        text-align: left;
        padding: 0.5rem 0;
        @include font-family('numeric');

        li {
            position: relative;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin-top: 0.75rem;
            line-height: 1;
            // padding-right: 1rem;

            &:first-child {
                margin-top: 0;
            }

            > span {
                display: inline-block;
                max-width: calc(100% - 1rem);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .q-icon {
            // position: absolute;
            // right: 0;
            font-size: 0.9375rem;
            margin-left: 0.25rem;
            margin-top: -0.125rem;
            vertical-align: middle;
        }

        span {
            i {
                font-size: 0.875rem;
                font-weight: 500;
                font-style: normal;
                color: var(--k-color-primary-base);

                &.negative {
                    color: var(--k-color-red);
                }
            }

            b {
                font-weight: 700;
                color: #000;
                line-height: 1.2;
            }
        }
    }

    .change {
        padding: 0 0 0.875rem;
        margin: 0 0 auto;
        border-bottom: 1px solid var(--k-color-section-border);
    }

    .sector-change {
        @include font-family('numeric');
        // display: grid;
        // grid-template-columns: min-content 1fr;
        font-size: 0.75rem;
        font-weight: 400;
        line-height: 1;
        text-align: left;

        .row {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.375rem;
        }

        &.private {
            span {
                margin-top: 0;
            }
        }

        .separate {
            span:first-child {
                font-weight: 400;
                color: var(--k-color-label);
                white-space: nowrap;

                &::before {
                    content: '–';
                    margin-right: 0.25rem;
                }
            }
        }

        span {
            display: block;
            // grid-column: 1;

            &:first-child {
                font-weight: 700;
            }

            &:last-child {
                text-align: right;
                // grid-column: 2;
                color: var(--k-color-label);

                b {
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: #000;
                }
            }
        }
    }
}
</style>
