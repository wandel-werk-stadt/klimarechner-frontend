import Polyglot from 'node-polyglot'
import getObjectValueByPath from '@/tools/getObjectValueByPath.js'
import inputs from './inputs.js'
import results from './results.js'

const phrases = {
    details: 'Details',

    sectors: {
        private: 'Private Haushalte',
        industry: 'Gewerbe, Handel, Dienstleistungen',
        schools: 'Schulen',
        public: 'Kommune',
    },

    sectorsShort: {
        private: 'Privat',
        industry: 'GHD',
        public: 'Kommune',
        schools: 'Schulen',
    },

    sectorTabs: {
        aggregate: {
            label: 'Übersicht der Effekte',
            description: 'Für alle Sektoren zusammen gerechnet.',
        },
        private: { label: 'Private Haushalte', description: '' },
        industry: { label: 'Gewerbe, Handel & Dienstleistungen', description: '' },
        public: { label: 'Kommune', description: 'inkl. Schul&shy;gebäude' },
    },

    units: {
        'k*W*h/qm': 'kWh/m²',
    },

    heatTypes: {
        gas: 'Gas',
        oil: 'Öl',
        'oil-condensing': 'Öl mit Brennwert',
        'oil-no-condensing': 'Öl ohne Brennwert',
        'heat-pump': 'Wärmepumpe',
        'district-heating': 'Fernwärme',
        other: 'Sonstige',
    },

    electricityTypes: {
        'photovoltaics-roof': 'PV-Dach',
        'photovoltaics-landscape': 'PV-Freifläche',
        'wind-energy': 'Windenergie',
        'purchased-energy-renewable': 'Einkauf grüner Strom',
        'purchased-energy-mix': 'Einkauf Graustrom',
    },

    mobilityTypes: {
        car: 'PKW',
        public_transport: 'Zug/Bus',
        bicycle: 'Fahrrad',
        pedestrians: 'zu Fuß',
        other: 'Sonstige',
    },

    emissions: {
        oilHeating: 'Öl-Heizungen',
        gasHeating: 'Gas-Heizungen',
        fuel: 'Benzin',
        electricPower: 'Stromerzeugung',
    },

    heatingDistribution: {
        savings: 'Einsparungen',
    },

    actionList: {
        invest: { label: 'Investitionen', unit: 'Mio. €' },
        effectsOfReduction: { label: 'Effekte', unit: '€/t CO₂' },
        emissionsSaved: { label: 'CO₂-Reduktion', unit: '%' },
        return: { label: 'Rendite', unit: '%' },
        directEffects: { label: 'Effekte (Jahr)', unit: 'tsd. €' },
    },

    sources: {
        label: 'Quelle||||Quellen',
        categories: {
            all: 'Gesamt',
            private: 'Privat',
            industry: 'GHD',
            public: 'Kommune',
            schools: 'Schulen',
        },
    },

    charts: {
        economy: {
            direct_effects: {
                tooltip: `Summe der Veränderungen von laufenden Ausgaben und Einnahmen. Effizienzsteigerungen senken laufende Energiekosten, Einspeisevergütungen schaffen laufende Einnahmen. Je nach Auswahl für den Sektor oder alle zusammengerechnet.`,
            },
            indirect_effects: {
                tooltip: `Beschreibt indirekte wirtschaftliche Effekte von Klimamaßnahmen, etwa Einnahmensteigerung privater Haushalte durch zusätzliche Arbeitsplätze, Gewinnsteigerung von Unternehmen, die in der Kommune ansässig sind durch mehr Umsatz oder zusätzliche Steuereinnahmen der Kommune selbst.`,
            },
            invest: {
                tooltip: `Für die Umsetzung nötige Investition (einmalige Ausgaben für Material, Arbeit u.a.) in Mio. €. Je nach Auswahl für den Sektor oder alle berechnet.`,
            },
            cash_flow_netto: {
                tooltip: `Beschreibt, wieviel Geld in Summe eingenommen (+) oder ausgegeben (-) wurde. Der Wert errechnet sich aus den kumulierten direkten und indirekten Effekten, abzüglich der Investitionen.`,
            },
        },
    },

    kpis: {
        invest: {
            tooltip: `Die nötigen Investitionen (einmalige Ausgaben für Material, Arbeit u.a.), um alle Maßnahmen über den gesamten Zeitraum umzusetzen. Je nach Auswahl für den Sektor oder alle Sektoren berechnet.`,
        },

        directEffects: {
            tooltip: `Beschreibt wirtschaftliche Effekte von Klimamaßnahmen wie Kostensenkungen, Effizienz- oder Einnahmensteigerungen sowie die Preisentwicklung fossiler Energieträger. Werden über den Betrachtungszeitraum kumuliert.

Achtung: Auch wenn Klimamaßnahmen der Kommune hochrentable sind, kann die Preisentwicklung fossiler Energieträger über die Zeit zu einem negativen Gesamtergebnis führen.`,
        },

        indirectEffects: {
            tooltip: `Beschreibt indirekte wirtschaftliche Effekte von Klimamaßnahmen, etwa Einnahmensteigerung privater Haushalte durch zusätzliche Arbeitsplätze, Gewinnsteigerung von Unternehmen, die in der Kommune ansässig sind durch mehr Umsatz oder zusätzliche Steuereinnahmen der Kommune selbst.
Werden über den Betrachtungszeitraum kumuliert.`,
        },

        co2Reduction: {
            tooltip: `Welcher Anteil der gesamten CO₂-Emissionen durch alle Maßnahmen über den gesamten Zeitraum eingespart wird. Je nach Auswahl für den Sektor oder alle berechnet.`,
        },

        cashFlow: {
            tooltip: `Beschreibt, wieviel Geld in Summe eingenommen (+) oder ausgegeben (-) wurde. Der Wert errechnet sich aus den kumulierten direkten und indirekten Effekten, abzüglich der Investitionen.`,
        },
    },

    effects: {
        'co2Reduction[%]': {
            label: '%{value} %/Jahr <b>CO<sub>2</sub> Reduktion</b>',
            tooltip: `Welcher Anteil der gesamten CO₂-Emissionen eingespart wird. Je nach Auswahl für den Sektor oder alle berechnet.`,
        },
        'co2Reduction[k*to_coe]': {
            label: '%{value} tsd. to/Jahr <b>CO<sub>2</sub> Reduktion</b>',
            tooltip: `Einsparung von CO₂-Emissionen in Tonnen. Je nach Auswahl für den Sektor oder alle berechnet.`,
        },
        'investment[EUR]': {
            label: '%{value} Mio € <b>Invest</b>',
            tooltip: `Für die Umsetzung nötige Investition (einmalige Ausgaben für Material, Arbeit u.a.) in Mio. €. Je nach Auswahl für den Sektor oder alle berechnet.`,
        },
        'effectsOfReduction[EUR/t]': {
            label: '%{value} € <b>Effekt je eingesparte t CO<sub>2</sub></b>',
            tooltip: `Das nötige Investment umgelegt auf die eingesparte Tonne Emissionen. Je nach Auswahl für den Sektor oder alle zusammengerechnet.`,
        },
        'directEffects[k*EUR/a]': {
            label: '%{value} Mio. €/Jahr <b>Direkte Effekte</b>',
            tooltip: `Summe der Veränderungen von laufenden Ausgaben und Einnahmen. Effizienzsteigerungen senken laufende Energiekosten, Einspeisevergütungen schaffen laufende Einnahmen. Je nach Auswahl für den Sektor oder alle zusammengerechnet.`,
        },
        'breakEven[a]': {
            label: '%{year} (Jahr) <b>Break-Even</b>',
            tooltip: `Das Jahr, in welchem die kumulierten direkten Effekte die eingesetzte Investition ausgleichen, also mehr Geld einbringen statt reingesteckt werden muss. Direkte Effekte sind etwa Kosteneinsparungen oder Effizienzsteigerungen. Je nach Auswahl für den Sektor oder alle zusammengerechnet.`,
        },
        'return[%]': {
            label: '%{percent} % <b>Rendite</b>',
            tooltip: `Welche Rendite die Investition einbringt – jährliche direkte Effekte nach vollständiger Umsetzung geteilt durch die dafür eingesetzte Investition. Je nach Auswahl für den Sektor oder alle zusammengerechnet.`,
        },
    },

    actions: {
        groups: {
            'buildings-and-heat': 'Gebäudewärme',
            mobility: 'Mobilität',
            energy: 'Strom',
        },

        'fossil-price-increase': {
            label: 'Preisanstieg für fossile Energien',
            tooltip: `Linearer Preisanstieg der fossilen Energieträger über den angegebenen Zeitraum, etwa durch einen höheren CO₂-Preis.
Achtung: Wenn anstatt höheren (Start-)Preisen für fossile Energieträger ein Preisanstieg im Zeitverlauf eingestellt wird, wird dieser verrechnet wie eine Maßnahme mit stark negativen Effekten. Gesamteffekte können dadurch negativ werden, obwohl Klimamaßnahmen selbst hochrentabel sind.`,
        },
        'reduce-heat-demand': {
            label: 'Heizbedarf senken',
            tooltip: `Senkt den durchschnittlichen Heizbedarf im Jahr pro m² für den gewählten Sektor. Sehr niedrige Werte lassen sich nur mit erheblicher Dämmung erreichen.`,
        },
        'replace-gas-heating': {
            label: 'Gasheizungen ersetzen',
            tooltip: `Reduziert die Gesamtfläche, welche mit Gasheizungen beheizt wird. Über das Verhältnis lässt sich der Anteil an Wärmepumpen oder Fernwärme einstellen, die stattdessen eingesetzt werden sollen. Dies hat direkte Effekte auf den Energiebedarf, Investitionen und laufende Kosten sowie indirekte Effekte, etwa auf lokale Gewinne, Beschäftigung und Steuereinnahmen.`,
        },
        'replace-oil-heating': {
            label: 'Ölheizungen ersetzen',
            tooltip: `Reduziert die Gesamtfläche, welche mit Ölheizungen beheizt wird. Über das Verhältnis lässt sich der Anteil an Wärmepumpen oder Fernwärme einstellen, die stattdessen eingesetzt werden sollen. Dies hat direkte Effekte auf den Energiebedarf, Investitionen und laufende Kosten sowie indirekte Effekte, etwa auf lokale Gewinne, Beschäftigung und Steuereinnahmen.`,
        },
        'expand-photovoltaics-roof': {
            label: 'PV-Dach ausbauen',
            tooltip: `Nutzt die geschätzten oder angegebenen Potenzialflächen auf Dächern, um Photovoltaik-Anlagen auszubauen. Für 1000m² wird dabei mit 0,2 MWp gerechnet. Die Einheit Mega-Watt-Peak (MWp) bezeichnet dabei die Leistung unter günstigen Standard-Bedingungen.
Der Ausbau hat direkte Effekte auf den Energiebedarf, Investitionen, Einnahmen und laufende Kosten sowie indirekte Effekte, etwa auf lokale Gewinne, Beschäftigung und Steuereinnahmen.`,
        },
        'expand-photovoltaics-landscape': {
            label: 'PV-Freifläche ausbauen',
            tooltip: `Nutzt die Potenzialflächen, um Photovoltaik-Freiflächen-Anlagen auszubauen. Dabei wird eine Leistung von 0,08 MWp je Hektar angenommen. Die Einheit Mega-Watt-Peak (MWp) bezeichnet dabei die Leistung unter günstigen Standard-Bedingungen.
Der Ausbau hat direkte Effekte auf den Energiebedarf, Investitionen und laufende Kosten sowie indirekte Effekte, etwa auf lokale Gewinne, Beschäftigung und Steuereinnahmen.`,
        },
        'expand-wind-energy': {
            label: 'Windenergie ausbauen',
            tooltip: `Nutzt die Potenzialflächen, um Windkraft-Anlagen auszubauen. Dabei wird eine Leistung von 0,24 MWp je Hektar angenommen. Die Einheit Mega-Watt-Peak (MWp) bezeichnet dabei die Leistung unter günstigen Standard-Bedingungen.
Der Ausbau hat direkte Effekte auf den Energiebedarf, Investitionen und laufende Kosten sowie indirekte Effekte, etwa auf lokale Gewinne, Beschäftigung und Steuereinnahmen.`,
        },
        'increase-renewable-energy-share': {
            label: 'Zukauf erneuerbare Energien erhöhen',
            tooltip: `Erhöht den Anteil des eingekauften Stroms, der aus erneuerbaren Energien stammt.`,
        },
        'replace-cars-with-bev': {
            label: 'PKW mit E-Autos ersetzen',
            tooltip: `Wie viele der vorhandenen PKW in Zukunft durch E-Autos ersetzt werden sollen.`,
        },
        'promote-public-transport': {
            label: 'Anteil Zug/Bus erhöhen',
            tooltip: `Erhöht den Anteil der pro Person mit Zügen oder Bussen zurückgelegten Kilometer. Senkt dabei den Anteil, der per PKW zurückgelegt wird, um den gleichen Betrag.`,
        },
        'promote-bicycle': {
            label: 'Anteil Fahrrad erhöhen',
            tooltip: `Erhöht den Anteil der pro Person mit Fahrrad zurückgelegten Kilometer. Senkt dabei den Anteil, der per PKW zurückgelegt wird, um den gleichen Betrag.`,
        },
    },

    dataCategories: {
        buildings: 'Basis-Daten, Gebäudewärme',
        energy: 'Strom',
        mobility: 'Mobilität',
    },

    dataInputs: {
        'buildings/base_data/floor_area_total[k*qm]': {
            label: 'Geschossfläche Gesamt',
            unit: 'tsd. m²',
            tooltip: `Die gesamten Geschossflächen.`,

            sources: {
                private: {
                    'Statistisches Bundesamt':
                        'https://de.statista.com/statistik/daten/studie/70099/umfrage/wohnflaeche-in-wohngebaeuden-in-deutschland-seit-1994/',
                },
                industry: {
                    'BMVBS Dezember 2013':
                        'https://www.irbnet.de/daten/baufo/20138036007/DL_ON272013.pdf',
                },
                public: {},
                schools: {
                    'Land Berlin':
                        'https://www.berlin.de/schulbau/service/downloadcenter/musterraumprogramme/#MRPGrundschulen',
                },
            },
        },
        'buildings/demand/heat_total[k*qm]': {
            label: 'Wärmebedarf Gesamt (im Jahr)',
            unit: 'GWh',
            tooltip: `Hier wird die Summe des Wärmebedarfs (Heizung und Warmwasser) im Jahr gebildet: Geschossfläche x Heizbedarf + Warmwasserbedarf x Personen.`,
        },
        'buildings/heat_types_areas/other[k*qm]': {
            label: 'Fläche Sonstige',
            unit: 'tsd. m²',
            tooltip: `Für alle restlichen Gebäudeflächen, die nicht mit den aufgeführten Heizungsarten abgedeckt werden, werden andere angenommen – etwa Kohle oder Holz.`,
        },
        'mobility/modal_split/shares/sum[]': {
            label: 'Summe',
            unit: '%',
            tooltip: `Alle Verkehrsanteile zusammengerechnet sollten 100% ergeben.`,
        },
    },

    inputs,
    results,
    credits: [
        {
            name: 'Leonardo da Vinci Ventures gUG',
            url: 'https://www.leonardo-da-vinci-ventures.eu/',
            contribution: 'Rechenwerk',
            type: 'team',
        },
        {
            name: 'ClimateCalculator',
            url: 'https://github.com/antichloride/climcalc-core',
            contribution: 'Backend',
            type: 'team',
        },
        {
            name: 'logi.codes',
            url: 'https://logi.codes',
            contribution: 'Frontend',
            type: 'team',
        },
        {
            name: 'ansvar2030',
            url: 'https://www.ansvar.com/',
            contribution: 'Design, Entwicklung & Product Management',
            type: 'team',
        },
        {
            name: 'Agentur für clevere Städte',
            url: 'https://www.clevere-staedte.de/',
            contribution: 'Netzwerk & Partner',
            type: 'team',
        },
        {
            name: 'Konrad-Adenauer-Stiftung',
            url: 'https://www.kas.de/de/web/politische-bildung/kommunalakademie',
            contribution: 'Finanzierung, KommunalAkademie',
            type: 'team',
        },
        {
            name: 'madye-by-made | NounProject',
            url: '',
            contribution: 'Icons',
            type: 'material',
        },
    ],

    partners: [
        {
            name: 'ansvar2030',
            description:
                'Klimaschutzberatung, -umsetzung und -kommunikation für kommunalen Klimaschutz, der alle mitnimmt.',
            url: 'https://www.ansvar.com/',
            email: 'handeln@ansvar.com',
        },
        {
            name: 'Leonardo da Vinci Ventures gUG',
            description: 'Beratung, Konzept und Berechnung rund um Klimaschutz.',
            url: 'https://www.leonardo-da-vinci-ventures.eu/',
            email: 'hartmut.fischer@leonardo-da-vinci-ventures.eu',
        },
        // {
        //     name: 'Wandel WerkStadt',
        //     description: 'Das digitale Klimaportal für Ihre Stadt.',
        //     url: 'https://wandel-werkstadt.de/',
        //     email: 'kontakt@wandel-werkstadt.de',
        // },
        {
            name: 'Agentur für clevere Städte',
            description: 'Für gute Städte, Verkehrs- und Klimapolitik sorgen!',
            url: 'https://www.clevere-staedte.de/',
            email: 'hs@clevere-staedte.de',
        },
    ],
}

const polyglot = new Polyglot({
    locale: 'de',
    allowMissing: true,
})

polyglot.extend(phrases)

function i18n(phrase, options) {
    let opts = {}

    if (typeof options === 'number') {
        opts = { smart_count: options }
    } else {
        opts = { smart_count: options?.count, ...options }
    }

    return polyglot.t(phrase, opts)
}

i18n.has = (key) => polyglot.has(key)
i18n.raw = (key) => getObjectValueByPath(phrases, key.split('.'))

// i18n.listDelimiter = (length) =>
//     ({
//         1: ', ',
//         2: ' & ',
//     }[length === 2 ? 2 : 1])

export default i18n
