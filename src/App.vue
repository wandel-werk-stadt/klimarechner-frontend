<script>
import { computed } from 'vue'
import KSectionOurCity from '@/components/sections/our-city/OurCity.vue'
import KSectionClimateActions from '@/components/sections/climate-actions/ClimateActions.vue'
import KSectionOutput from '@/components/sections/output/Output.vue'
import KDebug from '@/components/KDebug.vue'
import IntroOverlay from '@/components/overlays/intro/Intro.vue'
import LegalOverlay from '@/components/overlays/Legal.vue'
import CreditsOverlay from '@/components/overlays/Credits.vue'
import { useQuasar } from 'quasar'
import { useAppStore } from '@/stores/app'
import { useCityStore } from '@/stores/city'
import { useCalculatorStore } from '@/stores/calculator/index'
import { useShareStore } from '@/stores/share'
import resizeWatcher from '@/tools/resizeWatcher'

export default {
    components: {
        KSectionOurCity,
        KSectionClimateActions,
        KSectionOutput,
        KDebug,
        IntroOverlay,
        LegalOverlay,
        CreditsOverlay,
    },

    provide() {
        const vm = this
        return {
            generateShareLink: () => this.generateShareLink(),
            print: () => this.print(),

            isMobile: computed(() => this.isMobile),
            isPhone: computed(() => this.isPhone),
            drawerState: computed({
                get() {
                    return vm.drawerState
                },
                set(state) {
                    vm.drawerState = state
                },
            }),
            breakpoint: computed(() => this.breakpoint),

            showResetButton: computed(() => this.showResetButton),
            showCreditsOverlay: () => (this.showCreditsOverlay = true),
            resetData: this.resetData,
            showResetDialog: computed({
                get() {
                    return vm.showResetDialog
                },
                set(state) {
                    vm.showResetDialog = state
                },
            }),
        }
    },

    setup() {
        const app = useAppStore()
        const store = useCityStore()
        const calculator = useCalculatorStore()
        const share = useShareStore()

        const q = useQuasar()
        return { app, store, calculator, share, q }
    },

    data() {
        return {
            ready: false,
            debugMode: false,
            showResetDialog: false,
            showIntroOverlay: false,
            showLegalOverlay: false,
            showCreditsOverlay: false,

            showShareLinkDialog: false,
            shareLink: '',

            isMobile: false,
            isPhone: false,
            breakpoint: undefined,
            mobileBreakpoints: ['xs', 'sm', 'md'],
            showPhoneNotReadyBanner: false,
            ignorePhoneNotReadyBanner: false,
            phoneBreakpoints: ['xs', 'sm'],
            drawerState: false,
        }
    },

    mounted() {
        resizeWatcher.init()

        this.handleResize(resizeWatcher.getData())
        this.removeResizeWatcher = resizeWatcher.on((data) => {
            this.handleResize(data)
        })

        this.calculator.process()

        if (import.meta.env.DEV) {
            document.title = `🚧 Klimarechner v${this.calculator.version}`
        }

        this.processParams()

        this.startUpdateCheckTimer(10 / 60)

        this.ready = true

        if (!this.app.introShown) {
            this.showIntroOverlay = true
            this.app.introShown = !this.isPhone
        }
    },

    beforeUnmount() {
        if (this.removeResizeWatcher) {
            this.removeResizeWatcher()
        }

        if (this.updateCheckTimer) {
            window.clearTimeout(this.updateCheckTimer)
        }

        if (window.cancelIdleCallback && this.updateCheckIdleTimer) {
            window.cancelIdleCallback(this.updateCheckIdleTimer)
        }
    },

    computed: {
        darkMode: {
            get() {
                return this.q.dark.isActive
            },
            set(val) {
                this.q.dark.set(val)
            },
        },

        showResetButton() {
            return this.calculator.actionsActive.length > 0 || this.store.inputMode === 'expert'
        },
    },

    methods: {
        handleResize(data) {
            this.breakpoint = data.breakpoint
            this.isMobile = this.mobileBreakpoints.includes(data.breakpoint)
            this.isPhone = this.phoneBreakpoints.includes(data.breakpoint)
            this.showPhoneNotReadyBanner = this.isPhone
        },

        startUpdateCheckTimer(delay = 5) {
            this.updateCheckTimer = window.setTimeout(() => {
                if (window.requestIdleCallback) {
                    this.updateCheckIdleTimer = window.requestIdleCallback(
                        () => {
                            this.checkForUpdates()
                        },
                        { timeout: 5_000 },
                    )
                } else {
                    this.checkForUpdates()
                }
            }, delay * 60_000)
        },

        checkForUpdates() {
            fetch(`${location.origin}/meta.json`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(
                        'update-check:',
                        this.calculator.version !== data.version ? 'new version' : 'up to date',
                    )

                    if (this.calculator.version !== data.version) {
                        this.q.notify({
                            message: 'Es gibt eine neue Version des Klimarechners!',
                            type: 'warning',
                            color: 'primary',
                            textColor: 'white',
                            icon: 'o_update',
                            position: 'top',
                            timeout: 30_000,
                            actions: [
                                {
                                    label: 'Jetzt laden',
                                    style: 'background-color: #fff',
                                    handler: () => {
                                        window.location.reload()
                                    },
                                },
                            ],
                        })
                    } else {
                        this.startUpdateCheckTimer()
                    }
                })
                .catch((error) => {
                    console.warn('update-check failed', error)
                    this.startUpdateCheckTimer()
                    return false
                })
        },

        processParams() {
            const urlParams = new URLSearchParams(window.location.search)

            if (urlParams.has('debug')) {
                this.debugMode = true
            }

            if (urlParams.has('share')) {
                const shareId = urlParams.get('share')
                this.share.loadData(shareId)
                urlParams.delete('share')
            }

            const newParams = []
            urlParams.forEach((value, key) => {
                if (value === '') {
                    newParams.push(key)
                    return
                }

                newParams.push(`${key}=${value}`)
            })
            let path = window.location.pathname
            if (newParams.length) {
                path += `?${newParams.join('&')}`
            }

            window.history.replaceState({}, '', path)
        },

        resetData(climateNeutral = false, keepFossilSettings = false) {
            console.log(
                'resetData',
                climateNeutral ? 'climateNeutral' : '',
                keepFossilSettings ? 'keepFossilSettings' : '',
            )
            this.store.$reset(keepFossilSettings)
            this.calculator.$reset(climateNeutral, keepFossilSettings)
        },

        // setTestData() {
        //     this.store.setTestData()
        //     this.calculator.setTestData()
        // },

        generateShareLink() {
            this.share.generateLink().then((link) => {
                if (!link) {
                    this.shareLink = ''

                    this.q.notify({
                        message: 'Link konnte nicht generiert werden',
                        type: 'negative',
                        // color: 'secondary',
                        icon: 'o_error',
                        position: 'bottom',
                    })
                    return
                }

                this.shareLink = link

                this.copyShareLink().then((result) => {
                    if (result) {
                        this.q.notify({
                            message: 'Link in Zwischenablage kopiert',
                            type: 'positive',
                            // color: 'secondary',
                            icon: 'o_check',
                            position: 'bottom',
                        })
                    } else {
                        this.showShareLinkDialog = true
                    }
                })
            })
        },

        copyShareLink() {
            return new Promise((resolve) => {
                this.$nextTick(resolve)
            }).then(() => {
                const clipBoardEl = document.createElement('input')
                clipBoardEl.style.opacity = 0
                clipBoardEl.style.height = '1px'
                clipBoardEl.style.position = 'absolute'
                document.body.appendChild(clipBoardEl)
                clipBoardEl.value = this.shareLink
                clipBoardEl.select()

                const result = document.execCommand('copy')
                document.body.removeChild(clipBoardEl)

                return result
            })
        },

        print() {
            document.documentElement.classList.add('print')
            setTimeout(() => {
                window.print()
                document.documentElement.classList.remove('print')
            }, 500)
        },
    },
}
</script>

