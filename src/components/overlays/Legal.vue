<template>
    <q-card class="legal-overlay">
        <q-card-section class="header">
            <header>
                <span>Impressum</span>
                <q-space />
                <q-btn icon="o_close" flat round dense v-close-popup />
            </header>
        </q-card-section>

        <q-card-section>
            <h4>Kontakt</h4>
            <p>
                ansvar2030 Holding GmbH<br />
                Plauener Straße 21<br />
                44139 Dortmund<br />
                <br />
                E-Mail:
                <a class="anchor" href="mailto:info@ansvar.com" target="_blank"
                    ><span class="text">info@ansvar.com</span></a
                ><br />
                Telefon:
                <a class="anchor" href="tel:+4923199777455"
                    ><span class="text">+49 231 997 774 55</span></a
                >
            </p>
        </q-card-section>
        <q-card-section>
            <h4>Rechtliche Hinweise</h4>
            <p>
                Wir entwickeln die Inhalte unserer Websiten ständig weiter und bemühen uns korrekte
                und aktuelle Informationen bereitzustellen. Leider können wir keine Haftung für die
                Korrektheit aller Inhalte übernehmen, speziell für jene, die seitens Dritter
                bereitgestellt wurden. Sollten Ihnen problematische oder rechtswidrige Inhalte
                auffallen, bitten wir Sie uns umgehend zu kontaktieren, damit wir die Inhalte
                entfernen oder aktualisieren können.
            </p>

            <p>
                Unsere Website enthält Links zu anderen Websites für deren Inhalt wir nicht
                verantwortlich sind. Haftung für verlinkte Websites besteht für uns nicht, da wir
                keine Kenntnis rechtswidriger Tätigkeiten hatten und haben, uns solche
                Rechtswidrigkeiten auch bisher nicht aufgefallen sind und wir Links sofort entfernen
                würden, wenn uns Rechtswidrigkeiten bekannt werden.
            </p>
        </q-card-section>
        <q-card-section>
            <h4>Urheberrecht</h4>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des Seitenbetreibers. Soweit die Inhalte auf dieser Seite nicht vom Betreiber
            erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
            Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
            aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
        </q-card-section>
        <q-card-section>
            <h4>Datenschutz für Besucherinnen und Besucher</h4>

            <p>
                Benutzerdefinierte Einstellungen (wie Dark Mode, eingegebene Daten o.ä.) werden im
                Local Storage abgelegt, um Ihnen ein angenehmes Nutzererlebnis zu ermöglichen. Diese
                lokalen Einstellungen werden nicht ohne Ihre Einwilligung an unsere Server
                übertragen und können jederzeit gelöscht werden. **Bei der Erstellung eines
                Short-Links zum Teilen werden die eingestellten Daten auf unsere Server übertragen
                und dort gespeichert.
            </p>

            <p>
                Wir verzichten auf den Einsatz invasiver Webtracking-Tools wie Google Analytics. Um
                die Nutzung dieser Website zu verstehen und sie zu verbessern, nutzen wir Plausible
                Analytics. Plausible setzt keine Cookies, speichert keine Informationen im Browser,
                und erhebt auch generell keinerlei personenenbezogenen Daten. Hier finden Sie mehr
                Informationen zu Plausible
                <a class="anchor" target="_blank" href="https://plausible.io/privacy"
                    ><span class="text">plausible.io/privacy</span></a
                >. Dienstanbieter: OÜ Plausible Insights, Västriku tn 2, Tartu 50403, Estland;
                <a class="anchor" target="_blank" href="https://plausible.io/"
                    ><span class="text">Website</span></a
                >,
                <a class="anchor" target="_blank" href="https://plausible.io/data-policy"
                    ><span class="text">Datenschutz</span></a
                >.
            </p>

            <p>
                Soweit nicht anders angegeben, werden Daten entsprechend den gesetzlichen
                Vorschriften für die hier dargestellten Zwecke verarbeitet und nur so lange, wie
                eine persönliche Identifikation des Betroffenen für den jeweiligen Zweck
                erforderlich ist. Anschließend erfolgt eine Löschung oder datenschutzgerechte
                Neutralisierung/Anonymisierung.
            </p>
        </q-card-section>

        <q-card-section class="credits">
            <h4>Credits</h4>
            <p>
                <template v-for="item of list" :key="item.name">
                    {{ item.contribution }}
                    <a class="anchor" :href="item.url" target="_blank"
                        ><span class="text">{{ item.name }}</span></a
                    ><br />
                </template>
            </p>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
    inject: ['i18n'],

    computed: {
        list() {
            return this.i18n.raw('credits')
        },
    },
}
</script>

<style scoped lang="scss">
@import 'src/assets/tools.scss';

.legal-overlay {
    background-color: var(--k-color-section-base);
    padding: 0 1.5rem 1.5rem;
    border-radius: 0.25rem;
    color: #000;
    font-size: 0.875rem;
    max-width: calc(var(--k-page-max-width) - var(--k-page-padding-x) * 2);
    width: calc(100% - var(--k-page-padding-x) * 2);

    .anchor {
        --anchor-color: #000;
    }

    header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        font-size: 1.25rem;
        line-height: 1.2;
        font-weight: 700;
    }

    h4 {
        font-size: 1rem;
        margin: 0 0 0.5rem;
        line-height: 1.2;
        font-weight: 700;
    }
}

.q-card__section {
    padding: 1.5rem 0 0;

    &.header {
        padding: 1rem 0;
        border-bottom: 1px solid #d7dadd;
    }

    p {
        margin-top: 1rem;
    }
}

.q-separator {
    margin: 0 0 1rem;
}
</style>
