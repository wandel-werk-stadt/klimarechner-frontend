<template>
    <q-card class="layer layer-our-city">
        <div class="content">
            <q-card-section class="section-header">
                <header>
                    <h3>Ihre Stadt</h3>
                    <p>Diese Daten lassen sich auch später noch anpassen.</p>
                </header>
                <q-btn icon="o_close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="section-input">
                <q-input
                    v-model="nameInternal"
                    type="text"
                    label="Name der Stadt"
                    placeholder=""
                    hint="Der Name dient lediglich als Referenz."
                />

                <q-input
                    v-model="populationInternal"
                    type="text"
                    ref="popInput"
                    :class="['population']"
                    min="1000"
                    step="1"
                    label="Anzahl der Einwohner"
                    v-number="{
                        decimal: ',',
                        separator: '.',
                        precision: 0,
                        minimumFractionDigits: 0,
                    }"
                    :rules="[validatePopulation]"
                />
            </q-card-section>

            <q-card-actions>
                <q-btn color="black" unelevated rounded @click="submit"
                    >Durchschnittliche Werte verwenden</q-btn
                >
                <p>
                    Über die Einwohnerzahl werden durchschnittliche Werte für Deutschland (anteilig)
                    für Ihre Stadt als Ausgangswerte geladen. Diese Basisdaten können Sie anpassen
                    für ein genaueres Ergebnis.
                </p>
            </q-card-actions>
        </div>
    </q-card>
</template>

<script>
export default {
    inject: ['showNextLayer', 'validatePopulation'],

    props: {
        name: {
            type: String,
            default: '',
        },
        population: {
            type: String,
            default: '',
        },
    },

    methods: {
        submit() {
            this.$refs.popInput.validate()
            if (this.$refs.popInput.hasError) {
                return
            }

            this.showNextLayer()
        },
    },

    computed: {
        nameInternal: {
            get() {
                return this.name
            },
            set(value) {
                this.$emit('update:name', value)
            },
        },

        populationInternal: {
            get() {
                return this.population
            },
            set(value) {
                this.$emit('update:population', value)
            },
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.layer-our-city {
    :deep(.q-card__actions) {
        background: url('/intro/map-germany.svg') no-repeat center center;
        background-size: auto 100%;
        height: 25rem;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        p {
            font-size: 0.9375rem;
            padding: 1rem 1.5rem;
            text-align: center;
            color: var(--k-color-label);
        }
    }

    .section-input {
        display: flex;
        flex-flow: row nowrap;
        gap: 1.5rem;

        .q-input {
            width: calc(50% - 1.5rem / 2);
        }
    }

    // :deep(.q-input) {
    //     &.q-field--labeled:not(.q-field--float) .q-field__native::placeholder,
    //     &.q-field--labeled:not(.q-field--float) .q-field__input::placeholder {
    //         color: var(--k-color-placeholder);
    //     }

    //     &:focus .q-placeholder::placeholder {
    //         opacity: 0.15;
    //     }
    // }
}
</style>
