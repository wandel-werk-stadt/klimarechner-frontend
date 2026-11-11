<script>
import KSection from '@/components/KSection.vue'
import KSectionButton from '@/components/KSectionButton.vue'
import ActionGroup from './ActionGroup.vue'
import Action from './Action.vue'
import { sectorsMain } from '@/stores/calculator/shared'
import { useCalculatorStore } from '@/stores/calculator/index'

export default {
    components: {
        KSection,
        KSectionButton,
        ActionGroup,
        Action,
    },

    inject: [
        'i18n',
        'filters',
        'breakpoint',
        'isMobile',
        'showResetButton',
        'resetData',
        'showResetDialog',
    ],

    setup() {
        const calculator = useCalculatorStore()

        return {
            calculator,
        }
    },

    data() {
        const levelOptions = [
            ...sectorsMain.map((sector) => ({
                value: sector,
                slot: sector,
            })),
            { value: 'aggregate' },
        ]

        // const defaultOptions = [
        //     { value: 0, label: 'Status Quo' },
        //     { value: 1, label: 'Ambitioniert' },
        //     { value: 2, label: 'Rechtssicher' },
        // ]

        return {
            mode: 'simple',

            levelOptions,

            sectors: ['private', 'industry', 'public'],

            showDetails: {},

            actionGroups: this.getActionGroups(this.calculator.actions),

            /*aggregateValue: 0,

            aggregateGroups: [
                {
                    name: 'building_and_heat',
                    label: 'Gebäude & Wärme',
                    items: [
                        {
                            name: 'replace_gas_heaters',
                            label: 'Gasheizungen ersetzen',
                            options: defaultOptions,
                        },
                        {
                            name: 'replace_oil_heaters',
                            label: 'Ölheizungen ersetzen',
                            options: defaultOptions,
                        },
                    ],
                },
                {
                    name: 'electricity',
                    label: 'Strom',
                    items: [
                        {
                            name: 'photovoltaic_roof',
                            label: 'Photovoltaik auf Dach',
                            options: defaultOptions,
                        },
                        {
                            name: 'wind_energy',
                            label: 'Windenergie',
                            options: defaultOptions,
                        },
                    ],
                },
                {
                    name: 'mobility',
                    label: 'Verkehr',
                    items: [
                        {
                            name: 'promotion_public_transport',
                            label: 'Förderung ÖPNV',
                            options: defaultOptions,
                        },
                        {
                            name: 'reduction_cars',
                            label: 'Reduktion PKW',
                            options: defaultOptions,
                        },
                    ],
                },
            ],*/
        }
    },

    computed: {
        modeLabel() {
            return this.mode === 'simple' ? 'Maßnahmen anpassen' : 'Vereinfachte Regler'
        },

        level: {
            get() {
                if (!this.calculator.sectorFocus) {
                    return 'aggregate'
                }

                return this.calculator.sectorFocus
            },
            set(value) {
                if (value === 'aggregate') {
                    this.calculator.sectorFocus = ''
                    return
                }

                this.calculator.sectorFocus = value
            },
        },

        itemsPerRow() {
            let count = 3
            if (this.breakpoint === 'xs') {
                count = 1
            } else if (this.breakpoint === 'sm') {
                count = 2
            }
            return count
        },
    },

    methods: {
        getActionGroups(actions) {
            const nested = actions.reduce((groups, action) => {
                const groupName = action.group

                if (!groupName) {
                    return groups
                }

                let group = groups[groupName]
                if (!group) {
                    group = {
                        name: groupName,
                        label: this.i18n('actions.groups.' + groupName),
                        actions: [],
                        subGroups: [],
                    }
                    groups[groupName] = group
                }

                if (action.subGroup) {
                    let subGroup = group.subGroups.find((g) => g.name === action.subGroup)
                    if (!subGroup) {
                        subGroup = {
                            name: action.subGroup,
                            description: this.i18n(
                                'actions.subGroups.' + action.subGroup + '.description',
                            ),
                            actions: [],
                        }
                        group.subGroups.push(subGroup)
                    }
                    subGroup.actions.push(action)
                } else {
                    group.actions.push(action)
                }

                return groups
            }, {})

            return Object.values(nested)
        },
    },

    // watch: {
    //     'calculator.resetCounter': {
    //         handler() {
    //             console.log('actions updated')
    //             this.actionGroups = this.getActionGroups(this.calculator.actions)
    //         },
    //     },
    // },
}
</script>

