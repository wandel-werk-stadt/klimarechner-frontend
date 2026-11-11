<template>
    <q-card class="layer layer-fossils-and-actions">
        <div class="content">
            <q-card-section class="section-header">
                <header>
                    <h3>Preise für fossile Energien</h3>
                    <p>
                        Auch wenn Klimamaßnahmen der Kommune hochrentabel sind, kann die
                        Preisentwicklung fossiler Energieträger über die Zeit zu einem negativen
                        Gesamtergebnis führen. Diese Daten lassen sich auch später noch anpassen.
                    </p>
                </header>
                <q-btn icon="o_close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="section-fossils">
                <FossilScenario />
            </q-card-section>

            <q-card-section class="section-climate-actions">
                <img
                    class="city-silhouette"
                    src="intro/city-silhouette.svg"
                    alt="Stadtsilhouette"
                />

                <header>
                    <h3>Voreinstellungen für Maßnahmen</h3>
                    <p>
                        Möchten Sie die empfohlenen Werte zur Erreichung der Klimaneutralität
                        einstellen oder auf einem frischen Blatt Papier starten?
                    </p>
                </header>
            </q-card-section>

            <q-card-actions>
                <q-btn
                    color="black"
                    outline
                    unelevated
                    rounded
                    @click="() => handleSetActions(false)"
                    >Maßnahmen selbst einstellen</q-btn
                >

                <q-btn color="black" unelevated rounded @click="() => handleSetActions(true)"
                    >Empfohlene Werte verwenden</q-btn
                >
            </q-card-actions>

            <KGlow type="bottom" preserveAspectRatio="xMidYMin slice" />
        </div>
    </q-card>
</template>

<script>
import FossilScenario from '@/components/sections/our-city/FossilScenario.vue'
import KGlow from '@/components/KGlow.vue'

export default {
    components: { FossilScenario, KGlow },

    inject: ['showNextLayer'],

    methods: {
        handleSetActions(climateNeutral = false) {
            this.$emit('settings-climate-neutral', climateNeutral)
            this.showNextLayer()
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.layer-fossils-and-actions {
    .city-silhouette {
        display: block;
        width: 75%;
        margin: 0 auto -3px;
    }

    .section-climate-actions {
        header {
            padding-top: 2rem;
            border-top: 3px solid #000;
        }
    }

    .q-card__section,
    .q-card__actions {
        position: relative;
        z-index: 5;
    }

    .q-card__actions {
        display: flex;
        flex-flow: row wrap;
        gap: 1rem 1.5rem;
    }

    :deep(.k-glow) {
        position: absolute;
        display: block;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80%;
        z-index: 1;
    }
}
</style>
