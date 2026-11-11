<template>
    <div class="data-akkordeons">
        <q-list>
            <q-expansion-item
                v-for="tab of tabs"
                :key="tab.name"
                v-model="expanded[tab.name]"
                @update:model-value="updateExpanded(tab.name, $event)"
                switch-toggle-side
                :label="tab.title"
                @before-show="expandedBuffered[tab.name] = true"
                @after-hide="expandedBuffered[tab.name] = false"
            >
                <div v-if="expandedBuffered[tab.name]">
                    <q-table
                        :class="['data-table', 'buildings-and-heat']"
                        flat
                        dense
                        v-for="table of tab.tables"
                        :key="table.name"
                        :columns="table.settings.columns"
                        :rows="table.rows"
                        row-key="id"
                        :pagination="{
                            page: 1,
                            rowsPerPage: 50,
                        }"
                        :rows-per-page-options="[50]"
                        :dark="false"
                    >
                        <template v-slot:body="props">
                            <q-tr
                                :props="props"
                                :class="[props.row?.slug, { calculated: props.row?.calculated }]"
                            >
                                <q-td
                                    v-for="(col, index) of props.cols"
                                    :key="col.name"
                                    :props="props"
                                    :class="[
                                        col.value?.sector || '',
                                        {
                                            'td-input': col.value?.key,
                                            changed:
                                                city.changedDataKeys[
                                                    col.value?.sector
                                                        ? col.value?.key + '.' + col.value?.sector
                                                        : col.value?.key
                                                ],
                                        },
                                    ]"
                                >
                                    <div>
                                        <q-input
                                            v-if="col.value?.key && props.row?.unit !== '%'"
                                            dense
                                            :model-value="filters.number(col.value.value)"
                                            @update:model-value="inputValues[col.value.id] = $event"
                                            @blur="(ev) => updateValue(col)"
                                            @keyup.enter="(ev) => updateValue(col)"
                                            type="text"
                                            v-number="numberFormat"
                                            :disable="!!props.row?.calculated"
                                        />
                                        <q-input
                                            v-else-if="col.value?.key && props.row?.unit === '%'"
                                            dense
                                            :model-value="filters.number(col.value.value * 100)"
                                            @update:model-value="
                                                inputValues[col.value.id] = filters.number(
                                                    filters.parseNumber($event) / 100,
                                                    4,
                                                )
                                            "
                                            @blur="(ev) => updateValue(col)"
                                            @keyup.enter="(ev) => updateValue(col)"
                                            type="text"
                                            v-number="numberFormat"
                                            :disable="!!props.row?.calculated"
                                        />
                                        <span
                                            v-else-if="col.name === 'value'"
                                            class="single-value"
                                            >{{
                                                filters.number(
                                                    props.row?.unit === '%'
                                                        ? col.value * 100
                                                        : col.value,
                                                    2,
                                                )
                                            }}</span
                                        >
                                        <span v-else-if="index === 0">
                                            <Tooltip
                                                :id="props.row?.slug"
                                                :i18n-base="
                                                    (props.row?.calculated
                                                        ? 'dataInputs.'
                                                        : 'inputs.') + props.row?.id
                                                "
                                            />
                                            {{ col.value }}</span
                                        >
                                        <span v-else>{{ col.value }}</span>
                                        <span
                                            class="unit"
                                            v-if="col.value?.key || col.name === 'value'"
                                            >{{ props.row?.unit }}</span
                                        >
                                    </div>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                    <div class="data-actions">
                        <p class="note">
                            Sobald Werte angepasst werden und damit vom bundesweiten Durchschnitt
                            (siehe Quellenangaben) abweichen, werden sie gelb hinterlegt.
                        </p>

                        <q-btn @click="() => resetTable(tab.name)" rounded outline class="discreet"
                            >Werte zurücksetzen</q-btn
                        >

                        <q-btn
                            @click="updateCalculations"
                            color="primary"
                            :loading="calculator.processing"
                            >Berechnen</q-btn
                        >
                    </div>
                </div>
            </q-expansion-item>
        </q-list>

        <q-dialog
            v-model="showResetDataDialog"
            transition-show="jump-up"
            transition-hide="jump-down"
        >
            <q-card>
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Einwohnerzahl geändert</div>
                    <q-space />
                    <q-btn icon="o_close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="row items-center">
                    <span
                        >Sie haben die Einwohnerzahl geändert. Möchten Sie die weiteren Basiswerte
                        auf die statistischen Durchschnittswerte für Deutschland zurücksetzen
                        lassen?<br />
                        <br />
                        Dies ermöglicht Ihnen einen schnelleren Start und verhindert ungewollte
                        Fehler.</span
                    >
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Durchschnittswerte übernehmen"
                        color="primary"
                        @click.prevent.stop="resetTable"
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator/index'
import { useCityStore } from '@/stores/city'
import Tooltip from '@/components/Tooltip.vue'
import useDataTables from '@/composables/data-tables.js'

