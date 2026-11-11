export const sectors = ['private', 'industry', 'public', 'schools']
export const sectorsMain = ['private', 'industry', 'public']

export const year = Math.max(2024, new Date().getFullYear())
export const nudgeYear = 2040
export const maxYear = 2045

// prettier-ignore
export const inputIdTranslation = {
    perSector: {
        'buildings/inputs/n_inhabitants__k__': 'buildings/base_data/inhabitants[k]',
        'buildings/inputs/n_buildings': 'buildings/base_data/n_buildings[]',
        'buildings/inputs/floor_A_building__m2': 'buildings/base_data/floor_area_per_building[qm]',
        'buildings/inputs/hot_water_dmd__k__W_h_per_m2_a':
        'buildings/demand/hot_water_per_capita[k*W*h/a]',
        'buildings/inputs/heat_dmd__k__W_h_per_m2_a': 'buildings/demand/heat[k*W*h/qm/a]',
        'buildings/inputs/A_heat_oil__k__m2': 'buildings/heat_types_areas/oil_no_condensing[k*qm]',
        'buildings/inputs/A_heat_oil_condensing__k__m2':
        'buildings/heat_types_areas/oil_with_condensing[k*qm]',
        'buildings/inputs/A_heat_gas__k__m2': 'buildings/heat_types_areas/gas[k*qm]',
        'buildings/inputs/A_heat_heat_pump__k__m2': 'buildings/heat_types_areas/heat_pump[k*qm]',
        'buildings/inputs/A_heat_district_heating__k__m2':
        'buildings/heat_types_areas/district_heating[k*qm]',
        'buildings/inputs/elec_dmd_capita__k_W_h_per_a':
            'buildings/demand/energy_per_capita[k*W*h/a]',

        'mobility/inputs/n_cars__k__': 'mobility/cars/n_pkw[k]',
        'mobility/inputs/n_bev__k__': 'mobility/cars/n_bev[k]',
        // 'mobility/inputs/traveld_dist_car__M__m_per_a': 'mobility/cars/kilometers_traveled[k*k*m]',

        'energy/inputs/rf_A__ha': 'energy/solar_roof/roof_area[ha]',
        'energy/inputs/sol_rf_suitable_A_part':
            'energy/solar_roof/solar_suitable_portion_of_roof_area[]',
        'energy/inputs/sol_rf_installed__M__Wp': 'energy/solar_roof/installed_power[M*Wp]',
        'energy/inputs/sol_rf_self_cnsmp_part': 'energy/solar_roof/self_consumption[]',
        'energy/inputs/sol_os_installed_A__ha': 'energy/solar_landscape/solar_area[ha]',
        'energy/inputs/sol_os_self_cnsmp_part': 'energy/solar_landscape/self_consumption[]',

        'energy/inputs/wind_suitable_A__ha': 'energy/wind/potential_area[ha]',
        'energy/inputs/wind_installed_A__ha': 'energy/wind/installed_area[ha]',

        'energy/inputs/prchsd_renewable_nrg__G__W_h_per_a':
            'energy/direct_aquisition_renewable_energies/power[G*W*h]',
        'energy/inputs/renewable_nrg_price__m__eur_per_W_h':
            'energy/direct_aquisition_renewable_energies/price[EUR/k*W*h]',
        'energy/inputs/nrg_mix_price__m__eur_per_W_h':
            'energy/aquisition_power_mix/aquisition_power_mix[EUR/k*W*h]',
    },

    direct: {
        'buildings/inputs/price_oil__eur_per_L': 'buildings/fossil_fuel_prices/oil[EUR/L]',
        'buildings/inputs/price_gas__eur_per_m3': 'buildings/fossil_fuel_prices/gas[EUR/m3]',
        'mobility/inputs/price_fuel__eur_per_L': 'mobility/fossil_fuel_prices/fuel[EUR/L]',

        'buildings/inputs/district_heating_renewable_part':
            'buildings/district_heating_renewable_part[]',
        'buildings/inputs/price_district_heating__m__eur_per_W_h':
            'buildings/district_heating_price[EUR/k*W*h]',
        'buildings/inputs/price_other_output_nrg__m__eur_per_W_h':
            'buildings/other_output_nrg_price[EUR/k*W*h]',

        'mobility/inputs/traveld_dist_per_person__m__m_per_a':
            'mobility/cars/kilometers_traveled_per_person[k*k*m]',
        'mobility/inputs/mean_persons_per_car': 'mobility/cars/mean_persons_per_car[]',

        'mobility/inputs/modal_split_pedestrians': 'mobility/modal_split/shares/pedestrians[]',
        'mobility/inputs/modal_split_bicycle': 'mobility/modal_split/shares/bicycle[]',
        'mobility/inputs/modal_split_public_transport':
            'mobility/modal_split/shares/public_transport[]',
        'mobility/inputs/modal_split_plane': 'mobility/modal_split/shares/plane[]',
        'mobility/inputs/modal_split_car': 'mobility/modal_split/shares/car[]',

        'mobility/inputs/n_sl__k__': 'mobility/street_lighting/street_lighting/n_lanterns[k]',
        'mobility/inputs/nrg_cnsmp_per_sl__k__W_h_per_a':
            'mobility/street_lighting/street_lighting/power_consumption_per_latern[k*W*h/a]',
        'mobility/inputs/om_costs_per_sl__eur_per_a':
            'mobility/street_lighting/street_lighting/other_costs_per_lantern[EUR/a]',
    },
}