<template>
    <div id="app">
        <transition name="quick-fade">
            <div v-show="ready && !showIntroOverlay">
                <q-banner
                    v-if="showPhoneNotReadyBanner && !ignorePhoneNotReadyBanner"
                    class="phone-not-ready bg-secondary"
                >
                    Der Klimarechner ist ein umfangreiches Tool, das auf kleinen Bildschirmen nur
                    eingeschränkt nutzbar ist. Bitte benutzen Sie den Klimarechner auf einem
                    Desktop-Computer oder Tablet.
                    <template v-slot:action>
                        <q-btn flat label="Ausblenden" @click="ignorePhoneNotReadyBanner = true" />
                    </template>
                </q-banner>
                <header>
                    <div class="title">
                        <h1>Klimarechner {{ debugMode ? calculator.version : '' }}</h1>
                        <!-- <div class="mode">
                    <div class="dark-mode">
                        Licht an
                        <q-toggle v-model="darkMode" left-label size="xs" />
                        Licht aus
                    </div>
                </div> -->
                        <div class="buttons">
                            <transition name="quick-fade">
                                <q-btn
                                    icon="o_restart_alt"
                                    flat
                                    color="secondary"
                                    @click="showResetDialog = true"
                                    align="left"
                                    v-if="showResetButton"
                                    >Eingaben zurücksetzen</q-btn
                                >
                            </transition>
                            <!-- <q-btn
                        v-if="debugMode"
                        icon="o_bug_report"
                        color="orange-10"
                        @click="setTestData"
                        align="left"
                        >Test-Daten einstellen</q-btn
                    >
                    <q-btn
                        v-if="debugMode"
                        icon="o_share"
                        color="purple"
                        @click="generateShareLink"
                        align="left"
                        :loading="share.loading"
                        >Share-Link generieren</q-btn
                    > -->
                        </div>
                    </div>
                    <p>
                        Wie wirken sich Klimaschutzmaßnahmen auf unsere Stadt aus?
                        <span class="disclaimer">
                            Diese Ergebnisse sind überschlägige Rechnungen. Für die Umsetzung werden
                            detaillierte Planungen benötigt.
                        </span>
                    </p>
                </header>

                <div class="app-content">
                    <div class="settings">
                        <main>
                            <KSectionOurCity />
                            <KSectionClimateActions />
                        </main>
                    </div>
                    <div
                        :class="[
                            'output-wrapper',
                            { drawer: isMobile, 'drawer-open': drawerState },
                        ]"
                    >
                        <KSectionOutput :class="{ drawer: isMobile, 'drawer-open': drawerState }" />
                    </div>
                </div>

                <q-btn
                    class="feedback"
                    label="Feedback"
                    color="white"
                    text-color="black"
                    :ripple="false"
                    href="https://tally.so/r/nPOrz1"
                    target="_blank"
                />

                <footer>
                    <span class="anchor legal" @click="showLegalOverlay = true"
                        ><span class="text">Impressum & Datenschutz</span></span
                    >
                </footer>

                <KDebug v-if="debugMode" />
            </div>
        </transition>

        <q-dialog
            v-model="showResetDialog"
            persistent
            transition-show="jump-up"
            transition-hide="jump-down"
        >
            <q-card>
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Einstellungen zurücksetzen</div>
                    <q-space />
                    <q-btn icon="o_close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="row items-center">
                    <span
                        >Alle Maßnahmen werden zurückgesetzt und die Basis-Daten mit den
                        statistischen Durchschnittswerten überschrieben.<br />
                        <br />
                        Möchten Sie die <b>empfohlenen Werte</b> für Klimaneutralität
                        einstellen?</span
                    >
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Auf Null setzen"
                        color="primary"
                        @click.prevent.stop="resetData(false)"
                        v-close-popup
                    />
                    <q-btn
                        flat
                        label="Empfohlene Werte"
                        color="primary"
                        @click.prevent.stop="resetData(true)"
                        v-close-popup
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog
            v-model="showIntroOverlay"
            persistent
            transition-show="jump-up"
            transition-hide="jump-down"
        >
            <IntroOverlay @close="showIntroOverlay = false" />
        </q-dialog>

        <q-dialog v-model="showLegalOverlay" transition-show="jump-up" transition-hide="jump-down">
            <LegalOverlay />
        </q-dialog>

        <q-dialog
            v-model="showCreditsOverlay"
            transition-show="jump-up"
            transition-hide="jump-down"
        >
            <CreditsOverlay />
        </q-dialog>

        <q-dialog v-model="showShareLinkDialog" @show="$refs.shareLinkInput.select()">
            <q-card class="share-link-dialog">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Generierter Link</div>
                    <q-space />
                    <q-btn icon="o_close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                    <q-input
                        ref="shareLinkInput"
                        :model-value="'klimarechner.wandel-werkstadt.de/?share=s4ZLx9Ux_t'"
                        flat
                        dense
                        readonly
                    />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Kopieren"
                        color="primary"
                        @click="
                            () => {
                                copyShareLink()
                                showShareLinkDialog = false
                            }
                        "
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

