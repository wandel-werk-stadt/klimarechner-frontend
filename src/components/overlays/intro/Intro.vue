<template>
    <div class="intro-overlay">
        <LayerWelcome :class="layerClasses['welcome']" />
        <LayerOurCity
            :class="layerClasses['our-city']"
            v-model:name="name"
            v-model:population="population"
        />
        <LayerFossilsAndActions
            :class="layerClasses['fossils-and-actions']"
            @settings-climate-neutral="(state) => (climateNeutral = state)"
        />
        <LayerExplanations :class="layerClasses['explanations']" />
    </div>
</template>

<script>
import { useCityStore } from '@/stores/city'
import LayerWelcome from './LayerWelcome.vue'
import LayerOurCity from './LayerOurCity.vue'
import LayerFossilsAndActions from './LayerFossilsAndActions.vue'
import LayerExplanations from './LayerExplanations.vue'

export default {
    components: { LayerExplanations, LayerFossilsAndActions, LayerOurCity, LayerWelcome },

    emits: ['close'],

    inject: ['resetData'],

    provide() {
        return {
            showNextLayer: this.showNextLayer,
            validatePopulation: this.validatePopulation,
        }
    },

    setup() {
        const store = useCityStore()

        return {
            store,
        }
    },

    data() {
        return {
            layers: ['welcome', 'our-city', 'fossils-and-actions', 'explanations'],

            layerIndex: 0,

            name: '',
            population: '',

            climateNeutral: true,
        }
    },

    computed: {
        activeLayer() {
            return this.layers[this.layerIndex]
        },

        layerClasses() {
            const map = {}

            this.layers.forEach((layer, index) => {
                const classes = {
                    active: this.layerIndex === index,
                }

                if (this.layerIndex > index) {
                    // classes['past-' + (this.layerIndex - index)] = true
                    classes.past = true
                } else if (this.layerIndex < index) {
                    classes['future-' + (index - this.layerIndex)] = true
                }

                map[layer] = classes
            })

            return map
        },
    },

    // mounted() {
    //     this.handleResize(resizeWatcher.getData())

    //     this.removeResizeWatcher = resizeWatcher.on((data) => {
    //         this.handleResize(data)
    //     })

    //     this.currentStep = -1
    //     this.steps.forEach((step) => {
    //         for (const key in step) {
    //             step[key] = false
    //         }
    //     })

    //     setTimeout(() => {
    //         this.showStep(0)
    //     }, 1000)
    // },

    // beforeUnmount() {
    //     if (this.timer) {
    //         clearTimeout(this.timer)
    //     }

    //     if (this.removeResizeWatcher) {
    //         this.removeResizeWatcher()
    //     }
    // },

    methods: {
        // handleResize() {
        //     this.distributionChartSize = this.$refs.chartContainer.clientWidth
        // },

        // showStep(index) {
        //     if (this.timer) {
        //         clearTimeout(this.timer)
        //     }

        //     setTimeout(() => {
        //         this.currentStep = index
        //         this.steps[index].show = true
        //     }, 250)
        // },
        validatePopulation(value) {
            const raw = value.replace(/\./g, '').replace(',', '.')
            const pop = parseInt(raw)

            return this.store.validatePopulation(pop)
        },

        applySettings() {
            this.store.name = this.name

            if (this.validatePopulation(this.population)) {
                const pop = parseInt(this.population.replace(/\./g, ''), 10)
                this.store.populationSimple = pop
            }

            // reset actions
            this.resetData(this.climateNeutral, true)
        },

        showNextLayer() {
            if (this.layerIndex === this.layers.length - 1) {
                this.applySettings()
                this.$emit('close')
                return
            }

            this.layerIndex++
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.intro-overlay {
    position: relative;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // left: 0%;
    // top: 0%;
    // width: 100%;
    // height: 100%;
    max-width: none;
    max-height: none;
    overflow: visible;
    align-self: flex-start;
    margin-top: calc(5vh - 1.5rem);

    // @include bp-md{
    //     width: 75%;
    // }

    :deep(.q-card__section) {
        padding: 1rem 1.5rem;
    }

    :deep(.q-separator) {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
    }

    :deep(.section-header) {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
        padding: 1.5rem;

        .q-btn {
            flex: none;
            margin-left: auto;
        }

        h3 {
            font-size: 1.75rem;
            line-height: 1.2;
            font-weight: 500;
            white-space: nowrap;
            margin: 0 0 0.5rem;
        }

        p {
            font-size: 0.875rem;
            font-weight: 400;
            color: var(--k-color-label);
        }
    }

    :deep(.q-card__actions) {
        padding: 1.5rem 1.5rem 2.5rem;

        .q-btn {
            padding: 1rem 3rem;
            margin: 0 auto;
            font-size: 1.125rem;
            font-weight: 500;
            line-height: 1;
            text-transform: none;
        }
    }

    .layer {
        position: relative;
        z-index: 10;
        display: flex;
        flex-flow: column;
        background-color: var(--k-color-label-subtle);
        padding: 0;
        border-radius: 0.25rem;
        color: #000;
        opacity: 1;
        pointer-events: none;
        width: 50vw;
        max-width: 90vw;
        max-height: 90vh;
        @include scroll-colored(#fff, get-color('primary.base'));
        overflow: auto;
        overflow-x: hidden;
        width: calc(100vw - var(--k-page-padding-x) * 2);
        transition: transform 0.3s $ease-out-cubic, opacity 0.3s, background-color 0.3s;

        @include bp-lg {
            width: 80vw;
            //     max-width: 50rem;
        }

        @include bp-xl {
            width: 65vw;
            max-width: 50rem;
        }

        &:nth-child(n + 2) {
            position: absolute;
            top: 0%;
            left: 0%;
            // width: 100%;
            // height: 100%;
            // transition: transform 0.5s ease-in-out;
        }

        &.active {
            pointer-events: all;
            background-color: #fff;
            opacity: 1;
            transform: translate(0, 0);

            &:deep(> .content) {
                opacity: 1;
            }
        }

        @for $i from 1 to 4 {
            &.future-#{$i} {
                z-index: 10 - $i;
                transform: translate(0%, $i * -2rem) scale(1 - $i * 0.0375);
                opacity: 1;
            }
        }

        &.past {
            background-color: #fff;
            transform: translate(0%, 2rem) scale(1.025);
            opacity: 0;
        }

        &:deep(> .content) {
            position: relative;
            opacity: 0;
        }
    }
}
</style>