// prettier-ignore
export const resultIds = {
    perSector: {
        'buildings/results/floor_A__k__m2': 'buildings/floor_area[k*qm]',
        'buildings/results/total_heat_dmd__G__W_h_per_a': 'buildings/total_heat_dmd[G*W*h/a]',
        'buildings/results/elec_dmd__G__W_h_per_a': 'buildings/elec_dmd[G*W*h/a]',
        'buildings/results/cnsmp_oil__G__W_h_per_a': 'buildings/cnsmp_oil[G*W*h/a]',
        'buildings/results/cnsmp_oil_condensing__G__W_h_per_a':
            'buildings/cnsmp_oil_condensing[G*W*h/a]',
        'buildings/results/cnsmp_gas__G__W_h_per_a': 'buildings/cnsmp_gas[G*W*h/a]',
        'buildings/results/cnsmp_elec_heat_pump__G__W_h_per_a':
            'buildings/cnsmp_elec_heat_pump[G*W*h/a]',
        'buildings/results/cnsmp_other__G__W_h_per_a': 'buildings/cnsmp_other[G*W*h/a]',
        'buildings/results/cnsmp_oil__M__L_per_a': 'buildings/cnsmp_oil[M*L/a]',
        'buildings/results/cnsmp_gas__M__m3_per_a': 'buildings/cnsmp_gas[M*m3/a]',

        'buildings/results/costs_oil__M__eur_per_a': 'buildings/costs_oil[M*EUR/a]',
        'buildings/results/costs_gas__M__eur_per_a': 'buildings/costs_gas[M*EUR/a]',

        'buildings/results/invest_heat_sources__M__eur_per_a':
            'buildings/invest_heat_sources[M*EUR/a]',
        'buildings/results/invest_energetic_renovation__M__eur_per_a':
            'buildings/invest_energetic_renovation[M*EUR/a]',
        'buildings/results/grant_heat_sources__M__eur_per_a':
            'buildings/grant_heat_sources[M*EUR/a]',
        'buildings/results/grant_energetic_renovation__M__eur_per_a':
            'buildings/grant_energetic_renovation[M*EUR/a]',
        'buildings/results/costs_heat_pump__M__eur': 'buildings/costs_heat_pump[M*EUR]',

        'buildings/results/cnsmp_district_heating__G__W_h_per_a':
            'buildings/cnsmp_district_heating[G*W*h/a]',
        'buildings/results/cnsmp_gas_district_heating__M__m3_per_a':
            'buildings/cnsmp_district_heating[M*m3/a]',
        'buildings/results/costs_client_district_heating__M__eur_per_a':
            'buildings/costs_client_district_heating[M*EUR/a]',

        'buildings/results/ems_oil__k__to_coe_per_a': 'buildings/ems_oil[k*to_coe/a]',
        'buildings/results/ems_gas__k__to_coe_per_a': 'buildings/ems_gas[k*to_coe/a]',

        'buildings/results/costs_other__M__eur_per_a': 'buildings/costs_other[M*EUR/a]',
        'buildings/results/costs_total__M__eur': 'buildings/costs_total[M*EUR/a]',

        'mobility/results/cars_grant__M__eur_per_a': 'mobility/cars_grant[M*EUR/a]',
        'mobility/results/bev_elec_nrg_dmd__G__W_h_per_a': 'mobility/bev_elec_nrg_dmd[G*W*h/a]',
        'mobility/results/bev_elec_nrg_price__G__W_h_per_a': 'mobility/bev_elec_nrg_price[G*W*h/a]',
        'mobility/results/cars_fuel_dmd__M__L_per_a': 'mobility/cars_fuel_dmd[M*L/a]',
        'mobility/results/cars_fuel_costs__M__eur_per_a': 'mobility/cars_fuel_costs[M*EUR/a]',
        'mobility/results/bev_nrg_costs__M__eur_per_a': 'mobility/bev_nrg_costs[M*EUR/a]',
        'mobility/results/cars_ems__k__to_coe_per_a': 'mobility/cars_ems[k*to_coe/a]',
        'mobility/results/traveld_dist_car__M__m_per_a': 'mobility/traveld_dist_car[k*k*m/a]',

        'energy/results/sol_rf_potential__M__Wp': 'energy/sol_rf_potential[M*Wp]',
        'energy/results/sol_rf_nrg__G__W_h_per_a': 'energy/sol_rf_nrg[G*W*h/a]',
        'energy/results/sol_rf_self_cnsmp__G__W_h_per_a': 'energy/sol_rf_self_cnsmp[G*W*h/a]',
        'energy/results/sol_rf_invest__M__eur_per_a': 'energy/sol_rf_invest[M*EUR/a]',
        'energy/results/sol_rf_grant__M__eur_per_a': 'energy/sol_rf_grant[M*EUR/a]',
        'energy/results/sol_rf_om__M__eur_per_a': 'energy/sol_rf_om[M*EUR/a]',
        'energy/results/sol_rf_revenue__M__eur_per_a': 'energy/sol_rf_revenue[M*EUR/a]',

        'energy/results/sol_os_installed__M__Wp': 'energy/sol_os_installed[M*Wp]',
        'energy/results/sol_os_nrg__G__W_h_per_a': 'energy/sol_os_nrg[G*W*h/a]',
        'energy/results/sol_os_self_cnsmp__G__W_h_per_a': 'energy/sol_os_self_cnsmp[G*W*h/a]',
        'energy/results/sol_os_invest__M__eur_per_a': 'energy/sol_os_invest[M*EUR/a]',
        'energy/results/sol_os_grant__M__eur_per_a': 'energy/sol_os_grant[M*EUR/a]',
        'energy/results/sol_os_om__M__eur_per_a': 'energy/sol_os_om[M*EUR/a]',
        'energy/results/sol_os_turnover_buyback__M__eur_per_a':
            'energy/sol_os_turnover_buyback[M*EUR/a]',
        'energy/results/sol_os_revenue__M__eur_per_a': 'energy/sol_os_revenue[M*EUR/a]',
        'energy/results/sol_os_prod_costs__M__eur_per_a': 'energy/sol_os_prod_costs[M*EUR/a]',

        'energy/results/wind_installed__M__WP': 'energy/wind_installed[M*Wp]',
        'energy/results/wind_nrg__G__W_h_per_a': 'energy/wind_nrg[G*W*h/a]',
        'energy/results/wind_invest__M__eur_per_a': 'energy/wind_invest[M*EUR/a]',
        'energy/results/wind_grant__M__eur_per_a': 'energy/wind_grant[M*EUR/a]',
        'energy/results/wind_om__M__eur_per_a': 'energy/wind_om[M*EUR/a]',
        'energy/results/wind_turnover_buyback__M__eur_per_a':
            'energy/wind_turnover_buyback[M*EUR/a]',
        'energy/results/wind_revenue__M__eur_per_a': 'energy/wind_revenue[M*EUR/a]',

        'energy/results/prchsd_renewable_nrg__G__W_h_per_a': 'energy/prchsd_renewable_nrg[G*W*h/a]',
        'energy/results/prchsd_renewable_nrg__M__eur_per_a': 'energy/prchsd_renewable_nrg[M*EUR/a]',
        'energy/results/elec_nrg_dmd__G__W_h_per_a': 'energy/elec_nrg_dmd[G*W*h/a]',
        'energy/results/prchsd_nrg_mix__G__W_h_per_a': 'energy/prchsd_nrg_mix[G*W*h/a]',
        'energy/results/prchsd_nrg_mix_costs__M__eur_per_a': 'energy/prchsd_nrg_mix_costs[M*EUR/a]',
        'energy/results/prchsd_nrg_mix_ems__k__to_coe_per_a':
            'energy/prchsd_nrg_mix_ems[k*to_coe/a]',
        'energy/results/nrg_own_mix_price__m__eur_per_W_h': 'energy/nrg_own_mix_price[EUR/k*W*h]',
    },

    direct: {
        'mobility/results/sl_nrg_dmd__G__W_h_per_a': 'mobility/sl_nrg_dmd[G*W*h/a]',
        'mobility/results/sl_nrg_costs__M__eur_per_a': 'mobility/sl_nrg_costs[M*EUR/a]',
        'mobility/results/sl_om_costs__M__eur_per_a': 'mobility/sl_om_costs[M*EUR/a]',
        'mobility/results/sl_total_costs__M__eur_per_a': 'mobility/sl_total_costs[M*EUR/a]',

        'economy/results/invest_heating_material': 'economy/invest_heating_material',
        'economy/results/invest_heating_work': 'economy/invest_heating_work',

        'economy/results/turnover_heating_crafting_local':
            'economy/turnover_heating_crafting_local',
        'economy/results/turnover_heating_crafting_national':
            'economy/turnover_heating_crafting_national',

        'economy/results/turnover_heating_production_national':
            'economy/turnover_heating_production_national',

        'economy/results/invest_heat_demand_material': 'economy/invest_heat_demand_material',
        'economy/results/invest_heat_demand_work': 'economy/invest_heat_demand_work',
        'economy/results/turnover_heat_demand_crafting_local':
            'economy/turnover_heat_demand_crafting_local',
        'economy/results/turnover_heat_demand_crafting_national':
            'economy/turnover_heat_demand_crafting_national',
        'economy/results/turnover_heat_demand_production_national':
            'economy/turnover_heat_demand_production_national',

        'economy/results/invest_solar_roof_material': 'economy/invest_solar_roof_material',
        'economy/results/invest_solar_roof_work': 'economy/invest_solar_roof_work',
        'economy/results/maintenance_solar_roof_work': 'economy/maintenance_solar_roof_work',

        'economy/results/turnover_solar_roof_crafting_local':
            'economy/turnover_solar_roof_crafting_local',
        'economy/results/turnover_solar_roof_crafting_national':
            'economy/turnover_solar_roof_crafting_national',
        'economy/results/turnover_solar_roof_production_national':
            'economy/turnover_solar_roof_production_national',

        'economy/results/invest_solar_landscape_material':
            'economy/invest_solar_landscape_material',
        'economy/results/invest_solar_landscape_work': 'economy/invest_solar_landscape_work',
        'economy/results/maintenance_solar_landscape_work':
            'economy/maintenance_solar_landscape_work',

        'economy/results/turnover_solar_landscape_crafting_local':
            'economy/turnover_solar_landscape_crafting_local',
        'economy/results/turnover_solar_landscape_crafting_national':
            'economy/turnover_solar_landscape_crafting_national',
        'economy/results/turnover_solar_landscape_production_national':
            'economy/turnover_solar_landscape_production_national',

        'economy/results/n_jobs_crafting_local': 'economy/n_jobs_crafting_local',
        'economy/results/n_jobs_crafting_national': 'economy/n_jobs_crafting_national',
        'economy/results/n_jobs_production_national': 'economy/n_jobs_production_national',

        'economy/results/revenue_local': 'economy/revenue_local',
        'economy/results/energy_tax_national': 'economy/energy_tax_national',

        'economy/results/income_local': 'economy/income_local',
        'economy/results/income_national': 'economy/income_national',

        'economy/results/income_tax_local': 'economy/income_tax_local',
        'economy/results/income_tax_national': 'economy/income_tax_national',

        'economy/results/turnover_local': 'economy/turnover_local',
        'economy/results/turnover_national': 'economy/turnover_national',

        'economy/results/turnover_tax_local': 'economy/turnover_tax_local',
        'economy/results/turnover_tax_national': 'economy/turnover_tax_national',

        'economy/results/business_tax_local': 'economy/business_tax_local',
        'economy/results/business_tax_national': 'economy/business_tax_national',

        'economy/results/corporate_tax_national': 'economy/corporate_tax_national',

        'stakeholders/results/private_invest': 'stakeholders/private_invest',
        'stakeholders/results/private_effect_of_measures':
            'stakeholders/private_effect_of_measures',
        'stakeholders/results/private_cash_flow_netto': 'stakeholders/private_cash_flow_netto',

        'stakeholders/results/industry_invest': 'stakeholders/industry_invest',
        'stakeholders/results/industry_effect_of_measures':
            'stakeholders/industry_effect_of_measures',
        // turnover * revenue margin 5%
        'stakeholders/results/industry_profit_from_measures':
            'stakeholders/industry_profit_from_measures',
        'stakeholders/results/industry_cash_flow_netto': 'stakeholders/industry_cash_flow_netto',

        'stakeholders/results/community_invest': 'stakeholders/public_invest',
        'stakeholders/results/community_effect_of_measures':
            'stakeholders/public_effect_of_measures',
        'stakeholders/results/community_tax_income_from_measures':
            'stakeholders/public_tax_income_from_measures',
        'stakeholders/results/community_cash_flow_netto': 'stakeholders/public_cash_flow_netto',

        'stakeholders/results/federal_additional_expenses':
            'stakeholders/federal_additional_expenses',
        'stakeholders/results/federal_additional_tax_income':
            'stakeholders/federal_additional_tax_income',
        'stakeholders/results/federal_cash_flow_netto': 'stakeholders/federal_cash_flow_netto',
    },
}

