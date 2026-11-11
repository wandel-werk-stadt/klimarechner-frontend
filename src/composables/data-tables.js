import { computed } from 'vue'
import i18n from '@/i18n/index.js'
import { useCalculatorStore } from '@/stores/calculator/index'
import { useCityStore } from '@/stores/city'
import { sectors } from '@/stores/calculator/shared'

function slugify(str) {
    return str.replace(/\//g, '-').slice(0, str.indexOf('[') || str.length)
}

const baseColumns = [
    {
        name: 'name',
        label: '',
        field: 'name',
        align: 'left',
        // headerStyle: 'width:220px; max-width:250px;',
    },
    // {
    //     name: 'unit',
    //     label: 'Einheit',
    //     field: 'unit',
    //     align: 'left',
    //     headerStyle: 'width:1%; min-width:95px;',
    // },
]

const sectorColumns = [
    {
        name: 'private',
        label: i18n('sectorsShort.private'),
        field: 'private',
        align: 'right',
    },
    {
        name: 'industry',
        label: i18n('sectorsShort.industry'),
        field: 'industry',
        align: 'right',
    },
    {
        name: 'schools',
        label: i18n('sectorsShort.schools'),
        field: 'schools',
        align: 'right',
    },
    {
        name: 'public',
        label: i18n('sectorsShort.public'),
        field: 'public',
        align: 'right',
    },
    {
        name: 'space',
        label: '',
        field: 'space',
        align: 'right',
        headerStyle: 'width:auto;',
    },
]

export default function useDataTables() {
    const calculator = useCalculatorStore()
    const city = useCityStore()

    const columns = {
        single: [
            ...baseColumns,
            {
                name: 'value',
                label: 'Wert',
                field: 'value',
                align: 'right',
                // headerStyle: 'width:1%;',
            },
            {
                name: 'space',
                label: '',
                field: 'space',
                align: 'right',
                headerStyle: 'width:auto;',
            },
        ],
        sectors: [...baseColumns, ...sectorColumns],
        sectorsMain: [...baseColumns, ...sectorColumns.filter((col) => col.name !== 'schools')],
    }

    const tabs = computed(() => {
        return [
            {
                name: 'buildingsAndHeat',
                title: 'Basis-Daten, Gebäudewärme',
                tables: [
                    {
                        name: 'buildingsAndHeatSectors',
                        ...tableBuildingsAndHeatSectors.value,
                    },
                    {
                        name: 'buildingsAndHeatSingle',
                        ...tableBuildingsAndHeatSingle.value,
                    },
                ].filter((table) => table?.rows?.length > 0),
            },
            {
                name: 'energy',
                title: 'Strom',
                tables: [
                    {
                        name: 'energySectors',
                        ...tableEnergySectors.value,
                    },
                    {
                        name: 'energySingle',
                        ...tableEnergySingle.value,
                    },
                ].filter((table) => table?.rows?.length > 0),
            },
            {
                name: 'mobility',
                title: 'Mobilität',
                tables: [
                    {
                        name: 'mobilitySectors',
                        ...tableMobilitySectors.value,
                    },
                    {
                        name: 'mobilitySingle',
                        ...tableMobilitySingle.value,
                    },
                ].filter((table) => table?.rows?.length > 0),
            },
        ]
    })

    const tableBuildingsAndHeatSectors = computed(() => {
        const rows = []
        const hideInputs = [
            // 'buildings/base_data/inhabitants[k]'
        ]

        const sectorInputs = Object.entries(city.data).filter(
            ([key, value]) =>
                key.startsWith('buildings/') &&
                !hideInputs.includes(key) &&
                typeof value === 'object',
        )

        sectorInputs.forEach(([key, data]) => {
            const id = key

            let label, unit
            label = i18n('inputs.' + id + '.label')
            unit = i18n('inputs.' + id + '.unit')

            const entry = { id, slug: slugify(id), name: label, unit }

            for (const [sector, value] of Object.entries(data)) {
                entry[sector] = { id: id + '.' + sector, key, sector, value }
            }

            rows.push(entry)
        })

        // insert
        const buildingAreaIndex = rows.findIndex(
            (row) => row.id === 'buildings/base_data/floor_area_per_building[qm]',
        )
        if (buildingAreaIndex > -1) {
            const id = 'buildings/base_data/floor_area_total[k*qm]'
            const row = {
                id,
                slug: slugify(id),
                name: i18n('dataInputs.' + id + '.label'),
                unit: i18n('dataInputs.' + id + '.unit'),
                calculated: true,
            }

            for (const sector of sectors) {
                row[sector] = {
                    id: id + '.' + sector,
                    key: id,
                    value: calculator.results.all?.data?.buildings?.['floor_area[k*qm]'][
                        sector
                    ]?.[0],
                }
            }

            rows.splice(buildingAreaIndex + 1, 0, row)
        }

        // insert
        const hotWaterIndex = rows.findIndex((row) =>
            row.id.startsWith('buildings/demand/hot_water_per_capita[k*W*h/a]'),
        )
        if (hotWaterIndex > -1) {
            const id = 'buildings/demand/heat_total[k*qm]'
            const row = {
                id,
                slug: slugify(id),
                name: i18n('dataInputs.' + id + '.label'),
                unit: i18n('dataInputs.' + id + '.unit'),
                calculated: true,
            }

            for (const sector of sectors) {
                const value =
                    calculator.results.all?.data?.buildings?.['total_heat_dmd[G*W*h/a]'][
                        sector
                    ]?.[0]
                row[sector] = { id: id + '.' + sector, key: id, value }
            }

            rows.splice(hotWaterIndex + 1, 0, row)
        }

        // insert
        const heatAreaIndex = rows.findLastIndex((row) =>
            row.id.startsWith('buildings/heat_types_areas/'),
        )
        if (heatAreaIndex > -1) {
            const id = 'buildings/heat_types_areas/other[k*qm]'
            const row = {
                id,
                slug: slugify(id),
                name: i18n('dataInputs.buildings/heat_types_areas/other[k*qm].label'),
                unit: i18n('dataInputs.buildings/heat_types_areas/other[k*qm].unit'),
                calculated: true,
            }

            for (const sector of sectors) {
                const other =
                    calculator.results.all?.data?.buildings?.['floor_area[k*qm]'][sector]?.[0] -
                    city.heatTypeAreas.bySector[sector]['area[k*qm]']
                row[sector] = { id: id + '.' + sector, key: id, value: other }
            }

            rows.splice(heatAreaIndex + 1, 0, row)
        }

        return {
            settings: {
                columns: columns.sectors,
            },
            rows,
        }
    })

    const tableBuildingsAndHeatSingle = computed(() => {
        const rows = []
        const hideInputs = [...Object.values(city.fossilPriceKeys)]

        const singleInputs = Object.entries(city.data).filter(
            ([key, value]) =>
                key.startsWith('buildings/') &&
                !hideInputs.includes(key) &&
                typeof value !== 'object',
        )

        singleInputs.forEach(([key, value]) => {
            const id = key

            let label, unit
            label = i18n('inputs.' + id + '.label')
            unit = i18n('inputs.' + id + '.unit')

            const entry = {
                id,
                slug: slugify(id),
                name: label,
                unit,
                value: { id: key, key, value },
            }
            rows.push(entry)
        })

        return {
            settings: {
                columns: columns.single,
            },
            rows,
        }
    })

    const tableEnergySectors = computed(() => {
        const rows = []
        const hideInputs = []

        const singleInputs = Object.entries(city.data).filter(
            ([key, value]) =>
                key.startsWith('energy/') && !hideInputs.includes(key) && typeof value === 'object',
        )

        singleInputs.forEach(([key, data]) => {
            const id = key

            let label, unit
            label = i18n('inputs.' + id + '.label')
            unit = i18n('inputs.' + id + '.unit')

            const entry = { id, slug: slugify(id), name: label, unit }

            for (const [sector, value] of Object.entries(data)) {
                entry[sector] = { id: id + '.' + sector, key, sector, value }
            }

            rows.push(entry)
        })

        return {
            settings: {
                columns: columns.sectorsMain,
            },
            rows,
        }
    })

    const tableEnergySingle = computed(() => {
        const rows = []
        const hideInputs = []

        const singleInputs = Object.entries(city.data).filter(
            ([key, value]) =>
                key.startsWith('energy/') && !hideInputs.includes(key) && typeof value !== 'object',
        )

        singleInputs.forEach(([key, value]) => {
            const id = key

            let label, unit
            label = i18n('inputs.' + id + '.label')
            unit = i18n('inputs.' + id + '.unit')

            const entry = {
                id,
                slug: slugify(id),
                name: label,
                unit,
                value: { id: key, key, value },
            }
            rows.push(entry)
        })

        return {
            settings: {
                columns: columns.single,
            },
            rows,
        }
    })

    const tableMobilitySectors = computed(() => {
        const rows = []
        const hideInputs = []

        const singleInputs = Object.entries(city.data).filter(
            ([key, value]) =>
                key.startsWith('mobility/') &&
                !hideInputs.includes(key) &&
                typeof value === 'object',
        )

        singleInputs.forEach(([key, data]) => {
            const id = key

            let label, unit
            label = i18n('inputs.' + id + '.label')
            unit = i18n('inputs.' + id + '.unit')

            const entry = { id, slug: slugify(id), name: label, unit }

            for (const [sector, value] of Object.entries(data)) {
                entry[sector] = { id: id + '.' + sector, key, sector, value }
            }

            rows.push(entry)
        })

        return {
            settings: {
                columns: columns.sectorsMain,
            },
            rows,
        }
    })

    const tableMobilitySingle = computed(() => {
        const rows = []
        const hideInputs = [...Object.values(city.fossilPriceKeys)]

        const singleInputs = Object.entries(city.data).filter(
            ([key, value]) =>
                key.startsWith('mobility/') &&
                !hideInputs.includes(key) &&
                typeof value !== 'object',
        )

        singleInputs.forEach(([key, value]) => {
            const id = key

            let label, unit
            label = i18n('inputs.' + id + '.label')
            unit = i18n('inputs.' + id + '.unit')

            const entry = {
                id,
                slug: slugify(id),
                name: label,
                unit,
                value: { id: key, key, value },
            }
            rows.push(entry)
        })

        // insert
        const modalSplitIndex = rows.findLastIndex((row) =>
            row.id.startsWith('mobility/modal_split/shares/'),
        )
        if (modalSplitIndex > -1) {
            const id = 'mobility/modal_split/shares/sum[]'
            const row = {
                id,
                key: id,
                slug: slugify(id),
                name: i18n('dataInputs.' + id + '.label'),
                unit: i18n('dataInputs.' + id + '.unit'),
                calculated: true,
            }

            row.value = Object.entries(city.data)
                .filter(([key]) => key.startsWith('mobility/modal_split/shares/'))
                .reduce((acc, [key, value]) => {
                    acc += value
                    return acc
                }, 0)

            rows.splice(modalSplitIndex + 1, 0, row)
        }

        return {
            settings: {
                columns: columns.single,
            },
            rows,
        }
    })

    return {
        tabs,
    }
}
