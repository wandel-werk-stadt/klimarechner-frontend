import { sectors, sectorsMain, reverseInputIdTranslation } from './shared'

// function sumArrayListBySectors(data) {
//     const combined = []

//     for (const sector of sectors) {
//         const list = data[sector]
//         if (!list) continue

//         list.forEach((value, i) => {
//             combined[i] = (combined[i] || 0) + (value || 0)
//         })
//     }

//     return combined
// }

function getPropsByKeys(obj, keys) {
    return keys.reduce((result, key) => {
        result.push(obj[key])
        return result
    }, [])
}

// for each item in list, get array by key and get the sum of each value
// returns an array with the sum of all values
function combineArrayList(fn, list, key) {
    const combined = []

    if (!Array.isArray(list)) {
        list = [list]
    }

    list.forEach((item) => {
        let array = key ? item[key] : item
        if (!array || (!Array.isArray(array) && !(array instanceof Float64Array))) {
            console.warn('array not found', key, item)
            return
        }

        if (array instanceof Float64Array) {
            array = [...array]
        }

        array.forEach((value, index) => {
            value = value || 0
            combined[index] = combined[index] === undefined ? value : fn(combined[index], value)
        })
    })

    return combined
}

function combineArray(fn, array) {
    if (array instanceof Float64Array) {
        array = [...array]
    }

    return array.reduce((sum, value) => {
        value = value || 0
        return sum === undefined ? value : fn(sum, value)
    }, undefined)
}

function deltaArray(array) {
    return array[array.length - 1] - array[0]
}

function addSectors(list, keys) {
    const combined = []

    if (!Array.isArray(list)) {
        list = [list]
    }

    list.forEach((item) => {
        for (let sectorArray of getPropsByKeys(item, keys || sectors)) {
            if (
                !sectorArray ||
                (!Array.isArray(sectorArray) && !(sectorArray instanceof Float64Array))
            ) {
                console.warn('sectorArray not found', item, sectorArray)
                return
            }

            if (sectorArray instanceof Float64Array) {
                sectorArray = [...sectorArray]
            }

            sectorArray.forEach((value, index) => {
                combined[index] = (combined[index] || 0) + (value || 0)
            })
        }
    })

    return combined
}

function calculateHeatingDistribution(data, { startIndex, endIndex, actionInputs, cityData }) {
    const items = [
        {
            type: 'gas',
            keys: ['cnsmp_gas[G*W*h/a]'],
            inputIds: ['buildings/heat_types_areas/gas[k*qm]'],
        },
        {
            type: 'oil',

            keys: ['cnsmp_oil[G*W*h/a]', 'cnsmp_oil_condensing[G*W*h/a]'],
            inputIds: [
                'buildings/heat_types_areas/oil_with_condensing[k*qm]',
                'buildings/heat_types_areas/oil_no_condensing[k*qm]',
            ],
        },
        {
            type: 'heat-pump',
            keys: ['cnsmp_elec_heat_pump[G*W*h/a]'],
            inputIds: ['buildings/heat_types_areas/heat_pump[k*qm]'],
        },
        {
            type: 'district-heating',
            keys: ['cnsmp_district_heating[G*W*h/a]'],
            inputIds: ['buildings/heat_types_areas/district_heating[k*qm]'],
        },
        { type: 'other', keys: ['cnsmp_other[G*W*h/a]'], inputIds: [] },
    ]

    const totalArea = addSectors(data.buildings['floor_area[k*qm]'])
    const totalConsumption = addSectors(data.buildings['total_heat_dmd[G*W*h/a]'])

    const areas = {}
    items.forEach((item) => {
        if (item.type === 'other') {
            return
        }

        areas[item.type] = item.inputIds.reduce((sum, inputId) => {
            const id = reverseInputIdTranslation(inputId)
            const actions = actionInputs.filter((i) => i.id.startsWith(id))

            const value = addHorizontal(Object.values(cityData[inputId]))
            let delta = 0
            actions.forEach((action) => {
                delta += action.delta
            })

            sum += value - delta

            return sum
        }, 0)
    })

    areas.other = totalArea[endIndex] - Object.values(areas).reduce((sum, value) => sum + value, 0)

    const types = items.map((item) => {
        const consumption = addVertical(
            item.keys.map((key) => {
                return addSectors(data.buildings[key])
            }),
        )
        const area = areas[item.type] || 0

        return {
            type: item.type,
            'consumption[G*W*h/a]': consumption,
            'area[k*qm]': area,
            consumptionShare: consumption[endIndex] / totalConsumption[endIndex],
            areaShare: area / totalArea[endIndex],
        }
    })

    const delta = totalConsumption[endIndex] - totalConsumption[0]
    const deltaRelative = delta / totalConsumption[0]

    return {
        types,
        delta,
        deltaRelative,
    }
}

