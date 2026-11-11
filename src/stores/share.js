import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCityStore } from '@/stores/city'
import { useCalculatorStore } from '@/stores/calculator/index'

export const useShareStore = defineStore('share', {
    state: () => {
        const city = useCityStore()
        const calculator = useCalculatorStore()

        const loading = ref(false)
        const backendURL = import.meta.env.VITE_BACKEND_URL
        const selfURL = location.origin + location.pathname

        const hash = ref('')
        const link = ref('')

        async function generateLink() {
            if (loading.value) return
            loading.value = true

            if (
                link.value &&
                hash.value === localStorage.getItem('city') + localStorage.getItem('calculator')
            ) {
                loading.value = false
                return link.value
            }

            city.$persist()
            calculator.$persist()

            let result = await fetch(`${backendURL}/items/scenarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: city.name,
                    settings: {
                        city: JSON.parse(localStorage.getItem('city')),
                        calculator: JSON.parse(localStorage.getItem('calculator')),
                    },
                }),
            })
                .then((response) => response.json())
                .then(({ data }) => data)
                .catch((error) => {
                    console.warn('failed to save share-data', error)
                    return false
                })

            if (!result) {
                loading.value = false
                return false
            }
            hash.value = localStorage.getItem('city') + localStorage.getItem('calculator')

            const linkParams = [`share=${result.short_id}`]

            const urlParams = new URLSearchParams(location.search)
            urlParams.forEach((value, key) => {
                if (value === '') {
                    linkParams.push(key)
                    return
                }

                linkParams.push(`${key}=${value}`)
            })

            let url = selfURL
            if (linkParams.length) {
                url += `?${linkParams.join('&')}`
            }

            link.value = url
            console.log('share-link', link.value)

            loading.value = false
            return link.value
        }

        async function loadData(shortId) {
            console.info('loading data', shortId)
            if (loading.value || !shortId) return false
            loading.value = true

            // request data from server
            const result = await fetch(`${backendURL}/scenario?short_id=${shortId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data?.state === 'error') {
                        throw new Error(data.message)
                    }

                    return data
                })
                .catch((error) => {
                    console.warn('failed to load share-data', shortId, error)
                    return false
                })

            if (!result) {
                loading.value = false
                return false
            }

            const scenario = result
            console.log('scenario', scenario)

            localStorage.setItem('city', JSON.stringify(scenario.settings.city))
            localStorage.setItem('calculator', JSON.stringify(scenario.settings.calculator))
            city.$hydrate()
            calculator.$hydrate()

            loading.value = false
            return true
        }

        return {
            // actions
            loadData,
            generateLink,
        }
    },
})
