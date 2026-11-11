const locale = 'de-DE'

const numberFormat = (value, precision = 2, prefix = false) => {
    let n
    if (Intl) {
        n = new Intl.NumberFormat(locale, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
        }).format(value)
    } else {
        n = value.toFixed(precision).replace('.', ',')
    }

    if (prefix) {
        n = value > 0 ? `+${n}` : n
    }

    return n
}

const parseNumber = (value) => {
    if (typeof value !== 'string') {
        return value
    }

    const raw = value.replace(/\./g, '').replace(',', '.')
    return raw ? parseFloat(raw) : 0
}

const camelCase = (str) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}

// const priceFormat = (value, precision = 2, currency = '€') => {
//     if (Intl) {
//         return new Intl.NumberFormat(locale, {
//             style: 'currency',
//             currency: 'EUR',
//             minimumFractionDigits: precision,
//             maximumFractionDigits: precision,
//         }).format(value)
//     }
//     return `${numberFormat(value, precision)} ${currency}`
// }

// const moneyFormat = (value, precision = 0, currency = '€') => {
//     if (Intl) {
//         return new Intl.NumberFormat(locale, {
//             style: 'currency',
//             currency: 'EUR',
//             minimumFractionDigits: precision,
//             maximumFractionDigits: precision,
//         }).format(value)
//     }
//     return `${numberFormat(value, precision)} ${currency}`
// }

// const percentFormat = (value, precision = 1) => {
//     if (Intl) {
//         return new Intl.NumberFormat(i18n.global.locale.value, {
//             style: 'percent',
//             minimumFractionDigits: precision,
//             maximumFractionDigits: precision,
//         }).format(value / 100)
//     }
//     return `${numberFormat(value, precision)} %`
// }

// const units = {
//     cent: ['Cent'],
//     seconds: ['Sekunde', 'Sekunden'],
//     minutes: ['Minute', 'Minuten'],
//     hours: ['Stunde', 'Stunden'],
//     weeks: ['Woche', 'Wochen'],
//     months: ['Monat', 'Monate'],
//     years: ['Jahr', 'Jahre'],
//     mg: ['mg'],
//     g: ['g'],
//     kg: ['kg'],
//     km: ['km'],
//     tco2e: ['CO₂'],
// }

// function filterUnit(value, unit = '') {
//     const unitDef = units[unit] || units[`${unit}s`] || ''
//     return `${value} ${unitDef[0]}`
// }

// function filterDate(date, includeTime = false) {
//     if (!date) {
//         return ''
//     }

//     if (typeof date === 'string') {
//         date = new Date(date)
//     } else if (!(date instanceof Date)) {
//         return ''
//     }

//     if (Intl) {
//         const options = {
//             timezome: 'UTC',
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//         }

//         if (includeTime) {
//             options.hour = '2-digit'
//             options.minute = '2-digit'
//         }

//         let formatted = new Intl.DateTimeFormat(locale, options).format(date)

//         if (includeTime) {
//             formatted = `${formatted.replace(', ', ' / ')} Uhr`
//         }

//         return formatted
//     }

//     return date.toLocaleDateString()
// }

// function filterPeriod(startDate, endDate) {
//     let output = filterDate(startDate)
//     const endDateStr = filterDate(endDate)

//     if (endDateStr) {
//         output = `${output.slice(0, -4)} - ${endDateStr}`
//     }

//     return output
// }

function firstUpperCase(str) {
    if (typeof str !== 'string') {
        console.warn('string expected', str)
        return str
    }

    return str.substring(0, 1).toUpperCase() + str.substring(1)
}

const filters = {
    number: (value, precision, prefix) => numberFormat(value, precision, prefix),
    parseNumber,
    camelCase,
    //     price: (value, precision, currency) => priceFormat(value, precision, currency),
    //     money: (value, precision, currency) => moneyFormat(value, precision, currency),
    //     percent: (value, precision) => percentFormat(value, precision),
    //     round: Math.round,
    //     ceil: Math.ceil,
    //     floor: Math.floor,
    //     abs: Math.abs,
    //     unit: filterUnit,
    //     date: filterDate,
    //     period: filterPeriod,
    //     dateTimeFormatString: 'DD.MM.YYYY / HH:mm Uhr',
    firstUpperCase,
}

export default filters
