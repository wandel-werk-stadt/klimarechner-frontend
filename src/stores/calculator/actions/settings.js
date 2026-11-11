const endYear = 2045
export const defaultSettings = {
    'fossil-price-increase': {
        inputs: [
            { name: 'price-oil', deltaRelative: 0, endYear },
            { name: 'price-gas', deltaRelative: 0, endYear },
            { name: 'price-fuel', deltaRelative: 0, endYear },
        ],
    },
    'replace-gas-heating': {
        inputs: [
            { name: 'gas', deltaRelative: 0 },
            { name: 'heat-pump-district-heating-distribution', deltaRelative: 0.3 },
            { name: 'heat-pump', deltaRelative: 1 },
            { name: 'district-heating', deltaRelative: 1 },
        ],
    },
    'replace-oil-heating': {
        inputs: [
            { name: 'oil', deltaRelative: 0 },
            {
                name: 'heat-pump-district-heating-distribution',
                deltaRelative: 0.3,
            },
            { name: 'heat-pump', deltaRelative: 1 },
            { name: 'district-heating', deltaRelative: 1 },
        ],
    },
}

export const climateNeutralSettings = {
    'fossil-price-increase': {
        inputs: [
            { name: 'price-oil', deltaRelative: 0, endYear },
            { name: 'price-gas', deltaRelative: 0, endYear },
            { name: 'price-fuel', deltaRelative: 0, endYear },
        ],
    },
    'reduce-heat-demand': {
        inputs: [{ name: 'heat-demand', deltaRelative: 0.3 }],
    },
    'replace-gas-heating': {
        inputs: [
            { name: 'gas', deltaRelative: 1.0 },
            { name: 'heat-pump-district-heating-distribution', deltaRelative: 0.5 },
            { name: 'heat-pump', deltaRelative: 1 },
            { name: 'district-heating', deltaRelative: 1 },
        ],
    },
    'replace-oil-heating': {
        inputs: [
            { name: 'oil', deltaRelative: 1.0 },
            { name: 'oil-condensing', deltaRelative: 1.0 },
            { name: 'heat-pump-district-heating-distribution', deltaRelative: 0.5 },
            { name: 'heat-pump', deltaRelative: 1 },
            { name: 'district-heating', deltaRelative: 1 },
        ],
    },

    'expand-photovoltaics-roof': {
        inputs: [
            {
                name: 'installed-solar-roof-area',
                deltaRelative: 0.1,
            },
        ],
    },
    'expand-photovoltaics-landscape': {
        inputs: [
            {
                name: 'installed-solar-landscape-area',
                deltaRelative: 0.1,
            },
            {
                name: 'installed-solar-landscape-area',
                deltaRelative: 0,
                sector: 'private',
            },
        ],
    },
    'expand-wind-energy': {
        inputs: [
            {
                name: 'installed-wind-area',
                deltaRelative: 0.1,
            },
            {
                name: 'installed-wind-area',
                deltaRelative: 0,
                sector: 'private',
            },
        ],
    },

    'increase-renewable-energy-share': {
        inputs: [
            {
                name: 'purchased-renewable-energy',
                deltaRelative: 1.0,
            },
        ],
    },

    'replace-cars-with-bev': {
        inputs: [
            {
                name: 'bev-cars',
                deltaRelative: 1.0,
            },
        ],
    },

    'promote-public-transport': {
        inputs: [
            {
                name: 'share-public-transport',
                deltaRelative: 0,
            },
        ],
    },

    'promote-bicycle': {
        inputs: [
            {
                name: 'share-bicycle',
                deltaRelative: 0,
            },
        ],
    },
}

export function applySettings(actions = [], settings = {}) {
    const copyKeys = ['active', 'deltaRelative', 'startYear', 'endYear']

    for (const name in settings) {
        const action = actions.find((a) => a.name === name)
        if (!action) {
            continue
        }

        const config = settings[name]
        for (const cInput of config.inputs) {
            const inputs = action.inputs.filter(
                (i) => i.name === cInput.name && (!cInput.sector || i.sector === cInput.sector),
            )
            if (!inputs.length) {
                continue
            }

            for (const key of copyKeys) {
                if (cInput[key] === undefined) {
                    continue
                }

                for (const input of inputs) {
                    input[key] = cInput[key]
                }
            }

            if (cInput.active === undefined) {
                for (const input of inputs) {
                    input.active = input.deltaRelative > 0 || input.fixed
                }
            }
        }
    }
}

export function mergeSettings(actions = [], settings = []) {
    // apply settings to actions
    const copyKeys = ['active', 'deltaRelative', 'startYear', 'endYear']

    for (const action of actions) {
        const actionSettings = settings.find((s) => s.name === action.name)
        if (!actionSettings) {
            continue
        }

        for (const input of action.inputs) {
            const inputSettings = actionSettings.inputs.find(
                (s) => s.name === input.name && (!input.sector || s.sector === input.sector),
            )
            if (!inputSettings) {
                continue
            }

            for (const key of copyKeys) {
                input[key] = inputSettings[key]
            }
        }
    }
}
