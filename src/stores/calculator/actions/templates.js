import { year, nudgeYear } from '../shared'

const rules = {
    // 'reduce-cars': {
    //     'number-of-cars'(input) {
    //         const input2 = getActionInput('replace-cars-with-bev', 'cars', input.sector)
    //         console.log('rule1', input, input.slug, input2)
    //         if (input2 && input.deltaRelativeValue + input2.deltaRelativeValue > 1) {
    //             input2.deltaRelativeValue = 1 - input.deltaRelativeValue
    //         }
    //     },
    // },
    // 'replace-cars-with-bev': {
    //     cars(input) {
    //         const input2 = getActionInput('reduce-cars', 'number-of-cars', input.sector)
    //         console.log('rule2', input.slug, input2)
    //         if (input2 && input.deltaRelativeValue + input2.deltaRelativeValue > 1) {
    //             input2.deltaRelativeValue = 1 - input.deltaRelativeValue
    //         }
    //     },
    // },

    'replace-gas-heating': {
        // gas(input) {
        //     const input2 = getActionInput('install-heat-pumps', 'gas', input.sector)
        //     if (input2 && input.deltaRelativeValue + input2.deltaRelativeValue > 1) {
        //         input2.deltaRelativeValue = 1 - input.deltaRelativeValue
        //     }
        // }
    },
    'replace-oil-heating': {},
    'install-heat-pumps': {},
    'install-district-heating': {},
}

function handleRules(input) {
    const rule = rules[input.actionName]?.[input.name]
    if (rule) {
        rule(input)
    }
}

function getActionInput(actionName, inputName, sector = '') {
    const action = actionDefs.find((action) => action.name === actionName)
    if (!action) {
        return false
    }

    return action.inputs.find((input) => input.name === inputName && input.sector === sector)
}

export const inputTemplate = (obj) => ({
    name: '',
    id: '',
    unit: '',
    precision: 0,
    main: false,
    // show as separate input field
    separate: false,
    // fixed deltaRelative
    fixed: false,
    deltaReference: false,
    deltaFactor: -1, // -1 = add, 1 = subtract
    deltaRelativeValueRaw: 0, // 0 - 1
    ...obj,

    // reference value
    value: 0,
    // reference calculated by fn
    valueRef: undefined,

    // reset
    active: false,
    startYear: year,
    endYear: nudgeYear,
    delta: 0,

    get deltaRelative() {
        return this.deltaRelativeValue
    },
    set deltaRelative(rel) {
        this.deltaRelativeValue = rel
        // handleRules(this)
    },

    // internal
    get currentValue() {
        return this.valueRef === undefined ? this.value : this.valueRef
    },

    get deltaRelativeValue() {
        return this.deltaRelativeValueRaw
    },
    set deltaRelativeValue(rel) {
        this.deltaRelativeValueRaw = rel
        this.calculateDelta()
    },

    calculateDelta() {
        this.delta = this.currentValue * (this.deltaFactor * -1) * this.deltaRelativeValue
    },
})

export const actionTemplate = (obj) => ({
    name: '',
    group: '',
    subGroup: '',
    inputs: [],
    disabled: false,
    disabledSectors: undefined,

    // value, delta, target are added (e.g. public & schools)
    absolute: true,

    // add: compare no actions to this action
    // sub: compare all actions to all actions without this action
    effectsCalculation: 'add',
    // normal: run action with other actions during calculation
    // after: run action after other actions during second calculation
    processOrder: 'normal',

    ...obj,
    //
    get mainInputs() {
        return this.inputs.filter((i) => i.main)
    },

    value(sector = '') {
        return this.mainInputs.reduce((sum, input) => {
            if (sector && input.sector && input.sector !== sector) {
                return sum
            }
            return sum + input.value
        }, 0)
    },

    delta(sector = '') {
        return this.mainInputs.reduce((sum, input) => {
            if (sector && input.sector && input.sector !== sector) {
                return sum
            }
            return sum + input.delta
        }, 0)
    },

    target(sector = '') {
        const v = this.value(sector)
        const d = this.delta(sector)
        return v - d
    },

    //
    get deltaRelative() {
        if (!this.inputs?.length) {
            return 0
        }

        let sum = 0
        for (const input of this.inputs) {
            sum += input.currentValue
        }

        return this.inputs.reduce((acc, input) => {
            if (input.fixed) {
                return acc
            }

            const share = Math.abs(input.currentValue) / sum
            return acc + input.deltaRelative * share
        }, 0)
    },
    set deltaRelative(rel) {
        for (const input of this.inputs) {
            if (!input.fixed) {
                input.deltaRelative = rel
            }
        }
    },

    get active() {
        return this.inputs.length
            ? this.inputs.reduce((sum, input) => {
                  if (input.active && !input.separate) {
                      sum += 1
                  }
                  return sum
              }, 0) / this.inputs.length
            : 0
    },
    set active(value) {
        const state = Boolean(value)
        this.inputs.forEach((input) => {
            input.active = state
        })
    },

    get activeState() {
        return this.active === 0 ? false : this.active === 1 ? true : null
    },

    get startYear() {
        return this.inputs.length
            ? this.inputs.reduce(
                  (min, input) => (!min || min > input.startYear ? input.startYear : min),
                  0,
              )
            : year
    },
    set startYear(value) {
        this.inputs.forEach((input) => {
            input.startYear = value
        })
    },

    get endYear() {
        return this.inputs.length
            ? this.inputs.reduce(
                  (min, input) => (!min || min < input.endYear ? input.endYear : min),
                  0,
              )
            : year
    },
    set endYear(value) {
        this.inputs.forEach((input) => {
            input.endYear = value
        })
    },
})