export default {
    name: 'DataAkkordeons',

    components: {
        Tooltip,
    },

    inject: ['i18n', 'filters'],

    setup() {
        const calculator = useCalculatorStore()
        const city = useCityStore()
        const { tabs } = useDataTables()

        window.city = city

        return {
            calculator,
            city,
            tabs,
        }
    },

    data() {
        return {
            expanded: {},
            expandedBuffered: {},
            inputValues: {},

            numberFormat: {
                decimal: ',',
                separator: '',
                precision: 2,
                minimumFractionDigits: 2,
                prefill: false,
                masked: false,
            },

            showResetDataDialog: false,
        }
    },

    methods: {
        updateCalculations() {
            if (this.calculator.processing) {
                return
            }

            this.city.updateCurrentData()
        },

        updateExpanded(name) {
            for (const key in this.expanded) {
                if (key !== name) {
                    this.expanded[key] = false
                }
            }
        },

        updateValue(cell) {
            const { id, key, sector } = cell.value

            let value = this.inputValues[id || key]
            if (value === undefined) {
                return
            }

            if (key === 'buildings/base_data/inhabitants[k]' && sector === 'private') {
                this.showResetDataDialog = true
            }

            // console.log(
            //     'update',
            //     key,
            //     sector,
            //     !!this.city.data[key]?.[sector],
            //     value,
            //     parseFloat(value),
            //     this.filters.parseNumber(value),
            // )

            if (typeof value === 'string') {
                value = this.filters.parseNumber(value)
            }

            if (sector) {
                if (this.city.data[key]?.[sector] !== undefined) {
                    this.city.data[key][sector] = value
                }
            } else {
                if (this.city.data[key] !== undefined) {
                    this.city.data[key] = value
                }
            }

            delete this.inputValues[id || key]
        },

        resetTable(tabName) {
            let keys = Object.keys(this.city.data)

            if (tabName === 'buildingsAndHeat') {
                keys = keys.filter((k) => k.startsWith('buildings/'))
            } else if (tabName === 'energy') {
                keys = keys.filter((k) => k.startsWith('energy/'))
            } else if (tabName === 'mobility') {
                keys = keys.filter((k) => k.startsWith('mobility/'))
            }

            this.city.resetDataToDataStats(keys)
        },
    },
}
</script>

<style lang="scss">
@import 'src/assets/tools.scss';