export const ignoreInputIds = [
    'mobility/inputs/modal_split_pedestrians',
    'mobility/inputs/modal_split_bicycle',
    'mobility/inputs/modal_split_public_transport',
    'mobility/inputs/modal_split_plane',

    'mobility/inputs/n_cars__k__/schools',
    'mobility/inputs/n_bev__k__/schools',
    'energy/inputs/rf_A__ha/schools',
    'energy/inputs/sol_rf_suitable_A_part/schools',
    'energy/inputs/sol_rf_installed__M__Wp/schools',
    'energy/inputs/sol_rf_self_cnsmp_part/schools',
    'energy/inputs/sol_os_installed_A__ha/schools',
    'energy/inputs/sol_os_self_cnsmp_part/schools',
    'energy/inputs/wind_suitable_A__ha/schools',
    'energy/inputs/wind_installed_A__ha/schools',
    'energy/inputs/prchsd_renewable_nrg__G__W_h_per_a/schools',
    'energy/inputs/renewable_nrg_price__m__eur_per_W_h/schools',
    'energy/inputs/nrg_mix_price__m__eur_per_W_h/schools',
]

export function reverseInputIdTranslation(key) {
    const translation = Object.entries(inputIdTranslation.perSector).find(
        ([, value]) => value === key,
    )
    if (translation) {
        return translation[0]
    }

    const translation2 = Object.entries(inputIdTranslation.direct).find((value) => value === key)
    if (translation2) {
        return translation2[0]
    }

    return null
}