function calculateElectricityDistribution(
    data,
    { startIndex, endIndex, yearRangeCalculated, actionInputs, cityData },
) {
    const keys = {
        'photovoltaics-roof': () => addSectors(data.energy['sol_rf_nrg[G*W*h/a]']),
        'photovoltaics-landscape': () => addSectors(data.energy['sol_os_nrg[G*W*h/a]']),
        'wind-energy': () => addSectors(data.energy['wind_nrg[G*W*h/a]']),
        'purchased-energy-renewable': () =>
            addSectors(data.energy['prchsd_renewable_nrg[G*W*h/a]']),
        'purchased-energy-mix': () => addSectors(data.energy['prchsd_nrg_mix[G*W*h/a]']),
        // 'purchased-energy-renewable': () => {
        //     const v = addHorizontal(
        //         Object.values(cityData['energy/direct_aquisition_renewable_energies/power[G*W*h]']),
        //     )

        //     return yearRangeCalculated.map(() => v)
        // },
    }

    const totalDemand = addSectors(data.energy['elec_nrg_dmd[G*W*h/a]'])

    const types = Object.entries(keys).map(([key, getValue]) => {
        const energy = getValue()

        return {
            type: key,
            energy,
            // share: energy[endIndex] / totalDemand[endIndex],
        }
    })

    const totalEnergy = addVertical(types.map((item) => item.energy))
    types.forEach((item) => {
        item.share = item.energy[endIndex] / totalEnergy[endIndex]
    })

    const delta = totalDemand[endIndex] - totalDemand[0]
    const deltaRelative = delta / totalDemand[0]

    return {
        types,
        delta,
        deltaRelative,
    }
}

const addArray = combineArray.bind(null, (a, b) => a + b)
const subArray = combineArray.bind(null, (a, b) => a - b)

const addArrayList = combineArrayList.bind(null, (a, b) => a + b)
const subArrayList = combineArrayList.bind(null, (a, b) => a - b)

const addHorizontal = addArray
const subHorizontal = subArray
const addVertical = addArrayList
const subVertical = subArrayList
const addAll = (list, key) => addHorizontal(addVertical(list, key))

export function generateOutput(
    data,
    { startYear, endYear, yearRangeCalculated, actionInputs, cityData },
) {
    const output = {}

    const startIndex = yearRangeCalculated.indexOf(startYear)
    const endIndex = yearRangeCalculated.indexOf(endYear)

    output.heatingDistribution = calculateHeatingDistribution(data, {
        startIndex,
        endIndex,
        actionInputs,
        cityData,
    })

    output.electricityDistribution = calculateElectricityDistribution(data, {
        startIndex,
        endIndex,
        yearRangeCalculated,
        actionInputs,
        cityData,
    })
    // output.emissions = {
    //     byType: {
    //         oilHeating: addSectors(data.buildings['ems_oil[k*to_coe/a]']),
    //         gasHeating: addSectors(data.buildings['ems_gas[k*to_coe/a]']),
    //         fuel: addSectors(data.mobility['cars_ems[k*to_coe/a]']),
    //         electricPower: addSectors(data.energy['prchsd_nrg_mix_ems[k*to_coe/a]']),
    //     },
    //     bySector: sectors.reduce((result, sector) => {
    //         result[sector] = addArrayList(
    //             [
    //                 data.buildings['ems_oil[k*to_coe/a]'],
    //                 data.buildings['ems_gas[k*to_coe/a]'],
    //                 data.mobility['cars_ems[k*to_coe/a]'],
    //                 data.energy['prchsd_nrg_mix_ems[k*to_coe/a]'],
    //             ],
    //             sector,
    //         )
    //         return result
    //     }, {}),
    // }

    // output.heatDemand = {
    //     byType: {
    //         gas: addSectors(data.buildings['cnsmp_gas[G*W*h/a]']),
    //         oil: addSectors(data.buildings['cnsmp_oil[G*W*h/a]']),
    //         oilCondensing: addSectors(data.buildings['cnsmp_oil_condensing[G*W*h/a]']),
    //         heatPump: addSectors(data.buildings['cnsmp_elec_heat_pump[G*W*h/a]']),
    //         other: addSectors(data.buildings['cnsmp_other[G*W*h/a]']),
    //     },
    // }

    return output
}