.data-akkordeons {
    .q-list {
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }

    .q-expansion-item {
        background-color: var(--k-color-primary-base);
        color: var(--k-color-primary-base-text);
        border-radius: 0.25rem;
        overflow: hidden;
        box-shadow: 0 0.125rem 0.25rem 0.125rem rgba(#000, 0.125);

        .q-expansion-item__container {
            font-size: 0.9375rem;
            font-weight: 400;

            .q-item {
                min-height: 2rem;
            }

            .q-item__section--avatar {
                min-width: 0;
                padding: 0 0.5rem 0 0;
            }
        }

        .q-expansion-item__content {
            background-color: #fff;
        }
    }

    .q-table__container {
        border-radius: 0;
    }

    .q-input {
        width: 4.25rem;
        margin-bottom: -1px;

        input {
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 1;
            color: #000;
            text-align: right;
            -moz-appearance: textfield;
            padding: 4px 0;

            &[disabled] {
                cursor: default !important;
            }

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }

        &.q-field--disabled .q-field__inner {
            cursor: default;
        }

        .q-field__control {
            height: 2rem;
        }
    }

    .single-value {
        width: 4.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1;
    }

    .unit {
        display: inline-block;
        font-size: 0.75rem;
        @include font-family('numeric');
        color: var(--k-color-label);
        margin-bottom: 4px;
    }

    .q-table__middle {
        overflow: hidden;
    }

    .q-table__bottom {
        display: none;
    }

    .q-table {
        font-size: 0.875rem;
        font-weight: 400;

        thead {
            th {
                text-align: center;
                color: var(--k-color-label);
                background-color: var(--k-color-table-light);
                text-transform: uppercase;

                &:first-child {
                    width: 235px;
                    // max-width: 235px;
                }

                &:nth-child(n + 2) {
                    width: 7.25rem;
                }

                // &:last-child {
                //     width: 100%;
                // }
            }
        }

        tbody {
            tr {
                &.buildings-base_data-inhabitants .private {
                    background-color: color-mix(
                        in srgb,
                        var(--k-color-secondary-base) 25%,
                        transparent
                    );
                }

                td {
                    font-size: 0.875rem;
                    padding: 0.375rem 0.25rem 0.375rem;
                    cursor: default;
                    border-bottom: 1px solid var(--k-color-section-border);
                    background-color: #fff;
                    transition: background-color 0.25s;
                    vertical-align: bottom;

                    &:first-child {
                        padding-left: 0.625rem;

                        // span {
                        // max-width: 220px;
                        //     display: block;
                        //     text-overflow: ellipsis;
                        //     overflow: hidden;
                        // }
                        div {
                            width: 100%;
                            // width: 180px;
                            // max-width: 235px;

                            span {
                                position: relative;
                                display: block;
                                padding-left: 1.5rem;

                                i {
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                }
                            }
                        }
                    }

                    &:last-child {
                        padding-right: 0.625rem;
                    }

                    div {
                        display: flex;
                        flex-flow: row nowrap;
                        align-items: flex-end;
                        gap: 0.25rem;
                        white-space: wrap;
                    }

                    &.td-input {
                        vertical-align: bottom;
                        cursor: default;
                        padding-top: 0;
                        padding-bottom: 0;

                        &.changed {
                            // background-color: color-mix(
                            //     in srgb,
                            //     var(--k-color-primary-base) 25%,
                            //     transparent
                            // ) !important;

                            .q-input {
                                // input {
                                //     color: var(--k-color-primary-base);
                                // }

                                .q-field__control:before {
                                    border-bottom: 2px solid var(--k-color-secondary-base);
                                }
                            }
                        }

                        // span {
                        //     .q-icon {
                        //         color: var(--k-color-label-subtle);
                        //         margin-right: 0.125rem;
                        //         vertical-align: sub;
                        //         font-size: 1.125rem;
                        //     }
                        // }
                    }
                }

                &:hover:not(.calculated) {
                    td {
                        background-color: var(--k-color-gray-100);
                    }
                }

                &.calculated {
                    td {
                        background-color: var(--k-color-gray-100);
                        color: var(--k-color-gray-600);
                    }
                }

                // &:nth-child(odd) {
                //     td {
                //         background-color: var(--k-color-gray-100);
                //     }

                //     &:hover {
                //         td {
                //             background-color: var(--k-color-gray-200);
                //         }
                //     }
                // }
            }
        }
    }

    .data-actions {
        background-color: #fff;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding: 0.5rem 1rem;
        gap: 1rem;

        .note {
            color: var(--k-color-label);
            font-size: 0.75rem;
            line-height: 1.2;
        }

        .q-btn {
            white-space: nowrap;
        }
    }
}
</style>
