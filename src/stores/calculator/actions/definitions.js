import { sectors, getLast } from '../shared'
import { actionTemplate, inputTemplate } from './templates'

function getActionDefs() {
    return [
        actionTemplate({
            name: 'fossil-price-increase',
            group: '', // hidden
            inputs: [
                {
                    id: 'buildings/inputs/price_oil__eur_per_L',
                    name: 'price-oil',
                    deltaFactor: 1,
                },
                {
                    id: 'buildings/inputs/price_gas__eur_per_m3',
                    name: 'price-gas',
                    deltaFactor: 1,
                },
                {
                    id: 'mobility/inputs/price_fuel__eur_per_L',
                    name: 'price-fuel',
                    deltaFactor: 1,
                },
            ],
        }),

        actionTemplate({
            name: 'reduce-heat-demand',
            group: 'buildings-and-heat',
            absolute: false,
            perSector: [
                {
                    id: 'buildings/inputs/heat_dmd__k__W_h_per_m2_a',
                    name: 'heat-demand',
                    unit: 'k*W*h/qm',
                    main: true,
                    deltaFactor: -1,
                    // ziel 25 kwh
                    deltaReference: ({ getData }) =>
                        getData('buildings/demand/heat[k*W*h/qm/a]') - 25,
                },
            ],
        }),

        actionTemplate({
            name: 'replace-gas-heating',
            group: 'buildings-and-heat',
            // subGroup: 'heating-technology',
            perSector: [
                {
                    id: 'buildings/inputs/A_heat_gas__k__m2',
                    name: 'gas',
                    main: true,
                    deltaFactor: -1,
                },
                {
                    name: 'heat-pump-district-heating-distribution',
                    value: 1,
                    separate: true,
                },
                {
                    id: 'buildings/inputs/A_heat_heat_pump__k__m2',
                    name: 'heat-pump',
                    deltaReference: ({ getValue, getInput }) =>
                        getValue('gas') *
                        (1 - getInput('heat-pump-district-heating-distribution').deltaRelative),
                    deltaFactor: 1,
                    fixed: true,
                },
                {
                    id: 'buildings/inputs/A_heat_district_heating__k__m2',
                    name: 'district-heating',
                    deltaReference: ({ getValue, getInput }) =>
                        getValue('gas') *
                        getInput('heat-pump-district-heating-distribution').deltaRelative,
                    deltaFactor: 1,
                    fixed: true,
                },
            ],
        }),

        actionTemplate({
            name: 'replace-oil-heating',
            group: 'buildings-and-heat',
            // subGroup: 'heating-technology',
            perSector: [
                {
                    id: 'buildings/inputs/A_heat_oil__k__m2',
                    name: 'oil',
                    main: true,
                    deltaFactor: -1,
                },
                {
                    id: 'buildings/inputs/A_heat_oil_condensing__k__m2',
                    name: 'oil-condensing',
                    main: true,
                    deltaFactor: -1,
                },
                {
                    name: 'heat-pump-district-heating-distribution',
                    value: 1,
                    separate: true,
                },
                {
                    id: 'buildings/inputs/A_heat_heat_pump__k__m2',
                    name: 'heat-pump',
                    deltaReference: ({ getValue, getInput }) =>
                        (getValue('oil') + getValue('oil-condensing')) *
                        (1 - getInput('heat-pump-district-heating-distribution').deltaRelative),
                    deltaFactor: 1,
                    fixed: true,
                },
                {
                    id: 'buildings/inputs/A_heat_district_heating__k__m2',
                    name: 'district-heating',
                    deltaReference: ({ getValue, getInput }) =>
                        (getValue('oil') + getValue('oil-condensing')) *
                        getInput('heat-pump-district-heating-distribution').deltaRelative,
                    deltaFactor: 1,
                    fixed: true,
                },
            ],
        }),

        actionTemplate({
            name: 'expand-photovoltaics-roof',
            group: 'energy',
            perSector: [
                {
                    id: 'energy/inputs/sol_rf_installed__M__Wp',
                    name: 'installed-solar-roof-area',
                    main: true,
                    precision: 1,
                    deltaFactor: 1,
                    // 0.2 MWp / k*m²
                    deltaReference: ({ getData }) =>
                        getData('energy/solar_roof/roof_area[ha]', 0) *
                        getData('energy/solar_roof/solar_suitable_portion_of_roof_area[]', 0) *
                        2,
                },
            ],
        }),

        actionTemplate({
            name: 'expand-photovoltaics-landscape',
            group: 'energy',
            disabledSectors: ['private'],
            perSector: [
                {
                    id: 'energy/inputs/sol_os_installed_A__ha',
                    name: 'installed-solar-landscape-area',
                    main: true,
                    precision: 1,
                    deltaFactor: 1,
                    deltaReference: ({ getData }) =>
                        getData('energy/solar_landscape/potential_area[ha]', 0) -
                        getData('energy/solar_landscape/solar_area[ha]', 0),
                },
            ],
        }),

        actionTemplate({
            name: 'expand-wind-energy',
            group: 'energy',
            disabledSectors: ['private'],
            perSector: [
                {
                    id: 'energy/inputs/wind_installed_A__ha',
                    name: 'installed-wind-area',
                    main: true,
                    precision: 1,
                    deltaFactor: 1,
                    deltaReference: ({ getData }) => getData('energy/wind/potential_area[ha]'),
                    //- data('energy/wind/installed_area[ha]'),
                },
            ],
        }),

        actionTemplate({
            name: 'increase-renewable-energy-share',
            group: 'energy',
            effectsCalculation: 'sub',
            processOrder: 'after',
            perSector: [
                {
                    id: 'energy/inputs/prchsd_renewable_nrg__G__W_h_per_a',
                    name: 'purchased-renewable-energy',
                    main: true,
                    precision: 1,
                    deltaFactor: 1,
                    deltaReference: ({ getDataRaw, getResults, sector }) => {
                        if (sector === 'schools') {
                            return 0
                        }

                        try {
                            const startDemand = getDataRaw([
                                'currentData',
                                'energy/direct_aquisition_renewable_energies/power[G*W*h]',
                            ])

                            const demand = getResults('all', [
                                'data',
                                'energy',
                                'elec_nrg_dmd[G*W*h/a]',
                            ])

                            const solarRoofSelfConsumption = getResults('all', [
                                'data',
                                'energy',
                                'sol_rf_self_cnsmp[G*W*h/a]',
                            ])

                            const solarLandscapeSelfConsumption = getResults('all', [
                                'data',
                                'energy',
                                'sol_os_self_cnsmp[G*W*h/a]',
                            ])

                            return Math.max(
                                0,
                                getLast(demand[sector]) -
                                    getLast(solarRoofSelfConsumption[sector]) -
                                    getLast(solarLandscapeSelfConsumption[sector]) -
                                    startDemand[sector],
                            )
                        } catch (error) {
                            console.warn('purchased-renewable-energy delta', error.message)
                            return 0
                        }
                    },
                },
            ],
        }),

        actionTemplate({
            name: 'replace-cars-with-bev',
            group: 'mobility',
            perSector: [
                {
                    id: 'mobility/inputs/n_bev__k__',
                    name: 'bev-cars',
                    main: true,
                    precision: 1,
                    deltaFactor: 1,
                    deltaReference: ({ getData }) =>
                        getData('mobility/cars/n_pkw[k]', 0) - getData('mobility/cars/n_bev[k]', 0),
                },
                // {
                //     id: 'mobility/inputs/n_cars__k__',
                //     name: 'cars',
                //     // main: true,
                //     // precision: 1,
                //     deltaFactor: -1,
                //     deltaReference: ({ getData }) => getData('mobility/cars/n_pkw[k]', 0) * 0.2,
                // },
            ],
        }),

        // reduce car share by 20% and increase public transport by 20%
        actionTemplate({
            name: 'promote-public-transport',
            group: 'mobility',
            disabledSectors: ['industry', 'public'],
            inputs: [
                {
                    id: 'mobility/inputs/modal_split_public_transport',
                    name: 'share-public-transport',
                    deltaFactor: 1,
                    precision: 1,
                    main: true,
                    deltaReference: ({ getData }) => {
                        const current = getData('mobility/modal_split/shares/public_transport[]')
                        const delta = Math.min(1, current + 0.2) - current
                        return delta
                    },
                },
                {
                    id: 'mobility/inputs/modal_split_car',
                    name: 'share-car',
                    deltaFactor: -1,
                    deltaReference: ({ getData }) => {
                        const currentPublic = getData(
                            'mobility/modal_split/shares/public_transport[]',
                        )
                        const deltaPublic = Math.min(1, currentPublic + 0.2) - currentPublic
                        const currentCar = getData('mobility/modal_split/shares/car[]')
                        const deltaCar = currentCar - Math.max(0, currentCar - deltaPublic)

                        return deltaCar
                    },
                },
                // {
                //     id: 'mobility/inputs/traveld_dist_per_person__m__m_per_a',
                //     name: 'car-usage',
                //     deltaFactor: -0.1,
                // },
            ],
        }),

        // reduce car share by 15% and increase bicycle by 15%
        actionTemplate({
            name: 'promote-bicycle',
            group: 'mobility',
            disabledSectors: ['industry', 'public'],
            inputs: [
                {
                    id: 'mobility/inputs/modal_split_bicycle',
                    name: 'share-bicycle',
                    deltaFactor: 1,
                    precision: 1,
                    main: true,
                    deltaReference: ({ getData }) => {
                        const current = getData('mobility/modal_split/shares/bicycle[]')
                        const delta = Math.min(1, current + 0.15) - current
                        return delta
                    },
                },
                {
                    id: 'mobility/inputs/modal_split_car',
                    name: 'share-car',
                    deltaFactor: -1,
                    deltaReference: ({ getData }) => {
                        const currentPublic = getData('mobility/modal_split/shares/bicycle[]')
                        const deltaPublic = Math.min(1, currentPublic + 0.15) - currentPublic
                        const currentCar = getData('mobility/modal_split/shares/car[]')
                        const deltaCar = currentCar - Math.max(0, currentCar - deltaPublic)

                        return deltaCar
                    },
                },
                // {
                //     id: 'mobility/inputs/traveld_dist_per_person__m__m_per_a',
                //     name: 'car-usage',
                //     deltaFactor: -0.1,
                // },
            ],
        }),
    ]
}

export function createActions() {
    const actionDefs = getActionDefs()

    actionDefs.forEach((action) => {
        const { inputs } = action
        action.inputs = []

        for (const input of inputs) {
            action.inputs.push(
                inputTemplate({
                    ...input,
                    actionName: action.name,
                    slug: input.name,
                }),
            )
        }

        const { perSector } = action
        delete action.perSector

        if (perSector) {
            for (const input of perSector) {
                for (const sector of sectors) {
                    action.inputs.push(
                        inputTemplate({
                            ...input,
                            actionName: action.name,
                            sector,
                            slug: input.name + '_' + sector,
                            id: input.id ? input.id + '/' + sector : '',
                        }),
                    )
                }
            }
        }
    })

    return actionDefs
}
