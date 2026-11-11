<template>
    <q-field class="k-range" :label="label" model-value=" " borderless bottom-slots>
        <q-range
            v-model="selection"
            type="number"
            :step="1"
            :min="min"
            :max="max"
            color="secondary"
            :marker-labels="markerLabels"
            @change="handleChange"
        />

        <template v-slot:hint>
            <b>{{ selection.min }}</b> bis <b>{{ selection.max }}</b>
        </template>
    </q-field>
</template>

<script>
export default {
    emits: ['update:modelValue', 'update:valueMin', 'update:valueMax'],

    props: {
        label: {
            type: String,
            required: false,
        },

        min: {
            type: Number,
            required: true,
        },

        max: {
            type: Number,
            required: true,
        },

        modelValue: {
            type: Object,
        },

        valueMin: {
            type: Number,
            default: 0,
        },

        valueMax: {
            type: Number,
            default: 0,
        },

        showMarkerLabels: {
            type: Boolean,
            default: false,
        },

        markerSpacing: {
            type: Number,
            default: 5,
        },
    },

    data() {
        return {
            // selection: this.modelValue || { min: this.valueMin, max: this.valueMax },
            // innerSelection: this.modelValue || { min: this.valueMin, max: this.valueMax },
            innerSelection: this.modelValue || { min: this.valueMin, max: this.valueMax },
        }
    },

    computed: {
        selection: {
            get() {
                return this.innerSelection
            },
            set(value) {
                this.innerSelection = value
            },
        },

        markerLabels() {
            const labels = []

            if (!this.showMarkerLabels) {
                return labels
            }

            const every = 1 //this.markerSpacing
            const highlight = 5

            let start = Math.ceil(this.min / every) * every
            for (let i = start; i <= this.max; i += every) {
                const big = i % highlight === 0
                labels.push({ value: i, label: ' ', classes: big ? 'big' : '' })
            }

            return labels
        },
    },

    methods: {
        handleChange(value) {
            if (this.modelValue) {
                if (value.min !== this.modelValue.min || value.max !== this.modelValue.max) {
                    this.$emit('update:modelValue', value)
                }
            } else {
                if (value.min !== this.valueMin) {
                    this.$emit('update:valueMin', value.min)
                }
                if (value.max !== this.valueMax) {
                    this.$emit('update:valueMax', value.max)
                }
            }
            document.getSelection().removeAllRanges()
        },
    },

    watch: {
        modelValue(value) {
            this.innerSelection = value
        },
        valueMin(value) {
            this.innerSelection = { ...this.selection, min: value }
        },
        valueMax(value) {
            this.innerSelection = { ...this.selection, max: value }
        },
    },
}
</script>

<style lang="scss">
.k-range {
    --k-range-track-color: #ccc;
    padding: 0 0.5rem;

    &.q-field {
        &--highlighted {
            .q-field__label {
                color: var(--k-color-label);
            }
        }

        .q-field__control {
            min-height: 0;
        }

        .q-field__bottom {
            padding: 0;
        }
    }

    .q-field__messages {
        font-size: 0.875rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        padding: 0 1rem;

        b {
            color: var(--k-color-section-text);
            font-weight: bold;
            width: 4ch;
        }
    }
}
</style>