export function getLast(array) {
    return array[array.length - 1]
}

export function getObjectValueByPath(data = {}, path = []) {
    return path.reduce((data, key) => {
        return data && data[key]
    }, data)
}

export function createNestedObject(base = {}, path = '') {
    const indexBracket = path.indexOf('[')
    const parts = path.slice(0, indexBracket).split('/')
    parts[parts.length - 1] += path.slice(indexBracket)

    let obj = base
    for (const part of parts) {
        obj[part] = obj[part] || {}
        obj = obj[part]
    }

    return obj
}

export function getPathByInputId(inputId) {
    const parts = inputId.split('/')
    const sector = parts.slice(-1)[0]

    if (sectors.includes(sector)) {
        const path = [inputIdTranslation.perSector[parts.slice(0, -1).join('/')], sector]
        return path
    } else {
        return [inputIdTranslation.direct[inputId]]
    }
}

export function getPathByInputIdWithSector(inputId, sector) {
    return [inputIdTranslation.perSector[inputId], sector]
}

export function getValueByInputId(data, inputId, sector) {
    let path
    if (sector) {
        path = getPathByInputIdWithSector(inputId, sector)
    } else {
        path = getPathByInputId(inputId)
    }

    if (!path || !path.length) {
        return null
    }

    return getObjectValueByPath(data, path)
}