#app {
    --content-padding: 1.5rem;
    display: flex;
    flex-flow: column;
    padding: var(--k-page-padding-y) var(--k-page-padding-x);
    max-width: var(--k-page-max-width);
    margin: 0 auto;

    // @include bp-lg {
    //     padding-right: var(--k-page-padding-x);
    //     padding-left: var(--k-page-padding-x);
    // }
}

:deep(.phone-not-ready) {
    margin: 0 var(--content-padding) 1.5rem;

    .q-banner__content {
        font-weight: 500;
    }
}

header {
    width: 100%;
    margin-bottom: var(--k-section-margin-y);
    padding: 0 var(--content-padding);

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-flow: column;
        margin-bottom: 0.5rem;
        min-height: 2.25rem;
        color: var(--k-color-background-text);

        h1 {
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 1.35;
        }

        .q-icon {
            color: #000;
        }
    }

    p {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--k-color-gray-300);
        text-align: center;
    }

    .disclaimer {
        display: block;
        margin-top: 0.25rem;
        // font-style: italic;
        font-size: 0.875rem;
    }

    .buttons {
        display: flex;
        flex-flow: column;
        gap: 0.5rem;
    }

    @include bp-sm {
        .title {
            flex-flow: row nowrap;
        }

        p {
            text-align: left;
        }
    }

    @include bp-lg {
        width: calc(65% - var(--k-grid-gutter) / 2);
    }

    @include bp-xl {
        width: calc(65% - var(--k-grid-gutter) / 2);
    }

    @include bp-2xl {
        width: calc(67.5% - var(--k-grid-gutter) / 2);
    }
}

