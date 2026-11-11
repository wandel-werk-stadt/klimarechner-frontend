<template>
    <q-card class="layer layer-welcome">
        <div class="content">
            <q-card-section class="section-header">
                <header>
                    <h3>Klimaschutz ist ein starker<br />Wirtschaftsfaktor.</h3>
                    <p>Rechnen Sie das Einsparpotenzial für Ihre Kommune nach!</p>
                </header>
                <q-btn icon="o_close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-actions>
                <q-btn color="black" unelevated rounded @click="() => showNextLayer()"
                    >Für Ihre Stadt berechnen</q-btn
                >
            </q-card-actions>

            <q-card-section class="steps">
                <div class="bg" v-html="StepsBackgroundSVG"></div>

                <div :class="['step', { show: steps[0].show }]">
                    <h3>
                        <b>Daten</b> der Stadt &<br />
                        Basisparameter
                    </h3>
                    <p>
                        Orientieren sich wahlweise am deutschen Durchschnitt oder können exakt
                        definiert werden.
                    </p>

                    <div :class="['distributions', { show: steps[0].show }]">
                        <div class="shares-mobility" ref="chartContainer">
                            <ChartDistribution
                                :items="sharesMobility"
                                :height="distributionChartSize * 1.2"
                                :show-legend="false"
                                :class="{
                                    show: steps[0].show,
                                    'show-center': steps[0].showCenterText,
                                }"
                                v-if="steps[0].show"
                                @animation-end="
                                    () => {
                                        steps[0].show2 = true
                                        steps[0].showCenterText = true
                                    }
                                "
                                >Anteile <b>Mobilität</b></ChartDistribution
                            >
                        </div>
                        <div class="shares-heating">
                            <ChartDistribution
                                :items="sharesMobility"
                                :height="distributionChartSize * 1.2"
                                :show-legend="false"
                                :class="{
                                    show: steps[0].showCenterText,
                                    'show-center': steps[0].showCenterText2,
                                }"
                                v-if="steps[0].show2"
                                @animation-end="
                                    () => {
                                        steps[0].showCenterText2 = true
                                        showStep(1)
                                    }
                                "
                                ><b>Gebäude- wärme</b> Bedarf</ChartDistribution
                            >
                        </div>
                    </div>
                </div>

                <div :class="['step', { show: steps[1].show }]">
                    <h3>
                        <b>Maßnahmen</b> für<br />
                        Klimaschutz
                    </h3>
                    <p>Granular einstellbar: Ab wann, bis wann, wie umfangreich?</p>

                    <ul :class="['actions', { show: steps[1].show }]">
                        <li
                            v-for="(action, index) of actions"
                            :key="action"
                            @transitionend="
                                () => {
                                    if (index === actions.length - 1) {
                                        showStep(2)
                                    }
                                }
                            "
                        >
                            {{ action }}
                        </li>
                    </ul>
                </div>

                <div :class="['step', { show: steps[2].show }]">
                    <h3>
                        <b>Effekte</b> auf Konjunktur<br />
                        und Emissionen
                    </h3>
                    <p>
                        Im ausführlichen Bericht werden
                        <b>CO2-Emissionen, Investitionen, Einnahmen</b> und
                        <b>Ausgaben, Arbeitsplätze</b> usw. aufgeschlüsselt. Die Daten und
                        Zeitreihen lassen sich teilen oder exportieren.
                    </p>

                    <div :class="['bar-chart', { show: steps[2].show }]" v-html="BarChartSVG"></div>
                </div>
            </q-card-section>
        </div>
    </q-card>
</template>

<script>
import StepsBackgroundSVG from '@/assets/icons/intro-bg.svg?raw'
import BarChartSVG from '@/assets/icons/intro-bar-chart.svg?raw'
import ChartDistribution from '@/components/charts/ChartDistribution.vue'
import resizeWatcher from '@/tools/resizeWatcher'

