import { Calculator, default as core } from '@/climcalc/climcalc_core.js'
import {
    sectors,
    createNestedObject,
    resultIds,
    getResultsDelta,
    getResultsSum,
    ignoreInputIds,
} from './shared'
import { calculateEffects } from './output'

await core()

function Machine(startYear, endYear) {
    const self = this
    self.debug = true
    self.log = function log() {
        if (self.debug) console.info('💻', ...arguments)
    }
    self.calculator = null
    self.startYear = null
    self.endYear = null
    self.yearRange = []
    self.currentActionIds = {}

    self.updateTimeframe(startYear, endYear)

    if (self.debug) {
        // self.log('input ids', self.calculator.list_input_ids())
        self.compareResultIds()
    }
}

export default Machine

Machine.prototype.compareResultIds = function () {
    const self = this
    const ids = self.calculator.list_result_ids()
    const newIds = ids.filter((id) => {
        if (resultIds.direct[id]) {
            return false
        }

        const shortId = id.slice(0, id.lastIndexOf('/'))
        if (resultIds.perSector[shortId]) {
            return false
        }

        return true
    })

    if (newIds.length) {
        console.warn('new result ids found', newIds)
    }
}

Machine.prototype.updateTimeframe = function (startYear, endYear) {
    const self = this
    // self.log('timeframe', startYear, endYear)
    self.calculator = Calculator.new(startYear, endYear)
    self.startYear = startYear
    self.endYear = endYear
    self.yearRange = [...Array(endYear - startYear + 1).keys()].map((i) => i + startYear)
    self.currentActionIds = {}
}

Machine.prototype.reset = function () {
    const self = this
    self.updateTimeframe(self.startYear, self.endYear)
}

Machine.prototype.getActionIds = function () {
    const self = this

    return self.calculator.list_measure_ids().reduce((acc, list) => {
        if (list.length > 0) {
            list.forEach((id) => {
                acc[id] = (acc[id] || 0) + 1
            })
        }
        return acc
    }, {})
}

Machine.prototype.setInputs = function (params) {
    const self = this
    const ids = []

    // self.log('setting inputs')
    for (const [key, value] of Object.entries(params)) {
        if (ignoreInputIds.includes(key)) {
            continue
        }

        ids.push(key)
        // console.log('set input', key, value)
        self.calculator.set_input(key, value)

        if (self.debug) {
            const cValue = self.calculator.get_input(key)
            if (cValue !== value) {
                // if (Math.round(cValue * 10) !== Math.round(value * 10)) {
                console.warn('input not set correctly', key, value, cValue)
            }
        }
    }

    if (self.debug) {
        const inputIds = self.calculator.list_input_ids()
        const missingIds = inputIds.filter(
            (id) => !ignoreInputIds.includes(id) && !ids.includes(id),
        )

        if (missingIds.length) {
            console.warn('not used input ids found', missingIds)
        }
    }
}

Machine.prototype.setActions = function (actions, onlySectors = []) {
    const self = this

    // self.log('setting actions', Object.keys(self.currentActionIds))
    for (const action of actions) {
        for (const input of action.inputs) {
            if (!input.id) {
                // custom input
                continue
            }

            if (input.sector && onlySectors?.length && !onlySectors.includes(input.sector)) {
                continue
            }

            const name = action.name + '-' + input.slug
            const id = input.id + '/' + name

            if (!action.active || !input.active) {
                if (self.currentActionIds[id]) {
                    try {
                        self.log('removing action input', name, input.id)
                        self.calculator.delete_measure(name, input.id)
                        delete self.currentActionIds[id]
                    } catch (error) {
                        console.error('error deleting action', name, input.id)
                    }
                }
                continue
            }

            try {
                const method = self.currentActionIds[id] ? 'update_measure' : 'new_measure'
                const params = [name, input.id]

                params.push(input.startYear, input.endYear, input.delta)

                self.calculator[method](...params)
                // self.log(
                //     'action',
                //     input.id.split('/').slice(2).join('/'),
                //     input.startYear,
                //     input.endYear,
                //     input.delta.toFixed(3),
                // )
            } catch (error) {
                console.error('error setting action', name, action)
            }

            self.currentActionIds[id] = true
        }
    }

    // if (self.debug) {
    //     self.log('current actions', self.getActionIds())
    // }
}

