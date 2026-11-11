export default {
    buildings: {
        'floor_area[k*qm]': { label: 'Geschossfläche Gesamt', unit: 'k*m²' },
        'total_heat_dmd[G*W*h/a]': { label: 'Gesamtheizbedarf', unit: 'G*W*h/a' },
        'elec_dmd[G*W*h/a]': { label: 'Strombedarf', unit: 'G*W*h/a' },
        'cnsmp_oil[G*W*h/a]': { label: 'Verbrauch Öl', unit: 'G*W*h/a' },
        'cnsmp_oil_condensing[G*W*h/a]': {
            label: 'Verbrauch Öl mit Brennwert',
            unit: 'G*W*h/a',
        },
        'cnsmp_gas[G*W*h/a]': { label: 'Verbrauch Gas', unit: 'G*W*h/a' },
        'cnsmp_elec_heat_pump[G*W*h/a]': {
            label: 'Verbrauch Wärmepumpe',
            unit: 'G*W*h/a',
        },
        'cnsmp_other[G*W*h/a]': { label: 'Verbrauch Sonstige', unit: 'G*W*h/a' },
        'cnsmp_oil[M*L/a]': { label: 'Verbrauch Öl', unit: 'M*L/a' },
        'cnsmp_gas[M*m3/a]': { label: 'Verbrauch Gas', unit: 'M*m³/a' },
        'costs_oil[M*EUR/a]': { label: 'Kosten Öl', unit: 'M*€/a' },
        'costs_gas[M*EUR/a]': { label: 'Kosten Gas', unit: 'M*€/a' },
        'invest_heat_sources[M*EUR/a]': {
            label: 'Investition Wärmeerzeugung',
            unit: 'M*€/a',
        },
        'invest_energetic_renovation[M*EUR/a]': {
            label: 'Investition energetische Sanierung',
            unit: 'M*€/a',
        },
        'grant_heat_sources[M*EUR/a]': {
            label: 'Förderung Wärmeerzeugung',
            unit: 'M*€/a',
        },
        'grant_energetic_renovation[M*EUR/a]': {
            label: 'Förderung energetische Sanierung',
            unit: 'M*€/a',
        },
        'costs_heat_pump[M*EUR]': { label: 'Kosten Wärmepumpe', unit: 'M*€' },
        'ems_oil[k*to_coe/a]': { label: 'Emissonen Öl', unit: 'k*t*CO₂/a' },
        'ems_gas[k*to_coe/a]': { label: 'Emissonen Gas', unit: 'k*t*CO₂/a' },

        'cnsmp_district_heating[G*W*h/a]': { label: 'Verbrauch Fernwärme', unit: 'G*W*h/a' },
        'cnsmp_district_heating[M*m3/a]': { label: 'Verbrauch Fernwärme', unit: 'M*m³/a' },
        'costs_client_district_heating[M*EUR/a]': { label: 'Kosten Fernwärme', unit: 'M*€/a' },
        'costs_other[M*EUR/a]': { label: 'Kosten Sonstige', unit: 'M*€/a' },
        'costs_total[M*EUR/a]': { label: 'Kosten Gesamt', unit: 'M*€/a' },

        additional: {
            'total_floor_area[k*qm]': { label: 'Geschossfläche Gesamt', unit: 'k*m²' },
            'total_heat_demand[G*W*h/a]': { label: 'Geamtheizbedarf', unit: 'G*W*h/a' },
        },
    },
    mobility: {
        'cars_grant[M*EUR/a]': { label: 'Förderung PKW', unit: 'M*€/a' },
        'bev_elec_nrg_dmd[G*W*h/a]': {
            label: 'Energiebedarf Elektroautos',
            unit: 'G*W*h/a',
        },
        'bev_elec_nrg_price[G*W*h/a]': {
            label: 'Energiepreis Elektroautos',
            unit: 'G*W*h/a',
        },
        'traveld_dist_car[k*k*m/a]': { label: 'Gefahrene Strecke PKW', unit: 'tsd. km/a' },
        'cars_fuel_dmd[M*L/a]': { label: 'Kraftstoffbedarf PKW', unit: 'M*L/a' },
        'cars_fuel_costs[M*EUR/a]': { label: 'Kraftstoffkosten PKW', unit: 'M*€/a' },
        'bev_nrg_costs[M*EUR/a]': { label: 'Energiekosten Elektroautos', unit: 'M*€/a' },
        'cars_ems[k*to_coe/a]': { label: 'Emissonen PKW', unit: 'k*t*CO₂/a' },
        'sl_nrg_dmd[G*W*h/a]': {
            label: 'Straßenbeleuchtung Energiebedarf',
            unit: 'G*W*h/a',
        },
        'sl_nrg_costs[M*EUR/a]': {
            label: 'Straßenbeleuchtung Energiekosten',
            unit: 'M*€/a',
        },
        'sl_om_costs[M*EUR/a]': {
            label: 'Straßenbeleuchtung Betriebskosten',
            unit: 'M*€/a',
        },
        'sl_total_costs[M*EUR/a]': {
            label: 'Straßenbeleuchtung Gesamtkosten',
            unit: 'M*€/a',
        },
    },
    energy: {
        'sol_rf_potential[M*Wp]': { label: 'Potenzial PV-Dach', unit: 'M*Wp' },
        'sol_rf_nrg[G*W*h/a]': { label: 'Ertrag PV-Dach', unit: 'G*W*h/a' },
        'sol_rf_self_cnsmp[G*W*h/a]': {
            label: 'Eigenverbrauch PV-Dach',
            unit: 'G*W*h/a',
        },
        'sol_rf_invest[M*EUR/a]': { label: 'Investition PV-Dach', unit: 'M*€/a' },
        'sol_rf_grant[M*EUR/a]': { label: 'Förderung PV-Dach', unit: 'M*€/a' },
        'sol_rf_om[M*EUR/a]': { label: 'Betriebskosten PV-Dach', unit: 'M*€/a' },
        'sol_rf_revenue[M*EUR/a]': { label: 'Solarertrag Dach', unit: 'M*€/a' },
        'sol_os_installed[M*Wp]': {
            label: 'Installierte Solarleistung Freifläche',
            unit: 'M*Wp',
        },
        'sol_os_nrg[G*W*h/a]': { label: 'Ertrag PV-Freifläche', unit: 'G*W*h/a' },
        'sol_os_self_cnsmp[G*W*h/a]': {
            label: 'Eigenverbrauch PV-Freifläche',
            unit: 'G*W*h/a',
        },
        'sol_os_invest[M*EUR/a]': { label: 'Investition PV-Freifläche', unit: 'M*€/a' },
        'sol_os_grant[M*EUR/a]': { label: 'Förderung PV-Freifläche', unit: 'M*€/a' },
        'sol_os_om[M*EUR/a]': { label: 'Betriebskosten PV-Freifläche', unit: 'M*€/a' },
        'sol_os_turnover_buyback[M*EUR/a]': {
            label: 'Einspeisevergütung PV-Freifläche',
            unit: 'M*€/a',
        },
        'sol_os_revenue[M*EUR/a]': { label: 'Ertrag PV-Freifläche', unit: 'M*€/a' },
        'sol_os_prod_costs[M*EUR/a]': {
            label: 'Herstellungskosten PV-Freifläche',
            unit: 'M*€/a',
        },

        'wind_installed[M*Wp]': {
            label: 'Installierte Windleistung',
            unit: 'M*Wp',
        },
        'wind_nrg[G*W*h/a]': {
            label: 'Ertrag Windenergie',
            unit: 'G*W*h/a',
        },
        'wind_invest[M*EUR/a]': {
            label: 'Investition Windenergie',
            unit: 'M*€/a',
        },
        'wind_grant[M*EUR/a]': {
            label: 'Förderung Windenergie',
            unit: 'M*€/a',
        },
        'wind_om[M*EUR/a]': {
            label: 'Betriebskosten Windenergie',
            unit: 'M*€/a',
        },
        'wind_turnover_buyback[M*EUR/a]': {
            label: 'Einspeisevergütung Windenergie',
            unit: 'M*€/a',
        },
        'wind_revenue[M*EUR/a]': {
            label: 'Ertrag Windenergie',
            unit: 'M*€/a',
        },

        'prchsd_renewable_nrg[G*W*h/a]': {
            label: 'Gekaufter erneuerbarer Strom',
            unit: 'G*W*h/a',
        },
        'prchsd_renewable_nrg[M*EUR/a]': {
            label: 'Gekaufter erneuerbarer Strom',
            unit: 'M*€/a',
        },
        'elec_nrg_dmd[G*W*h/a]': { label: 'Energiebedarf Strom', unit: 'G*W*h/a' },
        'prchsd_nrg_mix[G*W*h/a]': { label: 'Gekaufter Strommix', unit: 'G*W*h/a' },
        'prchsd_nrg_mix_costs[M*EUR/a]': {
            label: 'Gekaufter Strommix Kosten',
            unit: 'M*€/a',
        },
        'prchsd_nrg_mix_ems[k*to_coe/a]': {
            label: 'Gekaufter Strommix Emissionen',
            unit: 'k*t*CO₂/a',
        },
        'nrg_own_mix_price[EUR/k*W*h]': {
            label: 'Erzeugter Strommix Preis',
            unit: '€/kWh',
        },
    },
    economy: {
        invest_heating_material: { label: 'Heizung - Investition Material' },
        invest_heating_work: { label: 'Heizung - Investition Arbeit' },
        turnover_heating_crafting_local: { label: 'Heizung - Umsatz Handwerk [lokal]' },
        turnover_heating_crafting_national: { label: 'Heizung - Umsatz Handwerk [national]' },
        turnover_heating_production_national: {
            label: 'Heizung - Umsatz Produktion [national]',
        },
        invest_heat_demand_material: { label: 'Heizwärmebedarf - Investition Material' },
        invest_heat_demand_work: { label: 'Heizwärmebedarf - Investition Arbeit' },
        turnover_heat_demand_crafting_local: {
            label: 'Heizwärmebedarf - Umsatz Handwerk [lokal]',
        },
        turnover_heat_demand_crafting_national: {
            label: 'Heizwärmebedarf - Umsatz Handwerk [national]',
        },
        turnover_heat_demand_production_national: {
            label: 'Heizwärmebedarf - Umsatz Produktion [national]',
        },
        invest_solar_roof_material: { label: 'PV-Dach - Investition Material' },
        invest_solar_roof_work: { label: 'PV-Dach - Investition Arbeit' },
        maintenance_solar_roof_work: { label: 'PV-Dach - Wartungskosten' },
        turnover_solar_roof_crafting_local: { label: 'PV-Dach - Umsatz Handwerk [lokal]' },
        turnover_solar_roof_crafting_national: {
            label: 'PV-Dach - Umsatz Handwerk [national]',
        },
        turnover_solar_roof_production_national: {
            label: 'PV-Dach - Umsatz Produktion [national]',
        },
        invest_solar_landscape_material: { label: 'PV-Freifläche - Investition Material' },
        invest_solar_landscape_work: { label: 'PV-Freifläche - Investition Arbeit' },
        maintenance_solar_landscape_work: { label: 'PV-Freifläche - Wartungskosten' },
        turnover_solar_landscape_crafting_local: {
            label: 'PV-Freifläche - Umsatz Handwerk [lokal]',
        },
        turnover_solar_landscape_crafting_national: {
            label: 'PV-Freifläche - Umsatz Handwerk [national]',
        },
        turnover_solar_landscape_production_national: {
            label: 'PV-Freifläche - Umsatz Produktion [national]',
        },
        n_jobs_crafting_local: { label: 'Anzahl Arbeitsplätze Handwerk [lokal]' },
        n_jobs_crafting_national: { label: 'Anzahl Arbeitsplätze Handwerk [national]' },
        n_jobs_production_national: { label: 'Anzahl Arbeitsplätze Produktion [national]' },
        revenue_local: { label: 'Umsatz [lokal]' },
        energy_tax_national: { label: 'Energiesteuer [national]' },
        income_local: { label: 'Einahmen [lokal]' },
        income_national: { label: 'Einahmen [national]' },
        income_tax_local: { label: 'Einahmen Steuern [lokal]' },
        income_tax_national: { label: 'Einahmen Steuern [national]' },
        turnover_local: { label: 'Umsatz [lokal]' },
        turnover_national: { label: 'Umsatz [national]' },
        turnover_tax_local: { label: 'Steuern Umsatz [lokal]' },
        turnover_tax_national: { label: 'Steuern Umsatz [national]' },
        business_tax_local: { label: 'Gewerbesteuer [lokal]' },
        business_tax_national: { label: 'Gewerbesteuer [national]' },
        corporate_tax_national: { label: 'Unternehmenssteuer [national]' },
    },

    stakeholders: {
        private_invest: { label: 'Privat-Investitionen' },
        private_effect_of_measures: { label: 'Privat-Effekte' },
        private_cash_flow_netto: { label: 'Privat-Cashflow' },
        industry_invest: { label: 'Gewerbe-Investitionen' },
        industry_effect_of_measures: { label: 'Gewerbe-Effekte' },
        industry_profit_from_measures: { label: 'Gewerbe-Gewinn von Maßnahmen' },
        industry_cash_flow_netto: { label: 'Gewerbe-Cashflow' },
        public_invest: { label: 'Kommune-Investitionen' },
        public_effect_of_measures: { label: 'Kommune-Effekte' },
        public_tax_income_from_measures: { label: 'Kommune-Steuereinnahmen von Maßnahmen' },
        public_cash_flow_netto: { label: 'Kommune-Cashflow' },
        federal_additional_expenses: { label: 'Zusätzliche Ausgaben Bund' },
        federal_additional_tax_income: { label: 'Zusätzliche Einnahmen Bund' },
        federal_cash_flow_netto: { label: 'Bund-Cashflow' },
    },
}
