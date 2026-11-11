import pkg from '/package.json'
import { ref, computed, watch, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { debounce } from 'quasar'
// import Decimal from 'decimal.js'
import { useCityStore } from '@/stores/city'
import { generateOutput } from './output.js'
import {
    createActions,
    mergeSettings,
    defaultSettings,
    climateNeutralSettings,
    applySettings,
} from './actions/index.js'
import {
    sectors,
    year,
    maxYear,
    nudgeYear,
    getValueByInputId,
    inputIdTranslation,
    getObjectValueByPath,
} from './shared'
import Machine from './machine.js'

export const useCalculatorStore = defineStore('calculator', {
    state: () => {
        const city = useCityStore()
        const version = pkg.version
        console.info('version', version)

        const processing = ref(false)

        function getParams(input) {
            const values = {}

            try {
                Object.entries(inputIdTranslation.perSector).forEach(([paramKey, dataKey]) => {
                    if (!input[dataKey]) {
                        console.warn('input key not found', dataKey)
                        return
                    }

                    Object.entries(input[dataKey]).forEach(([sector, value]) => {
                        values[`${paramKey}/${sector}`] = value
                    })
                })

                Object.entries(inputIdTranslation.direct).forEach(([paramKey, path]) => {
                    values[paramKey] = input[path]
                })
            } catch (error) {
                console.warn('param conversion failed', error)
            }

            // special case: copy inhabitants to mobility
            const copyDataKey = 'buildings/base_data/inhabitants[k]'
            const mobParamKey = 'mobility/inputs/n_inhabitants__k__'
            Object.entries(input[copyDataKey]).forEach(([sector, value]) => {
                values[`${mobParamKey}/${sector}`] = value
            })

            return values
        }

        function process() {
            processing.value = true

            // always calculate for minimum 20 years
            machine.updateTimeframe(startYear.value, endYearCalculated.value)

            console.info('params', toRaw(params.value))
            console.info('actions', toRaw(actions.value))

            // first run
            const machineResultsFirst = machine.getResultsPerAction({
                inputs: params.value,
                actions: actions.value,
                actionTimeframe: {
                    start: startYear.value,
                    end: endYear.value,
                },
            })

            updateActionsValues(true, machineResultsFirst)

            // second run
            const machineResultsSecond = machine.getResultsPerAction({
                inputs: params.value,
                actions: actions.value,
                actionTimeframe: {
                    start: startYear.value,
                    end: endYear.value,
                },
                secondRun: true,
            })

            const machineResults = {
                ...machineResultsFirst,
                ...machineResultsSecond,
            }

            const dataAll = machineResultsSecond.all.data

            dataAll.buildings.additional = {}
            dataAll.buildings.additional['total_floor_area[k*qm]'] = sectors
                .map((sector) => dataAll.buildings['floor_area[k*qm]'][sector])
                .reduce((sum, v) => sum + (v[0] || 0), 0)

            dataAll.buildings.additional['total_heat_demand[G*W*h/a]'] = sectors
                .map((sector) => dataAll.buildings['total_heat_dmd[G*W*h/a]'][sector])
                .reduce((sum, v) => sum + (v[0] || 0), 0)

            console.info('results', machineResults)
            results.value = machineResults

            output.value = generateOutput(dataAll, {
                startYear: startYear.value,
                endYear: endYear.value,
                yearRangeCalculated: yearRangeCalculated.value,
                actionInputs: actionInputs.value,
                cityData: city.currentData,
            })
            processing.value = false
        }

        function updateActionsByTimeframe() {
            for (const action of actions.value) {
                if (action.name === 'fossil-price-increase') {
                    continue
                }

                for (const input of action.inputs) {
                    if (input.startYear < startYear.value) {
                        input.startYear = startYear.value
                    }
                    if (input.endYear > endYear.value) {
                        input.endYear = endYear.value
                    }
                }
            }
        }

        function updateActionsValues(secondRun = false, intermediateResults = {}) {
            const start = new Date()
            const inputList = []

            const getInput = (inputs, sector, name) => {
                const refInput = inputs.find((i) => i.name === name && i.sector === sector)
                return refInput
            }

            const getValue = (inputs, sector, name) => {
                const refInput = inputs.find((i) => i.name === name && i.sector === sector)
                if (!refInput) return NaN
                return getValueByInputId(city.currentData, refInput.id) || 0
            }

            const getData = (sector, name, fallback) => {
                try {
                    const value = sector ? city.currentData[name][sector] : city.currentData[name]
                    return value === undefined ? fallback : value
                } catch (error) {
                    console.warn('getData failed', name, sector, city.currentData[name])
                    return 0
                }
            }

            const getDataRaw = (path) => {
                try {
                    return getObjectValueByPath(city, path)
                } catch (error) {
                    console.warn('getDataRaw failed', path)
                    return 0
                }
            }

            // only allowed if processOrder === 'after'
            const getResults = (key, path) => {
                try {
                    const data = intermediateResults?.[key]
                    if (!data) return undefined
                    return getObjectValueByPath(data, path)
                } catch (error) {
                    console.warn('getResults failed', key)
                    return undefined
                }
            }

            for (const action of actions.value) {
                if (secondRun && action.processOrder !== 'after') {
                    continue
                } else if (!secondRun && action.processOrder === 'after') {
                    continue
                }

                for (const input of action.inputs) {
                    if (!input.id) {
                        // custom inputs
                        input.calculateDelta()
                        continue
                    }

                    input.value = getValueByInputId(city.currentData, input.id) || 0

                    if (input.deltaReference) {
                        let refOption = input.deltaReference

                        if (typeof refOption === 'function') {
                            input.valueRef = refOption({
                                getInput: getInput.bind(null, action.inputs, input.sector),
                                getValue: getValue.bind(null, action.inputs, input.sector),
                                getData: getData.bind(null, input.sector),
                                getDataRaw: getDataRaw.bind(null),
                                getResults: getResults.bind(null),
                                sector: input.sector,
                            })
                        } else {
                            const refInput = action.inputs.find(
                                (i) => i.name === input.deltaReference && i.sector === input.sector,
                            )
                            if (refInput) {
                                input.valueRef =
                                    getValueByInputId(city.currentData, refInput.id) || 0
                            }
                        }
                    }

                    input.calculateDelta()

                    if (input.id && input.active) {
                        inputList.push({
                            id: input.id,
                            startYear: input.startYear,
                            endYear: input.endYear,
                            value: input.value,
                            delta: input.delta,
                            result: input.value - input.delta,
                        })
                    }
                }
            }

            actionInputs.value = inputList
            console.log('update action values', (new Date() - start).toFixed(1) + 'ms')
        }

        const processDebounced = debounce(process, 100)

        const params = ref(getParams(city.currentData))

        const actions = ref(createActions())
        applySettings(actions.value, defaultSettings)
        const actionsActive = computed(() => actions.value.filter((a) => a.group && a.active))
        const actionInputs = ref([])

        console.info('actions', actions.value)
        const sectorFocus = ref('private')

        watch(
            () => city.currentData,
            () => {
                processing.value = true
                params.value = getParams(city.currentData)

                updateActionsValues()
                processDebounced()
            },
            { deep: true },
        )

        watch(
            () => actions.value,
            () => {
                processing.value = true

                updateActionsValues()
                processDebounced()
            },
            { deep: true, immediate: true },
        )

        const results = ref({ none: {}, all: {} })
        const output = ref({})

        const startYear = ref(year)
        const endYear = ref(nudgeYear)

        const yearDelta = computed(() => endYear.value - startYear.value)
        const yearRange = computed(() =>
            [...Array(yearDelta.value + 1).keys()].map((i) => i + startYear.value),
        )

        const endYearCalculated = computed(() => {
            return 2045 //Math.max(startYear.value + 19, 2045)
        })
        const yearDeltaCalculated = computed(() => endYearCalculated.value - startYear.value)
        const yearRangeCalculated = computed(() =>
            [...Array(yearDeltaCalculated.value + 1).keys()].map((i) => i + startYear.value),
        )

        updateActionsByTimeframe()
        const machine = new Machine(startYear.value, endYear.value)

        watch(
            () => [startYear.value, endYear.value],
            () => {
                processing.value = true
                updateActionsByTimeframe()
                // machine.updateTimeframe(startYear.value, endYear.value)
                // machine.setInputs(params.value)
                // machine.setActions(actions.value)
                processDebounced()
            },
        )

        const resetCounter = ref(0)
        function $reset(climateNeutral = false, keepFossilAction = false) {
            console.info('resetting calculator store', climateNeutral)
            // localStorage.removeItem('calculator')

            const mergedSettings = structuredClone(
                climateNeutral ? climateNeutralSettings : defaultSettings,
            )
            const blankActions = createActions()

            if (keepFossilAction) {
                const actionIndex = blankActions.findIndex(
                    (a) => a.name === 'fossil-price-increase',
                )
                blankActions.splice(actionIndex, 1)

                delete mergedSettings['fossil-price-increase']
            }

            mergeSettings(actions.value, blankActions)
            applySettings(actions.value, mergedSettings)

            startYear.value = year
            endYear.value = nudgeYear
            sectorFocus.value = 'private'

            resetCounter.value += 1
        }

        // function setTestData() {
        //     console.info('setting calculator test data')

        //     startYear.value = 2022
        //     endYear.value = 2030
        //     sectorFocus.value = 'private'

        //     setTimeout(() => {
        //         const testActions = createActions()

        //         const fossilAction = testActions.find((a) => a.name === 'fossil-price-increase')
        //         fossilAction.deltaRelative = 0

        //         const heatReplacementActions = testActions.filter(
        //             (a) => a.name === 'replace-gas-heating' || a.name === 'replace-oil-heating',
        //         )

        //         heatReplacementActions.forEach((action) =>
        //             action.inputs
        //                 .filter((i) => i.name === 'heat-pump-district-heating-distribution')
        //                 .forEach((input) => {
        //                     input.deltaRelative = 0
        //                 }),
        //         )

        //         for (const action of testActions) {
        //             for (const input of action.inputs) {
        //                 input.startYear = 2024
        //                 input.endYear = 2030
        //             }
        //         }

        //         mergeSettings(actions.value, testActions)

        //         resetCounter.value += 1
        //         processDebounced()
        //     }, 100)
        // }

        return {
            // values
            resetCounter,

            startYear,
            endYear,

            actions,
            sectorFocus,

            // computed
            version,
            params,
            actionsActive,

            yearDelta,
            yearRange,

            endYearCalculated,
            yearDeltaCalculated,
            yearRangeCalculated,

            processing,
            year,
            maxYear,
            sectors,
            results,
            output,

            // functions
            $reset,
            // setTestData,
            process: processDebounced,
        }
    },
    persist: {
        paths: ['version', 'startYear', 'endYear', 'actions', 'actionSettings', 'sectorFocus'],
        serializer: {
            serialize: (value) => {
                return JSON.stringify(value)
            },
            deserialize: (value) => {
                const data = JSON.parse(value)
                const mainVersion = (v = '') => v.slice(0, v.lastIndexOf('.'))

                if (data.version && mainVersion(data.version) !== mainVersion(pkg.version)) {
                    console.warn('version mismatch', data.version, pkg.version)
                    return {}
                }

                delete data.version

                const { actions } = data
                data.actionSettings = actions
                delete data.actions

                return data
            },
        },
        afterRestore: ({ store }) => {
            console.info('restoring calculator store', store.$state.actionSettings)

            if (store.$state.actionSettings) {
                mergeSettings(store.$state.actions, store.$state.actionSettings)
            } else {
                applySettings(store.$state.actions, climateNeutralSettings)
            }
        },
    },
})
