import { sectors, sectorsAndSchools } from './shared.js'

function calculateRelativeValues(input, output, key, populationFactor, onlySectors = null) {
    if (!input[key]) {
        console.warn(`key not found: ${key}`)
    }

    if (typeof input[key] !== 'object') {
        output[key] = input[key] * populationFactor
        return
    }

    output[key] = { ...input[key] }

    Object.entries(input[key]).forEach(([sector, value]) => {
        if (onlySectors && !onlySectors.includes(sector)) return
        output[key][sector] = value * populationFactor
    })
}

// calculate city data based on country stats
export default function calculateDataStats(referenceStats, fossilPrices, population) {
    console.log('calculate dataStats')
    const output = {}
    const input = referenceStats
    const populationFactor =
        population / (input['buildings/base_data/inhabitants[k]'].private * 1000)

    const copyIds = (ids) => {
        for (let id of ids) {
            output[id] = input[id]
        }
    }

    try {
        const key = 'buildings/base_data/inhabitants[k]'
        output[key] = { private: population / 1000 }
        for (const sector of sectorsAndSchools) {
            if (sector === 'private') continue

            output[key][sector] = input[key][sector] * populationFactor
        }

        const keyBuildings = 'buildings/base_data/n_buildings[]'
        calculateRelativeValues(input, output, keyBuildings, populationFactor)
        // const bShare = 0.84 * 0.2
        // output[keyBuildings].public += output[keyBuildings].private * bShare
        // output[keyBuildings].private *= 1 - bShare

        copyIds([
            'buildings/base_data/floor_area_per_building[qm]',
            'buildings/demand/heat[k*W*h/qm/a]',
            'buildings/demand/hot_water_per_capita[k*W*h/a]',
        ])

        const heatTypeKeys = [
            'oil_no_condensing[k*qm]',
            'oil_with_condensing[k*qm]',
            'gas[k*qm]',
            'heat_pump[k*qm]',
            'district_heating[k*qm]',
        ]

        for (const type of heatTypeKeys) {
            const key = `buildings/heat_types_areas/${type}`
            calculateRelativeValues(input, output, key, populationFactor)
        }

        copyIds([
            'buildings/demand/energy_per_capita[k*W*h/a]',
            'buildings/district_heating_renewable_part[]',
            'buildings/district_heating_price[EUR/k*W*h]',
            'buildings/other_output_nrg_price[EUR/k*W*h]',
        ])

        calculateRelativeValues(input, output, 'energy/solar_roof/roof_area[ha]', populationFactor)
        calculateRelativeValues(
            input,
            output,
            'energy/solar_roof/installed_power[M*Wp]',
            populationFactor,
        )

        copyIds([
            'energy/solar_roof/solar_suitable_portion_of_roof_area[]',
            'energy/solar_roof/self_consumption[]',
        ])

        calculateRelativeValues(
            input,
            output,
            'energy/solar_landscape/potential_area[ha]',
            populationFactor,
        )
        calculateRelativeValues(
            input,
            output,
            'energy/solar_landscape/solar_area[ha]',
            populationFactor,
        )

        copyIds(['energy/solar_landscape/self_consumption[]'])

        calculateRelativeValues(input, output, 'energy/wind/potential_area[ha]', populationFactor)
        calculateRelativeValues(input, output, 'energy/wind/installed_area[ha]', populationFactor)

        calculateRelativeValues(
            input,
            output,
            'energy/direct_aquisition_renewable_energies/power[G*W*h]',
            populationFactor,
        )

        copyIds([
            'energy/direct_aquisition_renewable_energies/price[EUR/k*W*h]',
            'energy/aquisition_power_mix/aquisition_power_mix[EUR/k*W*h]',
        ])

        calculateRelativeValues(input, output, 'mobility/cars/n_pkw[k]', populationFactor)
        calculateRelativeValues(input, output, 'mobility/cars/n_bev[k]', populationFactor)

        copyIds([
            'mobility/cars/kilometers_traveled_per_person[k*k*m]',
            'mobility/cars/mean_persons_per_car[]',
            'mobility/modal_split/shares/pedestrians[]',
            'mobility/modal_split/shares/bicycle[]',
            'mobility/modal_split/shares/public_transport[]',
            'mobility/modal_split/shares/plane[]',
            'mobility/modal_split/shares/car[]',
        ])

        calculateRelativeValues(
            input,
            output,
            'mobility/street_lighting/street_lighting/n_lanterns[k]',
            populationFactor,
        )

        copyIds([
            'mobility/street_lighting/street_lighting/power_consumption_per_latern[k*W*h/a]',
            'mobility/street_lighting/street_lighting/other_costs_per_lantern[EUR/a]',
        ])
    } catch (e) {
        console.error('error calculating output', e)
    }

    output['buildings/fossil_fuel_prices/oil[EUR/L]'] = fossilPrices.heatingOil
    output['buildings/fossil_fuel_prices/gas[EUR/m3]'] = fossilPrices.heatingGas
    output['mobility/fossil_fuel_prices/fuel[EUR/L]'] = fossilPrices.fuel

    // compare ids
    const missingKeys = []
    for (let key of Object.keys(input)) {
        if (!output[key]) {
            missingKeys.push(key)
        }
    }
    if (missingKeys.length) {
        console.warn('data-stats missing keys', missingKeys)
    }
    console.log('output', output)
    return output
}
