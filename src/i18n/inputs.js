export default {
    'buildings/base_data/inhabitants[k]': {
        label: 'Einwohner, Mitarbeiter, Schüler',
        unit: 'tsd.',
        tooltip: ``,
        sources: {
            private: {
                'Statistisches Bundesamt':
                    'https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Bevoelkerungsstand/_inhalt.html',
            },
            industry: {
                'Statistisches Bundesamt':
                    'https://www-genesis.destatis.de/genesis/online?operation=abruftabelleBearbeiten&levelindex=2&levelid=1653653981985&auswahloperation=abruftabelleAuspraegungAuswaehlen&auswahlverzeichnis=ordnungsstruktur&auswahlziel=werteabruf&code=13321-0001&auswahltext=&werteabruf=Werteabruf#abreadcrumb',
            },
            public: {
                'Statistisches Bundesamt':
                    'https://www-genesis.destatis.de/genesis/online?operation=ergebnistabelleUmfang&levelindex=3&levelid=1653654280221&downloadname=21111-0002#abreadcrumbhttps://www-genesis.destatis.de/genesis/online?operation=abruftabelleBearbeiten&levelindex=2&levelid=1653654570929&auswahloperation=abruftabelleAuspraegungAuswaehlen&auswahlverzeichnis=ordnungsstruktur&auswahlziel=werteabruf&code=21121-0001&auswahltext=&werteabruf=Werteabruf#abreadcrumb',
            },
            schools: {
                'Statistisches Bundesamt':
                    'https://www-genesis.destatis.de/genesis/online?operation=abruftabelleBearbeiten&levelindex=1&levelid=1654252792176&auswahloperation=abruftabelleAuspraegungAuswaehlen&auswahlverzeichnis=ordnungsstruktur&auswahlziel=werteabruf&code=74111-0001&auswahltext=&werteabruf=Werteabruf#abreadcrumb',
            },
        },
    },
    'buildings/base_data/n_buildings[]': {
        label: 'Anzahl Gebäude',
        unit: 'Stück',
        tooltip: `Die gesamte Anzahl an Gebäuden in der Stadt. Diese Kennzahl ist wichtig, um den Heizwärmeverbrauch abzuleiten. Diese Daten liegen der Stadtverwaltung und zuletzt vom Zensus 2011 auch öffentlich vor.`,
        sources: {
            private: {
                'Statistisches Bundesamt':
                    'https://www-genesis.destatis.de/genesis/online?operation=abruftabelleBearbeiten&levelindex=1&levelid=1654253339631&auswahloperation=abruftabelleAuspraegungAuswaehlen&auswahlverzeichnis=ordnungsstruktur&auswahlziel=werteabruf&code=31231-0001&auswahltext=&werteabruf=Werteabruf#abreadcrumb',
            },
            industry: {
                'Institut Wohnen und Umwelt':
                    'https://datanwg.de/fileadmin/user/iwu/210428_IWU_PT_dataNWG_DatenundFakten.pdf',
            },
            public: {
                industry: ['Institut Wohnen und Umwelt'],
            },
            schools: {
                industry: ['Institut Wohnen und Umwelt'],
            },
        },
    },
    'buildings/base_data/floor_area_per_building[qm]': {
        label: 'Geschossfläche je Gebäude',
        unit: 'm²',
        tooltip: `Beheizte Nutzfläche je Gebäude. Der durchschnittliche Wert leitet sich aus der bundesweiten Anzahl von Gebäuden und bundesweiten Geschossfläche ab.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'buildings/demand/heat[k*W*h/qm/a]': {
        label: 'Wärmebedarf (im Jahr)',
        unit: 'kWh/m²',
        tooltip: `Der Heizbedarf ist je nach Sektor unterschiedlich.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'buildings/demand/hot_water_per_capita[k*W*h/a]': {
        label: 'Warmwasserbedarf pro Person & Jahr',
        unit: 'kWh/m²',
        tooltip: `Der Warmwasserbedarf ist je nach Sektor unterschiedlich.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/private-haushalte-konsum/wohnen/energieverbrauch-privater-haushalte#hochster-anteil-am-energieverbrauch-zum-heizen',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: {},
        },
    },
    'buildings/demand/energy_per_capita[k*W*h/a]': {
        label: 'Strombedarf pro Person & Jahr',
        unit: 'kWh',
        tooltip: `Der durchschnittliche Gebäude-Strombedarf pro Nutzer (Bewohner, Mitarbeiterinnen, Schülerin) im Jahr.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/private-haushalte-konsum/wohnen/energieverbrauch-privater-haushalte#endenergieverbrauch-der-privaten-haushalte',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: {},
        },
    },
    'buildings/heat_types_areas/oil_no_condensing[k*qm]': {
        label: 'Fläche Öl-Heizungen',
        unit: 'tsd. m²',
        tooltip: `Gebäudeflächen in m² welche mit Ölheizungen ohne Brennwertkessel beheizt werden.`,
        sources: {
            private: {
                'Bundesverband der Energie- und Wasserwirtschaft':
                    'https://www.bdew.de/media/documents/Pub_20191031_Wie-heizt-Deutschland-2019.pdf',
                'Statistisches Bundesamt':
                    'https://de.statista.com/statistik/daten/studie/162218/umfrage/beheizungsstruktur-des-wohnbestandes-in-deutschland-seit-1975/',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: { industry: ['Energieinstitut der Wirtschaft'] },
        },
    },
    'buildings/heat_types_areas/oil_with_condensing[k*qm]': {
        label: 'Fläche Öl-Heizungen (Brennwert)',
        unit: 'tsd. m²',
        tooltip: `Gebäudeflächen in m² welche mit Ölheizungen mit Brennwertkessel werden. Bei der etwas neueren Brennwerttechnologie wird etwa 10% eingespart.`,
        sources: {
            private: {
                'Bundesverband der Energie- und Wasserwirtschaft':
                    'https://www.bdew.de/media/documents/Pub_20191031_Wie-heizt-Deutschland-2019.pdf',
                'Statistisches Bundesamt':
                    'https://de.statista.com/statistik/daten/studie/162218/umfrage/beheizungsstruktur-des-wohnbestandes-in-deutschland-seit-1975/',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: { industry: ['Energieinstitut der Wirtschaft'] },
        },
    },
    'buildings/heat_types_areas/gas[k*qm]': {
        label: 'Fläche Gas-Heizungen',
        unit: 'tsd. m²',
        tooltip: `Gebäudeflächen in m² welche mit Gasheizungen beheizt werden.`,
        sources: {
            private: {
                'Statistisches Bundesamt':
                    'https://de.statista.com/statistik/daten/studie/162218/umfrage/beheizungsstruktur-des-wohnbestandes-in-deutschland-seit-1975/',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: { industry: ['Energieinstitut der Wirtschaft'] },
        },
    },
    'buildings/heat_types_areas/heat_pump[k*qm]': {
        label: 'Fläche Wärmepumpen',
        unit: 'tsd. m²',
        tooltip: `Gebäudeflächen in m² welche mit Wärmepumpen beheizt werden.`,
        sources: {
            private: {
                'Statistisches Bundesamt':
                    'https://de.statista.com/statistik/daten/studie/162218/umfrage/beheizungsstruktur-des-wohnbestandes-in-deutschland-seit-1975/',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: { industry: ['Energieinstitut der Wirtschaft'] },
        },
    },
    'buildings/heat_types_areas/district_heating[k*qm]': {
        label: 'Fläche Fernwärme',
        unit: 'tsd. m²',
        tooltip: `Gebäudeflächen in m² welche mit Fernwärme beheizt werden.`,
        sources: {
            private: {
                'Statistisches Bundesamt':
                    'https://de.statista.com/statistik/daten/studie/162218/umfrage/beheizungsstruktur-des-wohnbestandes-in-deutschland-seit-1975/',
            },
            industry: {
                'Energieinstitut der Wirtschaft':
                    'https://energieinstitut.net/de/system/files/0903_final_dienstleistungsgebaude_20120530.pdf',
            },
            public: { industry: ['Energieinstitut der Wirtschaft'] },
            schools: { industry: ['Energieinstitut der Wirtschaft'] },
        },
    },
    'heat-pump-district-heating-distribution': {
        label: 'Verhältnis Wärmepumpe / Fernwärme',
        unit: '%',
    },
    'buildings/district_heating_renewable_part[]': {
        label: 'Fernwärme-Anteil erneuerbar',
        unit: '%',
        tooltip: `Erneuerbarer Anteil von Fernwärme. Fernwärme kann in fossilen Heizkraftwerken aber auch klimaneutral (Abwärme, Geothermie) gewonnen werden.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'buildings/district_heating_price[EUR/k*W*h]': {
        label: 'Fernwärme-Preis',
        unit: '€/kWh',
        tooltip: `Der durchschnittliche Preis für Fernwärme je kWh.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'buildings/other_output_nrg_price[EUR/k*W*h]': {
        label: 'Sonstige Erzeugungs-Energiepreis',
        unit: '€/kWh',
        tooltip: `Für alle Gebäudeflächen, die nicht mit den explizit aufgeführten Heizungsarten abgedeckt werden, werden “Sonstige” angenommen – etwa Kohle oder Holz. Dafür lässt wird ein durchschnittlicher Preis je kWh angenommen.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'buildings/fossil_fuel_prices/oil[EUR/L]': {
        label: 'Öl-Preis',
        unit: '€/Liter',
        tooltip: ``,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'buildings/fossil_fuel_prices/gas[EUR/m3]': {
        label: 'Gas-Preis',
        unit: '€/m³',
        tooltip: ``,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/cars/n_pkw[k]': {
        label: 'Anzahl PKW',
        unit: 'tsd.',
        tooltip: `In der Kommune zugelassene PKW (Verbrenner und E-Auto).`,
        sources: {
            all: {
                'Kraftfahrt-Bundesamt':
                    'https://www.kba.de/DE/Presse/Pressemitteilungen/Fahrzeugbestand/2021/pm08_fz_bestand_pm_komplett.html;jsessionid=426EE853248DF46EA4BA8470FD5ABACB.live11314',
            },
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/cars/n_bev[k]': {
        label: 'davon Anzahl Elektroautos',
        unit: 'tsd.',
        tooltip: `In der Kommune zugelassene E-Autos.`,
        sources: {
            private: {
                'Statistisches Bundesamt':
                    'https://de.statista.com/statistik/daten/studie/265995/umfrage/anzahl-der-elektroautos-in-deutschland/',
            },
            industry: {
                'Kraftfahrt-Bundesamt':
                    'https://www.kba.de/DE/Presse/Pressemitteilungen/Fahrzeugbestand/2021/pm08_fz_bestand_pm_komplett.html;jsessionid=426EE853248DF46EA4BA8470FD5ABACB.live11314',
            },
            public: {
                'Kraftfahrt-Bundesamt':
                    'https://www.kba.de/DE/Presse/Pressemitteilungen/Fahrzeugbestand/2021/pm08_fz_bestand_pm_komplett.html;jsessionid=426EE853248DF46EA4BA8470FD5ABACB.live11314',
            },
            schools: {},
        },
    },
    'mobility/cars/kilometers_traveled_per_person[k*k*m]': {
        label: 'Zurückgelegte Strecke pro Person & Jahr',
        unit: 'tsd. km',
        tooltip: `Welche Strecken Personen im Jahr durchschnittlich zurückgelegt werden. Dazu zählen alle Verkehrsmittel, auch Fußwege.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/verkehr/fahrleistungen-verkehrsaufwand-modal-split#personenverkehr',
                'Statistisches Bundesamt':
                    'https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Transport-Verkehr/Unternehmen-Infrastruktur-Fahrzeugbestand/Tabellen/fahrzeugbestand.html',
            },
            industry: {
                'Kraftfahrt-Bundesamt':
                    'https://www.kba.de/DE/Statistik/Kraftverkehr/VerkehrKilometer/vk_inlaenderfahrleistung/2021/2021_vk_kurzbericht.html?nn=3517388&fromStatistic=3517388&yearFilter=2021&fromStatistic=3517388&yearFilter=2021',
            },
            public: {},
            schools: {},
        },
    },
    'mobility/modal_split/shares/plane[]': {
        label: 'Flugzeug-Anteil',
        unit: '%',
        tooltip: `Oben lässt sich die zurückgelegte Strecke pro Person im Jahr festlegen. Hier wird bestimmt, welcher Anteil davon aktuell mit dem Flugzeug zurückgelegt wird.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/verkehr/fahrleistungen-verkehrsaufwand-modal-split#die-meisten-personenkilometer-fur-die-freizeit-starke-zunahme-der-geschaftsreisen-',
            },
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/modal_split/shares/pedestrians[]': {
        label: 'Fußgänger-Anteil',
        unit: '%',
        tooltip: `Oben lässt sich die zurückgelegte Strecke pro Person im Jahr festlegen. Hier wird bestimmt, welcher Anteil davon aktuell zu Fuß zurückgelegt wird.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/verkehr/fahrleistungen-verkehrsaufwand-modal-split#die-meisten-personenkilometer-fur-die-freizeit-starke-zunahme-der-geschaftsreisen-',
            },
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/modal_split/shares/public_transport[]': {
        label: 'Zug/Bus-Anteil',
        unit: '%',
        tooltip: `Oben lässt sich die zurückgelegte Strecke pro Person im Jahr festlegen. Hier wird bestimmt, welcher Anteil davon aktuell mit dem Zug oder Bus zurückgelegt wird.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/verkehr/fahrleistungen-verkehrsaufwand-modal-split#die-meisten-personenkilometer-fur-die-freizeit-starke-zunahme-der-geschaftsreisen-',
            },
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/modal_split/shares/bicycle[]': {
        label: 'Fahrrad-Anteil',
        unit: '%',
        tooltip: `Oben lässt sich die zurückgelegte Strecke pro Person im Jahr festlegen. Hier wird bestimmt, welcher Anteil davon aktuell mit dem Rad zurückgelegt wird.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/verkehr/fahrleistungen-verkehrsaufwand-modal-split#die-meisten-personenkilometer-fur-die-freizeit-starke-zunahme-der-geschaftsreisen-',
            },
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/modal_split/shares/car[]': {
        label: 'Auto-Anteil',
        unit: '%',
        tooltip: `Oben lässt sich die zurückgelegte Strecke pro Person im Jahr festlegen. Hier wird bestimmt, welcher Anteil davon aktuell mit dem Auto zurückgelegt wird.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/cars/mean_persons_per_car[]': {
        label: 'Personen pro PKW',
        unit: '',
        tooltip: `Durchschnittliche Anzahl von Personen im Fahrzeug.`,
        sources: {
            private: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/daten/verkehr/fahrleistungen-verkehrsaufwand-modal-split#fahrleistung-im-personen-und-guterverkehr',
            },
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/solar_roof/roof_area[ha]': {
        label: 'Dachfläche',
        unit: 'ha',
        tooltip: `Im Stadtgebiet gesamte verfügbare Dachfläche.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/solar_roof/solar_suitable_portion_of_roof_area[]': {
        label: 'PV-Dach Anteil geeignete Fläche',
        unit: '%',
        tooltip: `Anteil der im Stadtgebiet gesamten verfügbaren Dachfläche, welche für Photovoltaik-Aufdach-Anlagen geeignet ist in Prozent.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/solar_roof/installed_power[M*Wp]': {
        label: 'PV-Dach installierte Leistung',
        unit: 'MWp',
        tooltip: `Bereits installierte Leistung von Photovoltaik-Aufdach-Anlagen. Die Einheit Mega-Watt-Peak (MWp) bezeichnet dabei die Leistung unter günstigen Standard-Bedingungen.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/solar_roof/self_consumption[]': {
        label: 'PV-Dach Anteil Eigenverbrauch',
        unit: '%',
        tooltip: `Erzeugter Strom kann selbst genutzt oder ins Netz eingespeist werden. Hier kann der Anteil bestimmt werden, der selbst genutzt wird.`,
        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/solar_landscape/solar_area[ha]': {
        label: 'PV-Freifläche installierte Fläche',
        unit: 'ha',
        tooltip: `Bereits mit Freiflächen-Photovoltaik-Anlagen bebaute Fläche in Hektar.`,

        sources: {
            private: {},
            industry: {
                Umweltbundesamt:
                    'https://www.umweltbundesamt.de/themen/klima-energie/erneuerbare-energien/photovoltaik#freiflächen',
            },
            public: {},
            schools: {},
        },
    },
    'energy/solar_landscape/potential_area[ha]': {
        label: 'PV-Freifläche potenzielle Fläche',
        unit: 'ha',
        tooltip: `Gesamte Fläche in Hektar, die für Freiflächen-Photovoltaik-Anlagen geeignet ist.`,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/solar_landscape/self_consumption[]': {
        label: 'PV-Freifläche Anteil Eigenverbrauch',
        unit: '%',
        tooltip: `Erzeugter Strom kann selbst genutzt oder ins Netz eingespeist werden. Hier kann der Anteil bestimmt werden, der selbst genutzt wird.`,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/wind/potential_area[ha]': {
        label: 'Wind potenzielle Fläche',
        unit: 'ha',
        tooltip: `Gesamte Fläche in Hektar, die für Windkraft-Anlagen geeignet ist.`,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/wind/installed_area[ha]': {
        label: 'Wind installierte Fläche',
        unit: 'ha',
        tooltip: `Bereits mit Windkraft-Anlagen bebaute Fläche in Hektar.`,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/direct_aquisition_renewable_energies/power[G*W*h]': {
        label: 'Gekaufte erneuerbarer Strom (im Jahr)',
        unit: 'GWh',
        tooltip: `Erneuerbarer Strom, der im Jahr zugekauft wird.`,

        sources: {
            all: {
                Bundesnetzagentur:
                    'https://www.bundesnetzagentur.de/SharedDocs/Mediathek/Monitoringberichte/Monitoringbericht_Energie2021.pdf?__blob=publicationFile&v=7',
            },
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/direct_aquisition_renewable_energies/price[EUR/k*W*h]': {
        label: 'Erneuerbarer Strom Preis',
        unit: '€/kWh',
        tooltip: `Preis für den Zukauf erneuerbaren Stroms in € pro kWh.`,

        sources: {
            all: {
                Bundesnetzagentur:
                    'https://www.bundesnetzagentur.de/SharedDocs/Mediathek/Monitoringberichte/Monitoringbericht_Energie2021.pdf?__blob=publicationFile&v=7',
            },
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'energy/aquisition_power_mix/aquisition_power_mix[EUR/k*W*h]': {
        label: 'Strommix Preis',
        unit: '€/kWh',
        tooltip: `Preis für den Zukauf von Strom aus dem allgemeinen Stromnetz in € pro kWh.`,

        sources: {
            all: {
                Bundesnetzagentur:
                    'https://www.bundesnetzagentur.de/SharedDocs/Mediathek/Monitoringberichte/Monitoringbericht_Energie2021.pdf?__blob=publicationFile&v=7',
            },

            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/fossil_fuel_prices/fuel[EUR/L]': {
        label: 'Benzin-Preis',
        unit: '€/Liter',
        tooltip: ``,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/street_lighting/street_lighting/n_lanterns[k]': {
        label: 'Straßenlaternen Anzahl',
        unit: 'tsd.',
        tooltip: `Anzahl der Straßenlaternen im Stadtgebiet in tausend Stück.`,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/street_lighting/street_lighting/power_consumption_per_latern[k*W*h/a]': {
        label: 'Straßenlaternen Stromverbrauch pro Stück & Jahr',
        unit: 'kWh',
        tooltip: `Durchschnittlicher Stromverbrauch einer Straßenlaterne im Jahr.`,

        sources: {
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
    'mobility/street_lighting/street_lighting/other_costs_per_lantern[EUR/a]': {
        label: 'Straßenlaternen Wartungskosten pro Stück & Jahr',
        unit: 'EUR',
        tooltip: `Durchschnittliche Wartungskosten einer Straßenlaterne im Jahr.`,

        sources: {
            all: {
                Bundesnetzagentur:
                    'https://www.bundesnetzagentur.de/SharedDocs/Mediathek/Monitoringberichte/Monitoringbericht_Energie2021.pdf?__blob=publicationFile&v=7',
            },
            private: {},
            industry: {},
            public: {},
            schools: {},
        },
    },
}
