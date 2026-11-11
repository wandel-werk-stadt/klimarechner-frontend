import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => {
        const introShown = ref(false)

        return {
            introShown,
        }
    },
    persist: true,
})