Machine.prototype.removeAction = function (action) {
    const self = this
    let removed = false

    for (const input of action.inputs) {
        const name = action.name + '-' + input.slug
        const id = input.id + '/' + name

        if (self.currentActionIds[id]) {
            try {
                self.calculator.delete_measure(name, input.id)
                delete self.currentActionIds[id]
                removed = true
            } catch (error) {
                console.error('error deleting action', name, input.id)
            }
        }
        continue
    }

    if (removed) {
        self.log('removed action', action.name)
    }

    // console.log(self.calculator.list_measure_ids().filter((arr) => arr.length > 0))
}

Machine.prototype.process = function () {
    const self = this
    // self.log('processing')
    self.calculator.calculate_over_years()
}

Machine.prototype.getResults = function (process = false) {
    const self = this

    if (process) {
        self.process()
    }

    // self.log('getting results')
    const results = {}

    for (const [id, translatedId] of Object.entries(resultIds.perSector)) {
        const obj = createNestedObject(results, translatedId)
        obj._id = id

        for (const sector of sectors) {
            obj[sector] = self.calculator.get_results(`${id}/${sector}`)
        }
    }

    for (const [id, translatedId] of Object.entries(resultIds.direct)) {
        const obj = createNestedObject(results, translatedId)
        obj._id = id

        obj.value = self.calculator.get_results(id)
    }

    return results
}

// get results with and without every action to calculate delta (effects)
// sectorFocus: focus on one sector, or run action for all active sectors
/*
getResultsPerAction
# positive
- run without actions
- run with all configured actions
- runs for every not inactive action turned on

# negative
- runs with all actions as configured
- then runs for every not inactive action turned off

- runs: not inactive actions count + 2

- sector focus
    - for every not inactive action
    - run action as configured
    - run action without sector
 */
Machine.prototype.getResultsPerAction = function ({ inputs, actions, actionTimeframe, secondRun }) {
    const self = this
    const results = {}
    const startTime = new Date().getTime()

    self.reset()
    self.setInputs(inputs)

    // run without actions
    results.none = { data: self.getResults(true) }

    // run with all configured actions
    self.reset()
    self.setInputs(inputs)

    self.setActions(actions)
    results.all = { data: self.getResults(true) }
    results.all.delta = getResultsDelta(results.none.data, results.all.data)
    results.all.effects = calculateEffects(
        results.all,
        self.yearRange,
        actionTimeframe,
        null,
        results.none.data,
    )

    // runs for every not inactive action (true or null=intermediate)
    for (let action of actions) {
        if (action.active === 0) {
            continue
        }
        if (secondRun && action.processOrder !== 'after') {
            continue
        } else if (!secondRun && action.processOrder === 'after') {
            continue
        }

        self.reset()
        self.setInputs(inputs)

        const actionResults = {}

        if (action.effectsCalculation === 'add') {
            self.setActions([action])
            actionResults.data = self.getResults(true)
            results[action.name] = actionResults

            actionResults.delta = getResultsDelta(results.none.data, actionResults.data)
        } else if (action.effectsCalculation === 'sub') {
            self.setActions(actions.filter((a) => a.name !== action.name))
            const subResults = self.getResults(true)

            actionResults.delta = getResultsDelta(subResults, results.all.data)
            actionResults.data = getResultsSum(actionResults.delta, results.none.data)
            results[action.name] = actionResults
        }

        actionResults.effects = calculateEffects(
            actionResults,
            self.yearRange,
            actionTimeframe,
            action,
            results.none.data,
        )
    }

    self.log('getResultsPerAction', new Date().getTime() - startTime, 'ms')

    return results
}