<template>
    <KSection title="Klimamaßnahmen">
        <template v-slot:title-suffix>
            <transition name="quick-fade">
                <span v-if="showResetButton" class="btn reset-btn" @click="showResetDialog = true">
                    <q-icon name="o_restart_alt" />
                    Eingaben zurücksetzen
                </span>
            </transition>
        </template>
        <template v-slot:description>
            Für jeden Bereich wird eine Vielzahl an Anpassungen, Umrüstungen und Innovation
            berechnet. Nach Verfassungsrecht sind Klimaschutzmaßnahmen nach den Grenzwerten des
            Pariser Klimaabkommens auszurichten. Mindere Maßnahmen bergen daher ein rechtliches
            Risiko.
        </template>

        <div class="select-level">
            <template v-for="(item, index) of levelOptions" :key="item.value">
                <q-btn :class="[{ active: item.value === level }]" @click="level = item.value">
                    <img :src="`sectors/${item.value}.svg`" class="icon" />
                    <span class="text">
                        <span class="label">{{ i18n('sectorTabs.' + item.value + '.label') }}</span>
                        <span
                            class="description"
                            v-html="i18n('sectorTabs.' + item.value + '.description')"
                        ></span>
                    </span>
                </q-btn>
                <span v-if="index < levelOptions.length - 2">+</span>
                <span v-else-if="index < levelOptions.length - 1">=</span>
            </template>
        </div>

        <div class="actions">
            <ActionGroup
                v-for="group of actionGroups"
                :key="group.name"
                :label="group.label"
                class="overspread"
            >
                <!-- <div
                    class="sub-group"
                    v-if="group.subGroups.length"
                    v-for="subGroup of group.subGroups"
                    :key="subGroup.name"
                >
                    <Action
                        v-for="action of subGroup.actions"
                        :key="action.name"
                        :action="action"
                        :sector="calculator.sectorFocus"
                        :show-details="showDetails[group.name]"
                    />

                    <p class="description">{{ subGroup.description }}</p>
                </div> -->

                <template v-for="(action, index) of group.actions" :key="action.name">
                    <template v-if="index > 0 && index % itemsPerRow === 0">
                        <div class="divider"></div>
                    </template>

                    <Action
                        :action="action"
                        :sector="calculator.sectorFocus"
                        :show-details="showDetails[group.name] || level === 'aggregate'"
                    />
                </template>

                <template v-slot:footer>
                    <KSectionButton
                        v-if="level !== 'aggregate'"
                        @click="showDetails[group.name] = !showDetails[group.name]"
                        >Effekte
                        {{ showDetails[group.name] ? 'verbergen' : 'anzeigen' }}</KSectionButton
                    >
                </template>
            </ActionGroup>
        </div>
    </KSection>
</template>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.inner > header .title .reset-btn {
    .q-icon {
        color: var(--k-color-secondary-base);
        $size: 1.25rem;
        width: $size;
        height: $size;
        font-size: $size;
    }
    // border-bottom: 1px solid var(--k-color-secondary-base);
}

.select-level {
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 1.5rem 0;
    overflow: hidden;

    :deep(.icon) {
        display: inline-block;
        flex: none;
        width: 3rem;
        height: auto;
        max-height: 3rem;
        margin: 0 1rem 0 0;
    }

    > span {
        display: none;
        color: var(--k-color-section-text-subtle);
        font-size: 1.375rem;
        font-weight: 300;
        flex: none;
        margin: auto 0;
        user-select: none;
        pointer-events: none;
    }

    .q-btn {
        padding: 0.5rem;
        border-radius: 0.25rem;
        white-space: wrap;

        :deep(.q-btn__content) {
            display: flex;
            flex-flow: row nowrap;
            gap: 0;
            padding: 0 0.5rem;
            line-height: 1.2;
            color: var(--k-color-section-text);
            justify-content: center;
            font-weight: 700;
            transition: color 0.2s;
        }

        :deep(.text) {
            text-align: left;
            margin: 0 auto 0 0;
        }

        :deep(.description) {
            display: block;
            font-weight: 400;
            color: var(--k-color-label);
        }

        &::before {
            display: block;
            border: 1px solid var(--k-color-label-subtle);
            box-shadow: none !important;
            transition: border-color 0.25s, background-color 0.25s;
        }

        &.active {
            :deep(.q-btn__content) {
                .label,
                .description {
                    color: #fff;
                    body.body--dark & {
                        color: var(--k-color-gray-200);
                    }
                }
            }

            &:before {
                background-color: var(--k-color-primary-base);
                border-color: var(--k-color-primary-base);
            }

            img {
                filter: brightness(3);
            }
        }

        img {
            filter: none;
            transition: filter 0.25s;
        }
    }

    @include bp-sm {
        flex-flow: row nowrap;

        :deep(.icon) {
            display: block;
            flex: none;
            width: 100%;
            max-height: 3rem;
            margin: 0 0 0.5rem;
        }

        .q-btn {
            flex: 25% 0 1;

            :deep(.q-btn__content) {
                flex-flow: column;
            }

            :deep(.text) {
                text-align: center;
                margin: 0;
                width: 100%;
            }

            :deep(.label) {
                margin: 0;
            }

            :deep(.description) {
                margin-top: 0.25rem;
            }
        }
    }

    @include bp-md {
        > span {
            display: block;
        }
    }
}

