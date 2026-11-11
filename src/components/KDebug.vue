<template>
    <section>
        <q-tabs v-model="tab" inline-label align="left" dense>
            <q-tab
                name="inputs"
                icon="o_login"
                label="Inputs"
                :class="{ 'bg-primary': tab === 'inputs', 'text-white': tab === 'inputs' }"
            />
            <q-tab
                name="actions"
                icon="o_settings_applications"
                label="Maßnahmen"
                :class="{ 'bg-primary': tab === 'actions', 'text-white': tab === 'actions' }"
            />
            <q-tab
                name="outputs"
                icon="o_logout"
                label="Outputs"
                :class="{ 'bg-primary': tab === 'outputs', 'text-white': tab === 'outputs' }"
            />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel :name="name" v-for="(table, name) in tables" :key="name">
                <q-table
                    :class="['debug-table', name]"
                    flat
                    bordered
                    dense
                    :columns="table.settings.columns"
                    :rows="table.rows"
                    row-key="id"
                    :pagination="{
                        page: 1,
                        rowsPerPage: 45,
                    }"
                    :rows-per-page-options="[15]"
                >
                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th auto-width />
                            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td auto-width>
                                <q-btn
                                    v-if="name === 'actions' || name === 'outputs'"
                                    size="sm"
                                    color="primary"
                                    round
                                    dense
                                    outline
                                    @click="
                                        expanded[name + '.' + props.row.category] =
                                            !expanded[name + '.' + props.row.category]
                                    "
                                    :icon="
                                        expanded[name + '.' + props.row.category]
                                            ? 'o_remove'
                                            : 'o_add'
                                    "
                                />
                            </q-td>
                            <q-td
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                                :title="col.field === 'name' ? props.row.id : ''"
                            >
                                {{ col.value }}
                            </q-td>
                        </q-tr>
                        <q-tr v-show="expanded[name + '.' + props.row.category]" :props="props">
                            <q-td colspan="100%">
                                <q-table
                                    :class="['debug-table-sub', props.row.category]"
                                    flat
                                    bordered
                                    dense
                                    :rows="props.row.subRows"
                                    :columns="table.settings.subColumns"
                                    row-key="name"
                                    :pagination="{
                                        page: 1,
                                        rowsPerPage: 0,
                                    }"
                                    :rows-per-page-options="[]"
                                >
                                    <template v-slot:body="props">
                                        <q-tr :props="props">
                                            <q-td
                                                v-for="col in props.cols"
                                                :key="col.name"
                                                :props="props"
                                                :title="col.field === 'name' ? props.row.id : ''"
                                            >
                                                {{ col.value }}
                                            </q-td>
                                        </q-tr>
                                    </template>
                                </q-table>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-tab-panel>
        </q-tab-panels>
    </section>
</template>

<script>
import { useCalculatorStore } from '@/stores/calculator/index'
import { sectors, getPathByInputId, getPathByInputIdWithSector } from '@/stores/calculator/shared'

