<template>
    <q-field
        :class="['k-amount', 'mode-' + descriptionMode]"
        :label="label"
        :label-slot="!!$slots.label"
        model-value=" "
        borderless
        bottom-slots
    >
        <q-slider
            v-model="selection"
            type="number"
            :step="step"
            :min="min"
            :max="max"
            :marker-labels="markerLabels"
            :selection-color="descriptionMode === 'ratio' ? 'transparent' : 'primary'"
            @change="handleChange"
        />

        <template v-slot:label>
            <slot name="label" /><template v-if="!$slots.label">{{ label }}</template>
        </template>

        <template v-slot:hint
            ><div v-html="description" :class="'mode-' + descriptionMode"></div
        ></template>
    </q-field>
</template>

<script>
export default {
    emits: ['update:modelValue', 'update:valueMin', 'update:valueMax'],

    inject: ['filters'],

    props: {
        label: {
            type: String,
        },

        min: {
            type: Number,
            default: 0,
            required: true,
        },

        max: {
            type: Number,
            default: 1,
            required: true,
        },

        step: {
            type: Number,
            default: 1,
            required: true,
        },

        unit: {
            type: String,
            required: false,
        },

        precision: {
            type: Number,
            default: 0,
        },

        previousValue: {
            type: Number,
            default: 0,
            required: false,
        },

        targetValue: {
            type: Number,
            required: false,
        },

        // for ratio mode
        leftText: {
            type: String,
            required: false,
        },

        rightText: {
            type: String,
            required: false,
        },

        modelValue: {
            type: Number,
        },

        valueMin: {
            type: Number,
            default: 0,
        },

        valueMax: {
            type: Number,
            default: 0,
        },

        markerSpacing: {
            type: Number,
            default: 1,
        },

        descriptionMode: {
            type: String,
            default: 'to', // to | of | ratio
        },
    },

    data() {
        return {
            innerValue: this.modelValue || 0,
        }
    },

    computed: {
        selection: {
            get() {
                return this.innerValue
            },
            set(value) {
                this.innerValue = value
            },
        },

        markerLabels() {
            const labels = []
            const every = this.markerSpacing
            const highlight = 5

            let start = Math.ceil(this.min / every) * every
            for (let i = start; i <= this.max; i += every) {
                const big = i % highlight === 0
                labels.push({ value: i, label: ' ', classes: big ? 'big' : '' })
            }

            return labels
        },

        description() {
            const value = this.filters.number(this.selection, this.precision)
            if (this.descriptionMode === 'of') {
                return `Um <b>${value}</b> ${this.unit}`
            } else if (this.descriptionMode === 'ratio') {
                return `<span><span><b>${this.max - value}</b>%</span>${
                    this.leftText
                }</span> <span><span><b>${value}</b>%</span>${this.rightText}</span>`
            }

            const p = this.precision
            const from = this.filters.number(this.previousValue, p)
            const to =
                this.targetValue !== undefined
                    ? this.filters.number(this.targetValue, p)
                    : this.filters.number(value, p)

            return `Von ${from} auf <b>${to}</b> ${this.unit}`
        },
    },

    methods: {
        handleChange(value) {
            this.$emit('update:modelValue', value)
            document.getSelection().removeAllRanges()
        },
    },

    watch: {
        modelValue(value) {
            this.selection = value
        },
    },
}
</script>

<style lang="scss">
.k-amount {
    --k-range-track-color: #ccc;
    padding: 0 0.5rem;

    &.q-field {
        &--highlighted {
            .q-field__label {
                color: var(--k-color-label);
            }
        }

        &.mode-ratio {
            padding-bottom: 2rem;
        }

        .q-field__control {
            min-height: 0;
        }

        .q-field__bottom {
            padding: 0;
            margin: 0 -0.25rem;
            font-weight: 400;
            font-size: 0.875rem;
            user-select: none;

            b {
                display: inline-block;
                font-weight: 700;
                min-width: 2ch;
            }

            div {
                display: block;
                text-align: center;

                &.mode-ratio {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    > span {
                        flex: none;
                        text-align: left;

                        &:last-child {
                            text-align: right;
                        }

                        span {
                            display: block;
                        }
                    }
                }
            }
        }
    }
}
</style>