.level {
    margin-left: auto;
    width: fit-content;
}

.actions {
    display: flex;
    flex-flow: column;
    gap: 1.5rem;
}

.sub-group {
    display: flex;
    flex-flow: row wrap;
    border-radius: 0.25rem;
    overflow: hidden;
    padding: 1rem 0;
    margin: 0 1rem;
    border: 1px solid var(--k-color-section-border);

    > .description {
        display: block;
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--k-color-section-text-subtle);
        text-align: center;
        padding: 0 1rem;
    }

    .action {
        position: relative;
        width: 100%;
        padding: 0 1rem 0.75rem;
        // border-right: 1px solid red;

        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 15%;
            display: block;
            width: 1px;
            height: 70%;
            background-color: var(--k-color-section-border);
        }
        // flex: auto 1 0;
    }

    // @include bp-md {
    //     .action {
    //         width: calc(50% - var(--k-gap) / 2);
    //     }
    // }

    @include bp-lg {
        max-width: calc(66% - 2rem);

        .action {
            width: calc(50% - var(--k-gap) / 3);

            &:nth-child(n) {
                &:after {
                    display: block;
                }
            }

            &:nth-child(2n) {
                &:after {
                    display: none;
                }
            }
        }
    }
}

/*fieldset {
    gap: var(--k-gap);
    border: 1px solid #dedede;
    margin: var(--k-gap) 0 0;
    padding: 1rem;

    &:first-child {
        margin-top: 0;
    }

    legend {
        padding: 0 0.5rem;
        font-size: var(--k-font-h6-size);
        line-height: 1;
        font-weight: 700;
    }

    .label {
        font-size: 0.9375rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
    }

    .items {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: bottom;
        gap: var(--k-gap);
        padding: 0 0.5rem;
    }

    .item {
        width: 100%;
        // flex: auto 1 0;
    }

    @include bp-md {
        .item {
            width: calc(50% - var(--k-gap) / 2);
        }
    }

    :deep(.q-option-group) {
        position: relative;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: flex-end;

        &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 1.25rem;
            width: 100%;
            height: 1px;
            background-color: #333;
        }

        .q-radio {
            flex-flow: column;
            position: relative;
            z-index: 5;

            &__label {
                position: relative;
                z-index: 5;
                font-size: 0.875rem;
                line-height: 1;
            }

            .q-radio__inner {
                position: relative;
                z-index: 5;

                &.q-radio__inner--truthy {
                    .q-radio__bg {
                        > path:not(.q-radio__check) {
                            opacity: 1;
                            transform: scale(1);
                            transition: transform 0.5s $ease-out-cubic, opacity 0.25s;
                        }
                    }
                }

                .q-radio__bg {
                    > path:not(.q-radio__check) {
                        opacity: 0;
                        transform: scale(0.75);
                        transform-origin: center;
                        transition: transform 0.5s $ease-in-cubic, opacity 0.25s;
                    }

                    .q-radio__check {
                        color: #000;
                        transform: scale(1);
                    }
                }
            }
        }

        > div {
            position: relative;
            margin: 0;
            flex: auto 1 0;
            display: flex;
            flex-flow: row;
            justify-content: center;

            &:first-child {
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 50%;
                    height: 100%;
                    background-color: var(--k-section-background-color);
                }
            }

            &:last-child {
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    z-index: 1;
                    right: 0;
                    top: 0;
                    width: 50%;
                    height: 100%;
                    background-color: var(--k-section-background-color);
                }
            }
        }
    }
}*/

/*.sectors {
    li {
        position: relative;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        border-top: 1px solid #dedede;
        padding: 1rem 0;

        .sector-label {
            width: 100%;
            flex: none;
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0 0.5rem;
            margin: 0 0 0.25rem;
        }

        .q-option-group {
            width: auto;
            flex: auto 1 1;
            margin: 0 -1rem;
        }
    }
}*/
</style>
