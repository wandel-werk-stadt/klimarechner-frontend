import filters from './filters'

const colors = {
    red: '#DF5C69',
    orange: '#E1976A',
    green: '#0AB480',
    yellow: '#E6C86F',
    blue: '#58A2E7',
    pink: '#EE5CB4',
}

export const dataSetColors = {
    oil: '#000',
    gas: 'gray',
    fuel: 'brown',
    electricPower: colors.blue,

    private: colors.red,
    industry: colors.orange,
    public: colors.yellow,
    schools: colors.blue,
}

const de = {
    name: 'de',
    options: {
        months: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
        ],
        shortMonths: [
            'Jan',
            'Feb',
            'Mär',
            'Apr',
            'Mai',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dez',
        ],
        days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        toolbar: {
            exportToSVG: 'SVG speichern',
            exportToPNG: 'PNG speichern',
            exportToCSV: 'CSV speichern',
            menu: 'Menü',
            selection: 'Auswahl',
            selectionZoom: 'Auswahl vergrößern',
            zoomIn: 'Vergrößern',
            zoomOut: 'Verkleinern',
            pan: 'Verschieben',
            reset: 'Zoom zurücksetzen',
        },
    },
}

export function createChartDefaultOptions({ dark = false }) {
    return {
        chart: {
            type: 'bar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            parentHeightOffset: 0,
            locales: [de],
            defaultLocale: 'de',
            fontFamily: 'Satoshi, sans-serif',
            foreColor: dark ? '#fff' : '#000',
        },
        xaxis: {
            type: 'category',
            categories: [],
            lines: {
                show: false,
            },
            labels: {
                rotate: -45,
                rotateAlways: true,
                hideOverlappingLabels: true,
                minHeight: 35,
                format: 'yyyy',
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },

            tooltip: {
                enabled: false,
                formatter(value, { w }) {
                    if (w.config.xaxis.type !== 'datetime') {
                        return value
                    }

                    return new Date(value).getFullYear()
                    // const { format = 'yyyy' } = w.config.xaxis.labels
                    // const d = DateTime.prototype.getDate.call({ w }, value)
                    // return DateTime.prototype.formatDate.call({ w }, d, format)
                },
            },
        },
        yaxis: [
            {
                opposite: true,
                tickAmount: 4,

                labels: {
                    style: {
                        fontSize: '12px',
                        fontWeight: 500,
                    },
                    formatter: function (value) {
                        return Math.round(value)
                    },
                },
                // title: {
                //     style: {
                //         fontSize: '15px',
                //         fontWeight: 500,
                //     },
                // },
            },
        ],
        colors: ['#000', '#999'],
        stroke: {
            width: 2,
            dashArray: 0,

            colors: [
                function ({ value, seriesIndex, dataPointIndex, w }) {
                    const year = w?.config?.xaxis.categories?.[dataPointIndex] || ''
                    if (year === '…') return '#000'

                    return w?.config?.colors?.[seriesIndex] || '#000'
                },
            ],
        },
        grid: {
            show: true,

            xaxis: {
                lines: {
                    show: false,
                },
            },

            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            type: 'solid',

            colors: [
                function ({ value, seriesIndex, dataPointIndex, w }) {
                    const year = w?.config?.xaxis.categories?.[dataPointIndex] || ''
                    if (year === '…') return '#eee'

                    return w?.config?.colors?.[seriesIndex] || '#000'
                },
            ],
        },
        markers: {
            size: 0,
            // shape: 'circle',
            // radius: 0,
            fillOpacity: 1,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
            // strokeDashArray: 0,
            hover: {
                size: 5,
            },
        },
        forecastDataPoints: {
            count: 0,
            fillOpacity: 0.35,
            strokeWidth: 1,
            dashArray: 5,
        },

        dataLabels: {
            enabled: false,
        },

        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
            },
        },

        legend: {
            horizontalAlign: 'left',
            inverseOrder: false,
            offsetY: -10,
            offsetX: -20,
            fontFamily: 'Lato, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            // markers: {
            //     width: 10,
            //     height: 10,
            //     radius: 0,
            //     strokeWidth: '1px',
            //     strokeColor: '#000',
            //     offsetX: -3,
            // },
            // itemMargin: {
            //     horizontal: 10,
            // },
        },

        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            inverseOrder: false,
            titleFn: false,
            fixed: {
                enabled: true,
                position: 'bottomLeft',
                offsetX: 0,
                offsetY: 0,
            },
            style: {
                fontSize: '14px',
            },
            x: {
                show: false,
                // formatter: (v) => new Date(v).getFullYear(),
            },
            y: {
                formatter: (v) => Math.round(v),
                //     title: {
                //         formatter: (seriesName) => seriesName,
                //     },
            },
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const hiddenSeries = [
                    ...(w?.globals.dom.baseEl.querySelectorAll('.apexcharts-series-collapsed') ||
                        []),
                ].map((el) => parseInt(el.getAttribute('data:realIndex'), 10))

                const list = series
                    .map((s, index) => {
                        const config = w?.config?.customData[index] || {}

                        if (Number.isNaN(s[dataPointIndex])) return false

                        return {
                            index,
                            name: config?.name,
                            color: config?.color,
                            value: filters.number(s[dataPointIndex], w?.config?.tooltip?.precision),
                            unit: w?.config?.tooltip.unit || config?.unit,
                        }
                    })
                    .filter((item) => item && !hiddenSeries.includes(item.index))

                if (!list.length) {
                    return '<div></div>'
                }

                if (w.config.tooltip.inverseOrder) {
                    list.reverse()
                }

                const year = w?.config?.xaxis.categories?.[dataPointIndex] || ''
                if (year === '…') return '<div></div>'

                let title = '' + year
                if (w.config.tooltip.titleFn) {
                    title = w.config.tooltip.titleFn({ year, unit: w.config.tooltip.unit })
                }

                return (
                    `<div class="title">${title}</div><ul>` +
                    `<li>${list
                        .map((item) => {
                            let result = `<span class="marker" style="color:${item.color};"></span>`
                            if (item.name) {
                                result += `<span class="name">${item.name}:</span> `
                            }

                            result += `<span class="value">${item.value} ${item.unit || ''}</span>`

                            return result
                        })
                        .join('</li><li>')}</li>` +
                    `</ul>`
                )
            },
            //     custom2: function ({ series, seriesIndex, dataPointIndex, w }) {
            //         const hiddenSeries = [
            //             ...(w?.globals.dom.baseEl.querySelectorAll('.apexcharts-series-collapsed') ||
            //                 []),
            //         ].map((el) => parseInt(el.getAttribute('data:realIndex'), 10))

            //         const list = series
            //             .map((s, index) => {
            //                 const config = w?.config?.customData[index] || {}

            //                 if (!s[dataPointIndex] || Number.isNaN(s[dataPointIndex])) return false

            //                 return {
            //                     index,
            //                     name: config?.name,
            //                     color: config?.color,
            //                     value: filters.number(
            //                         s[dataPointIndex],
            //                         config?.tooltip?.precision || 0,
            //                     ),
            //                     unit: config?.tooltip?.unit || config?.unit,
            //                 }
            //             })
            //             .filter((item) => item && !hiddenSeries.includes(item.index))

            //         if (!list.length) {
            //             return '<div></div>'
            //         }

            //         if (w.config.tooltip.inverseOrder) {
            //             list.reverse()
            //         }

            //         return (
            //             '<ul>' +
            //             '<li>' +
            //             list
            //                 .map(
            //                     (item) =>
            //                         `<span class="marker" style="color:${item.color};"></span>
            //                         <span class="name">${item.name}:</span> <span class="value">${item.value} ${item.unit}</span>`,
            //                 )
            //                 .join('</li><li>') +
            //             '</li>' +
            //             '</ul>'
            //         )
            //     },
        },
    }
}

export function compactSeries(data = []) {
    if (!data.length) return []

    // const firstYear = data[0]?.year
    const lastYear = data[data.length - 1]?.year

    const detailEndIndex = data.length >= 13 ? 7 : data.length
    const detailEnd = data[detailEndIndex - 1]?.year

    const compactStart = Math.ceil((detailEnd + 2) / 5) * 5
    const compactStartIndex = data.findIndex((i) => i.year === compactStart)

    const compacted = data
        .slice(0, detailEndIndex)
        .map((i) => ({ year: '' + i.year, value: i.value }))

    if (compactStart < lastYear) {
        compacted.push({
            year: '…',
            value: (compacted[compacted.length - 1].value + data[compactStartIndex].value) / 2,
        })

        for (let i = compactStartIndex; i < data.length; i += 5) {
            compacted.push({ year: '' + data[i].year, value: data[i].value })
        }
    }

    return compacted
}
