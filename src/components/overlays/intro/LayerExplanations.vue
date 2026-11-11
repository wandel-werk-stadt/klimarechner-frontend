<template>
    <q-card class="layer layer-explanations">
        <div class="content">
            <q-card-section class="section-header">
                <header>
                    <h3>Zum besseren Verständnis</h3>
                </header>
            </q-card-section>

            <q-separator />

            <q-card-section class="section-explanations">
                <div class="column">
                    <b>Wirtschaftliche Auswirkungen</b>
                    Werden in direkten + indirekten Effekten berechnet.

                    <img
                        class="economy-chart"
                        src="intro/economy-chart.svg"
                        alt="Beispiel Diagramm wirtschaftliche Effekte"
                    />
                </div>

                <div class="column">
                    <img
                        class="tooltip"
                        src="intro/tooltip.png"
                        width="348"
                        height="101"
                        alt="Beispiel Hilfetexte Info-Icon"
                    />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="section-terms">
                <ul>
                    <li>
                        <b>Direkte Effekte:</b> Beschreibt wirtschaftliche Effekte von
                        Klimamaßnahmen wie Kostensenkungen, Effizienz- oder Einnahmensteigerungen
                        sowie die Preisentwicklung fossiler Energieträger.
                    </li>

                    <li>
                        <b>Indirekte Effekte:</b> Beschreibt indirekte wirtschaftliche Effekte von
                        Klimamaßnahmen, etwa Einnahmensteigerung privater Haushalte durch
                        zusätzliche Arbeitsplätze, Gewinnsteigerung von Unternehmen, die in der
                        Kommune ansässig sind durch mehr Umsatz oder zusätzliche Steuereinnahmen der
                        Kommune selbst.
                    </li>

                    <li>
                        <b>Investitionen:</b> Die nötigen Investitionen (einmalige Ausgaben für
                        Material, Arbeit u.a.), um alle Maßnahmen über den gesamten Zeitraum
                        umzusetzen.
                    </li>
                </ul>
            </q-card-section>

            <q-card-actions>
                <q-btn color="black" unelevated rounded @click="showNextLayer"
                    >Rechner starten</q-btn
                >
            </q-card-actions>
        </div>
    </q-card>
</template>

<script>
export default {
    inject: ['showNextLayer'],
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.layer-explanations {
    .section-explanations {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        margin: 0 0 2rem;

        .column {
            display: flex;
            flex-flow: column;
            flex: 1 1 50%;
        }

        .tooltip {
            margin: 0 0 0 auto;
        }

        .economy-chart {
            width: 90%;
            margin: 2rem 0 0;
        }
    }

    .section-terms {
        ul {
            display: flex;
            flex-flow: row nowrap;
            align-items: flex-start;
            gap: 1.5rem;
            margin: 0;

            li {
                flex: 1 1 33.333%;
            }
        }
    }
}
</style>