export default {
    components: { ChartDistribution },

    inject: ['showNextLayer'],

    data() {
        return {
            steps: [
                {
                    show: false,
                    show2: false,
                    showCenterText: false,
                    showCenterText2: false,
                },
                { show: false },
                { show: false },
            ],

            StepsBackgroundSVG,
            BarChartSVG,
            actions: [
                'Gasheizungen austauschen',
                'Windenergie ausbauen',
                'Heizbedarf senken',
                'PKW mit E-Autos ersetzen',
            ],

            sharesMobility: [
                {
                    name: '',
                    type: 'bus',
                    color: `var(--k-color-red)`,
                    value: 0.15,
                },
                {
                    name: '',
                    type: 'bike',
                    color: `var(--k-color-orange)`,
                    value: 0.29,
                },
                {
                    name: '',
                    type: 'car',
                    color: `var(--k-color-green)`,
                    value: 0.26,
                },
                {
                    name: '',
                    type: 'car',
                    color: `var(--k-color-yellow)`,
                    value: 0.15,
                },
                {
                    name: '',
                    type: 'car2',
                    color: `var(--k-color-blue)`,
                    value: 0.1,
                },
                {
                    name: '',
                    type: 'car3',
                    color: `var(--k-color-pink)`,
                    value: 0.05,
                },
            ],

            sharesHeating: [
                {
                    name: '',
                    type: 'bus',
                    color: `var(--k-color-red)`,
                    value: 0.15,
                },
                {
                    name: '',
                    type: 'bike',
                    color: `var(--k-color-orange)`,
                    value: 0.29,
                },
                {
                    name: '',
                    type: 'car',
                    color: `var(--k-color-green)`,
                    value: 0.26,
                },
                {
                    name: '',
                    type: 'car',
                    color: `var(--k-color-yellow)`,
                    value: 0.15,
                },
                {
                    name: '',
                    type: 'car2',
                    color: `var(--k-color-blue)`,
                    value: 0.1,
                },
                {
                    name: '',
                    type: 'car3',
                    color: `var(--k-color-pink)`,
                    value: 0.05,
                },
            ],

            timer: null,
            currentStep: -1,
            distributionChartSize: 100,
        }
    },

    mounted() {
        this.handleResize(resizeWatcher.getData())

        this.removeResizeWatcher = resizeWatcher.on((data) => {
            this.handleResize(data)
        })

        this.currentStep = -1
        this.steps.forEach((step) => {
            for (const key in step) {
                step[key] = false
            }
        })

        setTimeout(() => {
            this.showStep(0)
        }, 1000)
    },

    beforeUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }

        if (this.removeResizeWatcher) {
            this.removeResizeWatcher()
        }
    },

    methods: {
        handleResize() {
            this.distributionChartSize = this.$refs.chartContainer.clientWidth
        },

        showStep(index) {
            if (this.timer) {
                clearTimeout(this.timer)
            }

            setTimeout(() => {
                this.currentStep = index
                this.steps[index].show = true
            }, 250)
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.layer-welcome {
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
            font-size: 2.25rem;
            line-height: 1.2;
            font-weight: 500;
            white-space: nowrap;
            margin: 0 0 0.5rem;
        }

        p {
            font-size: 1.25rem;
            font-weight: 400;
        }
    }

    .steps {
        background-color: #fff;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        overflow: hidden;
        min-height: 21rem;

        > .bg {
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            width: 100%;
            height: 100%;
            z-index: 1;

            :deep(svg) {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }

    .step {
        position: relative;
        width: calc(33% - 1.5rem * 2 / 3);
        flex: none;
        display: flex;
        flex-flow: column;
        z-index: 10;

        &.show {
            h3 b {
                font-weight: 700;
            }
        }

        h3 {
            font-size: 1.25rem;
            line-height: 1.2;
            min-height: calc(1.25rem * 2.4);
            font-weight: 400;
            white-space: nowrap;

            b {
                font-weight: 400;
                transition: font-weight 0.3s $ease-out-cubic;
            }
        }

        p {
            color: var(--k-color-label);
            font-size: 0.875rem;
            margin: 0 0 1rem;
        }
    }

    @include bp-lg {
        .steps {
            gap: 5.2rem;
        }

        .step {
            width: calc(33% - 5.2rem * 2 / 3);

            &.show {
                &::before {
                    opacity: 1;
                    transform: translate(0, 0);
                }
            }

            &::before {
                position: absolute;
                left: -4rem;
                top: 0.75rem;
                content: '';
                display: block;
                width: 2.2rem;
                height: 1rem;
                background: transparent
                    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAQCAMAAABJNS0RAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMAgJ/PMHBA3xAgv2CvoH+Q7ySI2o4AAABRSURBVHherdE7DsAgDARRhxhsyHfuf9k0qdmGqZ+0lmyTcrjJKtG1eojUarBrlEHRqge3Vv5SzRqyZh7zAJdzcOjD2VaY3DlNVYhc8uC8fvMBPYgFai+fLWYAAAAASUVORK5CYII=')
                    no-repeat center;
                background-size: contain;
                opacity: 0;
                transform: translate(-0.5rem, 0);
                transition: opacity 0.4s, transform 0.4s $ease-out-cubic;
            }

            &:first-child {
                &::before {
                    display: none;
                }
            }
        }
    }
}

.distributions {
    position: relative;
    overflow: hidden;
    margin-bottom: -20%;

    > div {
        position: relative;
        z-index: 10;
        width: 55%;
        padding-top: 50%;
    }

    .shares-mobility {
        margin-left: 0;
    }

    .shares-heating {
        margin-left: auto;
        margin-right: 0;
        transform: translate(0, -40%);
    }
}

:deep(.chart-distribution) {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    opacity: 0;
    transform: translate(0, 0.5rem);
    transition: opacity 0.4s, transform 0.4s $ease-out-cubic;

    &.show {
        opacity: 1;
        transform: translate(0, 0);
    }

    &.show-center {
        .content {
            opacity: 1;
        }
    }

    .content {
        position: absolute;
        left: 50%;
        top: 47.5%;
        width: 50%;
        height: 50%;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        white-space: wrap;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        line-height: 1.15;
        text-align: center;
        opacity: 0;
        transition: opacity 0.4s;

        b {
            font-weight: 700;
        }
    }
}

:deep(.actions) {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: fit-content;
    margin: 0 auto;

    &.show {
        li {
            opacity: 1;
            transform: translate(0, 0);

            @for $i from 1 through 4 {
                &:nth-child(#{$i}) {
                    opacity: #{1 - $i * 0.2};
                    transition-delay: #{$i * 0.2}s, #{$i * 0.2}s;
                }
            }
        }
    }

    li {
        display: inline-block;
        color: var(--k-color-label);
        font-size: 0.875rem;
        line-height: 1;
        padding: 0.5rem 0.75rem;
        margin-top: 0.5rem;
        border-radius: 1rem;
        border: 1px solid var(--k-color-label-subtle);
        user-select: none;
        opacity: 0;
        transform: translate(0, 1rem);
        transition: opacity 0.6s, transform 0.6s $ease-out-cubic;

        &:nth-child(even) {
            margin-left: auto;
        }
    }
}

:deep(.bar-chart) {
    position: relative;
    width: 100%;
    @include aspect-ratio(186/81);

    > svg {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
    }

    &.show {
        svg > path {
            transform: scalex(1);
            opacity: 1;
            transition-delay: 0s, 0s;
        }

        g {
            path {
                transform: scaley(1) !important;
            }
        }
    }

    svg > path {
        transform-box: fill-box;
        transition: transform 1s 1s $ease-out-cubic, opacity 0.25s 0.75s;
        transform: scalex(0);
        opacity: 0;
    }

    g {
        path {
            transform-box: fill-box;
            transition: transform 0.3s $ease-out-cubic;

            @for $i from 0 through 16 {
                &:nth-child(#{$i}) {
                    transition-delay: #{$i * 0.075}s;
                }
            }
        }

        &:nth-child(n-2) {
            path {
                transform-origin: bottom;
                transform: scaley(0);
            }
        }

        &:last-child {
            path {
                transform-origin: top;
                transform: scaley(0);
            }
        }
    }
}
</style>
