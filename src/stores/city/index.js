import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import countryStatsFlat from '@/data/stats-germany-flat.js'
// import testData from '@/data/test-data-v9.js'
import Decimal from 'decimal.js'
// import structuredClone from '@ungap/structured-clone'
import { sectors, sectorsAndSchools } from './shared.js'
import calculateDataStats from './calculate-data-stats.js'

export const useCityStore = defineStore('city', {
    state: () => {
        const inputMode = ref('simple') // simple | expert

        const name = ref('')

        const defaultPopulation = 35_000
        const populationSimple = ref(defaultPopulation)

        const population = computed(() => {
            if (inputMode.value === 'simple') {
                return populationSimple.value
            } else {
                return data?.value['buildings/base_data/inhabitants[k]']?.private * 1000
            }
        })

        // in relation to country population
        const germanPopulation =
            countryStatsFlat['buildings/base_data/inhabitants[k]'].private * 1000
        const populationFactor = computed(() => population.value / germanPopulation)

        const fossilPriceKeys = {
            heatingOil: 'buildings/fossil_fuel_prices/oil[EUR/L]',
            heatingGas: 'buildings/fossil_fuel_prices/gas[EUR/m3]',
            fuel: 'mobility/fossil_fuel_prices/fuel[EUR/L]',
        }

        const fossilPrices = ref({
            heatingOil: countryStatsFlat[fossilPriceKeys.heatingOil],
            heatingGas: countryStatsFlat[fossilPriceKeys.heatingGas],
            fuel: countryStatsFlat[fossilPriceKeys.fuel],
        })

        const calculateDataStatsByPopulation = calculateDataStats.bind(
            null,
            countryStatsFlat,
            fossilPrices.value,
        )

        watch(
            fossilPrices,
            () => {
                console.log('update fossilPrices')

                for (let obj of [data.value, dataStats.value]) {
                    obj[fossilPriceKeys.heatingOil] = fossilPrices.value.heatingOil
                    obj[fossilPriceKeys.heatingGas] = fossilPrices.value.heatingGas
                    obj[fossilPriceKeys.fuel] = fossilPrices.value.fuel
                }

                // always update
                updateCurrentDataLive()
                updateCurrentData()
            },
            { deep: true },
        )

        // inputs
        const dataStats = ref(calculateDataStatsByPopulation(population.value))
        const data = ref(JSON.parse(JSON.stringify(dataStats.value)))

        const changedDataKeys = ref({})

        watch(
            () => data?.value['buildings/base_data/inhabitants[k]']?.private,
            () => {
                if (inputMode.value === 'expert') {
                    populationSimple.value =
                        data?.value['buildings/base_data/inhabitants[k]']?.private * 1000
                }
            },
        )

        watch(
            () => [data.value, dataStats.value],
            () => {
                console.log('update changed keys')
                const changedKeys = {}
                const threshold = 0.01

                for (const [key, value] of Object.entries(dataStats.value)) {
                    if (typeof value !== 'object') {
                        if (!(Math.abs(data.value[key] - value) < threshold)) {
                            changedKeys[key] = true
                        }
                    } else {
                        for (const sector of sectorsAndSchools) {
                            if (
                                !(
                                    Math.abs(data.value?.[key]?.[sector] - value?.[sector]) <
                                    threshold
                                )
                            ) {
                                changedKeys[key + '.' + sector] = true
                            }
                        }
                    }
                }

                changedDataKeys.value = changedKeys
            },
            { deep: true },
        )

        const currentDataLive = ref({})
        const currentData = ref({})

        function updateCurrentDataLive() {
            console.log('update currentDataLive')

            if (inputMode.value === 'expert') {
                currentDataLive.value = JSON.parse(JSON.stringify(data.value))
            } else {
                currentDataLive.value = dataStats.value
            }
        }

        function updateCurrentData() {
            console.log('update currentData')

            currentData.value = JSON.parse(JSON.stringify(currentDataLive.value))
        }

        function resetDataToDataStats(keys) {
            const stats = calculateDataStatsByPopulation(population.value)
            keys = keys || Object.keys(stats)

            for (let key of keys) {
                if (typeof stats[key] !== 'object') {
                    data.value[key] = stats[key]
                } else {
                    for (const sector of sectorsAndSchools) {
                        data.value[key][sector] = stats[key]?.[sector]
                    }
                }
            }

            updateCurrentDataLive()
            updateCurrentData()
        }

        updateCurrentDataLive()
        updateCurrentData()

        watch(
            () => [data.value, dataStats.value],
            () => {
                updateCurrentDataLive()

                if (inputMode.value === 'simple') {
                    updateCurrentData()
                }
            },
            { deep: true },
        )

        watch(population, () => {
            Object.assign(dataStats.value, calculateDataStatsByPopulation(population.value))

            // if (inputMode.value === 'expert') {
            //     data.value = { ...dataStats.value['buildings/base_data/inhabitants[k]'] }
            // }
        })

        // watch(() => data.value?.['buildings/base_data/inhabitants[k]']?.private, () => {

        // })

        watch(inputMode, () => {
            Object.assign(dataStats.value, calculateDataStatsByPopulation(population.value))

            // always update
            updateCurrentDataLive()
            updateCurrentData()
        })

        function calculateBuildingAreas() {
            const result = {
                sectors: {},
            }

            let sum = new Decimal(0)

            for (const type of sectorsAndSchools) {
                const n_buildings = new Decimal(
                    currentDataLive.value[`buildings/base_data/n_buildings[]`][type],
                )
                const value = n_buildings
                    .mul(
                        currentDataLive.value[`buildings/base_data/floor_area_per_building[qm]`][
                            type
                        ],
                    )
                    .div(1_000)

                sum = sum.add(value)

                result.sectors[type] = {
                    'area[k*qm]': value,
                }
            }

            for (const type of sectorsAndSchools) {
                const area = result.sectors[type]['area[k*qm]']
                result.sectors[type].share = area.div(sum).toNumber()
                result.sectors[type]['area[k*qm]'] = area.toNumber()
            }

            result['total[k*qm]'] = sum.toNumber()

            return result
        }

        function calculateHeatTypeAreas() {
            const result = {
                byType: {},
                bySector: {},
            }
            let sum = new Decimal(0)

            const heatTypeKeys = [
                'oil_no_condensing',
                'oil_with_condensing',
                'gas',
                'heat_pump',
                'district_heating',
            ]

            for (const type of heatTypeKeys) {
                const key = `buildings/heat_types_areas/${type}[k*qm]`

                let typeSum = 0
                for (const sector of sectorsAndSchools) {
                    result.bySector[sector] = result.bySector[sector] || {}

                    const value = currentDataLive.value[key][sector] || 0
                    typeSum += value
                    result.bySector[sector]['area[k*qm]'] =
                        (result.bySector[sector]['area[k*qm]'] || 0) + value
                }

                result.byType[type] = { 'area[k*qm]': typeSum }
                sum = sum.add(typeSum)
            }

            const totalArea = new Decimal(buildingAreas.value['total[k*qm]'])
            result.byType.other = {
                'area[k*qm]': totalArea.sub(sum).toNumber(),
            }

            for (const type of heatTypeKeys.concat('other')) {
                const area = result.byType[type]['area[k*qm]']
                result.byType[type].share = area / sum
            }

            result['total[k*qm]'] = sum.toNumber()

            return result
        }

        // function calculateMobilityShares() {
        //     const result = {}

        //     let other = 1
        //     Object.entries(currentDataLive.value['mobility/modal_split/shares']).forEach(
        //         ([keyRaw, value]) => {
        //             const key = keyRaw.split('[')[0]
        //             result[key] = value
        //             other -= value
        //         },
        //     )

        //     result.other = other
        //     return result
        // }

        const buildingAreas = ref(calculateBuildingAreas())
        const heatTypeAreas = ref(calculateHeatTypeAreas())
        // const mobilityShares = ref(calculateMobilityShares())

        watch(currentDataLive, () => {
            console.log('update calculations')
            buildingAreas.value = calculateBuildingAreas()
            heatTypeAreas.value = calculateHeatTypeAreas()
            // mobilityShares.value = calculateMobilityShares()
        })

        function validatePopulation(value) {
            if (isNaN(value)) {
                return 'Einwohnerzahl darf nicht leer sein.'
            }

            if (value < 1000) {
                return 'Einwohnerzahl darf nicht kleiner als 1.000 sein.'
            }

            if (value > 84_000_000) {
                return 'Einwohnerzahl darf nicht größer als 84.000.000 sein.'
            }

            return true
        }

        function $reset(keepFossilPrices = false) {
            console.info('resetting city store')
            // localStorage.removeItem('city')

            // name.value = ''
            // populationSimple.value = defaultPopulation
            inputMode.value = 'simple'

            if (!keepFossilPrices) {
                fossilPrices.value = {
                    heatingOil: countryStatsFlat[fossilPriceKeys.heatingOil],
                    heatingGas: countryStatsFlat[fossilPriceKeys.heatingGas],
                    fuel: countryStatsFlat[fossilPriceKeys.fuel],
                }
            }

            Object.assign(dataStats.value, calculateDataStatsByPopulation(populationSimple.value))
            data.value = JSON.parse(JSON.stringify(dataStats.value))
        }

        // function setTestData() {
        //     name.value = 'Test City'
        //     population.value = 217_000
        //     inputMode.value = 'expert'

        //     data.value = structuredClone(testData)

        //     fossilPrices.value = {
        //         heatingOil: testData[fossilPriceKeys.heatingOil],
        //         heatingGas: testData[fossilPriceKeys.heatingGas],
        //         fuel: testData[fossilPriceKeys.fuel],
        //     }
        // }

        return {
            // stats: countryStats,
            statsFlat: countryStatsFlat,

            // values
            inputMode,
            name,
            population,
            populationSimple,
            fossilPrices,
            data,

            // computed
            fossilPriceKeys,
            populationFactor,
            validatePopulation,
            dataStats,
            currentData,
            currentDataLive,
            changedDataKeys,
            buildingAreas,
            heatTypeAreas,
            // mobilityShares,

            // methods
            $reset,
            // setTestData,
            updateCurrentData,
            resetDataToDataStats,
        }
    },
    persist: {
        paths: ['inputMode', 'name', 'populationSimple', 'fossilPrices', 'data'],

        // beforeRestore: ({ store }) => {
        //     console.info('restoring city store')
        //     console.log(store.$state?.data?.['buildings/base_data/inhabitants[k]'].private)
        // },

        // afterRestore: ({ store }) => {
        //     console.info('restored city store')
        //     console.log(store.$state?.data?.['buildings/base_data/inhabitants[k]'].private)
        // },
    },
})