export default {
    inject: ['i18n', 'filters'],

    setup() {
        const calculator = useCalculatorStore()
        return {
            calculator,
        }
    },

    data() {
        return {
            tab: 'actions',
            expanded: {},
        }
    },

    computed: {
        tables() {
            return {
                inputs: {
                    settings: this.inputsSettings,
                    rows: this.inputsRows,
                },
                actions: {
                    settings: this.actionsSettings,
                    rows: this.actionsRows,
                },
                outputs: {
                    settings: this.outputsSettings,
                    rows: this.outputsRows,
                },
            }
        },

        inputsSettings() {
            return {
                columns: [
                    // { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
                    {
                        name: 'name',
                        label: 'Name',
                        field: 'name',
                        align: 'left',
                        sortable: true,
                    },
                    {
                        name: 'unit',
                        label: 'Einheit',
                        field: 'unit',
                        align: 'left',
                    },
                    {
                        name: 'private',
                        label: 'Private',
                        field: 'private',
                        align: 'right',
                    },
                    {
                        name: 'industry',
                        label: 'Industry',
                        field: 'industry',
                        align: 'right',
                    },
                    {
                        name: 'public',
                        label: 'Public',
                        field: 'public',
                        align: 'right',
                    },
                    {
                        name: 'schools',
                        label: 'Schools',
                        field: 'schools',
                        align: 'right',
                    },
                    {
                        name: 'value',
                        label: 'Wert',
                        field: 'value',
                        align: 'right',
                    },
                ],
            }
        },
        actionsSettings() {
            return {
                columns: [
                    {
                        name: 'name',
                        label: 'Maßnahme',
                        field: 'category',
                        align: 'left',
                        sortable: true,
                    },
                ],
                subColumns: [
                    {
                        name: 'name',
                        label: 'Name',
                        field: 'name',
                        align: 'left',
                        headerStyle: 'width:1%; min-width: 155px;',
                        sortable: true,
                    },
                    {
                        name: 'unit',
                        label: 'Einheit',
                        field: 'unit',
                        align: 'left',
                        headerStyle: 'width:1%;',
                    },
                    {
                        name: 'sector',
                        label: 'Sektor',
                        field: 'sector',
                        align: 'left',
                        headerStyle: 'width:1%;',
                        sortable: true,
                    },
                    { name: 'timeframe', label: 'Zeitraum', field: 'timeframe', align: 'left' },
                    { name: 'value', label: 'Ausgangswert', field: 'value', sortable: true },
                    { name: 'valueRef', label: 'Basiswert', field: 'valueRef', sortable: true },
                    { name: 'delta', label: 'Delta', field: 'delta', sortable: true },
                    {
                        name: 'result',
                        label: 'Zielwert',
                        field: 'result',
                        sortable: true,
                    },
                ],
            }
        },
        outputsSettings() {
            const yearColumns = []
            for (const year of this.calculator.yearRangeCalculated) {
                yearColumns.push({
                    name: 'year-' + year,
                    label: year,
                    field: 'year-' + year,
                    align: 'right',
                })
            }

            return {
                columns: [
                    {
                        name: 'name',
                        label: 'Kategorie',
                        field: 'category',
                        align: 'left',
                        sortable: true,
                    },
                ],
                subColumns: [
                    {
                        name: 'name',
                        label: 'Name',
                        field: 'name',
                        align: 'left',
                        headerStyle: 'width:1%; min-width: 155px;',
                        sortable: true,
                    },
                    {
                        name: 'unit',
                        label: 'Einheit',
                        field: 'unit',
                        align: 'left',
                        headerStyle: 'width:1%;',
                    },
                    {
                        name: 'sector',
                        label: 'Sektor',
                        field: 'sector',
                        align: 'left',
                        headerStyle: 'width:1%;',
                        sortable: true,
                    },
                    {
                        name: 'delta',
                        label: 'Delta',
                        field: 'delta',
                        align: 'right',
                        sortable: true,
                    },
                    ...yearColumns,
                ],
            }
        },

        inputsRows() {
            const rows = []
            const data = {}

            Object.entries(this.calculator.params).forEach(([key, value]) => {
                const parts = key.split('/')
                const sector = parts[parts.length - 1]

                if (sectors.includes(sector)) {
                    let entry = data[parts.slice(0, -1).join('/')]
                    if (!entry) {
                        entry = {}
                        data[parts.slice(0, -1).join('/')] = entry
                    }
                    entry[sector] = this.filters.number(value, 2)
                } else {
                    data[key] = this.filters.number(value, 2)
                }
            })

            Object.entries(data).forEach(([key, value]) => {
                let path
                const entry = { id: key }

                if (typeof value === 'object') {
                    path = getPathByInputIdWithSector(key, sectors[0])
                    if (path) {
                        path = path[0]
                    }

                    for (const sector of sectors) {
                        const v = value[sector]
                        entry[sector] = typeof v === 'undefined' ? '-' : v
                    }
                } else {
                    path = getPathByInputId(key)
                    entry.value = value
                }

                if (Array.isArray(path)) {
                    path = path.join('/')
                }

                if (path) {
                    entry.name = this.i18n('inputs.' + path + '.label')
                    entry.unit = this.i18n('inputs.' + path + '.unit')

                    rows.push(entry)
                }
            })

            return rows
        },

        actionsRows() {
            const rows = []

            this.calculator.actions.forEach((action) => {
                if (action.disabled) {
                    return
                }

                const subRows = []
                const group = action.group
                    ? this.i18n('actions.groups.' + action.group) + ' / '
                    : ''

                rows.push({
                    ...action,
                    category: group + this.i18n('actions.' + action.name + '.label'),
                    subRows,
                })

                for (const input of action.inputs) {
                    const path = getPathByInputId(input.id)
                    let key = path[0] || input.name
                    let name = this.i18n('inputs.' + key + '.label')
                    let unit = this.i18n('inputs.' + key + '.unit')

                    const delta = input.active ? input.delta : 0

                    subRows.push({
                        id: input.id,
                        name,
                        unit,
                        sector: input.sector ? this.i18n('sectorsShort.' + input.sector) : '-',
                        timeframe: input.startYear + ' - ' + input.endYear,
                        value: this.filters.number(input.value, 2),
                        valueRef: !isNaN(input.valueRef)
                            ? this.filters.number(input.valueRef, 2)
                            : '-',
                        delta: this.filters.number(-1 * delta, 2),
                        result: this.filters.number(input.value - delta, 2),
                    })
                }
            })

            return rows
        },

        outputsRows() {
            const rows = []

            if (!this.calculator.results.all?.data) {
                return rows
            }

            for (const cat of Object.keys(this.calculator.results.all?.data)) {
                const subRows = []
                rows.push({ category: cat, subRows })

                for (const subCat of Object.keys(this.calculator.results.all?.data[cat])) {
                    const name = this.i18n('results.' + cat + '.' + subCat + '.label')
                    let unit = ''
                    if (this.i18n.has('results.' + cat + '.' + subCat + '.unit')) {
                        unit = this.i18n('results.' + cat + '.' + subCat + '.unit')
                    }

                    const entry = {
                        id: subCat,
                        name,
                        unit,
                        sector: ' - ',
                    }
                    const item = this.calculator.results.all?.data[cat][subCat]
                    if (!item) {
                        continue
                    }

                    if (item?.value instanceof Float64Array) {
                        const value = item.value
                        if (value.find((v) => isNaN(v) || !isFinite(v)) !== undefined) {
                            console.warn(
                                'invalid result',
                                cat,
                                subCat,
                                '[' + value.slice(0, 3).join(','),
                            )
                        }

                        entry.id = item._id

                        const row = { ...entry, value: '' }
                        const d = value[value.length - 1] - value[0]
                        row.delta = isNaN(d) ? '/' : this.filters.number(d, 2)

                        // if (cat === 'economy') {
                        //     row['year-' + this.calculator.yearRangeCalculated[0]] = this.filters.number(
                        //         value[0],
                        //         2,
                        //     )
                        //     row[
                        //         'year-' +
                        //             this.calculator.yearRangeCalculated[this.calculator.yearRangeCalculated.length - 1]
                        //     ] = this.filters.number(value[value.length - 1], 2)
                        // } else {
                        ;[].slice.call(value).forEach((v, index) => {
                            const year = this.calculator.yearRangeCalculated[index]
                            row['year-' + year] = isNaN(v) ? '/' : this.filters.number(v, 2)
                        })
                        // }

                        subRows.push(row)
                    } else if (typeof item === 'object' && subCat !== 'additional') {
                        entry.id = item._id
                        for (const sector of sectors) {
                            const row = { ...entry, value: '' }
                            row.sector = this.i18n('sectorsShort.' + sector)

                            const list = item[sector]
                            if (list && list.find((v) => isNaN(v) || !isFinite(v)) !== undefined) {
                                console.warn(
                                    'invalid result',
                                    cat,
                                    subCat,
                                    sector,
                                    '[' + list.slice(0, 3).join(','),
                                )
                            }

                            if (list) {
                                const d = list[list.length - 1] - list[0]
                                row.delta = isNaN(d) ? '/' : this.filters.number(d, 2)
                                ;[].slice.call(list).forEach((v, index) => {
                                    const year = this.calculator.yearRangeCalculated[index]

                                    row['year-' + year] = isNaN(v) ? '/' : this.filters.number(v, 2)
                                })
                            }

                            subRows.push(row)
                        }
                    }
                }
            }

            return rows
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

section {
    position: relative;
    background-color: var(--k-section-background-color);
    color: var(--k-section-color);
    border: 1px solid var(--k-section-border-color);
    border-radius: 0.25rem;
    transition: color 0.25s, background-color 0.25s, border-color 0.25s;
}

.back {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.25rem;
    overflow: hidden;
    z-index: 1;
}

header,
.content {
    position: relative;
    z-index: 10;
}

header {
    padding: 1.5rem 1.5rem 0;
    margin-bottom: 2.5rem;
}

.title {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    h2 {
        line-height: 1.2;
        font-size: 1.25rem;
    }

    .suffix {
        flex: auto 0 1;
    }
}

.content {
    padding: 0;
}

.q-tab-panel {
    padding: 0;
}

:deep(.q-table) {
    @include font-family('numeric');
    background-color: var(--k-section-background-color);
    color: var(--k-section-color);
    border-color: var(--k-section-border-color);

    .q-table__bottom,
    thead,
    tr,
    th,
    td {
        border-color: var(--k-section-border-color);
    }

    tbody td {
        font-size: 14px;
    }
}

:deep(.q-table--dark) {
    tbody td:before {
        background: rgba(10, 180, 128, 0.07);
    }
}

:deep(.debug-table) {
    border-radius: 0;

    &:not(.inputs) {
        > .q-table__middle > .q-table {
            table-layout: fixed;
        }

        thead {
            tr {
                th:nth-child(1) {
                    width: 3rem;
                }

                th:nth-child(2) {
                    width: 100%;
                }
            }
        }
    }

    > .q-table__middle > .q-table {
        > thead tr:first-child th {
            background-color: var(--k-color-green);
        }
    }
}

:deep(.debug-table-sub) {
    border-radius: 0;
    max-height: 500px;

    &.economy {
        td:nth-child(n + 2):nth-child(-n + 3),
        th:nth-child(n + 2):nth-child(-n + 3) {
            display: none;
        }
    }

    .q-table__top,
    .q-table__bottom,
    td:nth-child(-n + 3) {
        background-color: var(--k-color-gray-300);
    }

    tr th {
        position: sticky;
        z-index: 2;
        background: var(--k-color-gray-300);
    }

    thead tr:last-child th {
        top: 48px;
        z-index: 3;
    }

    thead tr:first-child th {
        top: 0;
        z-index: 1;
    }

    tr:first-child th:nth-child(-n + 3) {
        z-index: 3;
    }

    td:nth-child(-n + 3) {
        z-index: 1;
    }

    td:nth-child(-n + 3),
    th:nth-child(-n + 3) {
        position: sticky;
        left: 0;
        // max-width: 250px;
        // overflow: hidden;
    }

    td:nth-child(2),
    th:nth-child(2) {
        left: 155px;

        z-index: 2;
    }

    td:nth-child(3),
    th:nth-child(3) {
        left: 208px;

        z-index: 2;
    }

    tbody {
        scroll-margin-top: 48px;
    }
}
</style>