export function calculateEffects(
    { data, delta },
    calculatedYears,
    actionTimeframe,
    action,
    baseData,
) {
    const efx = {
        aggregate: {},
        private: {},
        industry: {},
        public: {},
    }

    const startYear = action ? action.startYear : calculatedYears[0]
    const endYear = action ? action.endYear : calculatedYears[calculatedYears.length - 1]
    const startIndex = calculatedYears.indexOf(startYear)
    const endIndex = calculatedYears.indexOf(endYear)
    const endIndexAction = calculatedYears.indexOf(actionTimeframe.end)
    const yearCountAction = endYear - startYear + 1
    const yearCount = action ? yearCountAction : calculatedYears.length
    const yearIndex = yearCount + startIndex

    efx.debug = {
        startYear,
        endYear,
        startIndex,
        endIndex,
        yearCountAction,
        yearCount,
        yearIndex,
        actionTimeframe,
        endIndexAction,
    }

    const indirectEffects = {
        private: data.economy.income_local.value,
        // private: [...Array(yearIndex)].map(() => 0),
        industry: data.stakeholders.industry_profit_from_measures.value,
        public: data.stakeholders.public_tax_income_from_measures.value,
    }

    // per sector
    for (let sector of sectorsMain) {
        // invest
        efx[sector]['invest[M*EUR/a]'] = data.stakeholders[sector + '_invest'].value
        efx[sector]['invest_total[M*EUR]'] = addHorizontal(
            data.stakeholders[sector + '_invest'].value,
        )

        // cash-flow
        efx[sector]['cash_flow_netto[M*EUR/a]'] =
            data.stakeholders[sector + '_cash_flow_netto'].value
        efx[sector]['cash_flow_netto_total[M*EUR]'] = addHorizontal(
            data.stakeholders[sector + '_cash_flow_netto'].value,
        )

        // effect of measures
        efx[sector]['direct_effects[M*EUR/a]'] =
            data.stakeholders[sector + '_effect_of_measures'].value

        efx[sector]['direct_effects[M*EUR]'] =
            efx[sector]['direct_effects[M*EUR/a]'][endIndex] -
            efx[sector]['direct_effects[M*EUR/a]'][0]

        efx[sector]['direct_effects_total[M*EUR]'] = addHorizontal(
            efx[sector]['direct_effects[M*EUR/a]'],
        )

        efx[sector]['indirect_effects[M*EUR/a]'] = indirectEffects[sector]
        efx[sector]['indirect_effects[M*EUR]'] =
            efx[sector]['indirect_effects[M*EUR/a]'][endIndex] -
            efx[sector]['indirect_effects[M*EUR/a]'][0]

        efx[sector]['indirect_effects_total[M*EUR]'] = addHorizontal(
            efx[sector]['indirect_effects[M*EUR/a]'],
        )

        // break-even
        efx[sector]['break_even[a]'] = null
        let start = false
        efx[sector]['cash_flow_netto[M*EUR/a]'].find((value, index) => {
            if (value < 0) {
                start = true
            } else if (start) {
                efx[sector]['break_even[a]'] = calculatedYears[index]
                return true
            }
        })
    }

    // invest
    efx.aggregate['invest[M*EUR/a]'] = addVertical([
        data.stakeholders['private_invest'].value,
        data.stakeholders['industry_invest'].value,
        data.stakeholders['public_invest'].value,
    ])

    efx.aggregate['invest_total[M*EUR]'] = addHorizontal(efx.aggregate['invest[M*EUR/a]'])

    // cash-flow
    efx.aggregate['cash_flow_netto[M*EUR/a]'] = addVertical([
        data.stakeholders['private_cash_flow_netto'].value,
        data.stakeholders['industry_cash_flow_netto'].value,
        data.stakeholders['public_cash_flow_netto'].value,
    ])

    efx.aggregate['cash_flow_netto_total[M*EUR]'] = addHorizontal(
        efx.aggregate['cash_flow_netto[M*EUR/a]'],
    )

    // effect of measures
    efx.aggregate['direct_effects[M*EUR/a]'] = addVertical([
        data.stakeholders['private_effect_of_measures'].value,
        data.stakeholders['industry_effect_of_measures'].value,
        data.stakeholders['public_effect_of_measures'].value,
    ])

    efx.aggregate['direct_effects[M*EUR]'] =
        efx.aggregate['direct_effects[M*EUR/a]'][endIndex] -
        efx.aggregate['direct_effects[M*EUR/a]'][0]

    efx.aggregate['direct_effects_total[M*EUR]'] = addHorizontal(
        efx.aggregate['direct_effects[M*EUR/a]'],
    )

    efx.aggregate['indirect_effects[M*EUR/a]'] = addVertical(Object.values(indirectEffects))
    efx.aggregate['indirect_effects[M*EUR]'] =
        efx.aggregate['indirect_effects[M*EUR/a]'][endIndex] -
        efx.aggregate['indirect_effects[M*EUR/a]'][0]

    efx.aggregate['indirect_effects_total[M*EUR]'] = addHorizontal(
        efx.aggregate['indirect_effects[M*EUR/a]'],
    )

    // break-even
    efx.aggregate['break_even[a]'] = null
    let start = false
    efx.aggregate['cash_flow_netto[M*EUR/a]'].find((value, index) => {
        if (value < 0) {
            start = true
        } else if (start) {
            efx.aggregate['break_even[a]'] = calculatedYears[index]
            return true
        }
    })

    // per sector
    for (let sector of ['aggregate', ...sectorsMain]) {
        let sectors = [sector]
        if (sector === 'public') {
            sectors = ['public', 'schools']
        } else if (sector === 'aggregate') {
            sectors = false
        }

        // emissions
        efx[sector]['emissions_change[k*to_coe/a]'] = addVertical([
            addSectors(delta.buildings['ems_oil[k*to_coe/a]'], sectors),
            addSectors(delta.buildings['ems_gas[k*to_coe/a]'], sectors),
            addSectors(delta.mobility['cars_ems[k*to_coe/a]'], sectors),
            addSectors(delta.energy['prchsd_nrg_mix_ems[k*to_coe/a]'], sectors),
        ])

        efx[sector]['emissions_change_per_year[k*to_coe]'] =
            efx[sector]['emissions_change[k*to_coe/a]'][endIndex]

        efx[sector]['emissions_change[k*to_coe]'] = addHorizontal(
            efx[sector]['emissions_change[k*to_coe/a]'],
        )

        efx[sector]['emissions_total[k*to_coe/a]'] = addVertical([
            addSectors(data.buildings['ems_oil[k*to_coe/a]'], sectors),
            addSectors(data.buildings['ems_gas[k*to_coe/a]'], sectors),
            addSectors(data.mobility['cars_ems[k*to_coe/a]'], sectors),
            addSectors(data.energy['prchsd_nrg_mix_ems[k*to_coe/a]'], sectors),
        ])
        efx[sector]['emissions_total[k*to_coe/a]_nrg_ems'] =
            data.energy['prchsd_nrg_mix_ems[k*to_coe/a]']

        efx[sector]['emissions_total[k*to_coe]'] = addHorizontal(
            efx[sector]['emissions_total[k*to_coe/a]'],
        )

        // -129 -6
        efx[sector]['emissions_saved_share[%]'] =
            (efx[sector]['emissions_change[k*to_coe/a]'][endIndex] /
                efx[sector]['emissions_total[k*to_coe/a]'][0]) *
            -1 *
            100

        efx[sector]['effects_of_reduction[EUR/t]'] = null
        if (efx[sector]['emissions_change[k*to_coe/a]'][endIndex]) {
            efx[sector]['effects_of_reduction[EUR/t]'] =
                (efx[sector]['invest_total[M*EUR]'] * -1 +
                    efx[sector]['direct_effects[M*EUR]'] * 30) /
                (((efx[sector]['emissions_change[k*to_coe/a]'][endIndex] * -1) / 1000) * 30)
        }

        efx[sector]['return[%]'] = null
        if (efx[sector]['invest_total[M*EUR]']) {
            efx[sector]['return[%]'] =
                (efx[sector]['direct_effects[M*EUR/a]'][endIndex] /
                    efx[sector]['invest_total[M*EUR]'] || 0) * 100
        }

        efx[sector]['turnover_local_total[M*EUR]'] = addHorizontal(
            data.economy['turnover_local'].value,
        )
    }

    // jobs
    efx.aggregate['jobs_local_total[n/a]'] = addVertical([
        delta.economy.n_jobs_crafting_local.value,
    ])
    efx.aggregate['jobs_local_total[n]'] = efx.aggregate['jobs_local_total[n/a]'][endIndexAction]

    efx.aggregate['jobs_national_total[n/a]'] = addVertical([
        delta.economy.n_jobs_crafting_national.value,
        delta.economy.n_jobs_production_national.value,
    ])

    return efx
}