.app-content {
    display: flex;
    flex-flow: column;
    gap: var(--k-grid-gutter);
    margin: 0 0 var(--k-grid-gutter);

    @include bp-lg {
        flex-flow: row;
        justify-content: space-between;

        > .settings {
            flex: none;
            width: calc(65% - var(--k-grid-gutter) / 2);
        }

        > .output-wrapper {
            flex: none;
            width: calc(35% - var(--k-grid-gutter) / 2);
        }
    }

    @include bp-xl {
        > .settings {
            width: calc(65% - var(--k-grid-gutter) / 2);
        }

        > .output-wrapper {
            width: calc(35% - var(--k-grid-gutter) / 2);
        }
    }

    @include bp-2xl {
        > .settings {
            width: calc(67.5% - var(--k-grid-gutter) / 2);
        }

        > .output-wrapper {
            width: calc(32.5% - var(--k-grid-gutter) / 2);
        }
    }
}

main {
    display: flex;
    flex-flow: column;
    align-items: stretch;
    gap: var(--k-section-margin-y);
    padding: 0 var(--content-padding);
}

footer {
    display: flex;
    flex-flow: row;
    justify-content: center;
    padding: 0 0 var(--k-grid-gutter);

    .anchor {
        display: inline-block;
        --anchor-color: var(--k-color-gray-300);
        --anchor-text-color-active: var(--k-color-background-base);
        font-weight: 500;
        font-size: 0.875rem;
    }
}

.q-btn.feedback {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translate(25%, -50%) rotate(90deg);

    &.q-btn__content {
        font-size: 0.9375rem;
    }
}

.output-wrapper {
    &.drawer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        z-index: 100;
        height: 5.25rem;
        padding: 0 0.5rem;

        .output {
            box-shadow: 0 0 0.25rem 0.125rem rgba(#000, 0.125);
            transform: translate(0, 0);
            transition: transform 0.4s $ease-out-cubic;
        }

        &.drawer-open {
            .output {
                transform: translate(0, calc(-100% + 5.25rem));
            }
        }
    }

    @include bp-lg {
        section {
            position: sticky;
            top: var(--k-section-margin-y);
        }
    }
}

.share-link-dialog {
    width: 320px;

    :deep(.q-input) {
        font-size: 0.875rem;
        color: var(--k-color-secondary-base);

        .q-field__native {
            line-height: 1;
        }
    }
}
</style>
