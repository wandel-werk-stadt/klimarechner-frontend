export default {
    'buildings/base_data/inhabitants[k]': {
        private: 217,
        industry: 116.7053,
        schools: 27.9996,
        public: 4.0594,
    },
    'buildings/base_data/n_buildings[]': {
        private: 44_000.0,
        industry: 5_180.1499,
        schools: 147.3566,
        public: 334.386,
    },
    'buildings/base_data/floor_area_per_building[qm]': {
        private: 197.6829,
        industry: 1.9225,
        schools: 4.8072,
        public: 0.8788,
    },
    'buildings/demand/heat[k*W*h/qm/a]': {
        private: 114.4357,
        industry: 50,
        schools: 50,
        public: 50,
    },
    'buildings/demand/hot_water_per_capita[k*W*h/a]': {
        private: 1_237.9808,
        industry: 10,
        schools: 10,
        public: 10,
    },
    'buildings/demand/energy_per_capita[k*W*h/a]': {
        private: 1_253.21,
        industry: 50,
        schools: 50,
        public: 50,
    },
    'buildings/heat_types_areas/oil_no_condensing[k*qm]': {
        private: 1_168.5183,
        industry: 330.4892,
        schools: 23.5074,
        public: 9.7521,
    },
    // mit brennwert
    'buildings/heat_types_areas/oil_with_condensing[k*qm]': {
        private: 1_295.8923,
        industry: 366.514,
        schools: 26.0698,
        public: 10.8152,
    },
    'buildings/heat_types_areas/gas[k*qm]': {
        private: 4_918.884,
        industry: 2_000.0962,
        schools: 142.2649,
        public: 59.0192,
    },
    'buildings/heat_types_areas/heat_pump[k*qm]': {
        private: 278.2399,
        industry: 0,
        schools: 0,
        public: 0,
    },
    'buildings/heat_types_areas/district_heating[k*qm]': {
        private: 1_401.1367,
        industry: 818.2212,
        schools: 58.1993,
        public: 24.1442,
    },
    'buildings/district_heating_renewable_part[]': 0.99,
    'buildings/district_heating_price[EUR/k*W*h]': 0.065,
    // Heizöl-Preis
    'buildings/other_output_nrg_price[EUR/k*W*h]': 0.9956,
    'mobility/cars/n_pkw[k]': {
        private: 87.0,
        industry: 8.0,
        public: 0.5,
    },
    'mobility/cars/n_bev[k]': {
        private: 0.001,
        industry: 0,
        public: 0,
    },
    'mobility/cars/kilometers_traveled_per_person[k*k*m]': 1246000000 / 83200000,
    'mobility/cars/mean_persons_per_car[]': 917 / 755,

    'mobility/street_lighting/street_lighting/n_lanterns[k]': 24.1256,
    'mobility/street_lighting/street_lighting/power_consumption_per_latern[k*W*h/a]': 432.4324,
    'mobility/street_lighting/street_lighting/other_costs_per_lantern[EUR/a]': 119.5403,

    'mobility/modal_split/shares/pedestrians[]': 0.04,
    'mobility/modal_split/shares/bicycle[]': 0.07,
    'mobility/modal_split/shares/public_transport[]': 0.27,
    'mobility/modal_split/shares/plane[]': 0,
    'mobility/modal_split/shares/car[]': 0.62,

    'energy/solar_roof/roof_area[ha]': {
        private: 6_369.1587,
        industry: 8_875.3522,
        public: 467.1238,
    },
    'energy/solar_roof/solar_suitable_portion_of_roof_area[]': {
        private: 0.2,
        industry: 0.2,
        public: 0.2,
    },
    'energy/solar_roof/installed_power[M*Wp]': {
        private: 36.2621,
        industry: 50.5309,
        public: 2.6595,
    },
    'energy/solar_roof/self_consumption[]': {
        private: 0,
        industry: 0,
        public: 0,
    },
    'energy/solar_landscape/potential_area[ha]': {
        private: 0,
        industry: 100,
        public: 100,
    },
    'energy/solar_landscape/solar_area[ha]': {
        private: 0,
        industry: 10,
        public: 4,
    },
    'energy/solar_landscape/self_consumption[]': {
        private: 0,
        industry: 0,
        public: 0,
    },
    'energy/wind/potential_area[ha]': {
        private: 0,
        industry: 100,
        public: 100,
    },
    'energy/wind/installed_area[ha]': {
        private: 0,
        industry: 0,
        public: 0,
    },
    'energy/direct_aquisition_renewable_energies/power[G*W*h]': {
        private: 97.024,
        industry: 89.9428,
        public: 4.7338,
    },
    'energy/direct_aquisition_renewable_energies/price[EUR/k*W*h]': {
        private: 0.3263,
        industry: 0.2323,
        public: 0.2323,
    },
    'energy/aquisition_power_mix/aquisition_power_mix[EUR/k*W*h]': {
        private: 0.3363,
        industry: 0.2323,
        public: 0.2323,
    },

    'buildings/fossil_fuel_prices/oil[EUR/L]': 0.8156,
    'buildings/fossil_fuel_prices/gas[EUR/m3]': 0.0668 * 11,
    // durchschnittlicher Benzin- und Dieselpreis * Anteil Benzin und Diesel
    'mobility/fossil_fuel_prices/fuel[EUR/L]': 0.652 * 1.912 + 0.312 * 1.99,
}