export function getArrayDelta(a1, a2) {
    return a1.map((v1, index) => {
        v1 = v1 || 0
        const v2 = a2[index] || 0

        return v2 - v1
    })
}

export function getResultsDelta(r1, r2) {
    const delta = {}

    for (const cat of Object.keys(r1)) {
        delta[cat] = {}

        for (const subCat of Object.keys(r1[cat])) {
            const result = {}
            delta[cat][subCat] = result

            const item = r1[cat][subCat]
            if (!item) {
                continue
            }

            result._id = item._id

            if (item?.value instanceof Float64Array) {
                const list1 = item.value
                const list2 = r2[cat][subCat]?.value
                result.value = getArrayDelta(list1, list2)
            } else if (typeof item === 'object' && subCat !== 'additional') {
                for (const sector of sectors) {
                    const list1 = item[sector]
                    const list2 = r2[cat][subCat][sector]
                    if (list1 && list2) {
                        result[sector] = getArrayDelta(list1, list2)
                    }
                }
            }
        }
    }

    return delta
}

export function getArraySum(a1, a2) {
    return a1.map((v1, index) => {
        v1 = v1 || 0
        const v2 = a2[index] || 0

        return v1 + v2
    })
}

export function getResultsSum(r1, r2) {
    const delta = {}

    for (const cat of Object.keys(r1)) {
        delta[cat] = {}

        for (const subCat of Object.keys(r1[cat])) {
            const result = {}
            delta[cat][subCat] = result

            const item = r1[cat][subCat]
            if (!item) {
                continue
            }

            result._id = item._id

            if (item?.value instanceof Float64Array) {
                const list1 = item.value
                const list2 = r2[cat][subCat]?.value
                result.value = getArraySum(list1, list2)
            } else if (typeof item === 'object' && subCat !== 'additional') {
                for (const sector of sectors) {
                    const list1 = item[sector]
                    const list2 = r2[cat][subCat][sector]
                    if (list1 && list2) {
                        result[sector] = getArraySum(list1, list2)
                    }
                }
            }
        }
    }

    return delta
}
